import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export type ThemeMode = 'light' | 'dark';

/** Temas padrão MD3 do Paper, usados pelas molduras de celular da apresentação. */
export const lightTheme: MD3Theme = MD3LightTheme;
export const darkTheme: MD3Theme = MD3DarkTheme;

export const getTheme = (mode: ThemeMode): MD3Theme => (mode === 'dark' ? darkTheme : lightTheme);
