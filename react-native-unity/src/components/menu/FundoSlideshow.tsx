// Fundo animado: as imagens trocam com "fade" e um zoom lento (efeito Ken Burns).
// As imagens e o tempo de cada uma ficam em src/config/midia.ts
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { fundosDoMenu, tempoPorFundo } from '@/config/midia';

export default function FundoSlideshow() {
  const [atual, setAtual] = useState(0);
  // um valor de opacidade e um de zoom para cada imagem
  const opacidades = useRef(fundosDoMenu.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  const zooms = useRef(fundosDoMenu.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    // zoom lento na imagem que está aparecendo
    zooms[atual].setValue(1);
    Animated.timing(zooms[atual], {
      toValue: 1.12,
      duration: tempoPorFundo + 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (fundosDoMenu.length < 2) return;
    const t = setTimeout(() => {
      const proxima = (atual + 1) % fundosDoMenu.length;
      Animated.parallel([
        Animated.timing(opacidades[atual], { toValue: 0, duration: 1200, useNativeDriver: true }),
        Animated.timing(opacidades[proxima], { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]).start();
      setAtual(proxima);
    }, tempoPorFundo);
    return () => clearTimeout(t);
  }, [atual]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {fundosDoMenu.map((img, i) => (
        <Animated.Image
          key={i}
          source={img}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { opacity: opacidades[i], transform: [{ scale: zooms[i] }] }]}
        />
      ))}
      {/* véu escuro para o texto ficar legível por cima das imagens */}
      <View style={[StyleSheet.absoluteFill, s.veu]} />
    </View>
  );
}

const s = StyleSheet.create({
  // escureça (0.6) ou clareie (0.2) o fundo mudando o último número
  veu: { backgroundColor: 'rgba(8, 10, 20, 0.45)' },
});
