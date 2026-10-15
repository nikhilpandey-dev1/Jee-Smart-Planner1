import { useState, useMemo, useEffect } from 'react';
import type { Subject, RevisionRecord, ChapterSelection } from '@/types';
import {
  getProfile,
  getCompletedTasks,
  getRevisionRecords,
  completeRevisionTask,
  ensureRevisionRecord,
} from '@/lib/storage';
import { WEIGHTAGE_DATA } from '@/data/weightage/main';
import {
  RotateCcw,
  Clock,
  AlertCircle,
  Play,
  CheckCircle2,
  Calendar,
  Loader2,
} from 'lucide-react';

interface RevisionCandidate {
  chapter: ChapterSelection;
  subject: Subject;
  record: RevisionRecord | null;
  reason: string;
  reasonType: 'overdue' | 'high_weightage' | 'not_revised' | 'recently_revised' | 'due_soon';
  action: string;
  priorityScore: number;
  isOverdue: boolean;
  isDueForRevision: boolean;
  lastRevisedAt: string | null;
  daysSinceRevision: number | null;
  daysSinceCompletion: number;
}

type FilterId = 'all' | 'Physics' | 'Chemistry' | 'Mathematics';

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Physics', label: 'Physics' },
  { id: 'Chemistry', label: 'Chemistry' },
  { id: 'Mathematics', label: 'Mathematics' },
];

const subjectColors: Record<Subject, string> = {
  Physics: 'bg-blue-100 text-blue-700 border-blue-200',
  Chemistry: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Mathematics: 'bg-purple-100 text-purple-700 border-purple-200',
};

