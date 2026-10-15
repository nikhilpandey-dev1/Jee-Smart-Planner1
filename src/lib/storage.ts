import type {
  StudentProfile,
  MockTestResult,
  StudyPlan,
  CompletedTask,
  RevisionRecord,
  TestWeakChapter,
} from '@/types';

const APP_NAMESPACE = 'jee_smart_planner_v1';

const KEYS = {
  profile: `${APP_NAMESPACE}_profile`,
  mockTests: `${APP_NAMESPACE}_mock_tests`,
  plan: `${APP_NAMESPACE}_plan`,
  completed: `${APP_NAMESPACE}_completed`,
  backup: `${APP_NAMESPACE}_backup`,
  isDemo: `${APP_NAMESPACE}_is_demo`,
  revisions: `${APP_NAMESPACE}_revisions`,
  weakChapters: `${APP_NAMESPACE}_weak_chapters`,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors
  }
}

// --- Demo mode tracking ---

export function isDemoMode(): boolean {
  return read<boolean>(KEYS.isDemo, false);
}

function setDemoMode(value: boolean): void {
  write(KEYS.isDemo, value);
}

/**
 * Before entering demo mode, back up the user's real data so it can be
 * restored later. Demo data is never permanently saved over real data.
 */
function backupRealData(): void {
  const backup = {
    profile: localStorage.getItem(KEYS.profile),
    mockTests: localStorage.getItem(KEYS.mockTests),
    plan: localStorage.getItem(KEYS.plan),
    completed: localStorage.getItem(KEYS.completed),
    revisions: localStorage.getItem(KEYS.revisions),
    weakChapters: localStorage.getItem(KEYS.weakChapters),
  };
  write(KEYS.backup, backup);
}

/**
 * Restore the user's real data that was backed up before demo mode.
 * Called when exiting demo mode.
 */
function restoreRealData(): void {
  const backup = read<{
    profile: string | null;
    mockTests: string | null;
    plan: string | null;
    completed: string | null;
    revisions: string | null;
    weakChapters: string | null;
  } | null>(KEYS.backup, null);

  if (backup) {
    if (backup.profile) localStorage.setItem(KEYS.profile, backup.profile);
    else localStorage.removeItem(KEYS.profile);
    if (backup.mockTests) localStorage.setItem(KEYS.mockTests, backup.mockTests);
    else localStorage.removeItem(KEYS.mockTests);
    if (backup.plan) localStorage.setItem(KEYS.plan, backup.plan);
    else localStorage.removeItem(KEYS.plan);
    if (backup.completed) localStorage.setItem(KEYS.completed, backup.completed);
    else localStorage.removeItem(KEYS.completed);
    if (backup.revisions) localStorage.setItem(KEYS.revisions, backup.revisions);
    else localStorage.removeItem(KEYS.revisions);
    if (backup.weakChapters) localStorage.setItem(KEYS.weakChapters, backup.weakChapters);
    else localStorage.removeItem(KEYS.weakChapters);
    localStorage.removeItem(KEYS.backup);
  }
  setDemoMode(false);
}

/**
 * Enter demo mode: back up real data, then save demo data.
 * The demo data is marked with isDemo so it can be distinguished.
 */
export function enterDemoMode(
  demoProfile: StudentProfile,
  demoTests: MockTestResult[],
  demoPlan: StudyPlan,
): void {
  backupRealData();
  const markedProfile = { ...demoProfile, isDemo: true };
  write(KEYS.profile, markedProfile);
  write(KEYS.mockTests, demoTests);
  write(KEYS.plan, demoPlan);
  write(KEYS.completed, []);
  write(KEYS.revisions, []);
  write(KEYS.weakChapters, []);
  setDemoMode(true);
}

/**
 * Exit demo mode: restore the user's real data from backup.
 */
export function exitDemoMode(): void {
  restoreRealData();
}

// --- Profile ---

export function getProfile(): StudentProfile | null {
  return read<StudentProfile | null>(KEYS.profile, null);
}

export function saveProfile(profile: StudentProfile): void {
  // When a real user saves their profile, exit demo mode first
  if (isDemoMode()) {
    exitDemoMode();
  }
  write(KEYS.profile, { ...profile, isDemo: false });
}

export function clearProfile(): void {
  localStorage.removeItem(KEYS.profile);
}

// --- Mock tests ---

export function getMockTests(): MockTestResult[] {
  return read<MockTestResult[]>(KEYS.mockTests, []);
}

export function saveMockTests(tests: MockTestResult[]): void {
  write(KEYS.mockTests, tests);
}

// --- Study plan ---

export function getPlan(): StudyPlan | null {
  return read<StudyPlan | null>(KEYS.plan, null);
}

export function savePlan(plan: StudyPlan): void {
  write(KEYS.plan, plan);
}

// --- Completed tasks ---

export function getCompletedTasks(): CompletedTask[] {
  return read<CompletedTask[]>(KEYS.completed, []);
}

export function saveCompletedTasks(tasks: CompletedTask[]): void {
  write(KEYS.completed, tasks);
}

// --- Revision records ---

export function getRevisionRecords(): RevisionRecord[] {
  return read<RevisionRecord[]>(KEYS.revisions, []);
}

