import { Info, AlertTriangle, Lightbulb, BookOpen, Settings, Rocket } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Info className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">About This Project</h1>
          <p className="text-sm text-slate-500">Understanding JEE Smart Planner</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Problem */}
        <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-slate-900">Problem</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            JEE students often know what they need to study but struggle to decide what to
            prioritize. With dozens of chapters across three subjects and limited daily study time,
            building an effective plan is difficult without guidance.
          </p>
        </div>

        {/* Solution */}
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold text-slate-900">Solution</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            JEE Smart Planner uses student performance and self-assessment data to create a
            personalized study plan. By combining chapter weakness, mock-test scores, chapter
            importance, and available study time, it recommends what to study each day and explains
            why each topic was prioritized.
          </p>
        </div>

        {/* How the system works */}
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-slate-900">How the System Works</h2>
          </div>
          <div className="space-y-3 text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-700">1. Profile Setup:</strong> The student enters
              their name, target exam, daily study hours, and marks each chapter as weak, average,
              or strong.
            </p>
            <p>
              <strong className="text-slate-700">2. Priority Scoring:</strong> Each selected chapter
              receives a score from 0 to 100 based on four factors: weakness level (40 pts), recent
              mock-test performance (30 pts), chapter importance for JEE (20 pts), and available
              study time (10 pts). Scores of 60+ are HIGH priority, 35-59 are MEDIUM, and below 35
              are LOW.
            </p>
            <p>
              <strong className="text-slate-700">3. Plan Generation:</strong> Chapters are sorted by
              priority score and allocated time from the student's daily budget. Each chapter's
              time is split into 50% study, 30% practice, and 20% revision.
            </p>
            <p>
              <strong className="text-slate-700">4. Mock Test Tracking:</strong> Students log test
              scores. The app calculates subject averages, identifies strongest/weakest subjects,
              shows trends, and generates improvement suggestions.
            </p>
            <p>
              <strong className="text-slate-700">5. Revision Dashboard:</strong> Ranks
              completed chapters by revision priority using spaced-repetition scheduling, mock test
              performance, and chapter weightage data.
            </p>
          </div>
        </div>

        {/* Limitations */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-slate-900">Limitations</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            This is an educational prototype and its recommendations are not guaranteed to improve
            exam performance. The priority algorithm uses a simple transparent scoring system, not
            a scientifically validated model. All data is stored locally in the browser — clearing
            browser data will erase everything.
          </p>
        </div>

        {/* Future improvements */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-900">Future Improvements</h2>
          </div>
          <ul className="text-slate-600 leading-relaxed space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              Add cloud sync so students can access their plan across devices.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              Add chapter-level mock test analysis for finer weak-chapter detection.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              Add timed study sessions with a Pomodoro timer.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              Include chapter-wise question banks for in-app practice.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              Add streak tracking, badges, and weekly/monthly analytics.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              Export study plans as PDF for offline reference.
            </li>
          </ul>
        </div>

        {/* Technology */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <h2 className="font-semibold text-slate-900 mb-3">Technology</h2>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>React + TypeScript (UI framework)</li>
            <li>Vite (build tool)</li>
            <li>Tailwind CSS (styling)</li>
            <li>Lucide React (icons)</li>
            <li>Browser LocalStorage (data persistence)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
