import { Pedometer } from 'expo-sensors';
import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { IFSP_GRAY, IFSP_GRAY_DARK, IFSP_GREEN } from '@/constants/ifsp-colors';

const DAYS_BACK = 7;
const WEEKDAY_LABEL = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

type DayOption = { label: string; weekday: string; start: Date; end: Date };

// getStepCountAsync só existe no iOS e só enxerga os últimos 7 dias — monta
// os limites de cada dia (meia-noite a meia-noite) pra consultar um por vez
function buildDayOptions(): DayOption[] {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return Array.from({ length: DAYS_BACK }, (_, i) => {
    const start = new Date(hoje);
    start.setDate(hoje.getDate() - i);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return {
      label: i === 0 ? 'Hoje' : i === 1 ? 'Ontem' : `${start.getDate()}/${start.getMonth() + 1}`,
      weekday: WEEKDAY_LABEL[start.getDay()],
      start,
      end,
    };
  });
}

type Result = { steps: number } | 'loading' | 'error' | null;

export function StepHistory({ onBack }: { onBack: () => void }) {
  const [days] = useState<DayOption[]>(buildDayOptions);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [permissionState, setPermissionState] = useState<'idle' | 'no-permission'>('idle');

  const unsupported = Platform.OS !== 'ios';

  async function selectDay(index: number) {
    if (unsupported) return;

    setSelectedIndex(index);
    setResult('loading');

    const { granted } = await Pedometer.requestPermissionsAsync();
    if (!granted) {
      setPermissionState('no-permission');
      setResult(null);
      return;
    }
    setPermissionState('idle');

    try {
      const { steps } = await Pedometer.getStepCountAsync(days[index].start, days[index].end);
      setResult({ steps });
    } catch {
      setResult('error');
    }
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={onBack} />

      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Passos</Text>
        <Text style={styles.subtitle}>escolha um dia dos últimos 7 pra ver quantos passos você deu</Text>
        {unsupported && (
          <Text style={styles.webNotice}>
            Pedometer.getStepCountAsync só funciona no iOS — no Android e na web esse histórico não existe
          </Text>
        )}
        {permissionState === 'no-permission' && (
          <Text style={styles.webNotice}>autorize o acesso à Atividade Física nas configurações do celular</Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRow}>
        {days.map((day, index) => (
          <Pressable
            key={day.start.toISOString()}
            style={[styles.dayChip, selectedIndex === index && styles.dayChipSelected]}
            disabled={unsupported}
            onPress={() => selectDay(index)}>
            <Text style={styles.dayWeekday}>{day.weekday}</Text>
            <Text style={styles.dayLabel}>{day.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.resultCard}>
        {result === null && <Text style={styles.resultHint}>toque num dia acima</Text>}
        {result === 'loading' && <ActivityIndicator color={IFSP_GREEN} size="large" />}
        {result === 'error' && <Text style={styles.resultHint}>não deu pra buscar esse dia</Text>}
        {result !== null && result !== 'loading' && result !== 'error' && (
          <>
            <Text style={styles.resultSteps}>{result.steps}</Text>
            <Text style={styles.resultLabel}>
              passos {selectedIndex !== null ? `em ${days[selectedIndex].label.toLowerCase()}` : ''}
            </Text>
          </>
        )}
      </View>

      {selectedIndex !== null && (
        <View style={styles.readings}>
          <Text style={styles.reading}>Pedometer.getStepCountAsync</Text>
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
  dayRow: {
    marginTop: 28,
    paddingHorizontal: 24,
    gap: 10,
  },
  dayChip: {
    alignItems: 'center',
    backgroundColor: IFSP_GRAY,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    minWidth: 64,
  },
  dayChipSelected: {
    backgroundColor: IFSP_GREEN,
  },
  dayWeekday: {
    color: '#c4c4c4',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  dayLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  resultCard: {
    marginTop: 40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#3a3a3a',
    borderWidth: 6,
    borderColor: IFSP_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultHint: {
    color: '#c4c4c4',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  resultSteps: {
    color: IFSP_GREEN,
    fontSize: 56,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  resultLabel: {
    color: '#c4c4c4',
    fontSize: 14,
    marginTop: 4,
  },
  readings: {
    marginTop: 24,
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
