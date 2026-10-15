import { useState, useEffect, useCallback } from 'react';
import type { Page } from '@/types';
import Navbar from '@/components/Navbar';
import Landing from '@/pages/Landing';
import Profile from '@/pages/Profile';
import Planner from '@/pages/Planner';
import MockTest from '@/pages/MockTest';
import Dashboard from '@/pages/Dashboard';
import RevisionCenter from '@/pages/RevisionCenter';
import About from '@/pages/About';
import Weightage from '@/pages/Weightage';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [dataVersion, setDataVersion] = useState(0);

  const bumpDataVersion = useCallback(() => setDataVersion((v) => v + 1), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const navigate = (p: Page) => setPage(p);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar current={page} onNavigate={navigate} onDataChanged={bumpDataVersion} />
      <main>
        {page === 'home' && <Landing onNavigate={navigate} onDataChanged={bumpDataVersion} />}
        {page === 'profile' && (
          <Profile onSaved={() => navigate('planner')} onDataChanged={bumpDataVersion} />
        )}
        {page === 'planner' && <Planner key={dataVersion} onNavigate={navigate} />}
        {page === 'mocktest' && <MockTest key={dataVersion} />}
        {page === 'dashboard' && <Dashboard key={dataVersion} onNavigate={navigate} />}
        {page === 'revision' && <RevisionCenter key={dataVersion} />}
        {page === 'weightage' && <Weightage />}
        {page === 'about' && <About />}
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          JEE Smart Planner — Educational prototype. Recommendations are not guaranteed to improve exam performance.
        </div>
      </footer>
    </div>
  );
}

export default App;
