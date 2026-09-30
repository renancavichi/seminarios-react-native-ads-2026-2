import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';

type Status = 'idle' | 'no-permission' | 'unavailable' | 'counting' | 'stopped';

export function StepCounter({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [steps, setSteps] = useState(0);

  // pedômetro só escuta enquanto está contando — watchStepCount entrega o
  // total acumulado de passos desde que a assinatura começou
  useEffect(() => {
    if (status !== 'counting') return;
    // expo-sensors não tem contagem de passos na web, só em dispositivo real
    if (Platform.OS === 'web') return;

    const subscription = Pedometer.watchStepCount(({ steps: contagem }) => {
      setSteps(contagem);
    });

    return () => subscription.remove();
  }, [status]);

  async function start() {
    if (Platform.OS !== 'web') {
      // separa os dois motivos mais comuns de "não conta nada": sensor
      // ausente no aparelho (comum em emuladores) vs. permissão negada
      const disponivel = await Pedometer.isAvailableAsync();
      if (!disponivel) {
        setStatus('unavailable');
        return;
      }

      const { granted } = await Pedometer.requestPermissionsAsync();
      if (!granted) {
        setStatus('no-permission');
        return;
      }
    }

    setSteps(0);
    setStatus('counting');
  }

  function stop() {
    setStatus('stopped');
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Contador de Passos</Text>
        <Text style={styles.subtitle}>
          {status === 'counting'
            ? 'ande ou marche no lugar com o celular no bolso ou na mão'
            : 'toque em iniciar e comece a andar'}
        </Text>
        {Platform.OS === 'web' && status === 'counting' && (
          <Text style={styles.webNotice}>contador de passos só funciona no celular, não no navegador</Text>
        )}
        {status === 'no-permission' && (
          <Text style={styles.webNotice}>autorize o acesso à Atividade Física nas configurações do celular</Text>
        )}
        {status === 'unavailable' && (
          <Text style={styles.webNotice}>
            este aparelho não tem sensor de contagem de passos (comum em emuladores/simuladores — teste num celular
            de verdade)
          </Text>
        )}
      </View>

      <View style={styles.stepsBig}>
        <Text style={styles.stepsBigText}>{steps}</Text>
        <Text style={styles.stepsBigLabel}>passos</Text>
      </View>

      {status !== 'counting' ? (
        <Pressable style={styles.button} onPress={start}>
          <Text style={styles.buttonText}>{status === 'stopped' ? 'Contar de novo' : 'Iniciar'}</Text>
        </Pressable>
      ) : (
        <Pressable style={[styles.button, styles.buttonStop]} onPress={stop}>
          <Text style={styles.buttonText}>Parar</Text>
        </Pressable>
      )}

      {status === 'counting' && (
        <View style={styles.readings}>
          <Text style={styles.reading}>Pedometer.watchStepCount</Text>
          <Text style={styles.reading}>steps: {steps}</Text>
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
    justifyContent: 'center',
    gap: 32,
  },
  header: {
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
  stepsBig: {
    alignItems: 'center',
  },
  stepsBigText: {
    color: IFSP_GREEN,
    fontSize: 96,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  stepsBigLabel: {
    color: '#c4c4c4',
    fontSize: 16,
    marginTop: -8,
  },
  button: {
    backgroundColor: IFSP_GREEN,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 16,
  },
  buttonStop: {
    backgroundColor: '#b04040',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  readings: {
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
});
