import React, { useMemo } from 'react';
import {
  Group,
  Path,
  LinearGradient,
  RadialGradient,
  SweepGradient,
  Shadow,
  BlurMask,
  Circle,
  vec,
} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { createXMenPaths } from '../../utils/paths/xmenPaths';
import { THEME } from '../../constants/theme';

interface XMenModeProps {
  cx: number;
  cy: number;
  size: number;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  clawProgress: SharedValue<number>;
  skiaEffectsEnabled: boolean;
}

export const XMenMode: React.FC<XMenModeProps> = ({
  cx,
  cy,
  size,
  tiltX,
  tiltY,
  clawProgress,
  skiaEffectsEnabled,
}) => {
  // Todos os caminhos do "X" e das garras estão matematicamente centrados em (0, 0)
  const paths = useMemo(() => createXMenPaths(size), [size]);
  const scale = size / 200;
  const rOuter = 86 * scale;
  const rInner = 68 * scale;
  const rHalf = size / 2;

  const emblemTransform = useDerivedValue(() => [
    { translateX: cx + tiltX.value * 16 },
    { translateY: cy + tiltY.value * 16 },
  ]);

  const metalStart = useDerivedValue(() => {
    return vec(-rHalf * 0.7 + tiltX.value * 70, -rHalf * 0.7 + tiltY.value * 70);
  });
  const metalEnd = useDerivedValue(() => {
    return vec(rHalf * 0.7 + tiltX.value * 70, rHalf * 0.7 + tiltY.value * 70);
  });

  const clawOpacity = useDerivedValue(() => {
    return Math.max(0, 1 - clawProgress.value);
  });

  if (!skiaEffectsEnabled) {
    return (
      <Group transform={emblemTransform}>
        <Circle cx={0} cy={0} r={rOuter} color={THEME.flat.emblem} />
        <Circle cx={0} cy={0} r={rInner} color="#11131a" />
        <Path path={paths.letterX} color={THEME.xmen.metalX} />
      </Group>
    );
  }

  return (
    <Group>
      {/* 1. Feixes de Energia Dourada e Azul Elétrico centrados em (cx, cy) */}
      <Circle cx={cx} cy={cy} r={size * 0.56}>
        <RadialGradient
          c={vec(cx, cy)}
          r={size * 0.56}
          colors={['rgba(234, 179, 8, 0.32)', 'rgba(56, 189, 248, 0.18)', 'rgba(0, 0, 0, 0)']}
        />
        <BlurMask style="normal" blur={24} />
      </Circle>

      {/* 2. Emblema Circular "X" Perfeitamente Centralizado em (0, 0) -> (cx, cy) */}
      <Group transform={emblemTransform}>
        {/* Sombra Projetada do Emblema */}
        <Circle cx={0} cy={0} r={rOuter} color="#06050c">
          <Shadow dx={6} dy={15} blur={20} color="rgba(0, 0, 0, 0.94)" />
        </Circle>

        {/* Núcleo Escuro Profundo */}
        <Circle cx={0} cy={0} r={rInner}>
          <RadialGradient
            c={vec(0, 0)}
            r={rInner}
            colors={['#1e1b4b', '#0f172a', '#020617']}
          />
          <Shadow dx={2} dy={4} blur={8} color="rgba(0, 0, 0, 0.9)" inner />
        </Circle>

        {/* Anel Circular Metálico Prateado & Dourado */}
        <Circle
          cx={0}
          cy={0}
          r={(rOuter + rInner) / 2}
          style="stroke"
          strokeWidth={rOuter - rInner}
        >
          <SweepGradient
            c={vec(0, 0)}
            colors={[
              '#cbd5e1',
              '#ffffff',
              '#eab308',
              '#475569',
              '#f8fafc',
              '#ca8a04',
              '#cbd5e1',
            ]}
          />
        </Circle>

        {/* Friso Interno Dourado/Prata */}
        <Circle
          cx={0}
          cy={0}
          r={rInner}
          style="stroke"
          strokeWidth={2 * scale}
          color="#fef08a"
          opacity={0.75}
        />

        {/* Símbolo "X" Centralizado em (0, 0) com Relevo 3D */}
        <Path path={paths.letterX} color="#0f172a">
          <Shadow dx={5} dy={10} blur={14} color="rgba(0, 0, 0, 0.9)" />
        </Path>

        <Path path={paths.letterX}>
          <LinearGradient
            start={metalStart}
            end={metalEnd}
            colors={['#ffffff', '#cbd5e1', '#64748b', '#e2e8f0', '#ffffff']}
          />
          <Shadow dx={-2} dy={-2} blur={4} color="rgba(255, 255, 255, 0.65)" inner />
          <Shadow dx={2} dy={3} blur={5} color="rgba(0, 0, 0, 0.8)" inner />
        </Path>

        {/* 4 Facetas Chanfradas 3D convergindo em (0, 0) */}
        <Path path={paths.bevelTopLeft} color="rgba(255, 255, 255, 0.38)" />
        <Path path={paths.bevelTopRight} color="rgba(0, 0, 0, 0.45)" />
        <Path path={paths.bevelBottomLeft} color="rgba(255, 255, 255, 0.25)" />
        <Path path={paths.bevelBottomRight} color="rgba(0, 0, 0, 0.55)" />

        {/* 3. 3 Cortes Brilhantes de Garras de Adamantium sobre o Emblema */}
        <Group opacity={clawOpacity}>
          <Path
            path={paths.clawSlashes}
            color="#facc15"
          >
            <BlurMask style="normal" blur={7} />
          </Path>
          <Path
            path={paths.clawSlashes}
            color="#ffffff"
          />
        </Group>
      </Group>

      {/* 4. Faíscas Metálicas das Garras de Adamantium */}
      <Group opacity={clawOpacity}>
        <BlurMask style="normal" blur={3} />
        {Array.from({ length: 16 }).map((_, i) => (
          <ClawSpark
            key={`claw-spark-${i}`}
            index={i}
            cx={cx}
            cy={cy}
            size={size}
            progress={clawProgress}
          />
        ))}
      </Group>
    </Group>
  );
};

const ClawSpark: React.FC<{
  index: number;
  cx: number;
  cy: number;
  size: number;
  progress: SharedValue<number>;
}> = ({ index, cx, cy, size, progress }) => {
  const seed = useMemo(() => {
    const t = (index / 15 - 0.5) * size * 0.65;
    const spread = ((index % 3) - 1) * 22;
    return {
      startX: cx + t + spread,
      startY: cy + t - spread,
      vx: ((index % 5) - 2) * 24,
      vy: ((index % 4) - 1.5) * 24,
      color: index % 2 === 0 ? '#facc15' : '#ffffff',
    };
  }, [index, cx, cy, size]);

  const pos = useDerivedValue(() => {
    const p = progress.value;
    return vec(seed.startX + seed.vx * p, seed.startY + seed.vy * p);
  });

  const radius = useDerivedValue(() => {
    return Math.max(0.4, 3.2 * (1 - progress.value));
  });

  return <Circle c={pos} r={radius} color={seed.color} />;
};
