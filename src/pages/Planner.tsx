import { useState, useEffect, useMemo } from 'react';
import type { Page, StudyPlan, CompletedTask, Subject, PlanItem } from '@/types';
import {
  getProfile,
  getPlan,
  savePlan,
  getCompletedTasks,
  saveCompletedTasks,
  getMockTests,
  ensureRevisionRecord,
  completeRevisionTask,
  removeRevisionRecord,
  getRevisionRecords,
  saveRevisionRecords,
} from '@/lib/storage';
import {
  generatePlanExcludingCompleted,
  generateRevisionPlan,
  getRevisionMeta,
} from '@/lib/priority';
import {
  RefreshCw,
  Clock,
  BookOpen,
  Brain,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  CalendarClock,
  RotateCw,
  Plus,
  RefreshCcw,
  CheckCircle,
} from 'lucide-react';

interface PlannerProps {
  onNavigate: (page: Page) => void;
}

const priorityColors: Record<string, string> = {
  HIGH: 'bg-red-50 text-red-700 border-red-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const subjectColors: Record<Subject, string> = {
  Physics: 'bg-blue-100 text-blue-700',
  Chemistry: 'bg-emerald-100 text-emerald-700',
  Mathematics: 'bg-purple-100 text-purple-700',
};

function taskKey(item: { subject: Subject; chapter: string }): string {
  return `${item.subject}-${item.chapter}`;
}

