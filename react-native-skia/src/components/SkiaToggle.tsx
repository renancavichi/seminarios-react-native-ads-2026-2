import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface SkiaToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const SkiaToggle: React.FC<SkiaToggleProps> = ({ enabled, onToggle }) => {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onToggle();
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.93);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Respeita o entalhe da câmera (Dynamic Island no iOS / Hole-Punch na MIUI/Samsung) em modo paisagem
  const safeTop = Math.max(12, insets.top + 4);
  const safeLeft = Math.max(16, insets.left + 8);

  return (
    <Animated.View
      style={[
        styles.container,
        { top: safeTop, left: safeLeft },
        animatedStyle,
      ]}
    >
      <Pressable
        style={[
          styles.pill,
          {
            backgroundColor: enabled
              ? 'rgba(4, 18, 12, 0.86)'
              : 'rgba(26, 28, 36, 0.90)',
            borderColor: enabled
              ? 'rgba(0, 255, 136, 0.55)'
              : 'rgba(120, 125, 140, 0.45)',
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={12}
      >
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: enabled ? '#00ff88' : '#6b7280',
              shadowColor: enabled ? '#00ff88' : 'transparent',
              shadowRadius: enabled ? 6 : 0,
              shadowOpacity: enabled ? 0.9 : 0,
            },
          ]}
        />
        <Text style={styles.titleText}>
          Skia GPU FX:{' '}
          <Text
            style={{
              color: enabled ? '#00ff88' : '#9ca3af',
              fontWeight: '900',
            }}
          >
            {enabled ? 'ON' : 'OFF'}
          </Text>
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 14,
    left: 16,
    zIndex: 99,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.1,
    gap: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  titleText: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
