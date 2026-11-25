// Moldura de todas as telas: carrega as fontes, esconde a barra de status
// e define a transição entre telas (animation).
import {
  Fredoka_400Regular,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  useFonts,
} from '@expo-google-fonts/fredoka';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { SessaoProvider } from '@/sessao';
import { cores } from '@/theme/tema';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontesProntas] = useFonts({ Fredoka_400Regular, Fredoka_600SemiBold, Fredoka_700Bold });

  useEffect(() => {
    if (fontesProntas) SplashScreen.hideAsync();
  }, [fontesProntas]);

  if (!fontesProntas) return null;

  return (
    <SessaoProvider>
      {/* jogo de verdade: tela cheia, sem barra de status */}
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
          animation: 'fade', // transição entre menu e jogo: 'fade' | 'slide_from_right' | 'none'
        }}
      />
    </SessaoProvider>
  );
}
