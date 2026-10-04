import { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisResults } from './components/AnalysisResults';
import { LoadingState } from './components/LoadingState';
import { ErrorMessage } from './components/ErrorMessage';
import { useAnalysis } from './hooks/useAnalysis';
import { useAuth } from './context/AuthContext';
import { DecisionInput } from './types/analysis';
import { Sparkles, Shield } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'engine'>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, userName } = useAuth();

  const { status, result, error, analyze, reset } = useAnalysis();
  const lastInputRef = useRef<DecisionInput | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (data: DecisionInput) => {
    lastInputRef.current = data;
    analyze(data);
  };

  const handleRetry = () => {
    if (lastInputRef.current) {
      analyze(lastInputRef.current);
    }
  };

  const handleReset = () => {
    lastInputRef.current = null;
    reset();
  };

  // Enforce: After login/signup, the user sees engine; overview page is only accessible after logging out
  useEffect(() => {
    if (user && currentView !== 'engine') {
      setCurrentView('engine');
    } else if (!user && currentView !== 'landing') {
      setCurrentView('landing');
    }
  }, [user]);

  const handleNavigate = (view: 'landing' | 'engine') => {
    if (view === 'engine' && !user) {
      setIsAuthModalOpen(true);
      return;
    }
    // If logged in, the user stays in engine; to see overview, they must log out
    if (view === 'landing' && user) {
      return;
    }
    setCurrentView(view);
  };

  useEffect(() => {
    if (status === 'success' && resultsContainerRef.current) {
      const heading = resultsContainerRef.current.querySelector<HTMLElement>('h2');
      heading?.focus();
    }
  }, [status]);

  const showForm = status === 'idle' || status === 'error';
  const showResults = status === 'success' && result !== null;
  const isLoading = status === 'loading';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full">
        {currentView === 'landing' ? (
          <LandingPage
            onStartEngine={() => {
              if (!user) {
                setIsAuthModalOpen(true);
              } else {
                setCurrentView('engine');
              }
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        ) : (
          <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
            {/* Top Welcome Banner with Name entered at registration */}
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-blue-200/80 dark:border-blue-900/60 p-4 sm:p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-blue-500/20">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent font-extrabold">{userName}</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your objective reasoning audit workspace is active. Input your decision dilemma below.
                  </p>
                </div>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Gemini 3.8 Flash</span>
              </div>
            </div>

            {/* Introduction Card */}
            <div className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Audit Your Reasoning
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                ThinkLens decomposes your logic without bias. Share what you are weighing and why — our engine separates stated facts from unstated assumptions, flags blind spots, and generates the counterfactual Flip Test. It will never tell you what to choose.
              </p>
            </div>

            {/* Decision Input Form */}
            {showForm && (
              <section aria-labelledby="form-heading" className="mb-8">
                <h3
                  id="form-heading"
                  className="mb-4 text-base font-bold text-slate-800 dark:text-slate-200"
                >
                  Describe Your Decision Dilemma
                </h3>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-sm">
                  <DecisionForm
                    onSubmit={handleSubmit}
                    isLoading={false}
                    preservedValues={lastInputRef.current}
                  />
                </div>
              </section>
            )}

            {/* Error Display */}
            {status === 'error' && error && (
              <div className="mb-8">
                <ErrorMessage message={error} onRetry={handleRetry} />
              </div>
            )}

            {/* Active Loading State */}
            {isLoading && <LoadingState />}

            {/* Results Display */}
            {showResults && (
              <div ref={resultsContainerRef} className="space-y-6">
                <AnalysisResults
                  result={result}
                  decisionInput={lastInputRef.current}
                />
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Audit Another Decision
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 transition-colors">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>ThinkLens does not recommend decisions. It helps you examine your reasoning.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Google Cloud Run</span>
            <span>•</span>
            <span>Firebase Auth</span>
            <span>•</span>
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setCurrentView('engine');
        }}
      />
    </div>
  );
}

export default App;
