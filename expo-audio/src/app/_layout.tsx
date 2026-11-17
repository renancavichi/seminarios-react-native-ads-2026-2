import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PlayerProvider } from '@/audio/PlayerContext';
import { colors } from '@/theme/colors';

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, primary: colors.accent },
};

/**
 * Layout raiz. O <PlayerProvider> fica AQUI, acima de toda a navegação,
 * para que o player de áudio sobreviva às trocas de tela.  [Slide 9]
 */
export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <PlayerProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="player" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="slides" options={{ animation: 'fade' }} />
        </Stack>
      </PlayerProvider>
    </ThemeProvider>
  );
}
