import React, { useMemo } from 'react';
import {
  Group,
  Path,
  LinearGradient,
  SweepGradient,
  RadialGradient,
  Shadow,
  BlurMask,
  Circle,
  vec,
} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { createDoomsdayPaths } from '../../utils/paths/doomsdayPaths';
import { THEME } from '../../constants/theme';
import { OrbitalParticle } from '../../types';

interface PosterModeProps {
  cx: number;
  cy: number;
  size: number;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  shimmer: SharedValue<number>;
  particles: OrbitalParticle[];
  skiaEffectsEnabled: boolean;
}

export const PosterMode: React.FC<PosterModeProps> = ({
  cx,
  cy,
  size,
  tiltX,
  tiltY,
  shimmer,
  particles,
  skiaEffectsEnabled,
}) => {
  // Todos os caminhos estão centrados na origem (0, 0)
  const paths = useMemo(() => createDoomsdayPaths(size), [size]);
  const rHalf = size / 2;

  // Ponto central único (cx, cy) com parallax suave do Giroscópio
  const emblemTransform = useDerivedValue(() => [
    { translateX: cx + tiltX.value * 16 },
    { translateY: cy + tiltY.value * 16 },
  ]);

  // Gradiente metálico prata e verde-esmeralda centrado em (0, 0)
  const holoStart = useDerivedValue(() => {
    const shiftX = tiltX.value * 75 + Math.sin(shimmer.value) * 24;
    const shiftY = tiltY.value * 75 + Math.cos(shimmer.value) * 24;
    return vec(-rHalf * 0.75 + shiftX, -rHalf * 0.8 + shiftY);
  });

  const holoEnd = useDerivedValue(() => {
    const shiftX = tiltX.value * 75 + Math.sin(shimmer.value) * 24;
    const shiftY = tiltY.value * 75 + Math.cos(shimmer.value) * 24;
    return vec(rHalf * 0.75 + shiftX, rHalf * 0.8 + shiftY);
  });

  const runeGlowOpacity = useDerivedValue(() => {
    return 0.6 + Math.abs(tiltX.value) * 0.3 + Math.sin(shimmer.value * 2) * 0.1;
  });

  if (!skiaEffectsEnabled) {
    return (
      <Group transform={emblemTransform}>
        <Path path={paths.ring} color={THEME.flat.emblem} />
        <Path path={paths.letter} color={THEME.flat.emblem} fillType="evenOdd" />
        <Path path={paths.bevelLeft} color={THEME.flat.emblemBevel} opacity={0.5} />
      </Group>
    );
  }

  return (
    <Group>
      {/* 1. Névoa e Aura Cósmica Verde-Esmeralda centrada em (cx, cy) */}
      <Circle cx={cx} cy={cy} r={size * 0.56}>
        <RadialGradient
          c={vec(cx, cy)}
          r={size * 0.56}
          colors={['rgba(0, 255, 136, 0.35)', 'rgba(16, 185, 129, 0.12)', 'rgba(0, 0, 0, 0)']}
        />
        <BlurMask style="normal" blur={24} />
      </Circle>

      {/* 2. Partículas e Runas Esmeraldas Flutuantes ao redor de (cx, cy) */}
      <Group>
        <BlurMask style="normal" blur={2.5} />
        {particles.map((p) => (
          <OrbitalSpark
            key={p.id}
            cx={cx}
            cy={cy}
            particle={p}
            shimmer={shimmer}
            colors={THEME.doomsday.sparks}
          />
        ))}
      </Group>

      {/* 3. Emblema Central "A" de Avengers: Doomsday centrado em (0, 0) -> (cx, cy) */}
      <Group transform={emblemTransform}>
        {/* Sombra profunda e chanfro interno do anel */}
        <Path path={paths.ring} color="#041209">
          <Shadow dx={5} dy={12} blur={16} color="rgba(0, 0, 0, 0.92)" />
        </Path>

        {/* Acabamento de metal escovado cônico no anel */}
        <Path path={paths.ring} opacity={0.95}>
          <SweepGradient
            c={vec(0, 0)}
            colors={[
              '#94a3b8',
              '#f8fafc',
              '#00ff88',
              '#334155',
              '#e2e8f0',
              '#10b981',
              '#94a3b8',
            ]}
          />
          <Shadow dx={-2} dy={-2} blur={4} color="rgba(255, 255, 255, 0.45)" inner />
          <Shadow dx={2} dy={3} blur={5} color="rgba(0, 0, 0, 0.75)" inner />
        </Path>

        {/* Borda externa esmeralda neon */}
        <Path
          path={paths.ringRim}
          style="stroke"
          strokeWidth={1.8}
          color={THEME.doomsday.emeraldNeon}
          opacity={0.85}
        >
          <BlurMask style="normal" blur={2} />
        </Path>

        {/* Base 3D do "A" com sombra projetada */}
        <Path path={paths.letter} fillType="evenOdd" color="#05140b">
          <Shadow dx={7} dy={15} blur={20} color="rgba(0, 0, 0, 0.95)" />
        </Path>

        {/* Metal Prata Escovado + Reflexo Verde-Esmeralda reagindo ao Giroscópio */}
        <Path path={paths.letter} fillType="evenOdd" opacity={0.94}>
          <LinearGradient
            start={holoStart}
            end={holoEnd}
            colors={THEME.doomsday.holoColors}
          />
          <Shadow dx={-2} dy={-2} blur={5} color="rgba(255, 255, 255, 0.55)" inner />
          <Shadow dx={3} dy={4} blur={6} color="rgba(0, 0, 0, 0.85)" inner />
        </Path>

        {/* Chanfros Especulares 3D */}
        <Path path={paths.bevelLeft} color="rgba(255, 255, 255, 0.36)" />
        <Path path={paths.bevelRight} color="rgba(0, 0, 0, 0.52)" />

        {/* Ponta da Flecha energizada */}
        <Path path={paths.arrow} opacity={0.78}>
          <LinearGradient
            start={vec(rHalf * 0.35, 0)}
            end={vec(rHalf * 0.92, 0)}
            colors={['rgba(0,255,136,0)', THEME.doomsday.emeraldNeon]}
          />
        </Path>

        {/* 4. Runas Arcanas Gravadas no Metal */}
        <Group opacity={runeGlowOpacity}>
          <BlurMask style="normal" blur={3} />
          {paths.runes.map((runePath, idx) => (
            <Path
              key={`rune-glow-${idx}`}
              path={runePath}
              style="stroke"
              strokeWidth={2.5}
              color={THEME.doomsday.emeraldNeon}
            />
          ))}
        </Group>
        <Group opacity={runeGlowOpacity}>
          {paths.runes.map((runePath, idx) => (
            <Path
              key={`rune-core-${idx}`}
              path={runePath}
              style="stroke"
              strokeWidth={1.1}
              color="#ffffff"
            />
          ))}
        </Group>
      </Group>
    </Group>
  );
};

const OrbitalSpark: React.FC<{
  cx: number;
  cy: number;
  particle: OrbitalParticle;
  shimmer: SharedValue<number>;
  colors: string[];
}> = ({ cx, cy, particle, shimmer, colors }) => {
  const color = colors[particle.colorIndex % colors.length];

  const pos = useDerivedValue(() => {
    const angle = particle.angle + shimmer.value * particle.speed * 0.75;
    const r = particle.baseRadius + Math.sin(shimmer.value * 2 + particle.id) * 7;
    return vec(
      cx + r * Math.cos(angle),
      cy + r * 0.85 * Math.sin(angle)
    );
  });

  return (
    <Circle c={pos} r={particle.size} color={color} opacity={particle.opacity} />
  );
};
