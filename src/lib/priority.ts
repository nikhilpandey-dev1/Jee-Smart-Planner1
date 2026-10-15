import type {
  StudentProfile,
  MockTestResult,
  PlanItem,
  StudyPlan,
  ChapterSelection,
  Subject,
  CompletedTask,
  RevisionRecord,
  RevisionMeta,
} from '@/types';
import { CHAPTERS } from '@/data/chapters';
import { getRevisionRecords, getTestWeakChapters } from '@/lib/storage';

function latestSubjectScore(
  mockTests: MockTestResult[],
  subject: Subject,
): number | null {
  if (mockTests.length === 0) return null;
  const latest = mockTests[mockTests.length - 1];
  const max = latest.maxTotal / 3;
  const score =
    subject === 'Physics'
      ? latest.physicsScore
      : subject === 'Chemistry'
        ? latest.chemistryScore
        : latest.mathScore;
  return max > 0 ? (score / max) * 100 : null;
}

export function calculatePriority(
  chapter: ChapterSelection,
  profile: StudentProfile,
  mockTests: MockTestResult[],
): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  if (chapter.proficiency === 'weak') {
    score += 40;
    reasons.push('you marked this chapter as weak');
  } else if (chapter.proficiency === 'average') {
    score += 20;
    reasons.push('you marked this chapter as average');
  } else {
    score += 5;
    reasons.push('you marked this chapter as strong');
  }

  const testScore = latestSubjectScore(mockTests, chapter.subject);
  if (testScore !== null) {
    if (testScore < 40) {
      score += 30;
      reasons.push(`your recent ${chapter.subject} score was low (${Math.round(testScore)}%)`);
    } else if (testScore < 70) {
      score += 15;
      reasons.push(`your recent ${chapter.subject} score was moderate (${Math.round(testScore)}%)`);
    } else {
      score += 3;
      reasons.push(`your recent ${chapter.subject} score was good (${Math.round(testScore)}%)`);
    }
  } else {
    score += 10;
    reasons.push('no mock test data available yet');
  }

  // Persistent weak-chapter flag from mock test chapter-level analysis:
  // chapters flagged as weak from poor chapter-level accuracy get a priority boost.
  const testWeakChapters = getTestWeakChapters();
  const weakFlag = testWeakChapters.find(
    (w) => w.subject === chapter.subject && w.chapter === chapter.name,
  );
  if (weakFlag) {
    score += 25;
    reasons.push(`weak in mock test (${weakFlag.accuracyPercent}% accuracy, ${weakFlag.correct}/${weakFlag.correct + weakFlag.wrong} correct)`);
  }

  const chapterData = CHAPTERS.find(
    (c) => c.name === chapter.name && c.subject === chapter.subject,
  );
  const importance = chapterData?.importance ?? 5;
  score += (importance / 10) * 20;
  if (importance >= 8) {
    reasons.push('this chapter is highly important for JEE');
  } else if (importance >= 6) {
    reasons.push('this chapter has moderate JEE importance');
  }

  if (profile.dailyStudyHours >= 6) {
    score += 10;
  } else if (profile.dailyStudyHours >= 4) {
    score += 7;
  } else {
    score += 4;
    reasons.push('limited daily study time');
  }

  score = Math.min(100, Math.round(score));
  const reasonStr = `${priorityLabel(score)} priority because ${reasons.join(', ')}.`;
  return { score, reason: reasonStr };
}

