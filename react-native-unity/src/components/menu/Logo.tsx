// Nome do jogo com uma animação de "flutuar".
// Texto em src/config/textos.ts · cores/fontes em src/theme/tema.ts
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';

import { textos } from '@/config/textos';
import { cores, fontes, tamanhos } from '@/theme/tema';

export default function Logo() {
  const flutuar = useRef(new Animated.Value(0)).current;
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // entrada: cresce de 0.8 até 1 com "mola"
    Animated.spring(entrada, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    // sobe e desce para sempre
    Animated.loop(
      Animated.sequence([
        Animated.timing(flutuar, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(flutuar, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = flutuar.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const scale = entrada.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });

  return (
    <Animated.View style={{ opacity: entrada, transform: [{ translateY }, { scale }] }}>
      <Text style={s.logo}>{textos.nomeDoJogo}</Text>
      <Text style={s.slogan}>{textos.slogan}</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  logo: {
    fontFamily: fontes.titulo,
    fontSize: tamanhos.logo,
    color: cores.texto,
    letterSpacing: 2,
    textShadowColor: cores.destaque,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0,
  },
  slogan: {
    fontFamily: fontes.normal,
    fontSize: tamanhos.texto,
    color: cores.textoSuave,
    marginTop: 4,
  },
});
