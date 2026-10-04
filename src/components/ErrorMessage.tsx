import { type FC } from 'react';
import { TriangleAlert, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 p-6 text-center"
    >
      <TriangleAlert className="h-8 w-8 text-amber-600" aria-hidden="true" />
      <div>
        <p className="text-base font-semibold text-amber-900">
          We couldn't complete the analysis
        </p>
        <p className="mt-1 text-sm text-amber-800">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </button>
    </div>
  );
};
