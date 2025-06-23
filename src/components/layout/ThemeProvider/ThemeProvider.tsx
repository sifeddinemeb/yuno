import { useEffect, useCallback } from 'react';
import { useStore } from '../../../store/useStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { isDarkMode, toggleDarkMode } = useStore();

  const applyTheme = useCallback(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Update color-scheme meta tag
    let metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', isDarkMode ? 'dark' : 'light');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'color-scheme';
      meta.content = isDarkMode ? 'dark' : 'light';
      document.head.appendChild(meta);
    }
  }, [isDarkMode]);

  useEffect(() => {
    applyTheme();
  }, [isDarkMode, applyTheme]);

  return <>{children}</>;
};

export default ThemeProvider;