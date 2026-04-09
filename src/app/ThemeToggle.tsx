'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 shadow-sm'} ${className ?? ''}`}
      aria-label={isDark ? 'Açık moda geç' : 'Koyu moda geç'}
    >
      {isDark ? (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
        </svg>
      )}
    </button>
  );
}
