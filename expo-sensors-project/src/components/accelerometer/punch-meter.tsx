import { Accelerometer } from 'expo-sensors';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';

// parado, a magnitude do acelerômetro fica perto de 1g (só a gravidade) não importa a orientação
const PUNCH_START = 1.8; // g — acima disso já é considerado o começo de um soco
const PUNCH_SETTLE = 1.3; // g — abaixo disso o impacto acabou
const MAX_PUNCH_DURATION_MS = 500; // segurança: finaliza mesmo se não "assentar"
const COOLDOWN_MS = 900; // ignora novos socos logo depois de um, pra não contar o balanço
const HIT_ANIMATION_MS = 1400;

const TIERS = [
  { max: 2.5, label: 'Fraco' },
  { max: 4.5, label: 'Bom' },
  { max: 7, label: 'Forte' },
  { max: Infinity, label: 'Brutal!' },
];

function tierFor(power: number) {
  return TIERS.find((tier) => power < tier.max) ?? TIERS[TIERS.length - 1];
}

const BAG_WIDTH = 140;
const BAG_HEIGHT = 260;

// janela usada pro "ritmo" (socos por segundo): mostra o quão rápido você está batendo agora,
// não a média desde o início da tela
const PACE_WINDOW_MS = 5000;

export function PunchMeter({ onBack }: { onBack: () => void }) {
  const [power, setPower] = useState<number | null>(null);
  const [best, setBest] = useState(0);
  const [totalPunches, setTotalPunches] = useState(0);
  const [punchesPerSecond, setPunchesPerSecond] = useState(0);

  const peakRef = useRef(0);
  const punchingRef = useRef(false);
  const punchStartedAtRef = useRef(0);
  const cooldownUntilRef = useRef(0);
  const recentPunchTimesRef = useRef<number[]>([]);

  const hitProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // expo-sensors não expõe o Accelerometer no navegador, só em dispositivos reais
    if (Platform.OS === 'web') return;

    Accelerometer.setUpdateInterval(20);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const now = Date.now();
      if (now < cooldownUntilRef.current) return;

      const magnitude = Math.sqrt(x * x + y * y + z * z);

      if (!punchingRef.current) {
        if (magnitude > PUNCH_START) {
          punchingRef.current = true;
          punchStartedAtRef.current = now;
          peakRef.current = magnitude;
        }
        return;
      }

      peakRef.current = Math.max(peakRef.current, magnitude);

      const settled = magnitude < PUNCH_SETTLE;
      const timedOut = now - punchStartedAtRef.current > MAX_PUNCH_DURATION_MS;
      if (settled || timedOut) {
        punchingRef.current = false;
        cooldownUntilRef.current = now + COOLDOWN_MS;
        registerHit(peakRef.current);
      }
    });

    return () => subscription.remove();
  }, []);

  // o ritmo também precisa cair sozinho quando você para de bater, não só quando acerta de novo
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const recent = recentPunchTimesRef.current.filter((t) => now - t <= PACE_WINDOW_MS);
      recentPunchTimesRef.current = recent;
      setPunchesPerSecond(recent.length / (PACE_WINDOW_MS / 1000));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  function registerHit(peak: number) {
    setPower(peak);
    setBest((current) => Math.max(current, peak));
    setTotalPunches((count) => count + 1);

    const now = Date.now();
    const recent = [...recentPunchTimesRef.current, now].filter((t) => now - t <= PACE_WINDOW_MS);
    recentPunchTimesRef.current = recent;
    setPunchesPerSecond(recent.length / (PACE_WINDOW_MS / 1000));

    hitProgress.setValue(0);
    Animated.timing(hitProgress, {
      toValue: 1,
      duration: HIT_ANIMATION_MS,
      useNativeDriver: true,
    }).start(() => setPower(null));
  }

  const bagRotate = hitProgress.interpolate({
    inputRange: [0, 0.08, 0.2, 0.32, 0.44, 1],
    outputRange: ['0deg', '-14deg', '10deg', '-6deg', '0deg', '0deg'],
  });
  const ringScale = hitProgress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0.4, 1.8, 1.8] });
  const ringOpacity = hitProgress.interpolate({ inputRange: [0, 0.1, 0.35, 1], outputRange: [0, 0.5, 0, 0] });

  const tier = useMemo(() => (power !== null ? tierFor(power) : null), [power]);

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Soqueira</Text>
        <Text style={styles.subtitle}>
          {tier ? tier.label : 'dá um soco rápido no celular (segurando firme!)'}
        </Text>
        {Platform.OS === 'web' && (
          <Text style={styles.webNotice}>sensor de movimento só funciona no celular, não no navegador</Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>socos</Text>
          <Text style={styles.statValue}>{totalPunches}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>melhor</Text>
          <Text style={styles.statValue}>{best.toFixed(1)} G</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>socos/s</Text>
          <Text style={styles.statValue}>{punchesPerSecond.toFixed(1)}</Text>
        </View>
        {power !== null && (
          <View style={[styles.statBox, styles.statBoxHighlight]}>
            <Text style={styles.statLabel}>agora</Text>
            <Text style={styles.statValue}>{power.toFixed(1)} G</Text>
          </View>
        )}
      </View>

      <Text style={styles.gExplainer}>
        G = "força G": mede o quanto a aceleração do soco passa da gravidade normal (1G = parado)
      </Text>

      <View style={styles.stage}>
        <Animated.View
          pointerEvents="none"
          style={[styles.impactRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
        />
        <Animated.View style={{ transform: [{ rotate: bagRotate }] }}>
          <PunchBagSvg />
        </Animated.View>
      </View>
    </View>
  );
}

function PunchBagSvg() {
  return (
    <Svg width={BAG_WIDTH * 0.7} height={BAG_HEIGHT * 0.7} viewBox={`0 0 ${BAG_WIDTH} ${BAG_HEIGHT}`}>
      <Defs>
        <LinearGradient id="bag" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#2E9E4F" />
          <Stop offset="0.5" stopColor={IFSP_GREEN} />
          <Stop offset="1" stopColor="#0E3B1B" />
        </LinearGradient>
      </Defs>

      {/* corrente/alça */}
      <Rect x={65} y={0} width={10} height={34} fill={IFSP_GRAY} />

      {/* saco em formato de cápsula */}
      <Path
        d="M 20 84 Q 20 34 70 34 Q 120 34 120 84 L 120 200 Q 120 250 70 250 Q 20 250 20 200 Z"
        fill="url(#bag)"
      />

      {/* faixas */}
      <Rect x={20} y={110} width={100} height={14} fill="#ffffff" opacity={0.9} />
      <Rect x={20} y={160} width={100} height={14} fill="#ffffff" opacity={0.9} />
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
  gExplainer: {
    marginTop: 12,
    paddingHorizontal: 32,
    color: '#8a8a8a',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  statsRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    backgroundColor: IFSP_GRAY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  statBoxHighlight: {
    backgroundColor: IFSP_GREEN,
  },
  statLabel: {
    color: '#c4c4c4',
    fontSize: 11,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#fff',
  },
});
