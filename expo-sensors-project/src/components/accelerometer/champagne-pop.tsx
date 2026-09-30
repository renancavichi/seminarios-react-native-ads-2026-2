import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, NativeModules, Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';
import { useLinearAccelerometer } from '@/hooks/use-linear-accelerometer';

const GOLD = '#D4AF37';
const FOAM = ['#ffffff', '#fdf6e3', '#f3efe6'];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// quantas trocas de direção (sobe->desce->sobe...) são precisas pra estourar
const TARGET_SHAKES = 6;
// o quão forte o movimento precisa ser pra contar como parte de uma sacudida
const SHAKE_THRESHOLD = 1.6; // m/s²
// duas trocas de direção muito seguidas são só ruído, não duas sacudidas separadas
const DEBOUNCE_MS = 150;
// se parar de sacudir por mais que isso, o progresso zera
const RESET_TIMEOUT_MS = 1200;
const SMOOTHING = 0.3;
const POP_DURATION_MS = 2000;

const BOTTLE_WIDTH = 140;
const BOTTLE_HEIGHT = 260;
const BOTTLE_SCALE = 0.95;
const BOTTLE_RENDER_WIDTH = BOTTLE_WIDTH * BOTTLE_SCALE;
const BOTTLE_RENDER_HEIGHT = BOTTLE_HEIGHT * BOTTLE_SCALE;
// o gargalo fica exatamente no meio do desenho (x 62–78 de um viewBox de largura 140)
const NECK_CENTER_X = BOTTLE_RENDER_WIDTH / 2;

// bolhas de espuma agrupadas perto do gargalo, subindo quase até o topo da tela
const FOAM_RISE_BASE = SCREEN_HEIGHT * 0.6;
const FOAM_BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  size: 16 + ((i * 13) % 22),
  sideOffset: ((i % 6) - 2.5) * 18,
  rise: FOAM_RISE_BASE + ((i * 47) % (SCREEN_HEIGHT * 0.18)),
  delay: (i % 4) * 0.03,
  color: FOAM[i % FOAM.length],
}));

export function ChampagnePop({ onBack }: { onBack: () => void }) {
  const [shakeCount, setShakeCount] = useState(0);
  const [popped, setPopped] = useState(false);

  const smoothedYRef = useRef(0);
  const directionRef = useRef(0);
  const lastShakeTimeRef = useRef(0);
  const poppedRef = useRef(false);

  const popProgress = useRef(new Animated.Value(0)).current;
  const popSound = useAudioPlayer(require('@/assets/sounds/champagne-pop.wav'));

  useEffect(() => {
    popSound.volume = 1;
    // no iOS, o som fica mudo se o celular estiver no modo silencioso a menos que isso seja ligado
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, [popSound]);

  // sacudir o celular pra estourar o champanhe também aciona o gesto nativo do Expo
  // que abre o menu de desenvolvedor — desativa só enquanto essa tela está aberta
  useEffect(() => {
    if (!__DEV__) return;
    const devSettings = NativeModules.DevSettings;
    devSettings?.setIsShakeToShowDevMenuEnabled?.(false);
    return () => devSettings?.setIsShakeToShowDevMenuEnabled?.(true);
  }, []);

  useLinearAccelerometer(
    (acceleration) => {
      if (poppedRef.current) return;

      const now = Date.now();
      smoothedYRef.current = smoothedYRef.current * (1 - SMOOTHING) + acceleration.y * SMOOTHING;
      const y = smoothedYRef.current;

      if (now - lastShakeTimeRef.current > RESET_TIMEOUT_MS) {
        setShakeCount(0);
      }

      if (Math.abs(y) > SHAKE_THRESHOLD) {
        const direction = y > 0 ? 1 : -1;

        if (directionRef.current === 0) {
          directionRef.current = direction;
        } else if (direction !== directionRef.current && now - lastShakeTimeRef.current > DEBOUNCE_MS) {
          directionRef.current = direction;
          lastShakeTimeRef.current = now;

          setShakeCount((count) => {
            const next = count + 1;
            if (next >= TARGET_SHAKES) {
              pop();
              return 0;
            }
            return next;
          });
        }
      }
    },
    50,
    true
  );

  function pop() {
    poppedRef.current = true;
    setPopped(true);

    // toca o som mesmo que o "voltar pro início" falhe (ex: primeira vez, ainda carregando)
    try {
      popSound.seekTo(0).catch(() => {});
    } catch {
      // ignora — o play() abaixo ainda tenta tocar do jeito que estiver
    }
    try {
      popSound.play();
    } catch {
      // sem áudio ainda? sem problema, a animação continua normalmente
    }

    popProgress.setValue(0);
    Animated.timing(popProgress, {
      toValue: 1,
      duration: POP_DURATION_MS,
      useNativeDriver: true,
    }).start(() => {
      poppedRef.current = false;
      directionRef.current = 0;
      lastShakeTimeRef.current = 0;
      setPopped(false);
    });
  }

  const foamStyles = useMemo(
    () =>
      FOAM_BUBBLES.map(({ size, sideOffset, rise, delay, color }) => {
        const start = delay;
        const end = Math.min(1, delay + 0.15);
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          transform: [
            {
              translateX: popProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, sideOffset],
              }),
            },
            {
              translateY: popProgress.interpolate({
                inputRange: [0, start, 1],
                outputRange: [0, 0, -rise],
              }),
            },
            {
              scale: popProgress.interpolate({
                inputRange: [0, start, end, 1],
                outputRange: [0, 0, 1, 1],
              }),
            },
          ],
          opacity: popProgress.interpolate({
            inputRange: [0, start, end, 0.75, 1],
            outputRange: [0, 0, 1, 1, 0],
          }),
        };
      }),
    [popProgress]
  );

  const corkTranslateY = popProgress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, -170, -170],
  });
  const corkOpacity = popProgress.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Estoura o Champanhe</Text>
        <Text style={styles.subtitle}>
          {popped ? 'saúde!' : 'sacode o celular pra cima e pra baixo, sem parar'}
        </Text>
        {Platform.OS === 'web' && (
          <Text style={styles.webNotice}>sensor de movimento só funciona no celular, não no navegador</Text>
        )}
      </View>

      {!popped && (
        <View style={styles.dots}>
          {Array.from({ length: TARGET_SHAKES }).map((_, i) => (
            <View key={i} style={[styles.dot, i < shakeCount && styles.dotFilled]} />
          ))}
        </View>
      )}

      <View style={styles.stage}>
        <View style={styles.bottle}>
          <View style={styles.foamOrigin}>
            <Animated.View
              style={[
                styles.cork,
                { transform: [{ translateY: corkTranslateY }], opacity: corkOpacity },
              ]}
            />

            {popped &&
              foamStyles.map((style, i) => (
                <Animated.View key={i} style={[styles.foamBubble, style]} />
              ))}
          </View>

          <ChampagneBottleSvg />
        </View>
      </View>
    </View>
  );
}

