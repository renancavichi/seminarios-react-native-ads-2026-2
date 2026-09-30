import { Barometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SKY_WIDTH = SCREEN_WIDTH * 0.7;
const SKY_HEIGHT = SCREEN_HEIGHT * 0.5;
const BALLOON_SIZE = 46;

const GRAVITY = 0.5;
const THRUST = 2.8;
const MAX_SPEED = 8;

// pressão varia uns poucos centésimos de hPa quando você sopra perto do
// microfone/alto-falante — bem menos que os décimos de um sopro "de peito".
// por isso a força do sopro é proporcional, não um gatilho de tudo ou nada:
// abaixo de BLOW_DEADZONE é ruído do sensor; a partir daí, quanto mais perto
// de BLOW_FULL_STRENGTH, mais forte o empuxo. a baseline é fixada uma única
// vez no começo da rodada (não fica perseguindo a leitura) — assim o balão
// para de subir assim que você solta o ar, sem ficar "grudado"
const BLOW_DEADZONE = 0.01;
const BLOW_FULL_STRENGTH = 0.045;

const TICK_MS = 16;
const COUNTDOWN_START = 3;
const ROUND_SECONDS = 20;

type Status = 'idle' | 'countdown' | 'playing' | 'finished';

export function BalloonGame({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [balloonY, setBalloonY] = useState(SKY_HEIGHT / 2);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [bestPercent, setBestPercent] = useState(0);
  const [reading, setReading] = useState({ pressure: 0, relativeAltitude: undefined as number | undefined });
  const [delta, setDelta] = useState(0);
  const [strength, setStrength] = useState(0);
  const [blowing, setBlowing] = useState(false);

  const velocityRef = useRef(0);
  const balloonYRef = useRef(SKY_HEIGHT / 2);
  const bestPercentRef = useRef(0);
  const baselineRef = useRef<number | null>(null);
  const blowStrengthRef = useRef(0);

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

  // contagem regressiva antes de soltar o balão
  useEffect(() => {
    if (status !== 'countdown') return;

    if (countdown === 0) {
      setStatus('playing');
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown]);

  // barômetro só escuta durante a partida — a baseline é fixada na primeira
  // leitura da rodada e não se move mais, então a resposta é instantânea
  // tanto pra começar a soprar quanto pra parar
  useEffect(() => {
    if (status !== 'playing') return;
    if (Platform.OS === 'web') return;

    Barometer.setUpdateInterval(16);
    const subscription = Barometer.addListener(({ pressure, relativeAltitude }) => {
      if (baselineRef.current === null) baselineRef.current = pressure;

      const diferenca = pressure - baselineRef.current;
      const forca = Math.max(0, Math.abs(diferenca) - BLOW_DEADZONE) / (BLOW_FULL_STRENGTH - BLOW_DEADZONE);
      blowStrengthRef.current = Math.min(1, forca);

      setBlowing(blowStrengthRef.current > 0);
      setReading({ pressure, relativeAltitude });
      setDelta(diferenca);
      setStrength(blowStrengthRef.current);
    });

    return () => subscription.remove();
  }, [status]);

  // loop do jogo: só física do balão — sopra sobe, solta desce
  useEffect(() => {
    if (status !== 'playing') return;

    const loop = setInterval(() => {
      velocityRef.current += blowStrengthRef.current > 0 ? THRUST * blowStrengthRef.current : -GRAVITY;
      velocityRef.current = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, velocityRef.current));

      let novoY = balloonYRef.current - velocityRef.current;
      novoY = Math.max(0, Math.min(SKY_HEIGHT - BALLOON_SIZE, novoY));
      if (novoY === 0 || novoY === SKY_HEIGHT - BALLOON_SIZE) velocityRef.current = 0;
      balloonYRef.current = novoY;
      setBalloonY(novoY);

      const percentAltura = Math.round((1 - novoY / (SKY_HEIGHT - BALLOON_SIZE)) * 100);
      if (percentAltura > bestPercentRef.current) {
        bestPercentRef.current = percentAltura;
        setBestPercent(percentAltura);
      }
    }, TICK_MS);

    return () => clearInterval(loop);
  }, [status]);

  function startGame() {
    velocityRef.current = 0;
    balloonYRef.current = SKY_HEIGHT / 2;
    bestPercentRef.current = 0;
    baselineRef.current = null;
    blowStrengthRef.current = 0;
    setBalloonY(SKY_HEIGHT / 2);
    setBestPercent(0);
    setBlowing(false);
    setDelta(0);
    setStrength(0);
    setCountdown(COUNTDOWN_START);
    setSecondsLeft(ROUND_SECONDS);
    setStatus('countdown');
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Sopre pra fazer o balão subir</Text>
        <Text style={styles.subtitle}>
          {status === 'playing'
            ? 'quanto mais alto você chegar, melhor'
            : status === 'finished'
              ? 'tempo esgotado!'
              : 'sopre bem perto do microfone do celular pra subir'}
        </Text>
        {Platform.OS === 'web' && status === 'playing' && (
          <Text style={styles.webNotice}>sensor de pressão só funciona no celular, não no navegador</Text>
        )}
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{secondsLeft}s</Text>
        </View>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{bestPercent}%</Text>
        </View>
      </View>

      <View style={styles.sky}>
        <Text style={styles.cloudDeco}>☁️</Text>
        <Text style={[styles.cloudDeco, styles.cloudDecoRight]}>☁️</Text>

        <Text
          style={[
            styles.balloon,
            {
              left: SKY_WIDTH / 2 - BALLOON_SIZE / 2,
              top: balloonY,
              transform: [{ rotate: blowing ? '-8deg' : '8deg' }],
            },
          ]}>
          🎈
        </Text>

        {status === 'countdown' && (
          <View style={styles.overlay}>
            <Text style={styles.countdownText}>{countdown === 0 ? 'Já!' : countdown}</Text>
          </View>
        )}

        {status === 'finished' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Tempo esgotado!</Text>
            <Text style={styles.finalTimeText}>você chegou a {bestPercent}% do topo</Text>
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

      {status === 'playing' && (
        <View style={styles.readings}>
          <Text style={styles.reading}>pressão: {reading.pressure.toFixed(3)} hPa</Text>
          <Text style={styles.reading}>
            desvio: {delta >= 0 ? '+' : ''}
            {delta.toFixed(3)} hPa
          </Text>
          <Text style={[styles.reading, blowing && styles.readingActive]}>
            força do sopro: {Math.round(strength * 100)}%
          </Text>
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
    gap: 12,
    marginTop: 12,
  },
  timer: {
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
  sky: {
    width: SKY_WIDTH,
    height: SKY_HEIGHT,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#5b8fb0',
    borderWidth: 6,
    borderColor: IFSP_GREEN,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  cloudDeco: {
    position: 'absolute',
    top: 24,
    left: 16,
    fontSize: 28,
    opacity: 0.7,
  },
  cloudDecoRight: {
    left: undefined,
    right: 16,
    top: 70,
  },
  balloon: {
    position: 'absolute',
    fontSize: BALLOON_SIZE,
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
    textAlign: 'center',
  },
  finalTimeText: {
    color: '#c4c4c4',
    fontSize: 16,
    textAlign: 'center',
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
  readings: {
    marginTop: 20,
    marginBottom: 16,
    gap: 6,
    backgroundColor: IFSP_GRAY,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  reading: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  readingActive: {
    color: IFSP_GREEN,
  },
});
