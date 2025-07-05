import {useEffect, useState} from 'react';
import {MoonIcon, SunIcon} from '@heroicons/react/24/outline';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check for system preference
    if (typeof window !== 'undefined') {
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.theme = newTheme;
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-200 bg-white text-surface-800 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:hover:bg-surface-700"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">
        {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}

// Theme Context Provider
import {createContext, useContext, ReactNode} from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}: {children: ReactNode}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Initialize theme
    if (typeof window !== 'undefined') {
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const value = {
    theme,
    setTheme: (newTheme: 'light' | 'dark') => {
      setTheme(newTheme);
      localStorage.theme = newTheme;
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Dark Mode CSS Variables
export const darkModeStyles = `
  :root {
    color-scheme: light;
    --color-text-primary: #111827;
    --color-text-secondary: #4B5563;
    --color-background: #FFFFFF;
    --color-surface: #F9FAFB;
    --color-border: #E5E7EB;
    --color-shadow: rgba(0, 0, 0, 0.1);
  }

  .dark {
    color-scheme: dark;
    --color-text-primary: #F9FAFB;
    --color-text-secondary: #9CA3AF;
    --color-background: #111827;
    --color-surface: #1F2937;
    --color-border: #374151;
    --color-shadow: rgba(0, 0, 0, 0.3);
  }
`;

// Usage Example:
/*
import {ThemeProvider, ThemeSwitcher, useTheme} from '~/components/ui/ThemeSwitcher';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <ThemeSwitcher />
        <Content />
      </Layout>
    </ThemeProvider>
  );
}

function Content() {
  const {theme} = useTheme();
  
  return (
    <div className="bg-background text-text-primary">
      Current theme: {theme}
    </div>
  );
}
*/ 