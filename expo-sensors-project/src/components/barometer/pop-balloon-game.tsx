import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { Barometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';

// pressão varia uns poucos centésimos de hPa quando você sopra perto do
// microfone/alto-falante — bem menos que os décimos de um sopro "de peito".
// por isso a força do sopro é proporcional, não um gatilho de tudo ou nada:
// abaixo de BLOW_DEADZONE é ruído do sensor; a partir daí, quanto mais perto
// de BLOW_FULL_STRENGTH, mais rápido o balão enche. a baseline é fixada uma
// única vez no começo da rodada (não fica perseguindo a leitura) — assim a
// reação some assim que você solta o ar, sem ficar "grudada"
const BLOW_DEADZONE = 0.01;
const BLOW_FULL_STRENGTH = 0.045;

const FILL_PER_TICK = 1.4; // sopro máximo enche o balão nesse ritmo
const DECAY_PER_TICK = 0.35; // soltar o ar deixa ele murchar um pouco
const TICK_MS = 16;

const POP_DURATION_MS = 600;
const BALLOON_MIN_SCALE = 0.55;
const BALLOON_MAX_SCALE = 1.5;

type Status = 'idle' | 'countdown' | 'playing';

const COUNTDOWN_START = 3;

export function PopBalloonGame({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [meter, setMeter] = useState(0);
  const [popped, setPopped] = useState(false);
  const [poppedCount, setPoppedCount] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [baseline, setBaseline] = useState(0);
  const [delta, setDelta] = useState(0);
  const [strength, setStrength] = useState(0);
  const [blowing, setBlowing] = useState(false);

  const meterRef = useRef(0);
  const baselineRef = useRef<number | null>(null);
  const blowStrengthRef = useRef(0);
  const poppedRef = useRef(false);

  const popScale = useRef(new Animated.Value(0)).current;
  const popSound = useAudioPlayer(require('@/assets/sounds/balloon-pop.wav'));

  useEffect(() => {
    popSound.volume = 1;
    // no iOS, o som fica mudo se o celular estiver no modo silencioso a menos que isso seja ligado
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, [popSound]);

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

  // já liga o barômetro na contagem regressiva, não só quando o jogo começa —
  // alguns aparelhos demoram um pouco pra "esquentar" o sensor na primeira
  // leitura, então é melhor esse tempo ser gasto durante o "3, 2, 1" do que
  // já dentro da rodada. a baseline é fixada na primeira leitura e não se
  // move mais, então a resposta é instantânea pra começar e pra parar
  const sensorAtivo = status === 'countdown' || status === 'playing';

  useEffect(() => {
    if (!sensorAtivo) return;
    // expo-sensors não tem listener de movimento na web, só em dispositivo real
    if (Platform.OS === 'web') return;

    Barometer.setUpdateInterval(TICK_MS);
    const subscription = Barometer.addListener(({ pressure: leitura }) => {
      if (baselineRef.current === null) {
        baselineRef.current = leitura;
        setBaseline(leitura);
      }

      const diferenca = leitura - baselineRef.current;
      const forca = Math.max(0, Math.abs(diferenca) - BLOW_DEADZONE) / (BLOW_FULL_STRENGTH - BLOW_DEADZONE);
      blowStrengthRef.current = Math.min(1, forca);

      setBlowing(blowStrengthRef.current > 0);
      setPressure(leitura);
      setDelta(diferenca);
      setStrength(blowStrengthRef.current);
    });

    return () => subscription.remove();
    // a mesma assinatura continua entre a contagem e a partida — só reinicia
    // quando o sensor liga ou desliga de vez, não a cada troca de status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorAtivo]);

  // loop do jogo: enche o balão enquanto sopra, murcha um pouco quando solta
  useEffect(() => {
    if (status !== 'playing') return;

    const loop = setInterval(() => {
      if (poppedRef.current) return;

      const proximo =
        meterRef.current + (blowStrengthRef.current > 0 ? FILL_PER_TICK * blowStrengthRef.current : -DECAY_PER_TICK);
      meterRef.current = Math.max(0, Math.min(100, proximo));
      setMeter(meterRef.current);

      if (meterRef.current >= 100) pop();
    }, TICK_MS);

    return () => clearInterval(loop);
  }, [status]);

  function pop() {
    poppedRef.current = true;
    setPopped(true);
    setPoppedCount((c) => c + 1);

    // zera tudo, inclusive a baseline: se ainda estiver soprando quando o
    // balão estoura, a próxima leitura (mesmo que ainda "alta") vira a nova
    // referência — isso exige soltar e soprar de novo pra encher o próximo,
    // em vez de um sopro contínuo estourando vários balões em sequência
    baselineRef.current = null;
    blowStrengthRef.current = 0;
    setBaseline(0);
    setDelta(0);
    setStrength(0);
    setBlowing(false);

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

    popScale.setValue(0);
    Animated.timing(popScale, {
      toValue: 1,
      duration: POP_DURATION_MS,
      useNativeDriver: true,
    }).start(() => {
      poppedRef.current = false;
      meterRef.current = 0;
      setMeter(0);
      setPopped(false);
    });
  }

  function startGame() {
    meterRef.current = 0;
    baselineRef.current = null;
    blowStrengthRef.current = 0;
    poppedRef.current = false;
    setMeter(0);
    setPopped(false);
    setPoppedCount(0);
    setBlowing(false);
    setBaseline(0);
    setDelta(0);
    setStrength(0);
    setCountdown(COUNTDOWN_START);
    setStatus('countdown');
  }

  const balloonScale = BALLOON_MIN_SCALE + (meter / 100) * (BALLOON_MAX_SCALE - BALLOON_MIN_SCALE);
  const balloonColor = meter > 80 ? '#e05555' : meter > 50 ? '#e0b955' : IFSP_GREEN;

  const burstScale = popScale.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1.4, 1.8] });
  const burstOpacity = popScale.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] });

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Sopre pra estourar o balão</Text>
        <Text style={styles.subtitle}>
          {status === 'playing'
            ? 'sopre sem parar bem perto do microfone até ele estourar'
            : 'aumente a pressão soprando no celular até o balão não aguentar mais'}
        </Text>
        {Platform.OS === 'web' && status === 'playing' && (
          <Text style={styles.webNotice}>sensor de pressão só funciona no celular, não no navegador</Text>
        )}
      </View>

      {status === 'playing' && (
        <View style={styles.badgeRow}>
          <View style={styles.timer}>
            <Text style={styles.timerText}>{poppedCount} 💥</Text>
          </View>
        </View>
      )}

      {(status === 'countdown' || status === 'playing') && (
        <View style={styles.readings}>
          <Text style={styles.reading}>pressão: {pressure.toFixed(3)} hPa</Text>
          <Text style={styles.reading}>referência: {baseline.toFixed(3)} hPa</Text>
          <Text style={styles.reading}>
            desvio: {delta >= 0 ? '+' : ''}
            {delta.toFixed(3)} hPa
          </Text>
          <Text style={[styles.reading, blowing && styles.readingActive]}>
            força do sopro: {Math.round(strength * 100)}%
          </Text>
        </View>
      )}

      <View style={styles.stage}>
        {!popped && (
          <View
            style={[
              styles.balloon,
              { backgroundColor: balloonColor, transform: [{ scale: balloonScale }] },
            ]}>
            <View style={styles.balloonKnot} />
          </View>
        )}

        {popped && (
          <Animated.Text
            style={[styles.burst, { opacity: burstOpacity, transform: [{ scale: burstScale }] }]}>
            💥
          </Animated.Text>
        )}

        {!popped && (
          <View style={styles.meterBar}>
            <View style={[styles.meterFill, { height: `${meter}%`, backgroundColor: balloonColor }]} />
          </View>
        )}

        {status === 'countdown' && (
          <View style={styles.overlay}>
            <Text style={styles.countdownText}>{countdown === 0 ? 'Já!' : countdown}</Text>
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
  stage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 24,
  },
  balloon: {
    width: 120,
    height: 140,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  balloonKnot: {
    position: 'absolute',
    bottom: -10,
    width: 10,
    height: 12,
    borderRadius: 4,
    backgroundColor: IFSP_GRAY,
  },
  burst: {
    fontSize: 80,
    position: 'absolute',
  },
  meterBar: {
    width: 28,
    height: 160,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: IFSP_GREEN,
    backgroundColor: IFSP_GRAY,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  meterFill: {
    width: '100%',
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
    marginTop: 12,
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
