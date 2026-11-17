import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePlayer } from '@/audio/PlayerContext';
import { colors } from '@/theme/colors';

/**
 * Mini player fixo acima das abas. Ele só lê o status do player global,
 * não cria player nenhum. É por isso que a música não para ao trocar de tela.
 */
export function MiniPlayer() {
  const { current, status, togglePlay, next } = usePlayer();
  if (!current) return null;

  // [Slide 7] currentTime e duration vêm em segundos.
  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;

  return (
    <Pressable onPress={() => router.push('/player')} style={[styles.container, { backgroundColor: current.color }]}>
      <View style={styles.row}>
        <Image source={{ uri: current.artwork }} style={styles.art} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{current.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{current.artist}</Text>
        </View>
        {status.isBuffering && !status.playing ? (
          <ActivityIndicator color={colors.text} style={styles.btn} />
        ) : (
          <Pressable onPress={togglePlay} hitSlop={10} style={styles.btn}>
            <Ionicons name={status.playing ? 'pause' : 'play'} size={26} color={colors.text} />
          </Pressable>
        )}
        <Pressable onPress={next} hitSlop={10} style={styles.btn}>
          <Ionicons name="play-skip-forward" size={22} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(progress, 1) * 100}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 8, marginBottom: 6, borderRadius: 10, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 10 },
  art: { width: 42, height: 42, borderRadius: 6, backgroundColor: colors.surfaceAlt },
  title: { color: colors.text, fontWeight: '700', fontSize: 14 },
  artist: { color: '#FFFFFFB0', fontSize: 12, marginTop: 2 },
  btn: { paddingHorizontal: 6 },
  track: { height: 3, backgroundColor: '#FFFFFF33' },
  fill: { height: 3, backgroundColor: colors.text },
});
