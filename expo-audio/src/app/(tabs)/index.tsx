import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePlayer } from '@/audio/PlayerContext';
import { TrackRow } from '@/components/TrackRow';
import { colors } from '@/theme/colors';

export default function Home() {
  const { queue, currentIndex, status, playTrack, shuffle, toggleShuffle } = usePlayer();

  const header = (
    <View>
      <View style={styles.topBar}>
        <Text style={styles.brand}>Sonora</Text>
        <View style={styles.links}>
          <Pressable onPress={() => router.push('/slides')} hitSlop={8} style={styles.slidesLink}>
            <Text style={styles.slidesLinkText}>Slides</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.playlistLabel}>Playlist</Text>
      <Text style={styles.playlistTitle}>Djavan essencial</Text>
      <Text style={styles.meta}>{queue.length} faixas</Text>

      <View style={styles.actions}>
        <Pressable onPress={toggleShuffle} hitSlop={10}>
          <Ionicons name="shuffle" size={24} color={shuffle ? colors.accent : colors.textMuted} />
        </Pressable>
        <Pressable style={styles.playAll} onPress={() => playTrack(0)}>
          <Ionicons name="play" size={24} color={colors.bg} style={{ marginLeft: 3 }} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={queue}
        keyExtractor={(t) => t.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TrackRow
            track={item}
            position={index + 1}
            active={index === currentIndex}
            playing={index === currentIndex && status.playing}
            onPress={() => playTrack(index)}
          />
        )}
        ListFooterComponent={
          <Text style={styles.credits}>Prévias de 30 s e capas: iTunes Search API.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 20, paddingBottom: 32, maxWidth: 720, width: '100%', alignSelf: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  brand: { color: colors.text, fontSize: 20, fontWeight: '700' },
  links: { flexDirection: 'row', gap: 8 },
  slidesLink: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  slidesLinkText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  playlistLabel: { color: colors.textMuted, fontSize: 13 },
  playlistTitle: { color: colors.text, fontSize: 26, fontWeight: '700', marginTop: 4 },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  playAll: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  credits: { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 24 },
});
