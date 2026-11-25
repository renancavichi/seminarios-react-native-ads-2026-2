import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getTaskState, registerTask, triggerTestWorker, unregisterTask } from '../background/background-tasks';
import { loadSettings } from '../background/settings';
import { DEFAULT_SETTINGS } from '../background/settings-validation';

type Mode = 'real' | 'experimental';

/** Apresenta as configurações e os controles para os dois modos de execução. */
export default function HomeScreen() {
  const [message, setMessage] = useState(DEFAULT_SETTINGS.message);
  const [interval, setInterval] = useState(String(DEFAULT_SETTINGS.minimumInterval));
  const [mode, setMode] = useState<Mode>('real');
  const [state, setState] = useState<{ available: boolean; registered: boolean } | null>(null);
  const [busy, setBusy] = useState(true);
  const [feedback, setFeedback] = useState('');

  const refresh = useCallback(async () => {
    setState(await getTaskState());
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const settings = await loadSettings();
        setMessage(settings.message);
        setInterval(String(settings.minimumInterval));
        await refresh();
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Não foi possível carregar as configurações.');
      } finally {
        setBusy(false);
      }
    }
    void initialize();
  }, [refresh]);

  /** Valida e registra a tarefa antes de agendar ou acionar o teste. */
  async function handleRun() {
    setBusy(true);
    setFeedback('');
    try {
      if (!/^\d+$/.test(interval.trim())) throw new Error('Informe um intervalo inteiro de pelo menos 15 minutos.');
      if (mode === 'experimental' && !__DEV__) throw new Error('O teste experimental só está disponível em desenvolvimento.');
      const settings = await registerTask({ message, minimumInterval: Number(interval) });
      setMessage(settings.message);
      setInterval(String(settings.minimumInterval));
      if (mode === 'experimental') {
        await triggerTestWorker();
        setFeedback('Disparo solicitado. Confira a notificação e os logs do aplicativo.');
      } else {
        setFeedback('Tarefa agendada. O sistema decidirá quando executá-la.');
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Não foi possível executar esta ação.');
    } finally {
      try { await refresh(); } catch { setState(null); }
      setBusy(false);
    }
  }

  /** Cancela o registro e atualiza o estado mostrado na tela. */
  async function handleCancel() {
    setBusy(true);
    setFeedback('');
    try {
      await unregisterTask();
      setFeedback('Tarefa cancelada.');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Não foi possível cancelar a tarefa.');
    } finally {
      try { await refresh(); } catch { setState(null); }
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled">
        <Text accessibilityRole="header" style={styles.title}>Background Tasks</Text>
        <Text style={styles.subtitle}>Teste tarefas em segundo plano com notificações locais.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configuração</Text>
          <Text style={styles.label}>Mensagem da notificação</Text>
          <TextInput accessibilityLabel="Mensagem da notificação" style={styles.input} value={message} onChangeText={setMessage} placeholder={DEFAULT_SETTINGS.message} multiline />
          <Text style={styles.label}>Intervalo mínimo em minutos</Text>
          <TextInput accessibilityLabel="Intervalo mínimo em minutos" style={styles.input} value={interval} onChangeText={setInterval} keyboardType="number-pad" />
          <Text style={styles.hint}>Mínimo de 15 minutos. O sistema escolhe o horário real.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Modo de execução</Text>
          {(['real', 'experimental'] as const).map((item) => (
            <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: mode === item }} onPress={() => setMode(item)} style={[styles.option, mode === item && styles.optionSelected]}>
              <Text style={styles.optionTitle}>{item === 'real' ? 'Agendamento real' : 'Disparo experimental'}</Text>
              <Text style={styles.hint}>{item === 'real' ? 'Aguarda a execução pelo sistema.' : 'Solicita o worker em desenvolvimento; no Android, em primeiro plano, ele pode não executar.'}</Text>
            </Pressable>
          ))}
          <Text style={styles.status} accessibilityLiveRegion="polite">
            {state === null ? 'Estado: desconhecido' : `Serviço: ${state.available ? 'disponível' : 'indisponível'} · Tarefa: ${state.registered ? 'registrada' : 'não registrada'}`}
          </Text>
          <Pressable accessibilityRole="button" disabled={busy || !state?.available} onPress={handleRun} style={[styles.button, (busy || !state?.available) && styles.disabled]}>
            <Text style={styles.buttonText}>{mode === 'real' ? 'Agendar tarefa' : 'Disparar teste'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={busy || !state?.registered} onPress={handleCancel} style={[styles.secondaryButton, (busy || !state?.registered) && styles.disabled]}>
            <Text style={styles.secondaryText}>Cancelar tarefa</Text>
          </Pressable>
          {busy && <ActivityIndicator accessibilityLabel="Processando" />}
          {!!feedback && <Text selectable accessibilityLiveRegion="polite" style={styles.feedback}>{feedback}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f5f9' },
  content: { padding: 24, paddingTop: 64, paddingBottom: 48, gap: 18 },
  title: { color: '#17233d', fontSize: 30, fontWeight: '700' },
  subtitle: { color: '#52617a', fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, gap: 12 },
  sectionTitle: { color: '#17233d', fontSize: 18, fontWeight: '700' },
  label: { color: '#263650', fontSize: 15, fontWeight: '600' },
  input: { borderColor: '#c9d2df', borderWidth: 1, borderRadius: 10, padding: 12, color: '#17233d', minHeight: 48 },
  hint: { color: '#596983', fontSize: 13, lineHeight: 19 },
  option: { borderWidth: 1, borderColor: '#d5ddea', borderRadius: 10, padding: 12, gap: 4 },
  optionSelected: { borderColor: '#315dd5', backgroundColor: '#eef3ff' },
  optionTitle: { color: '#17233d', fontWeight: '600', fontSize: 15 },
  status: { color: '#344966', lineHeight: 20 },
  button: { backgroundColor: '#315dd5', borderRadius: 10, padding: 15, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  secondaryButton: { borderColor: '#315dd5', borderWidth: 1, borderRadius: 10, padding: 14, alignItems: 'center' },
  secondaryText: { color: '#315dd5', fontWeight: '700', fontSize: 15 },
  disabled: { opacity: 0.45 },
  feedback: { color: '#263650', lineHeight: 21 },
});
