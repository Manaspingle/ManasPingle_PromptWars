import { useState, useRef, useCallback } from 'react';
import { AnalysisResult, DecisionInput } from '../types/analysis';
import { analyzeDecision } from '../services/analysisApi';

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (input: DecisionInput) => {
    setStatus('loading');
    setError(null);
    setResult(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const data = await analyzeDecision(input, controller.signal);
      setResult(data);
      setStatus('success');
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    result,
    error,
    analyze,
    reset,
  };
}
