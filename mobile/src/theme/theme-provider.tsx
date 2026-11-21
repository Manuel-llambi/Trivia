import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import {
  border,
  darkColors,
  darkLips,
  darkShadows,
  fontFamily,
  lightColors,
  lightLips,
  lightShadows,
  LIP_OFFSET,
  radius,
  size,
  space,
  typography,
} from './tokens';

const buildTheme = (scheme: 'light' | 'dark') => ({
  scheme,
  colors: scheme === 'dark' ? darkColors : lightColors,
  lips: scheme === 'dark' ? darkLips : lightLips,
  shadows: scheme === 'dark' ? darkShadows : lightShadows,
  lipOffset: LIP_OFFSET,
  space,
  radius,
  border,
  size,
  fontFamily,
  typography,
});

export type Theme = ReturnType<typeof buildTheme>;

const themes = { light: buildTheme('light'), dark: buildTheme('dark') } as const;

const ThemeContext = createContext<Theme>(themes.light);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return <ThemeContext.Provider value={themes[scheme]}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
