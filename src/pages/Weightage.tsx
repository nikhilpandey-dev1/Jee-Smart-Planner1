import { useState, useMemo } from 'react';
import type { Subject, WeightageRecord, WeightageLevel } from '@/types';
import { getValidWeightageByExam, getLastUpdatedDate } from '@/data/weightage/main';
import { TrendingUp, Search, X, AlertTriangle, Calendar, BarChart3 } from 'lucide-react';

type ExamTab = 'main' | 'advanced';
type SubjectFilter = 'all' | Subject;
type CategoryFilter = 'all' | WeightageLevel;

const importanceRank: Record<WeightageLevel, number> = {
  'Very High': 4,
  High: 3,
  Moderate: 2,
  Lower: 1,
};

const importanceColors: Record<WeightageLevel, string> = {
  'Very High': 'bg-red-50 text-red-700 border-red-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  Lower: 'bg-slate-50 text-slate-600 border-slate-200',
};

const subjectColors: Record<Subject, string> = {
  Physics: 'bg-blue-100 text-blue-700',
  Chemistry: 'bg-emerald-100 text-emerald-700',
  Mathematics: 'bg-purple-100 text-purple-700',
};

const evidenceLabels: Record<string, string> = {
  strong: 'Strong',
  moderate: 'Moderate',
  limited: 'Limited',
};

export default function Weightage() {
  const [tab, setTab] = useState<ExamTab>('main');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');

  const lastUpdated = getLastUpdatedDate();

  const validatedRecords = useMemo(() => getValidWeightageByExam(tab), [tab]);

  const filteredRecords = useMemo(() => {
    let records = validatedRecords;
    if (subjectFilter !== 'all') {
      records = records.filter((r) => r.subject === subjectFilter);
    }
    if (categoryFilter !== 'all') {
      records = records.filter((r) => r.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.chapterName.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.explanation.toLowerCase().includes(q),
      );
    }
    return [...records].sort(
      (a, b) => importanceRank[b.category] - importanceRank[a.category],
    );
  }, [validatedRecords, subjectFilter, categoryFilter, search]);

  const subjectCounts = useMemo(() => {
    return {
      all: validatedRecords.length,
      Physics: validatedRecords.filter((r) => r.subject === 'Physics').length,
      Chemistry: validatedRecords.filter((r) => r.subject === 'Chemistry').length,
      Mathematics: validatedRecords.filter((r) => r.subject === 'Mathematics').length,
    };
  }, [validatedRecords]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">JEE High-Weightage Chapters</h1>
          <p className="text-sm text-slate-500">
            Focus on chapters that historically and strategically deserve higher priority for JEE preparation.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6 mt-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600">
          Weightage is based on historical question trends and is not an official NTA/JEE Advanced
          prediction. These estimates are indicative, not definitive. No exact percentages are claimed.
        </p>
      </div>

      {/* Last updated */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
        <Calendar className="w-4 h-4" />
        <span>Last updated: {lastUpdated}</span>
        <span className="mx-1">·</span>
        <BarChart3 className="w-4 h-4" />
        <span>{validatedRecords.length} validated chapters</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['main', 'advanced'] as ExamTab[]).map((exam) => (
          <button
            key={exam}
            onClick={() => {
              setTab(exam);
              setSubjectFilter('all');
              setCategoryFilter('all');
              setSearch('');
            }}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
              tab === exam
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {exam === 'main' ? 'JEE Main' : 'JEE Advanced'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chapters..."
          className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
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
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {s === 'all' ? `All (${subjectCounts.all})` : `${s} (${subjectCounts[s]})`}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-1 flex-wrap mb-6">
        {(['all', 'Very High', 'High', 'Moderate', 'Lower'] as CategoryFilter[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              categoryFilter === c
                ? c === 'all'
                  ? 'bg-slate-600 text-white border-slate-600'
                  : importanceColors[c]
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {c === 'all' ? 'All Levels' : c}
          </button>
        ))}
      </div>

      {/* Chapter cards */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No chapters match your filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filteredRecords.map((rec, i) => (
            <WeightageCard key={`${rec.exam}-${rec.subject}-${rec.chapterId}`} record={rec} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function WeightageCard({ record, rank }: { record: WeightageRecord; rank: number }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
            {rank}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0 ${subjectColors[record.subject]}`}>
            {record.subject}
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${importanceColors[record.category]}`}>
          {record.category}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 text-sm mb-2">{record.chapterName}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-2">{record.explanation}</p>
      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
        <span>Evidence: {evidenceLabels[record.evidenceLevel] ?? record.evidenceLevel}</span>
        <span className="mx-0.5">·</span>
        <span className="capitalize">{record.sourceType.replace('-', ' ')}</span>
      </div>
    </div>
  );
}
