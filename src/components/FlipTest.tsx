import { type FC } from 'react';
import { Shuffle } from 'lucide-react';

interface FlipTestProps {
  question: string;
}

export const FlipTest: FC<FlipTestProps> = ({ question }) => {
  return (
    <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700"
          aria-hidden="true"
        >
          <Shuffle className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold text-slate-800">Flip Test</h3>
      </div>
      <p className="text-base leading-relaxed text-slate-700">{question}</p>
      <p className="mt-3 text-sm font-medium text-slate-500">
        Why does your answer change, or not change?
      </p>
    </div>
  );
};