export function saveRevisionRecords(records: RevisionRecord[]): void {
  write(KEYS.revisions, records);
}

export function getRevisionRecord(
  subject: string,
  chapter: string,
): RevisionRecord | undefined {
  return getRevisionRecords().find(
    (r) => r.subject === subject && r.chapter === chapter,
  );
}

/**
 * Create or update a revision record when a chapter is first completed.
 * Sets the initial nextRevisionAt to now (first revision is due immediately).
 */
export function ensureRevisionRecord(
  subject: string,
  chapter: string,
  completedAt: string,
): RevisionRecord {
  const records = getRevisionRecords();
  const existing = records.find(
    (r) => r.subject === subject && r.chapter === chapter,
  );
  if (existing) return existing;

  const record: RevisionRecord = {
    subject: subject as RevisionRecord['subject'],
    chapter,
    completedAt,
    revisionCount: 0,
    lastRevisedAt: null,
    nextRevisionAt: new Date().toISOString(),
  };
  records.push(record);
  saveRevisionRecords(records);
  return record;
}

/**
 * Mark a revision as completed: increment revisionCount, update lastRevisedAt,
 * and calculate nextRevisionAt using spaced-repetition intervals.
 */
export function completeRevisionTask(
  subject: string,
  chapter: string,
): RevisionRecord[] {
  const records = getRevisionRecords();
  const now = new Date();
  const record = records.find(
    (r) => r.subject === subject && r.chapter === chapter,
  );

  if (record) {
    record.revisionCount += 1;
    record.lastRevisedAt = now.toISOString();
    record.nextRevisionAt = nextRevisionDate(record.revisionCount, now).toISOString();
  }

  saveRevisionRecords(records);
  return records;
}

/**
 * Remove a revision record when a chapter is un-completed.
 */
export function removeRevisionRecord(
  subject: string,
  chapter: string,
): RevisionRecord[] {
  const records = getRevisionRecords().filter(
    (r) => !(r.subject === subject && r.chapter === chapter),
  );
  saveRevisionRecords(records);
  return records;
}

const REVISION_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30, 60];

function nextRevisionDate(revisionCount: number, from: Date): Date {
  const intervalIdx = Math.min(revisionCount, REVISION_INTERVALS_DAYS.length - 1);
  const days = REVISION_INTERVALS_DAYS[intervalIdx];
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return next;
}

// --- Test-weak chapters (from mock test chapter-level analysis) ---

export function getTestWeakChapters(): TestWeakChapter[] {
  return read<TestWeakChapter[]>(KEYS.weakChapters, []);
}

export function saveTestWeakChapters(chapters: TestWeakChapter[]): void {
  write(KEYS.weakChapters, chapters);
}

function generateRevisionRecommendations(accuracy: number, wrong: number, unattempted: number): string[] {
  const recs: string[] = [];
  if (accuracy < 30) {
    recs.push('Revise fundamental concepts from scratch');
    recs.push('Review solved examples and textbook theory');
    recs.push('Practice basic conceptual questions');
  } else if (accuracy < 50) {
    recs.push('Revise key concepts and formulas');
    recs.push('Review solved examples');
    recs.push('Practice moderate-difficulty questions');
  } else if (accuracy < 70) {
    recs.push('Review mistakes from wrong attempts');
    recs.push('Practice JEE-level questions');
  }
  if (unattempted > wrong && unattempted > 0) {
    recs.push('Focus on speed — many questions left unattempted');
  }
  if (wrong > 0) {
    recs.push('Analyze incorrect answers to find error patterns');
  }
  recs.push('Take a short chapter test to verify improvement');
  return recs;
}

/**
 * Detect weak chapters from chapter-level test results.
 * A chapter is weak if it was attempted (correct + wrong > 0) and
 * accuracy (correct / (correct + wrong)) is below 50%.
 * Chapters with all unattempted are not flagged weak — they just weren't covered.
 */
export function updateTestWeakChapters(test: MockTestResult): TestWeakChapter[] {
  const existing = getTestWeakChapters().filter((w) => w.testId !== test.id);

  if (!test.chapterResults || test.chapterResults.length === 0) {
    saveTestWeakChapters(existing);
    return existing;
  }

  const newWeak: TestWeakChapter[] = [];
  for (const cr of test.chapterResults) {
    const attempted = cr.correct + cr.wrong;
    if (attempted === 0) continue; // skip chapters with no attempts
    const accuracy = (cr.correct / attempted) * 100;
    if (accuracy < 50) {
      newWeak.push({
        subject: cr.subject,
        chapter: cr.chapter,
        testId: test.id,
        testDate: test.date,
        accuracyPercent: Math.round(accuracy),
        correct: cr.correct,
        wrong: cr.wrong,
        unattempted: cr.unattempted,
        recommendations: generateRevisionRecommendations(accuracy, cr.wrong, cr.unattempted),
      });
    }
  }

  const merged = [...existing, ...newWeak];
  saveTestWeakChapters(merged);
  return merged;
}

// --- Clear all ---

/**
 * Clears only this application's data. Never touches unrelated
 * browser data. Also exits demo mode and removes the backup.
 */
export function clearAllData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
