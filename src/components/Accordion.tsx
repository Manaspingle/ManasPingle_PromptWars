import { useState, useId, type ReactNode, type FC } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: FC<AccordionProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const regionId = useId();
  const buttonId = useId();

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-md">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={regionId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <span className="flex items-center gap-3">
          <span className="flex-shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true">
            {icon}
          </span>
          <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">{title}</span>
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-500 transition-transform motion-safe:duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          id={regionId}
          role="region"
          aria-labelledby={buttonId}
          className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-4"
        >
          {children}
        </div>
      )}
    </div>
  );
};
