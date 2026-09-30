import { Gyroscope } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';

// diferente do volante (que acumula um ângulo contínuo), esse jogo só
// detecta o GESTO: a rotação passou de um limiar? então virou. não precisa
// calibrar sensibilidade fina — ou o giro foi rápido o suficiente, ou não foi
const DIRECTION_THRESHOLD = 1.6; // rad/s — giro decidido, não tremedeira de mão
const GESTURE_COOLDOWN_MS = 450; // evita um giro só virando "vários" por ruído

const TICK_MS = 16;
const COUNTDOWN_START = 3;
const ROUND_SECONDS = 20;
const REACTION_WINDOW_MS = 1800;

type Status = 'idle' | 'countdown' | 'playing' | 'finished';
type Direction = 'up' | 'down' | 'left' | 'right';

const DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];
const ARROW: Record<Direction, string> = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
const LABEL: Record<Direction, string> = { up: 'cima', down: 'baixo', left: 'esquerda', right: 'direita' };

function sorteiaDirecao(anterior: Direction | null): Direction {
  let proxima = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  while (proxima === anterior) {
    proxima = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  }
  return proxima;
}

export function ReflexGame({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [target, setTarget] = useState<Direction>('up');
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [flash, setFlash] = useState<'hit' | 'miss' | null>(null);
  const [data, setData] = useState({ x: 0, y: 0 });

  const targetRef = useRef<Direction>('up');
  const lastGestureAtRef = useRef(0);
  const targetSetAtRef = useRef(0);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // cronômetro regressivo: a rodada dura ROUND_SECONDS
  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setStatus('finished');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // contagem regressiva antes de começar
  useEffect(() => {
    if (status !== 'countdown') return;

    if (countdown === 0) {
      setStatus('playing');
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown]);

  function showFlash(tipo: 'hit' | 'miss') {
    setFlash(tipo);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setFlash(null), 220);
  }

  function nextTarget() {
    const proxima = sorteiaDirecao(targetRef.current);
    targetRef.current = proxima;
    targetSetAtRef.current = Date.now();
    setTarget(proxima);
  }

  // giroscópio só escuta durante a partida — detecta qual eixo girou mais
  // forte e em que sentido, sem acumular ângulo nenhum
  useEffect(() => {
    if (status !== 'playing') return;
    // expo-sensors não tem listener de movimento na web, só em dispositivo real
    if (Platform.OS === 'web') return;

    Gyroscope.setUpdateInterval(TICK_MS);
    const subscription = Gyroscope.addListener(({ x, y }) => {
      setData({ x, y });

      const now = Date.now();
      if (now - lastGestureAtRef.current < GESTURE_COOLDOWN_MS) return;

      let detectada: Direction | null = null;
      if (Math.abs(x) > Math.abs(y) && Math.abs(x) > DIRECTION_THRESHOLD) {
        detectada = x > 0 ? 'down' : 'up';
      } else if (Math.abs(y) > DIRECTION_THRESHOLD) {
        detectada = y > 0 ? 'left' : 'right';
      }

      if (!detectada) return;
      lastGestureAtRef.current = now;

      if (detectada === targetRef.current) {
        setScore((s) => s + 1);
        showFlash('hit');
        nextTarget();
      } else {
        setMisses((m) => m + 1);
        showFlash('miss');
      }
    });

    return () => subscription.remove();
  }, [status]);

  // se demorar demais pra reagir, troca a seta sozinha e conta como erro
  useEffect(() => {
    if (status !== 'playing') return;

    const watchdog = setInterval(() => {
      if (Date.now() - targetSetAtRef.current > REACTION_WINDOW_MS) {
        setMisses((m) => m + 1);
        showFlash('miss');
        nextTarget();
      }
    }, TICK_MS);

    return () => clearInterval(watchdog);
  }, [status]);

  function startGame() {
    lastGestureAtRef.current = 0;
    setScore(0);
    setMisses(0);
    setFlash(null);
    nextTarget();
    setCountdown(COUNTDOWN_START);
    setSecondsLeft(ROUND_SECONDS);
    setStatus('countdown');
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Vire rápido pro lado certo</Text>
        <Text style={styles.subtitle}>
          {status === 'playing'
            ? 'gire o celular na direção da seta antes que ela mude'
            : status === 'finished'
              ? 'tempo esgotado!'
              : 'incline o celular rápido pra cima, baixo ou pros lados — não precisa ser suave'}
        </Text>
        {Platform.OS === 'web' && status === 'playing' && (
          <Text style={styles.webNotice}>sensor de movimento só funciona no celular, não no navegador</Text>
        )}
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{secondsLeft}s</Text>
        </View>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{score} ✅</Text>
        </View>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{misses} ❌</Text>
        </View>
      </View>

      <View
        style={[
          styles.arena,
          flash === 'hit' && styles.arenaHit,
          flash === 'miss' && styles.arenaMiss,
        ]}>
        {status === 'playing' && (
          <>
            <Text style={styles.arrow}>{ARROW[target]}</Text>
            <Text style={styles.arrowLabel}>{LABEL[target]}</Text>
          </>
        )}

        {status === 'countdown' && <Text style={styles.countdownText}>{countdown === 0 ? 'Já!' : countdown}</Text>}

        {status === 'finished' && (
          <>
            <Text style={styles.gameOverText}>Tempo esgotado!</Text>
            <Text style={styles.finalTimeText}>
              {score} acertos, {misses} erros
            </Text>
            <Pressable style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>Tentar de novo</Text>
            </Pressable>
          </>
        )}

        {status === 'idle' && (
          <Pressable style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Iniciar</Text>
          </Pressable>
        )}
      </View>

      {status === 'playing' && (
        <View style={styles.readings}>
          <Text style={styles.reading}>x: {data.x.toFixed(2)}</Text>
          <Text style={styles.reading}>y: {data.y.toFixed(2)}</Text>
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
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  timer: {
    backgroundColor: IFSP_GRAY,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  arena: {
    width: 260,
    height: 260,
    marginTop: 32,
    borderRadius: 130,
    backgroundColor: '#3a3a3a',
    borderWidth: 6,
    borderColor: IFSP_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  arenaHit: {
    borderColor: '#4CD964',
    backgroundColor: '#2f4a33',
  },
  arenaMiss: {
    borderColor: '#e05555',
    backgroundColor: '#4a2f2f',
  },
  arrow: {
    fontSize: 90,
  },
  arrowLabel: {
    color: '#c4c4c4',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  countdownText: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
  },
  gameOverText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  finalTimeText: {
    color: '#c4c4c4',
    fontSize: 15,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
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
  readings: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 20,
    backgroundColor: IFSP_GRAY,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  reading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
