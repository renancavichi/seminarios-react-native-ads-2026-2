import React, { useMemo } from 'react';
import {
  Group,
  Path,
  LinearGradient,
  Shadow,
  vec,
} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { createAvengersPaths } from '../utils/avengersPath';
import { THEME } from '../constants/theme';

interface AvengersEmblemProps {
  cx: number;
  cy: number;
  size: number;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  shimmer: SharedValue<number>;
  isOverloaded: boolean;
  skiaEffectsEnabled: boolean;
}

export const AvengersEmblem: React.FC<AvengersEmblemProps> = ({
  cx,
  cy,
  size,
  tiltX,
  tiltY,
  shimmer,
  isOverloaded,
  skiaEffectsEnabled,
}) => {
  const currentTheme = isOverloaded ? THEME.overload : THEME.normal;
  const paths = useMemo(() => createAvengersPaths(size), [size]);

  // Transform com Parallax da inclinação
  const emblemTransform = useDerivedValue(() => [
    { translateX: cx - size / 2 + tiltX.value * 20 },
    { translateY: cy - size / 2 + tiltY.value * 20 },
  ]);

  // LinearGradient dinâmico que desliza simulando reflexo holográfico
  const holoStart = useDerivedValue(() => {
    const shiftX = tiltX.value * 80 + Math.sin(shimmer.value) * 20;
    const shiftY = tiltY.value * 80 + Math.cos(shimmer.value) * 20;
    return vec(size * 0.15 + shiftX, size * 0.1 + shiftY);
  });

  const holoEnd = useDerivedValue(() => {
    const shiftX = tiltX.value * 80 + Math.sin(shimmer.value) * 20;
    const shiftY = tiltY.value * 80 + Math.cos(shimmer.value) * 20;
    return vec(size * 0.85 + shiftX, size * 0.9 + shiftY);
  });

  // Modo comparativo sem Skia (Renderização Plana)
  if (!skiaEffectsEnabled) {
    return (
      <Group transform={emblemTransform}>
        {/* Anel plano */}
        <Path path={paths.ring} color={THEME.flat.emblem} />
        {/* Letra A plana */}
        <Path
          path={paths.letter}
          color={THEME.flat.emblem}
          fillType="evenOdd"
        />
        {/* Borda chanfrada simples */}
        <Path
          path={paths.bevelLeft}
          color={THEME.flat.emblemBevel}
          opacity={0.5}
        />
      </Group>
    );
  }

  return (
    <Group transform={emblemTransform}>
      {/* ==================================================== */}
      {/* 1. ANEL METÁLICO COM REFLEXO HOLOGRÁFICO & CHANFRO   */}
      {/* ==================================================== */}
      {/* Sombra de projeção do anel */}
      <Path path={paths.ring} color={currentTheme.emblemBase}>
        <Shadow dx={6} dy={12} blur={16} color="rgba(0, 0, 0, 0.85)" />
      </Path>

      {/* Camada holográfica do anel */}
      <Path path={paths.ring} opacity={0.88}>
        <LinearGradient
          start={holoStart}
          end={holoEnd}
          colors={currentTheme.holoColors}
        />
      </Path>

      {/* Borda decorativa do anel (Rim) */}
      <Path
        path={paths.ringRim}
        style="stroke"
        strokeWidth={1.5}
        color={isOverloaded ? '#ff0055' : '#38bdf8'}
        opacity={0.7}
      />

      {/* ==================================================== */}
      {/* 2. EMBLEMA CENTRAL "A" COM SOMBRAS E RELEVO 3D      */}
      {/* ==================================================== */}
      {/* Base sólida do "A" com sombra projetada */}
      <Path
        path={paths.letter}
        fillType="evenOdd"
        color={currentTheme.emblemBase}
      >
        <Shadow dx={8} dy={16} blur={20} color="rgba(0, 0, 0, 0.9)" />
      </Path>

      {/* Camada Holográfica Dinâmica Reativa ao Giroscópio */}
      <Path
        path={paths.letter}
        fillType="evenOdd"
        opacity={0.85}
      >
        <LinearGradient
          start={holoStart}
          end={holoEnd}
          colors={currentTheme.holoColors}
        />
      </Path>

      {/* ==================================================== */}
      {/* 3. FACETAS CHANFRADAS (BEVELS) PARA REALISMO METÁLICO */}
      {/* ==================================================== */}
      {/* Faceta Esquerda (Luz especular direcionada) */}
      <Path
        path={paths.bevelLeft}
        color="rgba(255, 255, 255, 0.35)"
      />

      {/* Faceta Direita (Sombra oclusiva metálica) */}
      <Path
        path={paths.bevelRight}
        color="rgba(0, 0, 0, 0.45)"
      />

      {/* Ponta da Seta com Brilho Reforçado */}
      <Path path={paths.arrow} opacity={0.6}>
        <LinearGradient
          start={vec(size * 0.7, size * 0.5)}
          end={vec(size * 0.95, size * 0.5)}
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.7)']}
        />
      </Path>
    </Group>
  );
};
