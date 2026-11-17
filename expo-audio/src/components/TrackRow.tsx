import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Track } from '@/data/tracks';
import { colors } from '@/theme/colors';

type Props = {
  track: Track;
  position: number;
  active: boolean;
  playing: boolean;
  onPress: () => void;
};

export function TrackRow({ track, position, active, playing, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <View style={styles.position}>
        {active && playing ? (
          <Ionicons name="volume-medium" size={16} color={colors.accent} />
        ) : (
          <Text style={[styles.positionText, active && { color: colors.accent }]}>{position}</Text>
        )}
      </View>
      <Image source={{ uri: track.artwork }} style={styles.art} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, active && { color: colors.accent }]} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <Text style={styles.album} numberOfLines={1}>
        {track.album}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  position: { width: 20, alignItems: 'center' },
  positionText: { color: colors.textMuted, fontSize: 14, fontVariant: ['tabular-nums'] },
  art: { width: 44, height: 44, borderRadius: 3, backgroundColor: colors.surfaceAlt },
  title: { color: colors.text, fontSize: 15, fontWeight: '500' },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  album: { color: colors.textMuted, fontSize: 13, maxWidth: 110 },
});
