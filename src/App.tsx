import { useRef, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisResults } from './components/AnalysisResults';
import { LoadingState } from './components/LoadingState';
import { ErrorMessage } from './components/ErrorMessage';
import { useAnalysis } from './hooks/useAnalysis';
import { DecisionInput } from './types/analysis';

export function App() {
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-800 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white"
            aria-hidden="true"
          >
            <Brain className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">ThinkLens</h1>
            <p className="text-sm text-slate-500">
              Audit your reasoning before you decide
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10"
      >
        <section aria-label="Introduction" className="mb-8">
          <p className="text-base leading-relaxed text-slate-600">
            ThinkLens helps you find blind spots in how you think about a decision. Share
            what you're weighing and why — it will separate what you know from what you
            assume, and surface what you might be overlooking. It will never tell you what
            to choose.
          </p>
        </section>

        {showForm && (
          <section aria-labelledby="form-heading" className="mb-8">
            <h2
              id="form-heading"
              className="mb-4 text-lg font-semibold text-slate-800"
            >
              Tell us about your decision
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <DecisionForm
                onSubmit={handleSubmit}
                isLoading={false}
                preservedValues={lastInputRef.current}
              />
            </div>
          </section>
        )}

        {status === 'error' && error && (
          <div className="mb-8">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        {isLoading && <LoadingState />}

        {showResults && (
          <div ref={resultsContainerRef} className="space-y-6">
            <AnalysisResults result={result} />
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Analyze another decision
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center sm:px-6">
          <p className="text-sm text-slate-500">
            ThinkLens does not recommend decisions. It helps you examine your reasoning.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
