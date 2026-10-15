import { useState, useMemo } from 'react';
import type { StudentProfile, ChapterSelection, Proficiency, Subject } from '@/types';
import { SYLLABUS, SUBJECTS, getSyllabusBySubject } from '@/data/chapters';
import {
  getProfile,
  saveProfile,
  getMockTests,
  savePlan,
  clearAllData,
  enterDemoMode,
  isDemoMode,
  exitDemoMode,
} from '@/lib/storage';
import { getDemoProfile, getDemoMockTests } from '@/lib/demoData';
import { generatePlanExcludingCompleted } from '@/lib/priority';
import { User, Check, Sparkles, RotateCcw, Eye, Search, X } from 'lucide-react';

interface ProfileProps {
  onSaved: () => void;
  onDataChanged?: () => void;
}

const PREP_LEVELS: ('Beginner' | 'Intermediate' | 'Advanced')[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

type ProficiencyFilter = 'all' | 'weak' | 'average' | 'strong' | 'none';
type SubjectFilter = 'all' | Subject;

export default function Profile({ onSaved, onDataChanged }: ProfileProps) {
  const existing = getProfile();
  const demo = isDemoMode();
  const [name, setName] = useState(demo ? '' : (existing?.name ?? ''));
  const [targetExam, setTargetExam] = useState(existing?.targetExam ?? 'JEE Main 2026');
  const [targetPercentile, setTargetPercentile] = useState(existing?.targetPercentile ?? 90);
  const [dailyStudyHours, setDailyStudyHours] = useState(existing?.dailyStudyHours ?? 5);
  const [prepLevel, setPrepLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    existing?.prepLevel ?? 'Intermediate',
  );
  const [chapters, setChapters] = useState<ChapterSelection[]>(existing?.chapters ?? []);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState<ProficiencyFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [expandedSubject, setExpandedSubject] = useState<Subject | null>(null);

  const proficiencyFor = (chName: string, subject: Subject): Proficiency | null => {
    const found = chapters.find((c) => c.name === chName && c.subject === subject);
    return found?.proficiency ?? null;
  };

  const setProficiency = (chName: string, subject: Subject, prof: Proficiency) => {
    setChapters((prev) => {
      const without = prev.filter((c) => !(c.name === chName && c.subject === subject));
      return [...without, { name: chName, subject, proficiency: prof }];
    });
  };

  const removeChapter = (chName: string, subject: Subject) => {
    setChapters((prev) => prev.filter((c) => !(c.name === chName && c.subject === subject)));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (chapters.length === 0) {
      setError('Please select at least a few chapters and mark them as weak, average, or strong.');
      return;
    }
    setError('');
    const profile: StudentProfile = {
      name: name.trim(),
      targetExam,
      targetPercentile,
      dailyStudyHours,
      prepLevel,
      chapters,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);
    const plan = generatePlanExcludingCompleted(profile, getMockTests(), []);
    savePlan(plan);
    onSaved();
  };

  const loadDemo = () => {
    const demoProfile = getDemoProfile();
    const demoTests = getDemoMockTests();
    const plan = generatePlanExcludingCompleted(demoProfile, demoTests, []);
    enterDemoMode(demoProfile, demoTests, plan);
    onDataChanged?.();
    onSaved();
  };

  const handleClear = () => {
    clearAllData();
    onDataChanged?.();
    setName('');
    setTargetExam('JEE Main 2026');
    setTargetPercentile(90);
    setDailyStudyHours(5);
    setPrepLevel('Intermediate');
    setChapters([]);
    setError('');
  };

  const profColors: Record<Proficiency, string> = {
    weak: 'bg-red-500 text-white border-red-500',
    average: 'bg-amber-500 text-white border-amber-500',
    strong: 'bg-emerald-500 text-white border-emerald-500',
  };

  const profFilterColors: Record<ProficiencyFilter, string> = {
    all: 'bg-blue-600 text-white border-blue-600',
    weak: 'bg-red-500 text-white border-red-500',
    average: 'bg-amber-500 text-white border-amber-500',
    strong: 'bg-emerald-500 text-white border-emerald-500',
    none: 'bg-slate-500 text-white border-slate-500',
  };

  const subjectFilterColors: Record<SubjectFilter, string> = {
    all: 'bg-blue-600 text-white border-blue-600',
    Physics: 'bg-blue-600 text-white border-blue-600',
    Chemistry: 'bg-emerald-600 text-white border-emerald-600',
    Mathematics: 'bg-purple-600 text-white border-purple-600',
  };

  const subjectAssessedCount = (subject: Subject) => {
    const total = getSyllabusBySubject(subject).length;
    const assessed = chapters.filter((c) => c.subject === subject).length;
    return { assessed, total };
  };

  const filteredChapters = useMemo(() => {
    return SYLLABUS.filter((ch) => {
      // Subject filter
      const matchesSubject =
        subjectFilter === 'all' || ch.subject === subjectFilter;

      // Proficiency filter
      const prof = proficiencyFor(ch.chapterName, ch.subject);
      const matchesProficiency =
        proficiencyFilter === 'all' ||
        (proficiencyFilter === 'weak' && prof === 'weak') ||
        (proficiencyFilter === 'average' && prof === 'average') ||
        (proficiencyFilter === 'strong' && prof === 'strong') ||
        (proficiencyFilter === 'none' && prof === null);

      // Search filter
      const matchesSearch =
        search === '' ||
        ch.chapterName.toLowerCase().includes(search.toLowerCase()) ||
        ch.majorTopics.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      return matchesSubject && matchesProficiency && matchesSearch;
    });
  }, [search, proficiencyFilter, subjectFilter, chapters]);

  const filteredCount = filteredChapters.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
          <p className="text-sm text-slate-500">Tell us about yourself so we can build your plan.</p>
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">Basic Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Exam</label>
            <input
              type="text"
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Percentile: {targetPercentile}
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={targetPercentile}
              onChange={(e) => setTargetPercentile(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Daily Study Hours: {dailyStudyHours}h
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={dailyStudyHours}
              onChange={(e) => setDailyStudyHours(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Preparation Level
          </label>
          <div className="flex gap-2">
            {PREP_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setPrepLevel(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  prepLevel === level
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subject progress overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {SUBJECTS.map((subject) => {
          const { assessed, total } = subjectAssessedCount(subject);
          const percent = total > 0 ? Math.round((assessed / total) * 100) : 0;
          return (
            <div key={subject} className="p-4 rounded-xl bg-white border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">{subject}</p>
              <p className="text-sm font-bold text-slate-900">
                {assessed}/{total} assessed
              </p>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chapter selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-slate-800">Chapter Self-Assessment</h2>
          <span className="text-xs text-slate-400">{filteredCount} chapters</span>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          For each chapter, mark it as <span className="text-red-600 font-medium">Weak</span>,{' '}
          <span className="text-amber-600 font-medium">Average</span>, or{' '}
          <span className="text-emerald-600 font-medium">Strong</span>. Only selected chapters
          appear in your plan.
        </p>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chapters or topics..."
            className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Subject filters */}
        <div className="flex gap-1 flex-wrap mb-2">
          {(['all', 'Physics', 'Chemistry', 'Mathematics'] as SubjectFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setSubjectFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                subjectFilter === s
                  ? subjectFilterColors[s]
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s === 'all' ? 'All Subjects' : s}
            </button>
          ))}
        </div>

        {/* Proficiency filters */}
        <div className="flex gap-1 flex-wrap mb-4">
          {(['all', 'weak', 'average', 'strong', 'none'] as ProficiencyFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setProficiencyFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                proficiencyFilter === f
                  ? profFilterColors[f]
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f === 'none' ? 'Not Started' : f === 'all' ? 'All Levels' : f}
            </button>
          ))}
        </div>

        {/* Chapter list by subject */}
        {SUBJECTS.map((subject) => {
          const subjectChapters = filteredChapters.filter((c) => c.subject === subject);
          if (subjectChapters.length === 0) return null;
          const isExpanded = expandedSubject === subject || subjectFilter !== 'all' || search !== '' || proficiencyFilter !== 'all';
          return (
            <div key={subject} className="mb-4 last:mb-0">
              <button
                onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                className="w-full flex items-center justify-between text-left py-2 border-b border-slate-100"
              >
                <h3 className="font-medium text-slate-700">{subject}</h3>
                <span className="text-xs text-slate-400">
                  {subjectChapters.length} chapters
                </span>
              </button>
              {isExpanded && (
                <div className="space-y-1 mt-2">
                  {subjectChapters.map((ch) => {
                    const prof = proficiencyFor(ch.chapterName, ch.subject);
                    return (
                      <div
                        key={`${ch.subject}-${ch.chapterNumber}`}
                        className="flex items-center justify-between gap-2 py-2 px-2 rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-slate-400 flex-shrink-0">
                              {ch.chapterNumber}.
                            </span>
                            <span className="text-sm text-slate-700">{ch.chapterName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 ml-5 flex-wrap">
                            {ch.examMembership.main && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                                Main
                              </span>
                            )}
                            {ch.examMembership.advanced && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
                                Adv
                              </span>
                            )}
                            {ch.isPrerequisite && !ch.examMembership.main && !ch.examMembership.advanced && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                Prerequisite
                              </span>
                            )}
                            {ch.isPrerequisite && (ch.examMembership.main || ch.examMembership.advanced) && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                Supporting
                              </span>
                            )}
                            <span className="text-xs text-slate-400 truncate">
                              {ch.majorTopics.slice(0, 3).join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {(['weak', 'average', 'strong'] as Proficiency[]).map((p) => (
                            <button
                              key={p}
                              onClick={() =>
                                prof === p
                                  ? removeChapter(ch.chapterName, ch.subject)
                                  : setProficiency(ch.chapterName, ch.subject, p)
                              }
                              className={`px-2.5 py-1 rounded-md text-xs font-medium border capitalize transition-all ${
                                prof === p
                                  ? profColors[p]
                                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {filteredChapters.length === 0 && (search || proficiencyFilter !== 'all' || subjectFilter !== 'all') && (
          <p className="text-sm text-slate-400 text-center py-4">No chapters match your filters.</p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Check className="w-5 h-5" />
          Save Profile & Generate Plan
        </button>
        <button
          onClick={loadDemo}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-all"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          Load Demo Data
        </button>
        {demo && (
          <button
            onClick={() => {
              exitDemoMode();
              onDataChanged?.();
              onSaved();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-50 text-amber-700 font-semibold border border-amber-200 hover:bg-amber-100 transition-all"
          >
            <Eye className="w-5 h-5" />
            Exit Demo & Restore My Data
          </button>
        )}
        <button
          onClick={handleClear}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-500 font-semibold border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Clear All Data
        </button>
      </div>
    </div>
  );
}
