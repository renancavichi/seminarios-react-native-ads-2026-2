import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BALL_SIZE = 50;
const BOARD_WIDTH = SCREEN_WIDTH * 0.8;
const BOARD_HEIGHT = SCREEN_HEIGHT * 0.4;
const BOARD_PADDING = 20;
const MIN_X = BOARD_PADDING;
const MAX_X = BOARD_WIDTH - BALL_SIZE - BOARD_PADDING;
const MIN_Y = BOARD_PADDING;
const MAX_Y = BOARD_HEIGHT - BALL_SIZE - BOARD_PADDING;
const CENTER_POS = { x: BOARD_WIDTH / 2 - BALL_SIZE / 2, y: BOARD_HEIGHT / 2 - BALL_SIZE / 2 };
const COUNTDOWN_START = 3;

type Status = 'idle' | 'countdown' | 'playing' | 'gameover';

export function BallGame({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [pos, setPos] = useState(CENTER_POS);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'countdown') return;

    if (countdown === 0) {
      setStatus('playing');
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown]);


  useEffect(() => {
    if (status !== 'playing') return;
    // expo-sensors has no motion listener on web, only on real devices
    if (Platform.OS === 'web') return;

    Accelerometer.setUpdateInterval(16);
    // cada leitura vem como { x, y, z } em "g" (1g = gravidade da Terra, parada = ~1 num dos eixos).
    // com o celular na vertical: x = eixo esquerda/direita, y = eixo cima/baixo (na tela),
    // z = eixo entrando/saindo da tela. inclinar o celular muda o quanto a gravidade "puxa"
    // cada eixo, e é essa mudança que a gente lê aqui pra saber pra que lado mover a bolinha.
    const subscription = Accelerometer.addListener((leitura) => {
      setData(leitura); // só guardado pra mostrar x/y/z na tela, não é usado no cálculo abaixo

      setPos((atual) => {
        // x controla o movimento horizontal da bolinha: inclinar pra direita deixa x negativo
        // (por isso somamos, não subtraímos), e a bolinha desliza pra direita.
        // y controla o vertical: inclinar "pra frente" (celular deitando) deixa y positivo,
        // por isso aqui SUBTRAÍMOS — sem o sinal invertido a bolinha andaria ao contrário do
        // que a gente espera olhando pra tela.
        // o "* 15" é só sensibilidade: um valor de leitura pequeno (ex: 0.1g) já move a
        // bolinha vários pixels; sem multiplicar, precisaria inclinar muito pra ela andar.
        const novoX = atual.x + leitura.x * 15;
        const novoY = atual.y - leitura.y * 15;

        // z (o quanto o celular está "de frente" ou "de lado") não entra na conta —
        // esse jogo só olha inclinação nos dois eixos da tela, não rotação em torno dela.
        const fellOffBoard = novoX < MIN_X || novoX > MAX_X || novoY < MIN_Y || novoY > MAX_Y;

        if (fellOffBoard) {
          setStatus('gameover');
          return atual;
        }

        return { x: novoX, y: novoY };
      });
    });

    return () => subscription.remove();
  }, [status]);

  function startGame() {
    setPos(CENTER_POS);
    setCountdown(COUNTDOWN_START);
    setElapsedSeconds(0);
    setStatus('countdown');
  }

  const { x, y, z } = data;

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Incline o celular</Text>
        <Text style={styles.subtitle}>
          {status === 'playing'
            ? 'não deixe a bolinha cair da tábua'
            : status === 'gameover'
              ? 'a bolinha caiu!'
              : 'equilibre a bolinha na tábua de madeira'}
        </Text>
        {Platform.OS === 'web' && status === 'playing' && (
          <Text style={styles.webNotice}>sensor de movimento só funciona no celular, não no navegador</Text>
        )}
      </View>

      <View style={styles.timer}>
        <Text style={styles.timerText}>{elapsedSeconds}s</Text>
      </View>

      <View style={styles.board}>
        <View style={[styles.ball, { left: pos.x, top: pos.y }]} />

        {status === 'countdown' && (
          <View style={styles.overlay}>
            <Text style={styles.countdownText}>{countdown === 0 ? 'Já!' : countdown}</Text>
          </View>
        )}

        {status === 'gameover' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.finalTimeText}>você aguentou {elapsedSeconds}s</Text>
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
          <Text style={styles.reading}>x: {x.toFixed(2)}</Text>
          <Text style={styles.reading}>y: {y.toFixed(2)}</Text>
          <Text style={styles.reading}>z: {z.toFixed(2)}</Text>
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
  board: {
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    marginTop: 32,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: IFSP_GREEN,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: IFSP_GREEN,
    shadowColor: IFSP_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
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
  timer: {
    marginTop: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
