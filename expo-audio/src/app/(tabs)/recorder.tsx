/**
 * Tela "Gravar": a parte de gravação do expo-audio.  [Slides 14 a 17]
 *
 * Fluxo: pedir permissão, configurar a sessão (allowsRecording),
 * prepareToRecordAsync(), record(), stop(). O arquivo fica em recorder.uri.
 */
import { Ionicons } from '@expo/vector-icons';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PLAYBACK_MODE, RECORDING_MODE } from '@/audio/audioMode';
import { usePlayer } from '@/audio/PlayerContext';
import { colors } from '@/theme/colors';
import { formatTime } from '@/utils/formatTime';

type Recording = { uri: string; duration: number; createdAt: Date };

const BARS = 40;

/** [Slide 17] metering vem em dB (cerca de -160 é silêncio, 0 é o máximo). Normaliza para 0..1. */
function normalizeDb(db: number | undefined) {
  if (db == null) return 0;
  const min = -60;
  return Math.max(0, Math.min(1, (db - min) / -min));
}

export default function RecorderScreen() {
  const { player: musicPlayer } = usePlayer();

  // [Slide 15] Recorder com preset de alta qualidade e metering ligado.
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  // Atualiza o estado a cada 100ms (padrão 500ms) para o medidor ficar fluido.
  const recorderState = useAudioRecorderState(recorder, 100);

  // Um SEGUNDO player, só para ouvir as gravações. Dá pra ter vários players!
  const preview = useAudioPlayer(null);
  const previewStatus = useAudioPlayerStatus(preview);

  const [granted, setGranted] = useState<boolean | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [levels, setLevels] = useState<number[]>([]);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  // [Slide 14] Permissão de microfone.
  useEffect(() => {
    requestRecordingPermissionsAsync().then((res) => setGranted(res.granted));
  }, []);

  // [Slide 17] Enquanto grava, lê o metering a cada 100ms (getStatus) e guarda o
  // histórico para desenhar as barrinhas.
  const isRecording = recorderState.isRecording;
  useEffect(() => {
    if (!isRecording) return;
    const id = setInterval(() => {
      const level = normalizeDb(recorder.getStatus().metering);
      setLevels((l) => [...l.slice(-(BARS - 1)), level]);
    }, 100);
    return () => clearInterval(id);
  }, [isRecording, recorder]);

  // [Slide 16] Começar a gravar.
  async function start() {
    musicPlayer.pause(); // não dá pra gravar com música tocando no fundo
    preview.pause();
    await setAudioModeAsync(RECORDING_MODE);
    setLevels([]);
    await recorder.prepareToRecordAsync();
    recorder.record();
  }

  // [Slide 16] Parar: o arquivo fica disponível em recorder.uri.
  async function stop() {
    const duration = recorderState.durationMillis / 1000;
    await recorder.stop();
    await setAudioModeAsync(PLAYBACK_MODE); // volta ao modo de reprodução: microfone fechado
    const uri = recorder.uri;
    if (uri) setRecordings((r) => [{ uri, duration, createdAt: new Date() }, ...r]);
  }

  function togglePreview(uri: string) {
    if (previewUri === uri && previewStatus.playing) {
      preview.pause();
      return;
    }
    musicPlayer.pause();
    if (previewUri !== uri) {
      preview.replace(uri);
      setPreviewUri(uri);
    } else if (previewStatus.didJustFinish || previewStatus.currentTime >= previewStatus.duration - 0.1) {
      preview.seekTo(0);
    }
    preview.play();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.wrap}>
        <Text style={styles.h1}>Gravar áudio</Text>
        <Text style={styles.muted}>useAudioRecorder + useAudioRecorderState</Text>

        {granted === false && (
          <Text style={styles.warn}>Permissão de microfone negada. Libere nas configurações do aparelho.</Text>
        )}

        <View style={styles.card}>
          <Text style={styles.timer}>{formatTime(recorderState.durationMillis / 1000)}</Text>

          <View style={styles.meter}>
            {Array.from({ length: BARS }).map((_, i) => {
              const level = levels[i - (BARS - levels.length)] ?? 0;
              return (
                <View
                  key={i}
                  style={[
                    styles.bar,
                    { height: 4 + level * 76, backgroundColor: isRecording ? colors.danger : colors.border },
                  ]}
                />
              );
            })}
          </View>

          <Pressable
            disabled={!granted}
            onPress={isRecording ? stop : start}
            style={[styles.recBtn, !granted && { opacity: 0.4 }]}
          >
            <View style={isRecording ? styles.stopIcon : styles.recIcon} />
          </Pressable>
          <Text style={styles.muted}>
            {isRecording ? 'Gravando… toque para parar' : 'Toque para gravar'}
          </Text>
          <Text style={styles.meta}>
            metering: {recorderState.metering?.toFixed(1) ?? '-'} dB · canRecord: {String(recorderState.canRecord)}
          </Text>
        </View>

        <Text style={styles.h2}>Suas gravações</Text>
        <FlatList
          data={recordings}
          keyExtractor={(r) => r.uri}
          ListEmptyComponent={<Text style={styles.muted}>Nada gravado ainda.</Text>}
          renderItem={({ item, index }) => {
            const active = previewUri === item.uri;
            const playing = active && previewStatus.playing;
            return (
              <Pressable style={styles.row} onPress={() => togglePreview(item.uri)}>
                <Ionicons name={playing ? 'pause-circle' : 'play-circle'} size={40} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>Gravação {recordings.length - index}</Text>
                  <Text style={styles.muted}>
                    {item.createdAt.toLocaleTimeString()} ·{' '}
                    {active ? `${formatTime(previewStatus.currentTime)} / ` : ''}
                    {formatTime(item.duration)}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  wrap: { flex: 1, padding: 16, maxWidth: 720, width: '100%', alignSelf: 'center' },
  h1: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 8 },
  h2: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 24, marginBottom: 8 },
  muted: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  warn: { color: colors.danger, marginTop: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timer: { color: colors.text, fontSize: 44, fontWeight: '200', fontVariant: ['tabular-nums'] },
  meter: { flexDirection: 'row', alignItems: 'center', height: 84, gap: 3, marginVertical: 12 },
  bar: { width: 4, borderRadius: 2 },
  recBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  recIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.danger },
  stopIcon: { width: 28, height: 28, borderRadius: 4, backgroundColor: colors.danger },
  meta: { color: colors.textMuted, fontSize: 11, marginTop: 10, fontFamily: 'monospace' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
