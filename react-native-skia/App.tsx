import React, { useState, useEffect, useMemo, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Canvas, Group } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gyroscope } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

import { SLIDES } from './src/constants/theme';
import { CosmicBackground } from './src/components/CosmicBackground';
import { ShockwaveSystem } from './src/components/ShockwaveSystem';
import { SkiaToggle } from './src/components/SkiaToggle';
import { SkiaCardBackdrop } from './src/components/SkiaCardBackdrop';
import { TicketCardUI } from './src/components/TicketCardUI';

// Os 5 Slides Cinematográficos
import { PosterMode } from './src/components/modes/PosterMode';
import { DoomMode } from './src/components/modes/DoomMode';
import { FantasticFourMode } from './src/components/modes/FantasticFourMode';
import { AvengersMode } from './src/components/modes/AvengersMode';
import { XMenMode } from './src/components/modes/XMenMode';

import {
  generateStars,
  generateOrbitalSparks,
} from './src/utils/particleHelpers';

function MainExperience() {
  const { width: rawWidth, height: rawHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Garante dimensões válidas maiores que zero mesmo durante rotação na MIUI/iOS
  const width = Math.max(rawWidth, 320);
  const height = Math.max(rawHeight, 240);

  // Estado do slide atual (0 a 4) e chave de demonstração Skia GPU FX (inicia OFF para demonstrar a diferença ao ativar)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [skiaEffectsEnabled, setSkiaEffectsEnabled] = useState(false);

  const currentSlide = SLIDES[currentSlideIndex] ?? SLIDES[0];
  const slideIndexSV = useSharedValue(0);

  // Travar orientação automaticamente em Modo Paisagem (LANDSCAPE) com try/catch seguro para MIUI/split-screen
  useEffect(() => {
    let isMounted = true;
    const lockLandscape = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch {
        // Fallback silencioso para celulares Xiaomi/MIUI com restrição de rotação ou tela dividida
        try {
          if (isMounted) {
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
            );
          }
        } catch {
          // Ignora silenciosamente sem travar o app
        }
      }
    };
    lockLandscape();
    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================================================
  // GEOMETRIA DIVIDIDA EM PAISAGEM RESPEITANDO SAFE AREA (Notch / Dynamic Island)
  // ============================================================================
  const safeBounds = useMemo(() => {
    const safeLeft = Math.max(insets.left, 10);
    const safeRight = Math.max(insets.right, 10);
    const safeTop = Math.max(insets.top, 8);
    const safeBottom = Math.max(insets.bottom, 8);
    const usableWidth = Math.max(280, width - safeLeft - safeRight);
    const usableHeight = Math.max(200, height - safeTop - safeBottom);
    return { safeLeft, safeRight, safeTop, safeBottom, usableWidth, usableHeight };
  }, [width, height, insets.left, insets.right, insets.top, insets.bottom]);

  const stageLayout = useMemo(() => {
    const { safeLeft, usableWidth, usableHeight } = safeBounds;
    const stageWidth = safeLeft + usableWidth * 0.54;
    const stageHeight = height;
    // Ponto central único (cx, cy) deslocado do notch esquerdo para nunca cortar o emblema
    const cx = safeLeft + (usableWidth * 0.54) / 2;
    const cy = stageHeight / 2;
    const emblemSize = Math.min(usableWidth * 0.54 * 0.74, usableHeight * 0.80, 245);
    return { stageWidth, stageHeight, cx, cy, emblemSize };
  }, [height, safeBounds]);

  const cardLayout = useMemo(() => {
    const { safeLeft, safeTop, usableWidth, usableHeight } = safeBounds;
    const rightZoneX = safeLeft + usableWidth * 0.54;
    const rightZoneWidth = usableWidth * 0.46;
    const cardWidth = Math.max(220, rightZoneWidth - 14);
    const cardHeight = Math.min(usableHeight - 12, 336);
    const cardX = rightZoneX + (rightZoneWidth - cardWidth) / 2;
    const cardY = safeTop + (usableHeight - cardHeight) / 2;
    return { cardX, cardY, cardWidth, cardHeight };
  }, [safeBounds]);

  // Parallax do Giroscópio e Transição Horizontal de Slides
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const isTouching = useSharedValue(false);
  const slideParallaxX = useSharedValue(0);

  // Animações contínuas na GPU
  const shimmer = useSharedValue(0);
  const doomRuneRotation = useSharedValue(0);
  const f4FlameCycle = useSharedValue(0);

  // Onda de Choque ao Tocar
  const shockOriginX = useSharedValue(stageLayout.cx);
  const shockOriginY = useSharedValue(stageLayout.cy);
  const shockProgress = useSharedValue(1);

  // Poderes específicos de cada emblema
  const doomChargeProgress = useSharedValue(0);
  const f4TouchX = useSharedValue(stageLayout.cx);
  const f4TouchY = useSharedValue(stageLayout.cy);
  const f4TouchActive = useSharedValue(0);
  const capShieldRotation = useSharedValue(0);
  const capSparkProgress = useSharedValue(1);
  const xmenClawProgress = useSharedValue(1);

  // Estrelas e partículas geradas proceduralmente
  const { distantStars, foregroundStars } = useMemo(
    () => generateStars(width, height),
    [width, height]
  );

  const orbitalParticles = useMemo(
    () => generateOrbitalSparks(stageLayout.emblemSize * 0.47),
    [stageLayout.emblemSize]
  );

  // Loops contínuos na UI Thread
  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 4800, easing: Easing.linear }),
      -1,
      false
    );
    doomRuneRotation.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 9500, easing: Easing.linear }),
      -1,
      false
    );
    f4FlameCycle.value = withRepeat(
      withTiming(1, { duration: 950, easing: Easing.linear }),
      -1,
      false
    );
  }, [shimmer, doomRuneRotation, f4FlameCycle]);

  // Leitura resiliente do Giroscópio (compatível com iOS e Android Xiaomi/Samsung/Motorola + fallback automático)
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let isMounted = true;

    const initGyroscope = async () => {
      try {
        const available = await Gyroscope.isAvailableAsync();
        if (!isMounted || !available) return;

        // Solicita permissão caso exigido pelo iOS / Expo Go
        if (typeof Gyroscope.requestPermissionsAsync === 'function') {
          try {
            const perm = await Gyroscope.requestPermissionsAsync();
            if (!perm.granted) return;
          } catch {
            // Prossegue silenciosamente se o SO não exigir permissão explícita
          }
        }

        if (!isMounted) return;

        // 32ms (~30Hz) evita throttling na MIUI/Xiaomi; o withSpring interpola a 60/120fps na GPU
        Gyroscope.setUpdateInterval(32);

        subscription = Gyroscope.addListener((data) => {
          if (!data || isTouching.value) return;
          const rawX = Number.isFinite(data.x) ? data.x : 0;
          const rawY = Number.isFinite(data.y) ? data.y : 0;

          const targetX = Math.max(-1, Math.min(1, rawY * 1.35));
          const targetY = Math.max(-1, Math.min(1, rawX * 1.35));

          tiltX.value = withSpring(targetX, { damping: 16, stiffness: 90 });
          tiltY.value = withSpring(targetY, { damping: 16, stiffness: 90 });
        });
      } catch {
        // Fallback automático silencioso: o app funciona 100% via toque/arraste do dedo
      }
    };

    initGyroscope();

    return () => {
      isMounted = false;
      try {
        if (subscription) subscription.remove();
      } catch {
        // Ignora erro ao remover listener no unmount
      }
    };
  }, [tiltX, tiltY, isTouching]);

  // Funções de Feedback Tátil Seguras (não falham em aparelhos sem motor háptico)
  const triggerHapticLight = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const triggerHapticHeavy = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  }, []);

  const handleSelectSlide = useCallback(
    (nextIndex: number) => {
      const clamped = (nextIndex + SLIDES.length) % SLIDES.length;
      slideIndexSV.value = clamped;
      setCurrentSlideIndex(clamped);
      slideParallaxX.value = 40;
      slideParallaxX.value = withSpring(0, { damping: 14, stiffness: 110 });
    },
    [slideIndexSV, slideParallaxX]
  );

  const changeSlideByDelta = useCallback(
    (delta: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setCurrentSlideIndex((prev) => {
        const next = (prev + delta + SLIDES.length) % SLIDES.length;
        slideIndexSV.value = next;
        return next;
      });
    },
    [slideIndexSV]
  );

  // Acionamento manual do poder do slide atual (via toque no emblema ou banner)
  const activateCurrentEmblemPower = useCallback(() => {
    const cx = stageLayout.cx;
    const cy = stageLayout.cy;

    shockOriginX.value = cx;
    shockOriginY.value = cy;
    shockProgress.value = 0;
    shockProgress.value = withTiming(1, {
      duration: 680,
      easing: Easing.out(Easing.cubic),
    });

    if (currentSlide.id === 'doomsday') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } else if (currentSlide.id === 'doom') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      doomChargeProgress.value = withTiming(1, { duration: 280 }, () => {
        doomChargeProgress.value = withTiming(0, { duration: 750 });
      });
    } else if (currentSlide.id === 'fantastic4') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      f4TouchX.value = cx;
      f4TouchY.value = cy;
      f4TouchActive.value = 1;
      f4TouchActive.value = withTiming(0, { duration: 900 });
    } else if (currentSlide.id === 'cap') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      capShieldRotation.value = 0;
      capShieldRotation.value = withTiming(Math.PI * 6, {
        duration: 950,
        easing: Easing.out(Easing.cubic),
      });
      capSparkProgress.value = 0;
      capSparkProgress.value = withTiming(1, {
        duration: 850,
        easing: Easing.out(Easing.quad),
      });
    } else if (currentSlide.id === 'xmen') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      xmenClawProgress.value = 0;
      xmenClawProgress.value = withTiming(1, {
        duration: 1150,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [
    currentSlide.id,
    stageLayout.cx,
    stageLayout.cy,
    shockOriginX,
    shockOriginY,
    shockProgress,
    doomChargeProgress,
    f4TouchX,
    f4TouchY,
    f4TouchActive,
    capShieldRotation,
    capSparkProgress,
    xmenClawProgress,
  ]);

  // ============================================================================
  // GESTOS NA UI THREAD (Navegação Horizontal Parallax + Poderes dos Emblemas)
  // ============================================================================
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      isTouching.value = true;
    })
    .onUpdate((e) => {
      'worklet';
      const idx = slideIndexSV.value;
      const inEmblemCore =
        Math.hypot(e.x - stageLayout.cx, e.y - stageLayout.cy) <
        stageLayout.emblemSize * 0.56;

      // Slide 3 (Quarteto Fantástico): Arrastar sobre o emblema gera chamas de plasma
      if (idx === 2 && inEmblemCore) {
        f4TouchX.value = e.x;
        f4TouchY.value = e.y;
        f4TouchActive.value = 1;
      }

      // Slide 5 (X-Men): Deslizar diagonalmente sobre o emblema ativa os 3 cortes de Adamantium
      if (idx === 4 && inEmblemCore && Math.abs(e.translationY) > 15) {
        xmenClawProgress.value = 0;
      }

      // Parallax horizontal durante o arrasto
      slideParallaxX.value = e.translationX * 0.35;

      // Inclinação 3D suave pelo toque (funciona como fallback universal sem giroscópio)
      const normX = Math.max(-1, Math.min(1, (e.x - stageLayout.cx) / (stageLayout.stageWidth * 0.5)));
      const normY = Math.max(-1, Math.min(1, (e.y - stageLayout.cy) / (stageLayout.stageHeight * 0.5)));
      tiltX.value = withSpring(normX, { damping: 14, stiffness: 120 });
      tiltY.value = withSpring(normY, { damping: 14, stiffness: 120 });
    })
    .onFinalize((e) => {
      'worklet';
      isTouching.value = false;
      const idx = slideIndexSV.value;
      const inEmblemCore =
        Math.hypot(e.x - stageLayout.cx, e.y - stageLayout.cy) <
        stageLayout.emblemSize * 0.52;

      tiltX.value = withSpring(0, { damping: 14, stiffness: 80 });
      tiltY.value = withSpring(0, { damping: 14, stiffness: 80 });
      f4TouchActive.value = withTiming(0, { duration: 500 });

      if (idx === 4 && xmenClawProgress.value < 0.2) {
        xmenClawProgress.value = withTiming(1, {
          duration: 1100,
          easing: Easing.out(Easing.quad),
        });
        runOnJS(triggerHapticHeavy)();
      }

      // Verifica se foi um gesto de swipe horizontal para trocar de slide
      const isHorizontalSwipe =
        Math.abs(e.translationX) > 62 &&
        Math.abs(e.translationX) > Math.abs(e.translationY) * 1.25 &&
        !(idx === 2 && inEmblemCore && Math.abs(e.translationX) < 110);

      if (isHorizontalSwipe) {
        const direction = e.translationX < 0 ? 1 : -1;
        runOnJS(changeSlideByDelta)(direction);
      }

      slideParallaxX.value = withSpring(0, { damping: 14, stiffness: 100 });
    });

  // Toque simples no emblema ativa a interação característica de cada slide
  const tapGesture = Gesture.Tap().onEnd((e) => {
    'worklet';
    if (e.x > stageLayout.stageWidth) return;

    shockOriginX.value = e.x;
    shockOriginY.value = e.y;
    shockProgress.value = 0;
    shockProgress.value = withTiming(1, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });

    const idx = slideIndexSV.value;
    if (idx === 1) {
      // Doutor Destino: Pulso de raios verdes
      doomChargeProgress.value = 1;
      doomChargeProgress.value = withTiming(0, { duration: 750 });
      runOnJS(triggerHapticHeavy)();
    } else if (idx === 2) {
      // Quarteto Fantástico: Explosão de chamas e campo de força no ponto
      f4TouchX.value = e.x;
      f4TouchY.value = e.y;
      f4TouchActive.value = 1;
      f4TouchActive.value = withTiming(0, { duration: 800 });
      runOnJS(triggerHapticLight)();
    } else if (idx === 3) {
      // Capitão América: Giro em alta velocidade com faíscas de impacto
      capShieldRotation.value = 0;
      capShieldRotation.value = withTiming(Math.PI * 6, {
        duration: 950,
        easing: Easing.out(Easing.cubic),
      });
      capSparkProgress.value = 0;
      capSparkProgress.value = withTiming(1, {
        duration: 850,
        easing: Easing.out(Easing.quad),
      });
      runOnJS(triggerHapticHeavy)();
    } else if (idx === 4) {
      // X-Men: Cortes de Adamantium
      xmenClawProgress.value = 0;
      xmenClawProgress.value = withTiming(1, {
        duration: 1100,
        easing: Easing.out(Easing.quad),
      });
      runOnJS(triggerHapticHeavy)();
    } else {
      runOnJS(triggerHapticLight)();
    }
  });

  // Segurar o dedo (LongPress): Carrega energia arcana na máscara do Doutor Destino
  const longPressGesture = Gesture.LongPress()
    .minDuration(280)
    .onStart((e) => {
      'worklet';
      if (e.x > stageLayout.stageWidth) return;
      doomChargeProgress.value = withTiming(1, { duration: 320 });
      runOnJS(triggerHapticHeavy)();
    })
    .onFinalize(() => {
      'worklet';
      doomChargeProgress.value = withTiming(0, { duration: 600 });
    });

  const composedGestures = Gesture.Simultaneous(
    panGesture,
    tapGesture,
    longPressGesture
  );

  // Transform de parallax do palco esquerdo durante o swipe entre slides
  const stageParallaxTransform = useDerivedValue(() => [
    { translateX: slideParallaxX.value },
  ]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar hidden />

      {/* 1. Botão de Demonstração Técnica no Canto Superior Esquerdo (com Safe Area) */}
      <SkiaToggle
        enabled={skiaEffectsEnabled}
        onToggle={() => setSkiaEffectsEnabled((v) => !v)}
      />

      {/* 2. Palco Skia GPU em Tela Cheia com Interação Gestual */}
      <GestureDetector gesture={composedGestures}>
        <View style={StyleSheet.absoluteFill}>
          <Canvas style={StyleSheet.absoluteFill}>
            {/* Fundo Atmosférico, Nebulosas e Partículas da GPU */}
            <CosmicBackground
              width={width}
              height={height}
              stageCenterX={stageLayout.cx}
              stageCenterY={stageLayout.cy}
              tiltX={tiltX}
              tiltY={tiltY}
              slideParallaxX={slideParallaxX}
              distantStars={distantStars}
              foregroundStars={foregroundStars}
              currentSlideId={currentSlide.id}
              skiaEffectsEnabled={skiaEffectsEnabled}
            />

            {/* ZONA ESQUERDA (54% da área útil): Emblema 3D/Realista Centralizado em (cx, cy) */}
            <Group transform={stageParallaxTransform}>
              {currentSlide.id === 'doomsday' && (
                <PosterMode
                  cx={stageLayout.cx}
                  cy={stageLayout.cy}
                  size={stageLayout.emblemSize}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  shimmer={shimmer}
                  particles={orbitalParticles}
                  skiaEffectsEnabled={skiaEffectsEnabled}
                />
              )}

              {currentSlide.id === 'doom' && (
                <DoomMode
                  cx={stageLayout.cx}
                  cy={stageLayout.cy}
                  size={stageLayout.emblemSize}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  chargeProgress={doomChargeProgress}
                  runeRotation={doomRuneRotation}
                  skiaEffectsEnabled={skiaEffectsEnabled}
                />
              )}

              {currentSlide.id === 'fantastic4' && (
                <FantasticFourMode
                  cx={stageLayout.cx}
                  cy={stageLayout.cy}
                  size={stageLayout.emblemSize}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  touchX={f4TouchX}
                  touchY={f4TouchY}
                  touchActive={f4TouchActive}
                  flameCycle={f4FlameCycle}
                  skiaEffectsEnabled={skiaEffectsEnabled}
                />
              )}

              {currentSlide.id === 'cap' && (
                <AvengersMode
                  cx={stageLayout.cx}
                  cy={stageLayout.cy}
                  size={stageLayout.emblemSize}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  shieldRotation={capShieldRotation}
                  sparkProgress={capSparkProgress}
                  skiaEffectsEnabled={skiaEffectsEnabled}
                />
              )}

              {currentSlide.id === 'xmen' && (
                <XMenMode
                  cx={stageLayout.cx}
                  cy={stageLayout.cy}
                  size={stageLayout.emblemSize}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  clawProgress={xmenClawProgress}
                  skiaEffectsEnabled={skiaEffectsEnabled}
                />
              )}
            </Group>

            {/* Onda de Choque Energética ao Tocar no Emblema */}
            <ShockwaveSystem
              originX={shockOriginX}
              originY={shockOriginY}
              progress={shockProgress}
              currentSlideId={currentSlide.id}
              skiaEffectsEnabled={skiaEffectsEnabled}
            />

            {/* ZONA DIREITA (46% da área útil): Card Flutuante em Vidro Fosco (<BackdropBlur blur={16}>) */}
            <SkiaCardBackdrop
              cardX={cardLayout.cardX}
              cardY={cardLayout.cardY}
              cardWidth={cardLayout.cardWidth}
              cardHeight={cardLayout.cardHeight}
              currentSlideId={currentSlide.id}
              skiaEffectsEnabled={skiaEffectsEnabled}
            />
          </Canvas>
        </View>
      </GestureDetector>

      {/* 3. Conteúdo Tipográfico do Card Flutuante (Lado Direito, respeitando Safe Area) */}
      <TicketCardUI
        cardX={cardLayout.cardX}
        cardY={cardLayout.cardY}
        cardWidth={cardLayout.cardWidth}
        cardHeight={cardLayout.cardHeight}
        slide={currentSlide}
        onSelectSlide={handleSelectSlide}
        onActivatePower={activateCurrentEmblemPower}
      />
    </GestureHandlerRootView>
  );
}

class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error?.message || String(error),
    };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Captura erros de renderização para evitar a tela genérica "Something went wrong" do Expo Go
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>AVENGERS: DOOMSDAY // DIAGNÓSTICO</Text>
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false, errorMessage: '' })}
          >
            <Text style={styles.retryButtonText}>RECARREGAR EXPERIÊNCIA</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <MainExperience />
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#010503',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#010503',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  errorText: {
    color: '#f8fafc',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: 'rgba(0, 255, 136, 0.16)',
    borderColor: '#00ff88',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#00ff88',
    fontSize: 11,
    fontWeight: '800',
  },
});
