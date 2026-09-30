import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { NativeModules, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

// os jogos que usam sacudida acionam junto o gesto nativo que abre o menu de
// desenvolvedor do Expo — desativa em todo o app; ainda dá pra abrir pela engrenagem
if (__DEV__) {
  NativeModules.DevSettings?.setIsShakeToShowDevMenuEnabled?.(false);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
