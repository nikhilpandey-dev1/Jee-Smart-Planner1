import { useState, useEffect } from 'react';
import type { MockTestResult } from '@/types';
import { getMockTests, saveMockTests, updateTestWeakChapters, getTestWeakChapters, saveTestWeakChapters } from '@/lib/storage';
import { BarChart, LineChart } from '@/components/Charts';
import { ClipboardList, Save, Trash2, TrendingUp, Award, AlertCircle, Flag } from 'lucide-react';

export default function MockTest() {
  const [tests, setTests] = useState<MockTestResult[]>(getMockTests());
  const [physics, setPhysics] = useState('');
  const [chemistry, setChemistry] = useState('');
  const [math, setMath] = useState('');
  const [maxTotal, setMaxTotal] = useState('300');
  const [error, setError] = useState('');
  const [flaggedWeakCount, setFlaggedWeakCount] = useState(0);

  useEffect(() => {
    setTests(getMockTests());
  }, []);

  const handleSave = () => {
    const p = Number(physics);
    const c = Number(chemistry);
    const m = Number(math);
    const max = Number(maxTotal);

    if (isNaN(p) || isNaN(c) || isNaN(m) || isNaN(max)) {
      setError('Please enter valid numbers for all fields.');
      return;
    }
    if (max <= 0) {
      setError('Max total must be greater than 0.');
      return;
    }
    if (p < 0 || c < 0 || m < 0) {
      setError('Scores cannot be negative.');
      return;
    }
    if (p + c + m > max) {
      setError('Total of subject scores exceeds the maximum total.');
      return;
    }
    setError('');

    const newTest: MockTestResult = {
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      physicsScore: p,
      chemistryScore: c,
      mathScore: m,
      totalScore: p + c + m,
      maxTotal: max,
    };
    const updated = [...tests, newTest];
    saveMockTests(updated);
    setTests(updated);
    setPhysics('');
    setChemistry('');
    setMath('');

    const weakChapters = updateTestWeakChapters(newTest);
    setFlaggedWeakCount(weakChapters.filter((w) => w.testId === newTest.id).length);
  };

  const handleDelete = (id: string) => {
    const updated = tests.filter((t) => t.id !== id);
    saveMockTests(updated);
    setTests(updated);
    const remaining = getTestWeakChapters().filter((w) => w.testId !== id);
    saveTestWeakChapters(remaining);
  };

  const sorted = [...tests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1];

  const maxPerSubject = latest ? latest.maxTotal / 3 : 100;

  const avgPhysics = sorted.length ? Math.round(sorted.reduce((s, t) => s + t.physicsScore, 0) / sorted.length) : 0;
  const avgChem = sorted.length ? Math.round(sorted.reduce((s, t) => s + t.chemistryScore, 0) / sorted.length) : 0;
  const avgMath = sorted.length ? Math.round(sorted.reduce((s, t) => s + t.mathScore, 0) / sorted.length) : 0;

  const subjectAverages: { name: string; avg: number }[] = [
    { name: 'Physics', avg: avgPhysics },
    { name: 'Chemistry', avg: avgChem },
    { name: 'Mathematics', avg: avgMath },
  ];
  const sortedByPerf = [...subjectAverages].sort((a, b) => b.avg - a.avg);
  const strongest = sortedByPerf[0];
  const weakest = sortedByPerf[sortedByPerf.length - 1];

  const suggestions: string[] = [];
  if (sorted.length > 0) {
    if (weakest && weakest.avg < maxPerSubject * 0.5) {
      suggestions.push(`Focus more on ${weakest.name} — your average is ${weakest.avg}/${Math.round(maxPerSubject)}.`);
    }
    if (strongest && strongest.avg >= maxPerSubject * 0.7) {
      suggestions.push(`${strongest.name} is your strongest subject. Maintain it with regular practice.`);
    }
    if (sorted.length >= 2) {
      const trend = sorted[sorted.length - 1].totalScore - sorted[sorted.length - 2].totalScore;
      if (trend > 0) {
        suggestions.push(`Your total score improved by ${trend} points since the last test. Keep it up!`);
      } else if (trend < 0) {
        suggestions.push(`Your total score dropped by ${Math.abs(trend)} points. Review your mistakes.`);
      }
    }
    suggestions.push('Take at least one mock test per week for consistent tracking.');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mock Test Analyzer</h1>
          <p className="text-sm text-slate-500">Enter your scores and track your performance.</p>
        </div>
      </div>

      {/* Input form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">Add New Mock Test</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Physics Score</label>
            <input
              type="number"
              value={physics}
              onChange={(e) => setPhysics(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chemistry Score</label>
            <input
              type="number"
              value={chemistry}
              onChange={(e) => setChemistry(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mathematics Score</label>
            <input
              type="number"
              value={math}
              onChange={(e) => setMath(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Total</label>
            <input
              type="number"
              value={maxTotal}
              onChange={(e) => setMaxTotal(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        <button
          onClick={handleSave}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
        >
          <Save className="w-4 h-4" />
          Save Test Result
        </button>
        {flaggedWeakCount > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm flex items-start gap-2">
            <Flag className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              {flaggedWeakCount} chapter{flaggedWeakCount > 1 ? 's' : ''} flagged as weak from this test.
              They will be prioritized in your next Study Plan.
            </span>
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No mock tests saved yet. Add your first test above.
        </div>
      ) : (
        <>
          {/* Performance summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-500">Strongest Subject</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{strongest?.name}</p>
              <p className="text-sm text-slate-500">Avg: {strongest?.avg}/{Math.round(maxPerSubject)}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-slate-500">Weakest Subject</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{weakest?.name}</p>
              <p className="text-sm text-slate-500">Avg: {weakest?.avg}/{Math.round(maxPerSubject)}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-slate-500">Latest Total</span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {latest?.totalScore}/{latest?.maxTotal}
              </p>
              <p className="text-sm text-slate-500">
                {latest ? new Date(latest.date).toLocaleDateString() : ''}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Subject-wise Performance (Latest)</h3>
              <BarChart
                data={[
                  { label: 'Physics', value: latest?.physicsScore ?? 0, color: 'bg-blue-500' },
                  { label: 'Chemistry', value: latest?.chemistryScore ?? 0, color: 'bg-emerald-500' },
                  { label: 'Mathematics', value: latest?.mathScore ?? 0, color: 'bg-purple-500' },
                ]}
                max={maxPerSubject}
              />
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Total Score Trend</h3>
              <LineChart
                data={sorted.map((t, i) => ({
                  label: `Test ${i + 1}`,
                  value: t.totalScore,
                }))}
                max={latest?.maxTotal ?? 300}
              />
            </div>
          </div>

          {/* Suggestions */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 mb-6">
            <h3 className="font-semibold text-slate-800 mb-3">Improvement Suggestions</h3>
            <ul className="space-y-2">
              {suggestions.map((s, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Test History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Physics</th>
                    <th className="pb-2 pr-4">Chemistry</th>
                    <th className="pb-2 pr-4">Math</th>
                    <th className="pb-2 pr-4">Total</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {[...sorted].reverse().map((t) => (
                    <tr key={t.id} className="border-b border-slate-50">
                      <td className="py-2.5 pr-4 text-slate-600">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 pr-4 text-slate-600">{t.physicsScore}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{t.chemistryScore}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{t.mathScore}</td>
                      <td className="py-2.5 pr-4 font-semibold text-slate-800">
                        {t.totalScore}/{t.maxTotal}
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
