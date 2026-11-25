import React, { useMemo } from 'react';
import {
  Group,
  Circle,
  BlurMask,
  vec,
} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { SLIDES, SlideId, THEME } from '../constants/theme';

interface SparkSeed {
  id: number;
  angle: number;
  distance: number;
  size: number;
  colorIdx: number;
}

interface ShockwaveSystemProps {
  originX: SharedValue<number>;
  originY: SharedValue<number>;
  progress: SharedValue<number>;
  currentSlideId: SlideId;
  skiaEffectsEnabled: boolean;
}

export const ShockwaveSystem: React.FC<ShockwaveSystemProps> = ({
  originX,
  originY,
  progress,
  currentSlideId,
  skiaEffectsEnabled,
}) => {
  const slide = SLIDES.find((s) => s.id === currentSlideId) ?? SLIDES[0];

  const sparkSeeds = useMemo<SparkSeed[]>(() => {
    const list: SparkSeed[] = [];
    const count = THEME.counts.shockwaveSparks;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const distance = 70 + Math.random() * 115;
      list.push({
        id: i,
        angle,
        distance,
        size: 2.2 + Math.random() * 2.5,
        colorIdx: i % 4,
      });
    }
    return list;
  }, []);

  const shockwaveRadius = useDerivedValue(() => {
    return progress.value * 185;
  });

  const shockwaveOpacity = useDerivedValue(() => {
    return Math.max(0, (1 - progress.value) * 0.85);
  });

  const echoRadius = useDerivedValue(() => {
    return progress.value * 120;
  });

  const echoOpacity = useDerivedValue(() => {
    return Math.max(0, (1 - progress.value) * 0.55);
  });

  const shockwaveCenter = useDerivedValue(() => {
    return vec(originX.value, originY.value);
  });

  if (!skiaEffectsEnabled) {
    return (
      <Group>
        <Circle
          c={shockwaveCenter}
          r={shockwaveRadius}
          style="stroke"
          strokeWidth={1.5}
          color="rgba(150, 155, 175, 0.4)"
          opacity={shockwaveOpacity}
        />
      </Group>
    );
  }

  return (
    <Group>
      {/* 1. Onda de Choque Primária */}
      <Circle
        c={shockwaveCenter}
        r={shockwaveRadius}
        style="stroke"
        strokeWidth={3.5}
        color={slide.accentColor}
        opacity={shockwaveOpacity}
      >
        <BlurMask style="normal" blur={6} />
      </Circle>

      <Circle
        c={shockwaveCenter}
        r={shockwaveRadius}
        style="stroke"
        strokeWidth={1.4}
        color="#ffffff"
        opacity={shockwaveOpacity}
      />

      {/* 2. Eco Harmônico Secundário */}
      <Circle
        c={shockwaveCenter}
        r={echoRadius}
        style="stroke"
        strokeWidth={2}
        color={slide.secondaryColor}
        opacity={echoOpacity}
      >
        <BlurMask style="normal" blur={4} />
      </Circle>

      {/* 3. Explosão de Partículas */}
      <Group>
        <BlurMask style="normal" blur={3} />
        {sparkSeeds.map((spark) => (
          <BurstSparkItem
            key={spark.id}
            seed={spark}
            originX={originX}
            originY={originY}
            progress={progress}
            colors={slide.sparks}
          />
        ))}
      </Group>
    </Group>
  );
};

interface BurstSparkItemProps {
  seed: SparkSeed;
  originX: SharedValue<number>;
  originY: SharedValue<number>;
  progress: SharedValue<number>;
  colors: string[];
}

const BurstSparkItem: React.FC<BurstSparkItemProps> = ({
  seed,
  originX,
  originY,
  progress,
  colors,
}) => {
  const sparkColor = colors[seed.colorIdx % colors.length];

  const sparkPos = useDerivedValue(() => {
    const p = Math.sin((progress.value * Math.PI) / 2);
    const dist = seed.distance * p;
    return vec(
      originX.value + Math.cos(seed.angle) * dist,
      originY.value + Math.sin(seed.angle) * dist
    );
  });

  const sparkRadius = useDerivedValue(() => {
    return Math.max(0.1, seed.size * (1 - progress.value * 0.8));
  });

  const sparkOpacity = useDerivedValue(() => {
    return Math.max(0, 1 - progress.value);
  });

  return (
    <Circle
      c={sparkPos}
      r={sparkRadius}
      color={sparkColor}
      opacity={sparkOpacity}
    />
  );
};
