import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkThmee, lightTheme } from '../theme';

export type OneOfThemeType = keyof typeof THEME_ENTRIES;
type ThemeSetter = (next: OneOfThemeType) => void;

const THEME_ENTRIES = { dark: darkThmee, light: lightTheme } as const;

export const useThemeSetter = () => useContext(useThemeSetter.context);
useThemeSetter.context = createContext<ThemeSetter>(null as any);

interface CustomThemeProviderProps {
  defaultTheme: OneOfThemeType;
  children: React.ReactChild;
}

export const CustomThemeProvider = ({ defaultTheme, children }: CustomThemeProviderProps) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <useThemeSetter.context.Provider value={setTheme}>
      <ThemeProvider theme={{ color: THEME_ENTRIES[theme] }} children={children} />
    </useThemeSetter.context.Provider>
  );
};
