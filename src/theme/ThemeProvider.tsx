import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light';

interface ThemeModeContextValue {
  mode: 'light';
  toggleThemeMode: () => void;
  setThemeMode: (mode: 'light') => void;
  isDark: false;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'mylibrary-theme-mode';

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider locked strictly to light mode as requested by user.
 * Ensures dark class is always removed and light colorScheme is applied.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode] = useState<'light'>('light');

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
      localStorage.removeItem('theme_mode');
    } catch {
      // Ignore localStorage errors
    }
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }, []);

  const toggleThemeMode = () => {
    // Strictly light mode only
  };

  const setThemeMode = () => {
    // Strictly light mode only
  };

  const contextValue = useMemo<ThemeModeContextValue>(
    () => ({
      mode: 'light',
      toggleThemeMode,
      setThemeMode,
      isDark: false,
    }),
    [],
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export default ThemeProvider;
