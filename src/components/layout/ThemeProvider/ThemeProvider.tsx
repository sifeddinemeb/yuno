import { useEffect, useCallback, useState } from 'react';
import { useStore } from '../../../store/useStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { isDarkMode, toggleDarkMode } = useStore();
  const [isThemeReady, setIsThemeReady] = useState(false);

  const applyTheme = useCallback(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Update color-scheme meta tag for browser UI elements
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', isDarkMode ? 'dark' : 'light');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'color-scheme';
      meta.content = isDarkMode ? 'dark' : 'light';
      document.head.appendChild(meta);
    }

    // Add theme-color meta for mobile browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#121212' : '#fafafa');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = isDarkMode ? '#121212' : '#fafafa';
      document.head.appendChild(meta);
    }
    
    setIsThemeReady(true);
  }, [isDarkMode]);

  // Apply theme on initial render and when theme changes
  useEffect(() => {
    // Give a very small delay to ensure DOM is fully loaded
    const timeoutId = setTimeout(() => applyTheme(), 0);
    return () => clearTimeout(timeoutId);
  }, [isDarkMode, applyTheme]);

  // The provider doesn't add a DOM element, improving rendering performance
  return <>{children}</>;
};

export default ThemeProvider;