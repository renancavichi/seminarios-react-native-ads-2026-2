import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';
import { useLinearAccelerometer } from '@/hooks/use-linear-accelerometer';

// abaixo disso o "movimento" é só ruído do sensor
const ACCEL_DEADZONE = 0.25; // m/s²
// quando não há aceleração, a velocidade estimada vai voltando a zero (fricção simulada)
const DECAY_PER_SECOND = 2.5; // m/s por segundo
// nenhum ser humano corre mais rápido que isso — trava de segurança contra deriva do sensor
const MAX_SPEED_MS = 12.5; // ~45 km/h
// suaviza o ruído do sensor antes de integrar, pra um pico isolado não disparar a leitura
const SMOOTHING = 0.2;

export function SpeedMeter({ onBack }: { onBack: () => void }) {
  const [speedKmh, setSpeedKmh] = useState(0);
  const [maxSpeedKmh, setMaxSpeedKmh] = useState(0);

  const speedRef = useRef(0);
  const smoothedAccelRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);

  useLinearAccelerometer(
    (acceleration) => {
      const lastTimestamp = lastTimestampRef.current;
      lastTimestampRef.current = acceleration.timestamp;
      if (lastTimestamp === null) return;

      const dt = acceleration.timestamp - lastTimestamp;
      if (dt <= 0 || dt > 1) return; // ignora saltos estranhos (app em background, etc.)

      // só considera o eixo de frente/trás do celular (perpendicular à tela) — ignora
      // o balanço lateral e para cima/baixo do braço, que é o que deixava a leitura esquisita
      smoothedAccelRef.current = smoothedAccelRef.current * (1 - SMOOTHING) + acceleration.z * SMOOTHING;
      const forwardAccel = smoothedAccelRef.current;

      let speed = speedRef.current;
      if (Math.abs(forwardAccel) > ACCEL_DEADZONE) {
        // integra com sinal: a desaceleração de cada passada cancela a aceleração da
        // passada anterior, em vez de somar as duas (era isso que fazia o valor só crescer)
        speed += forwardAccel * dt;
      } else {
        speed -= DECAY_PER_SECOND * dt;
      }

      speed = Math.max(0, Math.min(MAX_SPEED_MS, speed));

      speedRef.current = speed;
      const kmh = speed * 3.6;
      setSpeedKmh(kmh);
      setMaxSpeedKmh((max) => Math.max(max, kmh));
    },
    100,
    true
  );

  function reset() {
    speedRef.current = 0;
    smoothedAccelRef.current = 0;
    lastTimestampRef.current = null;
    setSpeedKmh(0);
    setMaxSpeedKmh(0);
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Velocímetro</Text>
        <Text style={styles.subtitle}>
          segure o celular com a tela de frente pro seu corpo e corra
        </Text>
        {Platform.OS === 'web' && (
          <Text style={styles.webNotice}>sensor de movimento só funciona no celular, não no navegador</Text>
        )}
      </View>

      <View style={styles.dial}>
        <Text style={styles.speedValue}>{speedKmh.toFixed(1)}</Text>
        <Text style={styles.speedUnit}>km/h</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>máxima</Text>
          <Text style={styles.statValue}>{maxSpeedKmh.toFixed(1)} km/h</Text>
        </View>
        <Pressable style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>Zerar</Text>
        </Pressable>
      </View>

      <Text style={styles.disclaimer}>
        atenção: isso não é um GPS. é uma estimativa aproximada, feita integrando a aceleração ao
        longo do tempo — tende a "derivar" (acumular erro) quanto mais tempo passa.
      </Text>
    </View>
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
  dial: {
    marginTop: 40,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: IFSP_GREEN,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  speedValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: IFSP_GRAY_DARK,
    fontFamily: 'monospace',
  },
  speedUnit: {
    fontSize: 16,
    color: IFSP_GREEN,
    fontWeight: 'bold',
  },
  statsRow: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statBox: {
    backgroundColor: IFSP_GRAY,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  statLabel: {
    color: '#c4c4c4',
    fontSize: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: IFSP_GREEN,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop: 32,
    paddingHorizontal: 32,
    color: '#8a8a8a',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
