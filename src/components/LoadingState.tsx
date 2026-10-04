import { type FC } from 'react';
import { Lightbulb } from 'lucide-react';

export const LoadingState: FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-slate-600 motion-safe:animate-spin"
          aria-hidden="true"
        />
        <Lightbulb className="h-6 w-6 text-slate-600" aria-hidden="true" />
      </div>
      <p className="text-base font-medium text-slate-700">Analyzing your reasoning…</p>
      <p className="text-sm text-slate-400">
        Examining what you know, what you assume, and what you might be missing.
      </p>
    </div>
  );
};
