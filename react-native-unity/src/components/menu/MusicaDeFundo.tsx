// Toca a música do menu em loop enquanto este componente estiver na tela.
// O arquivo de música é definido em src/config/midia.ts (musicaDoMenu).
import { useAudioPlayer } from 'expo-audio';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { musicaDoMenu, volumeDaMusica } from '@/config/midia';

function Tocador({ fonte }: { fonte: number }) {
  const player = useAudioPlayer(fonte);
  // toca quando a tela do menu aparece e pausa quando vai para o jogo
  useFocusEffect(
    useCallback(() => {
      player.loop = true;
      player.volume = volumeDaMusica;
      player.play();
      return () => player.pause();
    }, [player])
  );
  return null;
}

export default function MusicaDeFundo() {
  if (musicaDoMenu == null) return null; // sem música configurada
  return <Tocador fonte={musicaDoMenu} />;
}
