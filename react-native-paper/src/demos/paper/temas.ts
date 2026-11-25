import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

// Paletas de marca (tons gerados a partir de uma cor-semente,
// no padrão do Material Theme Builder). Só sobrescrevemos o que muda.
type Tokens = Partial<MD3Theme['colors']>;

export const paletas: Record<string, { nome: string; claro: Tokens; escuro: Tokens }> = {
  roxo: { nome: 'Roxo (padrão)', claro: {}, escuro: {} },
  azul: {
    nome: 'Azul',
    claro: { primary: '#0061A4', onPrimary: '#FFFFFF', primaryContainer: '#D1E4FF', onPrimaryContainer: '#001D36', secondaryContainer: '#D7E3F7', onSecondaryContainer: '#101C2B' },
    escuro: { primary: '#9ECAFF', onPrimary: '#003258', primaryContainer: '#00497D', onPrimaryContainer: '#D1E4FF', secondaryContainer: '#3B4858', onSecondaryContainer: '#D7E3F7' },
  },
  verde: {
    nome: 'Verde',
    claro: { primary: '#006E1C', onPrimary: '#FFFFFF', primaryContainer: '#94F990', onPrimaryContainer: '#002204', secondaryContainer: '#D5E8CF', onSecondaryContainer: '#101F10' },
    escuro: { primary: '#78DC77', onPrimary: '#00390A', primaryContainer: '#005313', onPrimaryContainer: '#94F990', secondaryContainer: '#3A4B39', onSecondaryContainer: '#D5E8CF' },
  },
  laranja: {
    nome: 'Laranja',
    claro: { primary: '#8B5000', onPrimary: '#FFFFFF', primaryContainer: '#FFDCBE', onPrimaryContainer: '#2C1600', secondaryContainer: '#F2DFD1', onSecondaryContainer: '#251A11' },
    escuro: { primary: '#FFB870', onPrimary: '#4A2800', primaryContainer: '#693C00', onPrimaryContainer: '#FFDCBE', secondaryContainer: '#52443A', onSecondaryContainer: '#F2DFD1' },
  },
};

export function criarTema(paleta: string, escuro: boolean, roundness = 4): MD3Theme {
  const base = escuro ? MD3DarkTheme : MD3LightTheme;
  const p = paletas[paleta] ?? paletas.roxo;
  return {
    ...base,
    roundness,
    colors: { ...base.colors, ...(escuro ? p.escuro : p.claro) },
  };
}
