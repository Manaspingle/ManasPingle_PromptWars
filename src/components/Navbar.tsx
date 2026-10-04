import React from 'react';
import { Moon, Sun, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { ThinkLensLogo } from './ThinkLensLogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView?: 'landing' | 'engine';
  onNavigate: (view: 'landing' | 'engine') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const { user, userName, isGuest, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogoClick = () => {
    if (!user) {
      onNavigate('landing');
    } else {
      onNavigate('engine');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          aria-label="ThinkLens Home"
        >
          <ThinkLensLogo size="md" />
        </button>

        {/* Center Nav Status */}
        <nav className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
          {!user ? (
            <span className="px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm">
              Overview
            </span>
          ) : (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Reasoning Workspace</span>
            </div>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2">
          {/* Light/Dark Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Auth Info / Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200">
                <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                <span className="max-w-[140px] truncate font-medium">
                  {userName}
                </span>
                {isGuest && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                    Guest
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title="Log out and return to overview"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
