// TELA DE FIM DE JOGO (React Native por cima da Unity, que fica pausada atrás).
// Textos em src/config/textos.ts · cores/fontes em src/theme/tema.ts
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FotoAvatar } from '@/components/menu/SeletorAvatar';
import { avatares } from '@/config/avatares';
import { textos } from '@/config/textos';
import { cores, fontes } from '@/theme/tema';

type Props = {
  nickname: string;
  avatarId: string;
  pontos: number;
  recorde: number;
  aoJogarDeNovo: () => void;
  aoVoltarAoMenu: () => void;
};

export default function FimDeJogo({ nickname, avatarId, pontos, recorde, aoJogarDeNovo, aoVoltarAoMenu }: Props) {
  const avatar = avatares.find((a) => a.id === avatarId) ?? avatares[0];
  const fundo = useRef(new Animated.Value(0)).current;
  const cartao = useRef(new Animated.Value(0)).current;
  const novoRecorde = pontos > 0 && pontos >= recorde;

  useEffect(() => {
    Animated.timing(fundo, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    Animated.spring(cartao, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, []);

  const escala = cartao.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, s.fundo, { opacity: fundo }]}>
      <Animated.View style={[s.cartao, { opacity: cartao, transform: [{ scale: escala }] }]}>
        <Text style={s.titulo}>{textos.fimTitulo}</Text>

        <View style={s.jogador}>
          {avatar ? <FotoAvatar avatar={avatar} tamanho={44} /> : null}
          <Text style={s.nome}>{nickname}</Text>
        </View>

        <Text style={s.pontos}>{pontos}</Text>
        <Text style={s.legenda}>
          {novoRecorde ? textos.fimNovoRecorde : `${textos.recorde}: ${recorde}`}
        </Text>

        <View style={s.botoes}>
          <Pressable style={[s.botao, s.botaoSecundario]} onPress={aoVoltarAoMenu}>
            <Text style={s.textoBotao}>{textos.fimMenu}</Text>
          </Pressable>
          <Pressable style={[s.botao, s.botaoPrincipal]} onPress={aoJogarDeNovo}>
            <Text style={s.textoBotao}>{textos.fimJogarDeNovo}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  fundo: { backgroundColor: 'rgba(5, 7, 15, 0.7)', alignItems: 'center', justifyContent: 'center' },
  cartao: {
    width: 380,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: cores.painel,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: { fontFamily: fontes.titulo, fontSize: 30, color: cores.texto, letterSpacing: 2 },
  jogador: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  nome: { fontFamily: fontes.forte, fontSize: 18, color: cores.texto },
  pontos: { fontFamily: fontes.titulo, fontSize: 56, color: cores.sucesso, lineHeight: 64, marginTop: 4 },
  legenda: { fontFamily: fontes.forte, fontSize: 14, color: cores.textoSuave },
  botoes: { flexDirection: 'row', gap: 12, marginTop: 16, alignSelf: 'stretch' },
  botao: { flex: 1, borderRadius: 14, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.35)' },
  botaoPrincipal: { backgroundColor: cores.destaque },
  botaoSecundario: { backgroundColor: 'rgba(255,255,255,0.12)' },
  textoBotao: { fontFamily: fontes.titulo, fontSize: 16, color: '#fff', letterSpacing: 1 },
});
