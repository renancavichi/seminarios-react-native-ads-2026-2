import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DoomsdayTypographyProps {
  top: number;
  skiaEffectsEnabled: boolean;
}

export const DoomsdayTypography: React.FC<DoomsdayTypographyProps> = ({
  top,
  skiaEffectsEnabled,
}) => {
  return (
    <View style={[styles.container, { top }]} pointerEvents="none">
      <View style={styles.badgeRow}>
        <View style={styles.marvelBadge}>
          <Text style={styles.marvelText}>MARVEL</Text>
        </View>
        <Text style={styles.studiosText}>STUDIOS</Text>
      </View>

      <Text style={styles.avengersText}>AVENGERS</Text>

      <Text
        style={[
          styles.doomsdayText,
          {
            textShadowColor: skiaEffectsEnabled
              ? 'rgba(0, 255, 136, 0.85)'
              : 'transparent',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: skiaEffectsEnabled ? 16 : 0,
          },
        ]}
      >
        DOOMSDAY
      </Text>

      <Text style={styles.footerSpecs}>
        EM MAIO DE 2026 NOS CINEMAS • FORMATO IMAX® 3D
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  marvelBadge: {
    backgroundColor: '#041c10',
    borderColor: '#00ff88',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
  },
  marvelText: {
    color: '#00ff88',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  studiosText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  avengersText: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 8,
    lineHeight: 30,
  },
  doomsdayText: {
    color: '#00ff88',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 10,
    lineHeight: 36,
  },
  footerSpecs: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 8.5,
    fontWeight: '600',
    letterSpacing: 1.8,
    marginTop: 6,
  },
});
