import { Gyroscope } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ROAD_WIDTH = SCREEN_WIDTH * 0.72;
const ROAD_HEIGHT = SCREEN_HEIGHT * 0.42;
const CAR_SIZE = 42;
const CAR_BOTTOM_OFFSET = 16;
const CONE_SIZE = 36;
const HALF_TRACK = ROAD_WIDTH / 2 - CAR_SIZE / 2 - 6;

const MAX_ANGLE = (Math.PI / 180) * 100; // trava do volante: 100° pra cada lado
const STEER_SENSITIVITY = 0.09; // quanto cada leitura do giroscópio gira o volante
const RETURN_TO_CENTER = 0.985; // o volante relaxa sozinho, como um de verdade

const TICK_MS = 32;
const COUNTDOWN_START = 3;
const DASH_COUNT = 6;

type Status = 'idle' | 'countdown' | 'playing' | 'gameover';

type Cone = { id: number; x: number; y: number };

export function SteeringWheelGame({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [angleDeg, setAngleDeg] = useState(0);
  const [carX, setCarX] = useState(0);
  const [cones, setCones] = useState<Cone[]>([]);
  const [dashOffset, setDashOffset] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  const angleRef = useRef(0); // radianos, fonte da verdade entre os listeners
  const speedRef = useRef(3.5);
  const spawnCooldownRef = useRef(0);
  const nextConeId = useRef(0);

  // cronômetro: sobe enquanto o carro está na pista
  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  // contagem regressiva antes de largar
  useEffect(() => {
    if (status !== 'countdown') return;

    if (countdown === 0) {
      setStatus('playing');
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown]);

  // giroscópio só escuta durante a corrida — integra a rotação em torno do
  // eixo z, que é o eixo que gira quando você "vira o volante" com o celular
  useEffect(() => {
    if (status !== 'playing') return;
    // expo-sensors não tem listener de movimento na web, só em dispositivo real
    if (Platform.OS === 'web') return;

    Gyroscope.setUpdateInterval(16);
    const subscription = Gyroscope.addListener((leitura) => {
      setData(leitura);

      const proximo = angleRef.current - leitura.z * STEER_SENSITIVITY;
      angleRef.current = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, proximo));
    });

    return () => subscription.remove();
  }, [status]);

  // loop do jogo: aplica o ângulo do volante na posição do carro, move os
  // cones na pista, sorteia novos obstáculos e checa colisão
  useEffect(() => {
    if (status !== 'playing') return;

    const loop = setInterval(() => {
      angleRef.current *= RETURN_TO_CENTER;

      const angle = angleRef.current;
      setAngleDeg((angle * 180) / Math.PI);

      const alvoX = (angle / MAX_ANGLE) * HALF_TRACK;
      let carroX = 0;
      setCarX((atual) => {
        carroX = atual + (alvoX - atual) * 0.25;
        return carroX;
      });

      speedRef.current = Math.min(speedRef.current + 0.0025, 9);
      setDashOffset((d) => (d + speedRef.current) % 80);

      spawnCooldownRef.current -= 1;
      if (spawnCooldownRef.current <= 0) {
        spawnCooldownRef.current = Math.max(28 - Math.floor(speedRef.current * 2), 14);
        nextConeId.current += 1;
        setCones((atual) => [
          ...atual,
          { id: nextConeId.current, x: (Math.random() * 2 - 1) * HALF_TRACK, y: -CONE_SIZE },
        ]);
      }

      setCones((atual) => {
        const movidos = atual
          .map((cone) => ({ ...cone, y: cone.y + speedRef.current }))
          .filter((cone) => cone.y < ROAD_HEIGHT + CONE_SIZE);

        const carTop = ROAD_HEIGHT - CAR_BOTTOM_OFFSET - CAR_SIZE;
        const bateu = movidos.some((cone) => {
          const yOverlap = cone.y + CONE_SIZE > carTop && cone.y < carTop + CAR_SIZE;
          const xOverlap = Math.abs(cone.x - carroX) < (CONE_SIZE + CAR_SIZE) / 2 - 12;
          return yOverlap && xOverlap;
        });

        if (bateu) setStatus('gameover');

        return movidos;
      });
    }, TICK_MS);

    return () => clearInterval(loop);
  }, [status]);

  function startGame() {
    angleRef.current = 0;
    speedRef.current = 3.5;
    spawnCooldownRef.current = 20;
    setAngleDeg(0);
    setCarX(0);
    setCones([]);
    setDashOffset(0);
    setCountdown(COUNTDOWN_START);
    setElapsedSeconds(0);
    setStatus('countdown');
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Gire o celular como um volante</Text>
        <Text style={styles.subtitle}>
          {status === 'playing'
            ? 'desvie dos cones na pista'
            : status === 'gameover'
              ? 'você bateu!'
              : 'segure o celular na vertical e vire pros lados pra dirigir'}
        </Text>
        {Platform.OS === 'web' && status === 'playing' && (
          <Text style={styles.webNotice}>sensor de movimento só funciona no celular, não no navegador</Text>
        )}
      </View>

      <View style={styles.timer}>
        <Text style={styles.timerText}>{elapsedSeconds}s</Text>
      </View>

      <View style={styles.road}>
        {Array.from({ length: DASH_COUNT }).map((_, i) => (
          <View
            key={i}
            style={[styles.dash, { top: (i * ROAD_HEIGHT) / DASH_COUNT - 40 + dashOffset }]}
          />
        ))}

        {cones.map((cone) => (
          <Text
            key={cone.id}
            style={[
              styles.cone,
              { left: ROAD_WIDTH / 2 + cone.x - CONE_SIZE / 2, top: cone.y },
            ]}>
            🚧
          </Text>
        ))}

        <Text
          style={[
            styles.car,
            {
              left: ROAD_WIDTH / 2 + carX - CAR_SIZE / 2,
              bottom: CAR_BOTTOM_OFFSET,
              transform: [{ rotate: `${Math.max(-25, Math.min(25, angleDeg * 0.3))}deg` }],
            },
          ]}>
          🏎️
        </Text>

        {status === 'countdown' && (
          <View style={styles.overlay}>
            <Text style={styles.countdownText}>{countdown === 0 ? 'Já!' : countdown}</Text>
          </View>
        )}

        {status === 'gameover' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Bateu!</Text>
            <Text style={styles.finalTimeText}>você dirigiu por {elapsedSeconds}s</Text>
            <Pressable style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>Tentar de novo</Text>
            </Pressable>
          </View>
        )}

        {status === 'idle' && (
          <View style={styles.overlay}>
            <Pressable style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>Iniciar</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.wheelWrap}>
        <View style={{ transform: [{ rotate: `${angleDeg}deg` }] }}>
          <Svg width={110} height={110} viewBox="0 0 100 100">
            <Circle cx={50} cy={50} r={42} stroke={IFSP_GREEN} strokeWidth={8} fill="none" />
            <Circle cx={50} cy={50} r={10} fill={IFSP_GREEN} />
            <Line x1={50} y1={50} x2={50} y2={11} stroke={IFSP_GREEN} strokeWidth={8} />
            <Line x1={50} y1={50} x2={16} y2={70} stroke={IFSP_GREEN} strokeWidth={8} />
            <Line x1={50} y1={50} x2={84} y2={70} stroke={IFSP_GREEN} strokeWidth={8} />
          </Svg>
        </View>
      </View>

      {status === 'playing' && (
        <View style={styles.readings}>
          <Text style={styles.reading}>x: {data.x.toFixed(2)}</Text>
          <Text style={styles.reading}>y: {data.y.toFixed(2)}</Text>
          <Text style={styles.reading}>z: {data.z.toFixed(2)}</Text>
        </View>
      )}
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
    marginTop: 90,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
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
  timer: {
    marginTop: 12,
    backgroundColor: IFSP_GRAY,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  road: {
    width: ROAD_WIDTH,
    height: ROAD_HEIGHT,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#3a3a3a',
    borderWidth: 6,
    borderColor: IFSP_GREEN,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  dash: {
    position: 'absolute',
    left: ROAD_WIDTH / 2 - 3,
    width: 6,
    height: 30,
    borderRadius: 3,
    backgroundColor: '#8a8a8a',
  },
  cone: {
    position: 'absolute',
    fontSize: CONE_SIZE,
  },
  car: {
    position: 'absolute',
    fontSize: CAR_SIZE,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(43,43,43,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  countdownText: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
  },
  gameOverText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  finalTimeText: {
    color: '#c4c4c4',
    fontSize: 16,
  },
  button: {
    backgroundColor: IFSP_GREEN,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wheelWrap: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readings: {
    marginBottom: 16,
    flexDirection: 'row',
    gap: 20,
    backgroundColor: IFSP_GRAY,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  reading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