function ChampagneBottleSvg() {
  return (
    <Svg width={BOTTLE_RENDER_WIDTH} height={BOTTLE_RENDER_HEIGHT} viewBox={`0 0 ${BOTTLE_WIDTH} ${BOTTLE_HEIGHT}`}>
      <Defs>
        <LinearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#2E9E4F" />
          <Stop offset="0.45" stopColor={IFSP_GREEN} />
          <Stop offset="1" stopColor="#0E3B1B" />
        </LinearGradient>
      </Defs>

      {/* sombra da base */}
      <Path d={`M 25 254 Q 70 268 115 254 L 115 250 Q 70 260 25 250 Z`} fill="#000" opacity={0.25} />

      {/* corpo + ombro + gargalo, tudo de uma vez pra não ter emenda visível */}
      <Path
        d={`
          M 62 0
          L 78 0
          L 78 38
          Q 78 44 84 48
          L 106 82
          Q 118 96 118 116
          L 118 224
          Q 118 250 92 250
          L 48 250
          Q 22 250 22 224
          L 22 116
          Q 22 96 34 82
          L 56 48
          Q 62 44 62 38
          Z
        `}
        fill="url(#glass)"
      />

      {/* lacre dourado na base do gargalo */}
      <Rect x={58} y={26} width={24} height={16} rx={2} fill={GOLD} />

      {/* brilho do vidro */}
      <Path d="M 32 100 Q 30 170 32 236" stroke="#ffffff" strokeOpacity={0.18} strokeWidth={7} strokeLinecap="round" fill="none" />

      {/* rótulo */}
      <Rect x={38} y={150} width={64} height={56} rx={6} fill="#ffffff" />
      <Rect x={38} y={150} width={64} height={56} rx={6} fill="none" stroke={IFSP_GREEN} strokeWidth={2} />
      <Rect x={48} y={164} width={44} height={4} rx={2} fill={IFSP_GRAY} />
      <Rect x={48} y={174} width={30} height={4} rx={2} fill={IFSP_GRAY} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IFSP_GRAY_DARK,
    alignItems: 'center',
  },
  header: {
    marginTop: 110,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#c4c4c4',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  webNotice: {
    color: '#c4c4c4',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dots: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: IFSP_GRAY,
    borderWidth: 2,
    borderColor: IFSP_GREEN,
  },
  dotFilled: {
    backgroundColor: IFSP_GREEN,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottle: {
    width: BOTTLE_RENDER_WIDTH,
    height: BOTTLE_RENDER_HEIGHT,
  },
  foamOrigin: {
    position: 'absolute',
    top: 4,
    left: NECK_CENTER_X,
    width: 0,
    height: 0,
    zIndex: 1,
  },
  cork: {
    position: 'absolute',
    top: -14,
    left: -10,
    width: 20,
    height: 24,
    borderRadius: 4,
    backgroundColor: GOLD,
  },
  foamBubble: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
