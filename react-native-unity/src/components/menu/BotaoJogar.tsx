// Botão grande "JOGAR" que pulsa, e encolhe um pouco ao ser tocado.
// Texto em src/config/textos.ts · cor em src/theme/tema.ts (cores.destaque)
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';

import { textos } from '@/config/textos';
import { cores, fontes } from '@/theme/tema';

export default function BotaoJogar({ onPress }: { onPress: () => void }) {
  const pulso = useRef(new Animated.Value(0)).current;
  const toque = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const escala = Animated.multiply(pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }), toque);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(toque, { toValue: 0.92, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(toque, { toValue: 1, friction: 3, useNativeDriver: true }).start()}>
      <Animated.View style={[s.botao, { transform: [{ scale: escala }] }]}>
        <Text style={s.texto}>▶  {textos.botaoJogar}</Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  botao: {
    backgroundColor: cores.destaque,
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.35)', // "degrau" de botão de jogo
  },
  texto: { fontFamily: fontes.titulo, color: '#fff', fontSize: 20, letterSpacing: 3 },
});
