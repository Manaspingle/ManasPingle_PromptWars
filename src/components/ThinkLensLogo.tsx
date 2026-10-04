import { type FC } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const ThinkLensLogo: FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Lens Prism Icon */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 shadow-md ring-1 ring-white/10 dark:ring-white/20 overflow-hidden`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Dual Prism Beams */}
          <path
            d="M6 14L20 20L34 14"
            stroke="url(#beam1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <path
            d="M6 26L20 20L34 26"
            stroke="url(#beam2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          {/* Focal Reasoning Ring */}
          <circle
            cx="20"
            cy="20"
            r="6.5"
            stroke="url(#lensGradient)"
            strokeWidth="2.5"
          />
          {/* Center Synaptic Node */}
          <circle cx="20" cy="20" r="2.5" fill="#38BDF8" />
          <defs>
            <linearGradient id="beam1" x1="6" y1="14" x2="34" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="beam2" x1="6" y1="26" x2="34" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C084FC" />
              <stop offset="1" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="lensGradient" x1="14" y1="14" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="0.5" stopColor="#A855F7" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight ${textSizes[size]} bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent`}
          >
            Think<span className="text-blue-600 dark:text-blue-400 font-extrabold">Lens</span>
          </span>
        </div>
      )}
    </div>
  );
};
