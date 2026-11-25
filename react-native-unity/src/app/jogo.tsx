// TELA DO JOGO: a Unity ocupa a tela toda e o React Native desenha o HUD por cima.
// - integração Unity: src/unity/JogoUnity.tsx
// - HUD (avatar, nome, pontos): src/components/jogo/HudJogador.tsx
// - tela de fim de jogo: src/components/jogo/FimDeJogo.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';

import FimDeJogo from '@/components/jogo/FimDeJogo';
import HudJogador from '@/components/jogo/HudJogador';
import { useSessao } from '@/sessao';
import JogoUnity, { type MensagemDaUnity } from '@/unity/JogoUnity';

export default function Jogo() {
  const { nickname, avatarId, registrarPartida, recorde } = useSessao();
  const [pontos, setPontos] = useState(0);
  // quando não é null, a partida acabou: mostra a tela de fim e pausa a Unity
  const [resultado, setResultado] = useState<number | null>(null);

  // botão/gesto "voltar" do Android volta para o menu
  useEffect(() => {
    const voltar = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    return () => voltar.remove();
  }, []);

  const aoReceber = (msg: MensagemDaUnity) => {
    if (msg.tipo === 'ponto') setPontos(msg.pontos);
    if (msg.tipo === 'fim') {
      registrarPartida(msg.pontos);
      setResultado(msg.pontos);
      setPontos(0);
    }
  };

  return (
    <View style={s.tela}>
      <JogoUnity
        nickname={nickname}
        avatarId={avatarId}
        aoReceber={aoReceber}
        pausado={resultado !== null}
      />

      <HudJogador nickname={nickname} avatarId={avatarId} pontos={pontos} />

      <Pressable style={s.sair} onPress={() => router.back()} hitSlop={8}>
        <Text style={s.sairTexto}>✕</Text>
      </Pressable>

      {resultado !== null ? (
        <FimDeJogo
          nickname={nickname}
          avatarId={avatarId}
          pontos={resultado}
          recorde={recorde}
          aoJogarDeNovo={() => setResultado(null)}
          aoVoltarAoMenu={() => router.back()}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#000' },
  sair: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sairTexto: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
