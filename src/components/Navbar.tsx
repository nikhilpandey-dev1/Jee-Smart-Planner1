import type { Page } from '@/types';
import { BookOpen, Menu, X, Eye, LogOut } from 'lucide-react';
import { useState } from 'react';
import { isDemoMode, exitDemoMode } from '@/lib/storage';

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'Profile' },
  { id: 'planner', label: 'Study Plan' },
  { id: 'mocktest', label: 'Mock Tests' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'revision', label: 'Revision Dashboard' },
  { id: 'weightage', label: 'High Weightage' },
  { id: 'about', label: 'About' },
];

interface NavbarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  onDataChanged?: () => void;
}

export default function Navbar({ current, onNavigate, onDataChanged }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const demo = isDemoMode();

  const go = (page: Page) => {
    onNavigate(page);
    setOpen(false);
  };

  const handleExitDemo = () => {
    exitDemoMode();
    onDataChanged?.();
    go('home');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              JEE Smart Planner
            </span>
            {demo && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">
                <Eye className="w-3 h-3" />
                Demo
              </span>
            )}
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  current === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {demo && (
              <button
                onClick={handleExitDemo}
                className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Exit Demo
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  current === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {demo && (
              <button
                onClick={handleExitDemo}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200"
              >
                <span className="inline-flex items-center gap-1.5">
                  <LogOut className="w-4 h-4" />
                  Exit Demo
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
