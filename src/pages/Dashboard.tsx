import { useState, useEffect } from 'react';
import type { Page, StudentProfile, StudyPlan, CompletedTask, MockTestResult, Subject } from '@/types';
import {
  getProfile,
  getPlan,
  getCompletedTasks,
  getMockTests,
} from '@/lib/storage';
import { BarChart, LineChart, DonutChart } from '@/components/Charts';
import { LayoutDashboard, Clock, CheckCircle2, Target, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const subjectColors: Record<Subject, string> = {
  Physics: 'bg-blue-100 text-blue-700',
  Chemistry: 'bg-emerald-100 text-emerald-700',
  Mathematics: 'bg-purple-100 text-purple-700',
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(getProfile());
  const [plan, setPlan] = useState<StudyPlan | null>(getPlan());
  const [completed, setCompleted] = useState<CompletedTask[]>(getCompletedTasks());
  const [mockTests, setMockTests] = useState<MockTestResult[]>(getMockTests());

  useEffect(() => {
    setProfile(getProfile());
    setPlan(getPlan());
    setCompleted(getCompletedTasks());
    setMockTests(getMockTests());
  }, []);

  const allCompletedKeys = new Set(completed.map((t) => `${t.subject}-${t.chapter}`));
  const totalMinutesSpent = completed.reduce((s, t) => s + t.minutes, 0);

  const planItems = plan?.items ?? [];
  const completedCount = planItems.filter((item) => allCompletedKeys.has(`${item.subject}-${item.chapter}`)).length;
  const totalTasks = planItems.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Weak / strong topics from profile
  const weakTopics = profile?.chapters.filter((c) => c.proficiency === 'weak') ?? [];
  const strongTopics = profile?.chapters.filter((c) => c.proficiency === 'strong') ?? [];

  // Mock test data
  const sortedTests = [...mockTests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sortedTests[sortedTests.length - 1];
  const maxPerSubject = latest ? latest.maxTotal / 3 : 100;

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Progress Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, {profile.name}.</p>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-slate-500">Study Time Today</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {Math.floor(totalMinutesSpent / 60)}h {totalMinutesSpent % 60}m
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-slate-500">Tasks Completed</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {completedCount}/{totalTasks}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-slate-500">Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-slate-900">{progressPercent}%</p>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-slate-500">Mock Tests</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockTests.length}</p>
        </div>
      </div>

      {/* Today's plan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Today's Study Plan</h2>
          <button
            onClick={() => onNavigate('planner')}
            className="text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            View full plan →
          </button>
        </div>
        {planItems.length === 0 ? (
          <p className="text-sm text-slate-500">No plan generated yet.</p>
        ) : (
          <div className="space-y-2">
            {planItems.slice(0, 5).map((item, i) => {
              const isDone = allCompletedKeys.has(`${item.subject}-${item.chapter}`);
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${isDone ? 'bg-emerald-50' : 'bg-slate-50'}`}
                >
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${subjectColors[item.subject]}`}>
                    {item.subject}
                  </span>
                  <span className={`text-sm flex-1 ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item.chapter}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.studyMinutes + item.practiceMinutes + item.revisionMinutes}m
                  </span>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Weak / Strong topics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Topic Breakdown</h2>
          <div className="mb-4">
            <p className="text-sm font-medium text-red-600 mb-2">Weak Topics ({weakTopics.length})</p>
            <div className="flex flex-wrap gap-2">
              {weakTopics.length === 0 ? (
                <span className="text-sm text-slate-400">None marked</span>
              ) : (
                weakTopics.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs border border-red-100">
                    {t.subject}: {t.name}
                  </span>
                ))
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-600 mb-2">Strong Topics ({strongTopics.length})</p>
            <div className="flex flex-wrap gap-2">
              {strongTopics.length === 0 ? (
                <span className="text-sm text-slate-400">None marked</span>
              ) : (
                strongTopics.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs border border-emerald-100">
                    {t.subject}: {t.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Time distribution donut */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Time Distribution (Today's Plan)</h2>
          {planItems.length === 0 ? (
            <p className="text-sm text-slate-500">No plan data.</p>
          ) : (
            <DonutChart
              segments={[
                { label: 'Study', value: planItems.reduce((s, i) => s + i.studyMinutes, 0), color: '#3b82f6' },
                { label: 'Practice', value: planItems.reduce((s, i) => s + i.practiceMinutes, 0), color: '#10b981' },
                { label: 'Revision', value: planItems.reduce((s, i) => s + i.revisionMinutes, 0), color: '#f59e0b' },
              ]}
            />
          )}
        </div>
      </div>

      {/* Mock test performance */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Latest Mock Test</h2>
          {sortedTests.length === 0 ? (
            <p className="text-sm text-slate-500">No mock tests recorded yet.</p>
          ) : (
            <BarChart
              data={[
                { label: 'Physics', value: latest.physicsScore, color: 'bg-blue-500' },
                { label: 'Chemistry', value: latest.chemistryScore, color: 'bg-emerald-500' },
                { label: 'Mathematics', value: latest.mathScore, color: 'bg-purple-500' },
              ]}
              max={maxPerSubject}
            />
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Score Trend</h2>
          {sortedTests.length === 0 ? (
            <p className="text-sm text-slate-500">No mock tests recorded yet.</p>
          ) : (
            <LineChart
              data={sortedTests.map((t, i) => ({ label: `T${i + 1}`, value: t.totalScore }))}
              max={latest?.maxTotal ?? 300}
            />
          )}
        </div>
      </div>
    </div>
  );
}