export function priorityLabel(score: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

/**
 * Build plan items fitting within available time.
 * For revision mode, uses smaller per-chapter time allocation so more chapters fit.
 */
function buildPlanItems(
  scored: { chapter: ChapterSelection; score: number; reason: string }[],
  availableMinutes: number,
  isRevision: boolean,
): { items: PlanItem[]; usedMinutes: number; rescheduled: PlanItem[] } {
  const items: PlanItem[] = [];
  const rescheduled: PlanItem[] = [];
  let usedMinutes = 0;

  if (isRevision) {
    // Revision mode: include ALL due chapters — no time-based rescheduling.
    // Allocate time proportionally with a small minimum per chapter.
    const perChapter = Math.max(10, Math.round(availableMinutes / Math.max(scored.length, 1)));

    for (const entry of scored) {
      const priority = priorityLabel(entry.score);
      const practiceMinutes = Math.round(perChapter * 0.6);
      const revisionMinutes = perChapter - practiceMinutes;

      items.push({
        subject: entry.chapter.subject,
        chapter: entry.chapter.name,
        priority,
        priorityScore: entry.score,
        studyMinutes: 0,
        practiceMinutes,
        revisionMinutes,
        reason: entry.reason,
        isRevision: true,
      });
      usedMinutes += perChapter;
    }

    return { items, usedMinutes, rescheduled };
  }

  // New study mode: allocate more time per chapter, cap at 6
  const divisor = Math.min(scored.length, 6);
  const maxPerChapter = Math.max(30, availableMinutes / divisor);

  for (const entry of scored) {
    const priority = priorityLabel(entry.score);
    const studyMinutes = Math.round(maxPerChapter * 0.5);
    const practiceMinutes = Math.round(maxPerChapter * 0.3);
    const revisionMinutes = Math.round(maxPerChapter) - studyMinutes - practiceMinutes;
    const totalForChapter = studyMinutes + practiceMinutes + revisionMinutes;

    const item: PlanItem = {
      subject: entry.chapter.subject,
      chapter: entry.chapter.name,
      priority,
      priorityScore: entry.score,
      studyMinutes,
      practiceMinutes,
      revisionMinutes,
      reason: entry.reason,
      isRevision: false,
    };

    if (usedMinutes + totalForChapter <= availableMinutes) {
      items.push(item);
      usedMinutes += totalForChapter;
    } else {
      rescheduled.push(item);
    }
  }

  return { items, usedMinutes, rescheduled };
}

/**
 * Returns chapters from the profile that have NOT been completed.
 */
export function getRemainingChapters(
  profile: StudentProfile,
  completed: CompletedTask[],
): ChapterSelection[] {
  const completedKeys = new Set(
    completed.map((t) => `${t.subject}-${t.chapter}`),
  );
  return profile.chapters.filter(
    (ch) => !completedKeys.has(`${ch.subject}-${ch.name}`),
  );
}

/**
 * Generate a study plan. Always excludes completed chapters.
 */
export function generatePlan(
  profile: StudentProfile,
  mockTests: MockTestResult[],
  completed: CompletedTask[] = [],
): StudyPlan {
  return generatePlanExcludingCompleted(profile, mockTests, completed);
}

/**
 * Generate a plan that excludes already-completed chapters.
 * If no chapters remain, automatically generates a revision plan.
 */
export function generatePlanExcludingCompleted(
  profile: StudentProfile,
  mockTests: MockTestResult[],
  completed: CompletedTask[],
): StudyPlan {
  const remainingChapters = getRemainingChapters(profile, completed);

  if (remainingChapters.length === 0) {
    return generateRevisionPlan(profile, mockTests, completed);
  }

  const totalMinutes = profile.dailyStudyHours * 60;
  const availableMinutes = Math.round(totalMinutes * 0.95);

  const scored = remainingChapters.map((ch) => {
    const { score, reason } = calculatePriority(ch, profile, mockTests);
    return { chapter: ch, score, reason };
  });

  scored.sort((a, b) => b.score - a.score);

  const { items, usedMinutes, rescheduled } = buildPlanItems(scored, availableMinutes, false);

  return {
    date: new Date().toISOString(),
    items,
    totalMinutes: usedMinutes,
    rescheduled: rescheduled.length > 0 ? rescheduled : undefined,
  };
}

/**
 * Get completed chapters that are due for revision based on spaced-repetition schedule.
 * A chapter is "due" if nextRevisionAt <= now or revisionCount === 0 (first revision).
 */
export function getDueRevisionChapters(
  profile: StudentProfile,
  completed: CompletedTask[],
): { chapter: ChapterSelection; record: RevisionRecord | null }[] {
  const completedKeys = new Set(
    completed.map((t) => `${t.subject}-${t.chapter}`),
  );
  const revisionRecords = getRevisionRecords();
  const now = new Date();

  return profile.chapters
    .filter((ch) => completedKeys.has(`${ch.subject}-${ch.name}`))
    .map((ch) => {
      const record = revisionRecords.find(
        (r) => r.subject === ch.subject && r.chapter === ch.name,
      ) ?? null;
      return { chapter: ch, record };
    })
    .filter(({ record }) => {
      if (!record) return true; // No record means first revision is due
      return new Date(record.nextRevisionAt) <= now;
    });
}

/**
 * Generate a revision plan from completed chapters that are due for revision.
 * Uses spaced-repetition scheduling — only chapters due for revision are included.
 * All eligible chapters are scheduled (subject to time), not arbitrarily capped.
 */
export function generateRevisionPlan(
  profile: StudentProfile,
  mockTests: MockTestResult[],
  completed: CompletedTask[],
): StudyPlan {
  const dueChapters = getDueRevisionChapters(profile, completed);

  if (dueChapters.length === 0) {
    return {
      date: new Date().toISOString(),
      items: [],
      totalMinutes: 0,
    };
  }

  const totalMinutes = profile.dailyStudyHours * 60;
  const availableMinutes = Math.round(totalMinutes * 0.95);

  // Sort: weak first, then average, then strong; within same proficiency,
  // sort by revisionCount ascending (fewer revisions = higher priority)
  const sortedDue = [...dueChapters].sort((a, b) => {
    const rank = (p: string) => (p === 'weak' ? 0 : p === 'average' ? 1 : 2);
    const profDiff = rank(a.chapter.proficiency) - rank(b.chapter.proficiency);
    if (profDiff !== 0) return profDiff;
    const aCount = a.record?.revisionCount ?? 0;
    const bCount = b.record?.revisionCount ?? 0;
    return aCount - bCount;
  });

  const scored = sortedDue.map(({ chapter, record }) => {
    const { score, reason } = calculatePriority(chapter, profile, mockTests);
    const revisionNote = record
      ? `Revision #${record.revisionCount + 1}. `
      : 'First revision. ';
    return {
      chapter,
      score,
      reason: `Revision & Practice: ${revisionNote}${reason}`,
    };
  });

  const { items, usedMinutes, rescheduled } = buildPlanItems(scored, availableMinutes, true);

  return {
    date: new Date().toISOString(),
    items,
    totalMinutes: usedMinutes,
    rescheduled: rescheduled.length > 0 ? rescheduled : undefined,
  };
}

/**
 * Get revision metadata for UI display.
 */
export function getRevisionMeta(
  profile: StudentProfile,
  completed: CompletedTask[],
  scheduledCount: number,
): RevisionMeta {
  const revisionRecords = getRevisionRecords();
  const completedKeys = new Set(
    completed.map((t) => `${t.subject}-${t.chapter}`),
  );
  const now = new Date();

  const totalCompletedChapters = profile.chapters.filter((ch) =>
    completedKeys.has(`${ch.subject}-${ch.name}`),
  ).length;

  const dueChapters = getDueRevisionChapters(profile, completed);
  const dueToday = dueChapters.length;

  // Find the next due chapter that isn't being scheduled today
  const futureDue = revisionRecords
    .filter((r) => {
      const isCompleted = completedKeys.has(`${r.subject}-${r.chapter}`);
      return isCompleted && new Date(r.nextRevisionAt) > now;
    })
    .sort((a, b) => new Date(a.nextRevisionAt).getTime() - new Date(b.nextRevisionAt).getTime());

  return {
    totalCompletedChapters,
    dueToday,
    scheduledToday: scheduledCount,
    remainingForFuture: Math.max(0, totalCompletedChapters - scheduledCount),
    nextDueChapter: futureDue[0]?.chapter,
    nextDueDate: futureDue[0]
      ? new Date(futureDue[0].nextRevisionAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : undefined,
  };
}
