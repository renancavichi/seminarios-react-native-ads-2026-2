// HUD em React Native desenhado POR CIMA da Unity: avatar + nickname + pontos.
// Mostra na prática que as duas tecnologias estão na mesma tela.
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { FotoAvatar } from '@/components/menu/SeletorAvatar';
import { avatares } from '@/config/avatares';
import { cores, fontes } from '@/theme/tema';

type Props = { nickname: string; avatarId: string; pontos: number };

export default function HudJogador({ nickname, avatarId, pontos }: Props) {
  const avatar = avatares.find((a) => a.id === avatarId) ?? avatares[0];
  const pulo = useRef(new Animated.Value(1)).current;

  // o placar "pula" quando chega ponto novo da Unity
  useEffect(() => {
    if (pontos === 0) return;
    pulo.setValue(1.35);
    Animated.spring(pulo, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [pontos]);

  return (
    <View style={s.hud} pointerEvents="none">
      {avatar ? <FotoAvatar avatar={avatar} tamanho={40} /> : null}
      <View>
        <Text style={s.nome}>{nickname}</Text>
        <Text style={s.legenda}>React Native</Text>
      </View>
      <Animated.Text style={[s.pontos, { transform: [{ scale: pulo }] }]}>{pontos} pts</Animated.Text>
    </View>
  );
}

const s = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center', // centro do topo: o seu jogo usa os cantos (Pontos e Tempo)
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(14,18,32,0.75)',
    borderRadius: 30,
    paddingLeft: 6,
    paddingRight: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  nome: { fontFamily: fontes.forte, color: cores.texto, fontSize: 15 },
  legenda: { fontFamily: fontes.normal, color: cores.textoSuave, fontSize: 10 },
  pontos: { fontFamily: fontes.titulo, color: cores.sucesso, fontSize: 20, marginLeft: 6 },
});
