export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export type Proficiency = 'weak' | 'average' | 'strong';

export interface Chapter {
  name: string;
  subject: Subject;
  importance: number; // 1-10, how important for JEE
}

export interface ExamMembership {
  main: boolean;
  advanced: boolean;
}

export interface SyllabusChapter {
  subject: Subject;
  chapterNumber: number;
  chapterName: string;
  examMembership: ExamMembership;
  majorTopics: string[];
  importance: number; // 1-10
  isPrerequisite?: boolean; // true if this is a supporting/prerequisite topic not officially in the JEE syllabus
}

export interface ChapterSelection {
  name: string;
  subject: Subject;
  proficiency: Proficiency;
}

export interface StudentProfile {
  name: string;
  targetExam: string;
  targetPercentile: number;
  dailyStudyHours: number;
  prepLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  chapters: ChapterSelection[];
  createdAt: string;
  isDemo?: boolean;
}

export interface ChapterTestResult {
  subject: Subject;
  chapter: string;
  correct: number;
  wrong: number;
  unattempted: number;
  maxMarks: number;
  marksObtained: number;
}

export interface MockTestResult {
  id: string;
  date: string;
  physicsScore: number;
  chemistryScore: number;
  mathScore: number;
  totalScore: number;
  maxTotal: number;
  chapterResults?: ChapterTestResult[];
}

export interface PlanItem {
  subject: Subject;
  chapter: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  priorityScore: number;
  studyMinutes: number;
  practiceMinutes: number;
  revisionMinutes: number;
  reason: string;
  isRevision?: boolean;
}

export interface StudyPlan {
  date: string;
  items: PlanItem[];
  totalMinutes: number;
  rescheduled?: PlanItem[];
}

export interface CompletedTask {
  id: string;
  date: string;
  chapter: string;
  subject: Subject;
  minutes: number;
}

export interface TestWeakChapter {
  subject: Subject;
  chapter: string;
  testId: string;
  testDate: string;
  accuracyPercent: number;
  correct: number;
  wrong: number;
  unattempted: number;
  recommendations: string[];
}

export interface RevisionRecord {
  chapter: string;
  subject: Subject;
  completedAt: string;
  revisionCount: number;
  lastRevisedAt: string | null;
  nextRevisionAt: string;
}

export interface RevisionMeta {
  totalCompletedChapters: number;
  dueToday: number;
  scheduledToday: number;
  remainingForFuture: number;
  nextDueChapter?: string;
  nextDueDate?: string;
}

export type WeightageLevel = 'Very High' | 'High' | 'Moderate' | 'Lower';
export type EvidenceLevel = 'strong' | 'moderate' | 'limited';
export type SourceType = 'historical-analysis' | 'expert-review' | 'trend-estimate';

export interface WeightageRecord {
  exam: 'main' | 'advanced';
  subject: Subject;
  chapterId: string;
  chapterName: string;
  category: WeightageLevel;
  evidenceLevel: EvidenceLevel;
  explanation: string;
  lastUpdated: string;
  sourceType: SourceType;
}

export type Page =
  | 'home'
  | 'profile'
  | 'planner'
  | 'mocktest'
  | 'dashboard'
  | 'revision'
  | 'weightage'
  | 'about';
