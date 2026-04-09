'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ isDark: true, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ft-theme');
    if (saved === 'light') setIsDark(false);
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('ft-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