function daysBetween(from: string, to: Date): number {
  const ms = to.getTime() - new Date(from).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function getWeightageLevel(subject: Subject, chapterName: string): string | null {
  const record = WEIGHTAGE_DATA.find(
    (w) => w.exam === 'main' && w.subject === subject && w.chapterName === chapterName,
  );
  return record?.category ?? null;
}

function getRecommendedAction(
  reasonType: RevisionCandidate['reasonType'],
): string {
  if (reasonType === 'high_weightage') return 'Take Chapter Test';
  return 'Quick Revision';
}

function chapterKey(subject: Subject, chapter: string): string {
  return `${subject}-${chapter}`;
}

export default function RevisionCenter() {
  const [profile, setProfile] = useState(getProfile());
  const [completed, setCompleted] = useState(getCompletedTasks());
  const [revisions, setRevisions] = useState<RevisionRecord[]>(getRevisionRecords());
  const [filter, setFilter] = useState<FilterId>('all');
  const [inProgress, setInProgress] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<Set<string>>(new Set());

  useEffect(() => {
    const prof = getProfile();
    const comp = getCompletedTasks();
    setProfile(prof);
    setCompleted(comp);
    setRevisions(getRevisionRecords());

    if (prof) {
      let changed = false;
      for (const task of comp) {
        const existing = getRevisionRecords().find(
          (r) => r.subject === task.subject && r.chapter === task.chapter,
        );
        if (!existing) {
          ensureRevisionRecord(task.subject, task.chapter, task.date);
          changed = true;
        }
      }
      if (changed) {
        setRevisions(getRevisionRecords());
      }
    }
  }, []);

  const candidates = useMemo<RevisionCandidate[]>(() => {
    if (!profile) return [];

    const completedKeys = new Set(
      completed.map((t) => `${t.subject}-${t.chapter}`),
    );
    const now = new Date();

    const result: RevisionCandidate[] = [];

    for (const ch of profile.chapters) {
      const key = `${ch.subject}-${ch.name}`;
      if (!completedKeys.has(key)) continue;

      const record = revisions.find(
        (r) => r.subject === ch.subject && r.chapter === ch.name,
      ) ?? null;

      const completedTask = completed.find(
        (t) => t.subject === ch.subject && t.chapter === ch.name,
      );
      const daysSinceCompletion = completedTask
        ? daysBetween(completedTask.date, now)
        : 0;

      const isDueForRevision = record
        ? new Date(record.nextRevisionAt) <= now
        : true;

      const isOverdue = record
        ? isDueForRevision && daysBetween(record.nextRevisionAt, now) > 0
        : false;

      const weightageLevel = getWeightageLevel(ch.subject, ch.name);

      const lastRevisedAt = record?.lastRevisedAt ?? null;
      const daysSinceRevision = lastRevisedAt
        ? daysBetween(lastRevisedAt, now)
        : null;

      const revisionCount = record?.revisionCount ?? 0;

      let reason: string;
      let reasonType: RevisionCandidate['reasonType'];
      let priorityScore = 0;

      if (isOverdue) {
        if (weightageLevel === 'Very High' || weightageLevel === 'High') {
          reason = `High-weightage chapter — revision overdue (${weightageLevel} weightage)`;
          reasonType = 'high_weightage';
          priorityScore += 30;
        } else {
          reason = 'Revision overdue';
          reasonType = 'overdue';
          priorityScore += 25;
        }
      } else if (isDueForRevision) {
        if (weightageLevel === 'Very High' || weightageLevel === 'High') {
          reason = `High-weightage chapter — revision due (${weightageLevel} weightage)`;
          reasonType = 'high_weightage';
          priorityScore += 22;
        } else {
          reason = 'Revision due';
          reasonType = 'not_revised';
          priorityScore += 20;
        }
      } else if (lastRevisedAt === null) {
        reason = 'Not revised yet';
        reasonType = 'not_revised';
        priorityScore += 15;
      } else if (daysSinceRevision !== null && daysSinceRevision <= 3) {
        reason = 'Recently revised';
        reasonType = 'recently_revised';
        priorityScore += 0;
      } else if (daysSinceRevision !== null && daysSinceRevision > 14) {
        reason = `Not revised in ${daysSinceRevision} days`;
        reasonType = 'not_revised';
        priorityScore += 12;
      } else {
        reason = 'Revision due soon';
        reasonType = 'due_soon';
        priorityScore += 8;
      }

      if (weightageLevel === 'Very High') priorityScore += 15;
      else if (weightageLevel === 'High') priorityScore += 10;
      else if (weightageLevel === 'Moderate') priorityScore += 5;

      const action = getRecommendedAction(reasonType);

      result.push({
        chapter: ch,
        subject: ch.subject,
        record,
        reason,
        reasonType,
        action,
        priorityScore,
        isOverdue,
        isDueForRevision,
        lastRevisedAt,
        daysSinceRevision,
        daysSinceCompletion,
      });
    }

    result.sort((a, b) => b.priorityScore - a.priorityScore);
    return result;
  }, [profile, completed, revisions]);

  const filtered = useMemo(() => {
    if (filter === 'all') return candidates;
    return candidates.filter((c) => c.subject === filter);
  }, [candidates, filter]);

  const summary = useMemo(() => {
    const revisionDue = candidates.filter((c) => c.isDueForRevision).length;
    const overdue = candidates.filter((c) => c.isOverdue).length;
    const recentlyRevised = candidates.filter(
      (c) => c.daysSinceRevision !== null && c.daysSinceRevision <= 3,
    ).length;
    return { revisionDue, overdue, recentlyRevised };
  }, [candidates]);

  const handleStartRevision = (subject: Subject, chapter: string) => {
    const key = chapterKey(subject, chapter);
    setInProgress((prev) => new Set(prev).add(key));
  };

  const handleCancelRevision = (subject: Subject, chapter: string) => {
    const key = chapterKey(subject, chapter);
    setInProgress((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleCompleteRevision = (subject: Subject, chapter: string) => {
    const key = chapterKey(subject, chapter);
    if (saving.has(key)) return;

    setSaving((prev) => new Set(prev).add(key));

    const updated = completeRevisionTask(subject, chapter);
    setRevisions(getRevisionRecords());

    setInProgress((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    setSaving((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const completedToday = useMemo(() => {
    const today = new Date().toDateString();
    const set = new Set<string>();
    for (const r of revisions) {
      if (r.lastRevisedAt && new Date(r.lastRevisedAt).toDateString() === today) {
        set.add(chapterKey(r.subject, r.chapter));
      }
    }
    return set;
  }, [revisions]);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Revision Dashboard</h1>
            <p className="text-sm text-slate-500">Revise the chapters that need your attention most.</p>
          </div>
        </div>
        <div className="text-center py-12 text-slate-500">
          Create a profile and complete some chapters first to use Revision Dashboard.
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Revision Dashboard</h1>
            <p className="text-sm text-slate-500">Revise the chapters that need your attention most.</p>
          </div>
        </div>
        <div className="text-center py-12 text-slate-500">
          No completed chapters yet. Complete chapters from your Study Plan to start revising.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revision Dashboard</h1>
          <p className="text-sm text-slate-500">Revise the chapters that need your attention most.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-500">Revision Due</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{summary.revisionDue}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-slate-500">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{summary.overdue}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-500">Recently Revised</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{summary.recentlyRevised}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Revision Queue */}
      <div>
        <h2 className="font-semibold text-slate-800 mb-4">Revision Queue</h2>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
            No chapters match this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => {
              const key = chapterKey(c.subject, c.chapter.name);
              const weightageLevel = getWeightageLevel(c.subject, c.chapter.name);
              const isInProgress = inProgress.has(key);
              const isCompleted = completedToday.has(key);
              const isSaving = saving.has(key);

              return (
                <div
                  key={key}
                  className={`p-5 rounded-2xl bg-white border transition-all ${
                    isCompleted
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-slate-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${subjectColors[c.subject]}`}>
                          {c.subject}
                        </span>
                        <span className="font-semibold text-slate-800">{c.chapter.name}</span>
                        {c.isOverdue && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            Overdue
                          </span>
                        )}
                        {weightageLevel && (weightageLevel === 'Very High' || weightageLevel === 'High') && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            {weightageLevel} weightage
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Revision Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{c.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                        {c.lastRevisedAt ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Last revised: {new Date(c.lastRevisedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Not yet revised
                          </span>
                        )}
                        {c.record && c.record.revisionCount > 0 && (
                          <span>{c.record.revisionCount} revision{c.record.revisionCount > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-500 font-medium">
                        {c.action}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Completed
                        </span>
                      ) : isInProgress ? (
                        <div className="flex flex-col items-end gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Revision in progress
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCancelRevision(c.subject, c.chapter.name)}
                              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleCompleteRevision(c.subject, c.chapter.name)}
                              disabled={isSaving}
                              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                isSaving
                                  ? 'bg-emerald-400 text-white cursor-not-allowed'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {isSaving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              {isSaving ? 'Saving...' : 'Mark Revision Complete'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartRevision(c.subject, c.chapter.name)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Start Revision
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
