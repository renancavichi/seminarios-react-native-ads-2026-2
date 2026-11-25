// ⚙️ INTEGRAÇÃO COM A UNITY. Normalmente você não precisa editar este arquivo.
// Ele encapsula o <UnityView> da biblioteca @azesmway/react-native-unity e a "ponte" de mensagens:
//   React Native -> Unity: postMessage('RNBridge', 'SetJogador', nome)   (RNBridge.cs no jogo)
//   Unity -> React Native: RNBridge.Enviar("{...}")  chega aqui em onUnityMessage
import UnityView from '@azesmway/react-native-unity';
import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { duracaoDaPartida } from '@/config/jogo';

export type MensagemDaUnity =
  | { tipo: 'pronto'; jogador: string }
  | { tipo: 'ponto'; pontos: number }
  | { tipo: 'fim'; pontos: number };

type Props = {
  nickname: string;
  avatarId: string;
  aoReceber: (msg: MensagemDaUnity) => void;
  pausado?: boolean; // true = congela o jogo (ex.: tela de fim de jogo por cima)
};

export default function JogoUnity({ nickname, avatarId, aoReceber, pausado = false }: Props) {
  const unityRef = useRef<UnityView>(null);

  // Pausa/retoma a Unity quando o React pede (pauseUnity é um método da biblioteca)
  useEffect(() => {
    unityRef.current?.pauseUnity(pausado);
  }, [pausado]);

  useEffect(() => {
    // Da 2ª vez em diante a Unity está pausada (não descarregada, ver patches/): retomamos.
    const retomar = setTimeout(() => {
      unityRef.current?.resumeUnity();
      unityRef.current?.windowFocusChanged(true);
    }, 600);
    // Envia nome e avatar algumas vezes: a Unity leva um instante para iniciar.
    const enviar = () => {
      unityRef.current?.postMessage('RNBridge', 'SetJogador', nickname);
      unityRef.current?.postMessage('RNBridge', 'SetAvatar', avatarId);
      unityRef.current?.postMessage('RNBridge', 'SetTempo', String(duracaoDaPartida));
    };
    const timers = [800, 2000, 4000].map((ms) => setTimeout(enviar, ms));
    return () => {
      clearTimeout(retomar);
      timers.forEach(clearTimeout);
    };
  }, [nickname, avatarId]);

  return (
    <UnityView
      ref={unityRef}
      style={StyleSheet.absoluteFill}
      fullScreen={false}
      onUnityMessage={(e: any) => {
        try {
          aoReceber(JSON.parse(e.nativeEvent.message));
        } catch {
          // mensagem que não é JSON: ignorada
        }
      }}
    />
  );
}