export default function Planner({ onNavigate }: PlannerProps) {
  const [plan, setPlan] = useState<StudyPlan | null>(getPlan());
  const [completed, setCompleted] = useState<CompletedTask[]>(getCompletedTasks());
  const [profile] = useState(getProfile());
  const [revisionRecords, setRevisionRecords] = useState(getRevisionRecords());

  useEffect(() => {
    setPlan(getPlan());
    setCompleted(getCompletedTasks());
    setRevisionRecords(getRevisionRecords());
  }, []);

  const completedKeys = useMemo(
    () => new Set(completed.map((t) => taskKey(t))),
    [completed],
  );

  // Revision tasks are "done" if their revision record has lastRevisedAt set
  // AND nextRevisionAt is in the future (meaning the revision was already completed).
  // This is separate from chapter completion.
  const revisionDoneKeys = useMemo(() => {
    const now = new Date();
    const keys = new Set<string>();
    for (const r of revisionRecords) {
      if (r.lastRevisedAt && new Date(r.nextRevisionAt) > now) {
        keys.add(`${r.subject}-${r.chapter}`);
      }
    }
    return keys;
  }, [revisionRecords]);

  const allItems = plan?.items ?? [];
  const rescheduledItems = plan?.rescheduled ?? [];

  // Determine done state per item: revision tasks use revisionDoneKeys,
  // new study tasks use completedKeys.
  const isItemDone = (item: PlanItem): boolean =>
    item.isRevision
      ? revisionDoneKeys.has(taskKey(item))
      : completedKeys.has(taskKey(item));

  const completedCount = allItems.filter((item) => isItemDone(item)).length;
  const pendingItems = allItems.filter((item) => !isItemDone(item));
  const totalTasks = allItems.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const nextRecommended = pendingItems.length > 0
    ? [...pendingItems].sort((a, b) => b.priorityScore - a.priorityScore)[0]
    : null;

  const isRevisionMode = allItems.length > 0 && allItems.every((item) => item.isRevision);
  const hasCompletedChapters = completed.length > 0;
  const allPendingDone = totalTasks > 0 && pendingItems.length === 0;

  const revisionMeta = useMemo(() => {
    if (!profile) return null;
    return getRevisionMeta(profile, completed, allItems.length);
  }, [profile, completed, allItems.length]);

  const handleRegenerate = () => {
    if (!profile) return;
    const newPlan = generatePlanExcludingCompleted(profile, getMockTests(), completed);
    savePlan(newPlan);
    setPlan(newPlan);
  };

  const handleStartRevision = () => {
    if (!profile) return;
    const revisionPlan = generateRevisionPlan(profile, getMockTests(), completed);
    savePlan(revisionPlan);
    setPlan(revisionPlan);
  };

  const toggleComplete = (item: PlanItem) => {
    const key = taskKey(item);

    if (item.isRevision) {
      // Revision task: track completion via revision records, NOT via completed tasks.
      // This preserves the original chapter completion state.
      const isDone = revisionDoneKeys.has(key);

      if (isDone) {
        // Un-complete revision: decrement revisionCount, reset lastRevisedAt,
        // set nextRevisionAt to now (due again immediately).
        const records = getRevisionRecords();
        const record = records.find(
          (r) => r.subject === item.subject && r.chapter === item.chapter,
        );
        if (record) {
          record.revisionCount = Math.max(0, record.revisionCount - 1);
          record.lastRevisedAt = null;
          record.nextRevisionAt = new Date().toISOString();
          saveRevisionRecords(records);
          setRevisionRecords([...records]);
        }
      } else {
        // Complete revision: increment revisionCount, update lastRevisedAt,
        // calculate nextRevisionAt using spaced-repetition intervals.
        const records = completeRevisionTask(item.subject, item.chapter);
        setRevisionRecords([...records]);
      }
      return;
    }

    // New study task: track completion via completed tasks.
    const exists = completedKeys.has(key);
    let updated: CompletedTask[];

    if (exists) {
      updated = completed.filter((t) => taskKey(t) !== key);
      removeRevisionRecord(item.subject, item.chapter);
      setRevisionRecords(getRevisionRecords());
    } else {
      const now = new Date().toISOString();
      updated = [
        ...completed,
        {
          id: `${Date.now()}`,
          date: now,
          chapter: item.chapter,
          subject: item.subject,
          minutes: item.studyMinutes + item.practiceMinutes + item.revisionMinutes,
        },
      ];
      ensureRevisionRecord(item.subject, item.chapter, now);
      setRevisionRecords(getRevisionRecords());
    }

    saveCompletedTasks(updated);
    setCompleted(updated);
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">You need to create a profile first.</p>
        <button
          onClick={() => onNavigate('profile')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
        >
          Create Profile <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (!plan || allItems.length === 0) {
    // Check if there are due revisions
    const hasDueRevisions = revisionMeta?.dueToday ?? 0 > 0;
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">
          {hasCompletedChapters
            ? hasDueRevisions
              ? 'No new chapters to study. Start revision to strengthen retention.'
              : 'No revision is due today.'
            : 'No plan yet. Generate one now.'}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleRegenerate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Generate Plan
          </button>
          {hasCompletedChapters && (
            <button
              onClick={handleStartRevision}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-all"
            >
              <RotateCw className="w-4 h-4" /> Start Revision
            </button>
          )}
        </div>
        {hasCompletedChapters && !hasDueRevisions && revisionMeta?.nextDueChapter && (
          <p className="text-sm text-slate-400 mt-4">
            Next revision: {revisionMeta.nextDueChapter} on {revisionMeta.nextDueDate}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRevisionMode ? 'Revision & Practice Mode' : 'Your Study Plan'}
          </h1>
          <p className="text-sm text-slate-500">
            {profile.name} — {profile.dailyStudyHours}h available today
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleRegenerate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Plan
          </button>
          {hasCompletedChapters && (
            <button
              onClick={handleStartRevision}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold border border-cyan-600 hover:bg-cyan-700 transition-all"
            >
              <RotateCw className="w-4 h-4" />
              Start Revision
            </button>
          )}
        </div>
      </div>

      {/* Revision mode banner with stats */}
      {isRevisionMode && revisionMeta && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-50 border border-cyan-200 mb-6">
          <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-cyan-900 text-sm">Revision & Practice Mode</p>
            <p className="text-sm text-cyan-700 mt-0.5 mb-2">
              Your planned chapters are complete. Now strengthen retention through revision and practice.
            </p>
            <div className="flex gap-4 flex-wrap text-xs text-cyan-600">
              <span>{revisionMeta.scheduledToday} revision tasks scheduled today</span>
              {revisionMeta.remainingForFuture > 0 && (
                <span>{revisionMeta.remainingForFuture} completed chapters remaining for future revision</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No revision due message */}
      {isRevisionMode && allItems.length === 0 && revisionMeta && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
          <Clock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-700 text-sm">No revision is due today.</p>
            {revisionMeta.nextDueChapter && (
              <p className="text-sm text-slate-500 mt-0.5">
                Next revision: {revisionMeta.nextDueChapter} on {revisionMeta.nextDueDate}
              </p>
            )}
          </div>
        </div>
      )}

      {/* All pending done + has completed chapters */}
      {allPendingDone && !isRevisionMode && hasCompletedChapters && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-emerald-900 text-sm">All tasks completed!</p>
            <p className="text-sm text-emerald-700 mt-0.5 mb-3">
              Your planned chapters are complete. Now strengthen retention through revision and practice.
            </p>
            <button
              onClick={handleStartRevision}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-all"
            >
              <RotateCw className="w-4 h-4" />
              Start Revision
            </button>
          </div>
        </div>
      )}

      {/* All pending done + no completed chapters */}
      {allPendingDone && !isRevisionMode && !hasCompletedChapters && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900 text-sm">All tasks completed!</p>
            <p className="text-sm text-emerald-700 mt-0.5">
              Complete some chapters first to unlock revision recommendations.
            </p>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            {completedCount} of {totalTasks} tasks completed
          </span>
          <span className="text-sm font-bold text-slate-900">{progressPercent}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isRevisionMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                : 'bg-gradient-to-r from-blue-500 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Next Recommended */}
      {nextRecommended && (
        <div className={`rounded-2xl p-6 mb-6 shadow-lg ${isRevisionMode ? 'bg-gradient-to-br from-cyan-600 to-blue-500 shadow-cyan-200' : 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-blue-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white uppercase tracking-wide">
              Next Recommended
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/20 text-white">
              {nextRecommended.subject}
            </span>
            <h3 className="text-xl font-bold text-white">{nextRecommended.chapter}</h3>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/15 text-white border border-white/20">
              {nextRecommended.priority}
            </span>
            {nextRecommended.isRevision ? (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-cyan-300/30 text-white border border-cyan-200/30 flex items-center gap-1">
                <RefreshCcw className="w-3 h-3" />
                Revision
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/20 text-white flex items-center gap-1">
                <Plus className="w-3 h-3" />
                New
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/90 mb-3">
            {!nextRecommended.isRevision && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Study: {nextRecommended.studyMinutes} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <Brain className="w-4 h-4" /> Practice: {nextRecommended.practiceMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Review: {nextRecommended.revisionMinutes} min
            </span>
          </div>
          <p className="text-sm text-white/80 bg-white/10 rounded-lg p-3">
            {nextRecommended.reason}
          </p>
          <button
            onClick={() => toggleComplete(nextRecommended)}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            {nextRecommended.isRevision ? 'Mark Revision Complete' : 'Mark as Completed'}
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Total Time</p>
          <p className="text-lg font-bold text-slate-900">
            {Math.floor(plan.totalMinutes / 60)}h {plan.totalMinutes % 60}m
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">{isRevisionMode ? 'Revisions' : 'Chapters'}</p>
          <p className="text-lg font-bold text-slate-900">{totalTasks}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Completed</p>
          <p className="text-lg font-bold text-slate-900">
            {completedCount}/{totalTasks}
          </p>
        </div>
      </div>

      {/* Plan items */}
      <div className="space-y-4">
        {allItems.map((item, i) => {
          const isDone = isItemDone(item);
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleComplete(item)}
                    className="flex-shrink-0 p-1 -m-1 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    ) : (
                      <Circle className="w-7 h-7 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${subjectColors[item.subject]}`}>
                        {item.subject}
                      </span>
                      <h3 className={`font-semibold ${isDone ? 'text-slate-400' : 'text-slate-900'}`}>
                        {item.chapter}
                      </h3>
                      {isDone ? (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </span>
                      ) : item.isRevision ? (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center gap-1">
                          <RefreshCcw className="w-3 h-3" />
                          Revision
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${priorityColors[item.priority]}`}>
                  {item.priority}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 ml-9 text-sm text-slate-500 mb-3">
                {!item.isRevision && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" /> Study: {item.studyMinutes}m
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Brain className="w-4 h-4" /> Practice: {item.practiceMinutes}m
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Review: {item.revisionMinutes}m
                </span>
              </div>

              <div className="ml-9 p-3 rounded-lg bg-slate-50 text-sm text-slate-600">
                {item.reason}
              </div>

              {!isDone && (
                <button
                  onClick={() => toggleComplete(item)}
                  className={`ml-9 mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border transition-all ${
                    item.isRevision
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {item.isRevision ? 'Complete Revision' : 'Complete'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Rescheduled tasks */}
      {rescheduledItems.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-slate-800">
              {isRevisionMode ? 'More Revisions — Not enough time today' : 'Rescheduled — Not enough time today'}
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            {isRevisionMode
              ? 'These revision tasks will be available when you start revision again.'
              : 'These chapters didn\'t fit into today\'s study time. They will be included when you regenerate your plan.'}
          </p>
          <div className="space-y-3">
            {rescheduledItems.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-amber-50 border border-amber-100"
              >
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${subjectColors[item.subject]}`}>
                    {item.subject}
                  </span>
                  <h3 className="font-semibold text-slate-800 text-sm">{item.chapter}</h3>
                  {item.isRevision && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100">
                      Revision
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${priorityColors[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  {!item.isRevision && <span>Study: {item.studyMinutes}m</span>}
                  <span>Practice: {item.practiceMinutes}m</span>
                  <span>Review: {item.revisionMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
