import type { Page } from '@/types';
import { enterDemoMode } from '@/lib/storage';
import { getDemoProfile, getDemoMockTests } from '@/lib/demoData';
import { generatePlan } from '@/lib/priority';
import { BookOpen, ArrowRight, Play, Target, TrendingUp, Clock, RotateCcw, ClipboardCheck, BarChart3, CalendarDays } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: Page) => void;
  onDataChanged?: () => void;
}

export default function Landing({ onNavigate, onDataChanged }: LandingProps) {
  const handleViewDemo = () => {
    const demo = getDemoProfile();
    const demoTests = getDemoMockTests();
    const plan = generatePlan(demo, demoTests, []);
    enterDemoMode(demo, demoTests, plan);
    onDataChanged?.();
    onNavigate('dashboard');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-100 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              JEE Smart Planner
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
              Study smarter.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Focus on what matters most.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              JEE students often know what they need to study but struggle to decide what to
              prioritize. JEE Smart Planner uses your performance and self-assessment to build a
              personalized daily study plan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate('profile')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all"
              >
                Create My Study Plan
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleViewDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <Play className="w-5 h-5" />
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: ClipboardCheck,
                step: '1',
                title: 'Assess',
                desc: 'Enter your subjects, mark chapters as weak, average, or strong, and set your daily study time.',
                color: 'text-blue-600 bg-blue-50',
              },
              {
                icon: BarChart3,
                step: '2',
                title: 'Analyze',
                desc: 'Log your mock-test scores. The app identifies your strongest and weakest subjects and tracks trends.',
                color: 'text-emerald-600 bg-emerald-50',
              },
              {
                icon: CalendarDays,
                step: '3',
                title: 'Plan',
                desc: 'Get a personalized daily study plan with priorities, time splits, and clear explanations for each topic.',
                color: 'text-amber-600 bg-amber-50',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-slate-400 mb-1">STEP {item.step}</div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
              <h3 className="font-bold text-slate-900 text-lg mb-2">The Problem</h3>
              <p className="text-slate-600 leading-relaxed">
                JEE students often know what they need to study but struggle to decide what to
                prioritize. With limited time and many chapters, it is hard to build an effective
                daily plan.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <h3 className="font-bold text-slate-900 text-lg mb-2">The Solution</h3>
              <p className="text-slate-600 leading-relaxed">
                JEE Smart Planner uses student performance and self-assessment data to create a
                personalized study plan that focuses on the areas that need the most attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Everything you need to plan your JEE prep
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: 'Personalized Study Plan',
                desc: 'Get a daily plan based on your weak chapters, test scores, and available time.',
                color: 'text-blue-600 bg-blue-50',
              },
              {
                icon: TrendingUp,
                title: 'Mock Test Analyzer',
                desc: 'Enter your scores and see subject-wise performance, trends, and suggestions.',
                color: 'text-emerald-600 bg-emerald-50',
              },
              {
                icon: Clock,
                title: 'Progress Dashboard',
                desc: 'Track completed tasks, study time, and your overall progress at a glance.',
                color: 'text-amber-600 bg-amber-50',
              },
              {
                icon: RotateCcw,
                title: 'Revision Dashboard',
                desc: 'See which completed chapters need revision most, ranked by priority.',
                color: 'text-cyan-600 bg-cyan-50',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to start your smart prep?
          </h2>
          <p className="text-slate-600 mb-8">
            It takes less than 2 minutes to set up your profile and generate your first plan.
          </p>
          <button
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            Create My Study Plan
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
