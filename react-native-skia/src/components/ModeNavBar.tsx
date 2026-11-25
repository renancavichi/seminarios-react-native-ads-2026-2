import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { PosterModeType, THEME } from '../constants/theme';

interface ModeNavBarProps {
  currentMode: PosterModeType;
  onSelectMode: (mode: PosterModeType) => void;
  skiaEffectsEnabled: boolean;
}

const MODES_CONFIG: {
  id: PosterModeType;
  label: string;
  icon: string;
  color: string;
  hint: string;
}[] = [
  {
    id: 'poster',
    label: 'DOOMSDAY',
    icon: '⚡',
    color: '#00ff88',
    hint: 'Incline o celular • Toque na tela para ondas esmeraldas',
  },
  {
    id: 'doom',
    label: 'DR. DOOM',
    icon: '👑',
    color: '#10b981',
    hint: 'Segure na máscara para invocar raios arcanos de Latvéria',
  },
  {
    id: 'fantastic4',
    label: 'QUARTETO 4',
    icon: '🛡️',
    color: '#38bdf8',
    hint: 'Arraste o dedo: Campo de Força de Sue & Chamas de Johnny Storm',
  },
  {
    id: 'xmen',
    label: 'X-MEN',
    icon: '⚔️',
    color: '#facc15',
    hint: 'Deslize para cortar com Adamantium • Toque duplo para Rajada Óptica',
  },
  {
    id: 'avengers',
    label: 'HERÓIS',
    icon: '⭐',
    color: '#ef4444',
    hint: 'Arraste o Escudo para arremessar • Toque para alternar com Mjolnir',
  },
];

export const ModeNavBar: React.FC<ModeNavBarProps> = ({
  currentMode,
  onSelectMode,
  skiaEffectsEnabled,
}) => {
  const currentConfig = MODES_CONFIG.find((m) => m.id === currentMode)!;

  const handlePress = (mode: PosterModeType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectMode(mode);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* 1. Legenda Indicativa dos Gestos de cada Modo */}
      <View style={styles.hintContainer}>
        <Text style={[styles.hintIcon, { color: currentConfig.color }]}>
          {currentConfig.icon}
        </Text>
        <Text style={styles.hintText}>{currentConfig.hint}</Text>
      </View>

      {/* 2. Barra Seletora de 5 Modos */}
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: skiaEffectsEnabled
              ? 'rgba(6, 12, 18, 0.75)'
              : THEME.flat.cardBg,
            borderColor: skiaEffectsEnabled
              ? currentConfig.color + '44'
              : THEME.flat.border,
          },
        ]}
      >
        {MODES_CONFIG.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <Pressable
              key={mode.id}
              style={[
                styles.navItem,
                isActive && {
                  backgroundColor: mode.color + '22',
                  borderColor: mode.color + '88',
                  borderWidth: 1,
                },
              ]}
              onPress={() => handlePress(mode.id)}
              hitSlop={8}
            >
              <Text style={styles.navIcon}>{mode.icon}</Text>
              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isActive ? mode.color : 'rgba(255, 255, 255, 0.55)',
                    fontWeight: isActive ? '900' : '600',
                  },
                ]}
                numberOfLines={1}
              >
                {mode.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 22,
    left: 12,
    right: 12,
    alignItems: 'center',
    zIndex: 99,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 6,
  },
  hintIcon: {
    fontSize: 12,
  },
  hintText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderRadius: 22,
    borderWidth: 1.2,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginHorizontal: 3,
    borderRadius: 14,
    gap: 3,
  },
  navIcon: {
    fontSize: 15,
  },
  navLabel: {
    fontSize: 8.5,
    letterSpacing: 0.8,
  },
});
