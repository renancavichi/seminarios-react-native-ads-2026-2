import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePlayer } from '@/audio/PlayerContext';
import { colors } from '@/theme/colors';
import { formatTime } from '@/utils/formatTime';

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * Tela "Tocando agora". Tudo aqui é UI em cima do PlayerContext:
 * lê `status` e chama as ações (togglePlay, seek, next...).
 */
export default function PlayerScreen() {
  const {
    current, status, togglePlay, next, previous, seek,
    shuffle, toggleShuffle, repeat, cycleRepeat, setRate, volume, setVolume,
  } = usePlayer();

  // Enquanto o usuário arrasta a barra, a tela mostra o valor do dedo
  // e não o currentTime (senão a bolinha "briga" com o dedo).
  const [scrubbing, setScrubbing] = useState<number | null>(null);

  if (!current) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <Text style={styles.muted}>Nenhuma música tocando.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const position = scrubbing ?? status.currentTime;

  const debugRows: [string, unknown][] = [
    ['playing', status.playing],
    ['isLoaded', status.isLoaded],
    ['isBuffering', status.isBuffering],
    ['currentTime', status.currentTime.toFixed(2)],
    ['duration', status.duration.toFixed(2)],
    ['playbackRate', status.playbackRate],
    ['loop', status.loop],
    ['didJustFinish', status.didJustFinish],
    ['error', status.error ?? 'null'],
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: current.color }]}>
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-down" size={30} color={colors.text} />
          </Pressable>
          <Text style={styles.topLabel}>Tocando agora</Text>
          <View style={{ width: 30 }} />
        </View>

        <Image source={{ uri: current.artwork }} style={styles.art} />

        <Text style={styles.title} numberOfLines={1}>{current.title}</Text>
        <Text style={styles.artist}>{current.artist} · {current.album}</Text>

        {/* [Slide 10] Barra de progresso: value = currentTime; ao soltar, seekTo */}
        <Slider
          style={{ width: '100%', height: 40, marginTop: 12 }}
          minimumValue={0}
          maximumValue={Math.max(status.duration, 1)}
          value={position}
          onValueChange={setScrubbing}
          onSlidingComplete={(v) => {
            seek(v);
            setScrubbing(null);
          }}
          minimumTrackTintColor={colors.text}
          maximumTrackTintColor="#FFFFFF44"
          thumbTintColor={colors.text}
        />
        <View style={styles.times}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(status.duration)}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable onPress={toggleShuffle} hitSlop={10}>
            <Ionicons name="shuffle" size={26} color={shuffle ? colors.text : '#FFFFFF77'} />
            {shuffle && <View style={styles.dot} />}
          </Pressable>
          <Pressable onPress={previous} hitSlop={10}>
            <Ionicons name="play-skip-back" size={34} color={colors.text} />
          </Pressable>
          <Pressable onPress={togglePlay} style={styles.playBtn}>
            {status.isBuffering && !status.playing ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Ionicons name={status.playing ? 'pause' : 'play'} size={36} color={colors.bg} />
            )}
          </Pressable>
          <Pressable onPress={next} hitSlop={10}>
            <Ionicons name="play-skip-forward" size={34} color={colors.text} />
          </Pressable>
          <Pressable onPress={cycleRepeat} hitSlop={10}>
            <Ionicons name="repeat" size={26} color={repeat !== 'off' ? colors.text : '#FFFFFF77'} />
            {repeat === 'one' && <Text style={styles.repeatOne}>1</Text>}
            {repeat !== 'off' && <View style={styles.dot} />}
          </Pressable>
        </View>

        {/* [Slide 21] Velocidade de reprodução */}
        <Text style={styles.label}>Velocidade</Text>
        <View style={styles.rates}>
          {RATES.map((r) => {
            const active = Math.abs(status.playbackRate - r) < 0.01;
            return (
              <Pressable key={r} onPress={() => setRate(r)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && { color: colors.bg }]}>{r}x</Text>
              </Pressable>
            );
          })}
        </View>

        {/* [Slide 21] Volume do player (0 a 1) */}
        <Text style={styles.label}>Volume</Text>
        <View style={styles.volume}>
          <Ionicons name="volume-low" size={20} color={colors.text} />
          <Slider
            style={{ flex: 1, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor={colors.text}
            maximumTrackTintColor="#FFFFFF44"
            thumbTintColor={colors.text}
          />
          <Ionicons name="volume-high" size={20} color={colors.text} />
        </View>

        {/* Painel de debug: mostra o AudioStatus ao vivo, útil na apresentação */}
        <Text style={styles.label}>AudioStatus (ao vivo)</Text>
        <View style={styles.debug}>
          {debugRows.map(([k, v]) => (
            <Text key={k} style={styles.debugLine}>
              <Text style={{ color: '#9A9A9A' }}>{k}</Text>: {String(v)}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#121212B8' },
  content: { padding: 24, paddingBottom: 48, maxWidth: 520, width: '100%', alignSelf: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topLabel: { color: colors.text, fontSize: 14, fontWeight: '600' },
  art: { width: '100%', aspectRatio: 1, borderRadius: 6, marginTop: 24, backgroundColor: colors.surfaceAlt },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 24 },
  artist: { color: '#FFFFFFB0', fontSize: 15, marginTop: 4 },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { color: '#FFFFFFB0', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.text, alignSelf: 'center', marginTop: 2 },
  repeatOne: { position: 'absolute', top: -6, right: -6, color: colors.text, fontSize: 10, fontWeight: '900' },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 28, marginBottom: 10 },
  rates: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#FFFFFF55' },
  chipActive: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { color: colors.text, fontWeight: '700' },
  volume: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  debug: { backgroundColor: '#00000066', borderRadius: 10, padding: 12 },
  debugLine: { color: colors.text, fontFamily: 'monospace', fontSize: 13, lineHeight: 20 },
  muted: { color: colors.textMuted },
  link: { color: colors.accent, fontWeight: '700' },
});
