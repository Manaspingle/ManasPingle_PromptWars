import { type FC } from 'react';
import { Shuffle } from 'lucide-react';

interface FlipTestProps {
  question: string;
}

export const FlipTest: FC<FlipTestProps> = ({ question }) => {
  return (
    <div className="rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/70 bg-indigo-50/40 dark:bg-indigo-950/20 p-6">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shadow-sm"
          aria-hidden="true"
        >
          <Shuffle className="h-4 w-4" />
        </span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">The Flip Test (Counterfactual)</h3>
      </div>
      <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
        {question}
      </p>
      <p className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
        Why does your answer change, or not change?
      </p>
    </div>
  );
};
