/**
 * Slides da apresentação, dentro do próprio app.
 *
 * Navegação:
 *  - Botões embaixo, ou deslizar para os lados no celular
 *  - No navegador: setas, espaço, PageUp/PageDown; Esc sai
 *  - /slides?n=8 abre direto no slide 8
 */
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SlideView } from '@/components/SlideView';
import { SLIDES } from '@/slides/content';
import { colors } from '@/theme/colors';

type KeyTarget = {
  addEventListener: (type: 'keydown', fn: (e: { key: string }) => void) => void;
  removeEventListener: (type: 'keydown', fn: (e: { key: string }) => void) => void;
};

const clamp = (i: number) => Math.max(0, Math.min(SLIDES.length - 1, i));

export default function SlidesScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const scale = width >= 1400 ? 1.3 : wide ? 1.12 : 1;

  const { n } = useLocalSearchParams<{ n?: string }>();
  const [index, setIndex] = useState(() => clamp(Number(n) - 1 || 0));
  const go = useCallback((delta: number) => setIndex((i) => clamp(i + delta)), []);
  const slide = SLIDES[index];

  // Atalhos de teclado (web).
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const target = globalThis as unknown as KeyTarget;
    const onKey = (e: { key: string }) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) go(1);
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) go(-1);
      else if (e.key === 'Escape') closeSlides();
    };
    target.addEventListener('keydown', onKey);
    return () => target.removeEventListener('keydown', onKey);
  }, [go]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
        onPanResponderRelease: (_, g) => {
          if (g.dx < -60) go(1);
          else if (g.dx > 60) go(-1);
        },
      }),
    [go],
  );

  return (
    <SafeAreaView style={styles.screen} {...pan.panHandlers}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((index + 1) / SLIDES.length) * 100}%` }]} />
      </View>

      <View style={styles.topBar}>
        <Pressable onPress={closeSlides} hitSlop={10}>
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </Pressable>
        <Text style={styles.brand}>Sonora · expo-audio</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, slide.cover && styles.coverContent]} key={index}>
        <SlideView slide={slide} scale={scale} wide={wide} />
      </ScrollView>

      <View style={styles.nav}>
        <Text style={styles.counter}>
          {index + 1} / {SLIDES.length}
        </Text>
        <View style={styles.navButtons}>
          <Pressable onPress={() => go(-1)} disabled={index === 0} style={[styles.navBtn, index === 0 && styles.disabled]}>
            <Ionicons name="arrow-back" size={18} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => go(1)}
            disabled={index === SLIDES.length - 1}
            style={[styles.navBtn, index === SLIDES.length - 1 && styles.disabled]}
          >
            <Ionicons name="arrow-forward" size={18} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function closeSlides() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  progressTrack: { height: 2, backgroundColor: colors.surfaceAlt },
  progressFill: { height: 2, backgroundColor: colors.accent },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 12 },
  brand: { color: colors.textMuted, fontSize: 13 },
  content: {
    paddingHorizontal: Platform.OS === 'web' ? 64 : 24,
    paddingVertical: 32,
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  coverContent: { flexGrow: 1, justifyContent: 'center' },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  counter: { color: colors.textMuted, fontSize: 13, fontVariant: ['tabular-nums'] },
  navButtons: { flexDirection: 'row', gap: 8 },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.25 },
});
