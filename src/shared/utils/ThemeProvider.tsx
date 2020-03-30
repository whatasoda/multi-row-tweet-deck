import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkThmee, lightTheme } from '../theme';
import { EXTENSION_ID } from '../constants';
import { Icon } from '../components/Icon';

export type OneOfThemeType = keyof typeof THEME_ENTRIES;
type ToggleTheme = () => void;

const THEME_ENTRIES = { dark: darkThmee, light: lightTheme } as const;
const key = `${EXTENSION_ID}:theme`;

export const useToggleTheme = () => useContext(useToggleTheme.context);
useToggleTheme.context = createContext<ToggleTheme>(null as any);

interface CustomThemeProviderProps {
  defaultTheme: OneOfThemeType;
  children: React.ReactChild;
}

export const CustomThemeProvider = ({ defaultTheme, children }: CustomThemeProviderProps) => {
  const [theme, setTheme] = useState<OneOfThemeType>(() => {
    return (localStorage.getItem(key) as OneOfThemeType | null) || defaultTheme;
  });
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    localStorage.setItem(key, theme);
  }, [theme]);

  const themeToggler = useCallback(() => setTheme(themeRef.current === 'dark' ? 'light' : 'dark'), []);

  return (
    <useToggleTheme.context.Provider value={themeToggler}>
      <ThemeProvider theme={{ color: THEME_ENTRIES[theme] }} children={children} />
    </useToggleTheme.context.Provider>
  );
};

interface ThemeTogglerProps {
  className?: string;
}
export const ThemeToggler = ({ className }: ThemeTogglerProps) => {
  const toggle = useToggleTheme();

  return <Icon.Button icon="brightness" onClick={toggle} className={className} />;
};
