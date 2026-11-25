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
import { createCapShieldPaths } from '../../utils/paths/avengersHeroPaths';
import { THEME } from '../../constants/theme';

interface AvengersModeProps {
  cx: number;
  cy: number;
  size: number;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  shieldRotation: SharedValue<number>;
  sparkProgress: SharedValue<number>;
  skiaEffectsEnabled: boolean;
}

export const AvengersMode: React.FC<AvengersModeProps> = ({
  cx,
  cy,
  size,
  tiltX,
  tiltY,
  shieldRotation,
  sparkProgress,
  skiaEffectsEnabled,
}) => {
  // Caminhos e raios do Escudo de Vibranium perfeitamente centrados em (0, 0)
  const paths = useMemo(() => createCapShieldPaths(size), [size]);
  const { radii } = paths;
  const rHalf = size / 2;

  // Ponto central único (cx, cy) com parallax e giro de alta velocidade ao tocar
  const shieldTransform = useDerivedValue(() => [
    { translateX: cx + tiltX.value * 16 },
    { translateY: cy + tiltY.value * 16 },
    { rotate: shieldRotation.value + tiltX.value * 0.25 },
  ]);

  // Reflexo especular deslizante com o Giroscópio
  const metalStart = useDerivedValue(() => {
    return vec(-rHalf * 0.75 + tiltX.value * 70, -rHalf * 0.75 + tiltY.value * 70);
  });
  const metalEnd = useDerivedValue(() => {
    return vec(rHalf * 0.75 + tiltX.value * 70, rHalf * 0.75 + tiltY.value * 70);
  });

  if (!skiaEffectsEnabled) {
    return (
      <Group transform={shieldTransform}>
        <Circle cx={0} cy={0} r={radii.outerRed} color={THEME.avengers.shieldRed} />
        <Circle cx={0} cy={0} r={radii.silverRing} color={THEME.avengers.shieldSilver} />
        <Circle cx={0} cy={0} r={radii.innerRed} color={THEME.avengers.shieldRed} />
        <Circle cx={0} cy={0} r={radii.blueCore} color={THEME.avengers.shieldBlue} />
        <Path path={paths.star} color="#ffffff" />
      </Group>
    );
  }

  return (
    <Group>
      {/* 1. Aura Atmosférica Azul-Marinho & Feixe Cinematográfico centrado em (cx, cy) */}
      <Circle cx={cx} cy={cy} r={size * 0.56}>
        <RadialGradient
          c={vec(cx, cy)}
          r={size * 0.56}
          colors={['rgba(37, 99, 235, 0.36)', 'rgba(220, 38, 38, 0.16)', 'rgba(0, 0, 0, 0)']}
        />
        <BlurMask style="normal" blur={22} />
      </Circle>

      {/* 2. Escudo do Capitão América Perfeitamente Centralizado em (0, 0) -> (cx, cy) */}
      <Group transform={shieldTransform}>
        {/* Sombra Externa Profunda */}
        <Circle cx={0} cy={0} r={radii.outerRed} color="#050711">
          <Shadow dx={7} dy={16} blur={22} color="rgba(0, 0, 0, 0.94)" />
        </Circle>

        {/* ANEL 1: Vermelho Externo de Vibranium Escovado */}
        <Circle cx={0} cy={0} r={radii.outerRed}>
          <SweepGradient
            c={vec(0, 0)}
            colors={[
              '#991b1b',
              '#ef4444',
              '#7f1d1d',
              '#dc2626',
              '#f87171',
              '#991b1b',
            ]}
          />
          <Shadow dx={-2} dy={-2} blur={5} color="rgba(255, 255, 255, 0.35)" inner />
          <Shadow dx={3} dy={3} blur={6} color="rgba(0, 0, 0, 0.75)" inner />
        </Circle>

        {/* ANEL 2: Prata Metálico Escovado com SweepGradient */}
        <Circle cx={0} cy={0} r={radii.silverRing}>
          <SweepGradient
            c={vec(0, 0)}
            colors={[
              '#94a3b8',
              '#ffffff',
              '#64748b',
              '#e2e8f0',
              '#ffffff',
              '#475569',
              '#94a3b8',
            ]}
          />
        </Circle>

        {/* ANEL 3: Vermelho Interno de Vibranium Escovado */}
        <Circle cx={0} cy={0} r={radii.innerRed}>
          <SweepGradient
            c={vec(0, 0)}
            colors={[
              '#7f1d1d',
              '#ef4444',
              '#991b1b',
              '#f87171',
              '#b91c1c',
              '#7f1d1d',
            ]}
          />
        </Circle>

        {/* ANEL 4: Núcleo Azul Cobalto */}
        <Circle cx={0} cy={0} r={radii.blueCore}>
          <RadialGradient
            c={vec(0, 0)}
            r={radii.blueCore}
            colors={['#2563eb', '#1d4ed8', '#1e3a8a']}
          />
        </Circle>

        {/* Sulcos Usinados Concêntricos Realistas */}
        {[radii.outerRed, radii.silverRing, radii.innerRed, radii.blueCore].map((rVal, idx) => (
          <Circle
            key={`groove-${idx}`}
            cx={0}
            cy={0}
            r={rVal}
            style="stroke"
            strokeWidth={1.2}
            color="rgba(0, 0, 0, 0.55)"
          />
        ))}

        {/* Reflexo Especular Direcional Dinâmico sobre o Escudo (Reage ao Giroscópio) */}
        <Circle cx={0} cy={0} r={radii.outerRed} opacity={0.28}>
          <LinearGradient
            start={metalStart}
            end={metalEnd}
            colors={[
              'rgba(255,255,255,0)',
              'rgba(255,255,255,0.85)',
              'rgba(255,255,255,0)',
            ]}
          />
        </Circle>

        {/* ESTRELA DE 5 PONTAS MATEMATICAMENTE CENTRALIZADA EM (0, 0) */}
        <Path path={paths.star} color="#e2e8f0">
          <LinearGradient
            start={metalStart}
            end={metalEnd}
            colors={['#ffffff', '#cbd5e1', '#94a3b8', '#ffffff']}
          />
          <Shadow dx={0} dy={2} blur={4} color="rgba(0, 0, 0, 0.7)" />
        </Path>

        {/* Facetas Chanfradas 3D da Estrela (Luz e Sombra convergindo em (0, 0)) */}
        <Path path={paths.starLightFacets} color="rgba(255, 255, 255, 0.45)" />
        <Path path={paths.starDarkFacets} color="rgba(15, 23, 42, 0.35)" />
      </Group>

      {/* 3. Faíscas Cinéticas de Impacto de Vibranium ao Girar o Escudo */}
      <Group>
        <BlurMask style="normal" blur={3} />
        {Array.from({ length: 18 }).map((_, i) => (
          <VibraniumSpark
            key={`vib-spark-${i}`}
            index={i}
            cx={cx}
            cy={cy}
            baseRadius={radii.outerRed}
            progress={sparkProgress}
          />
        ))}
      </Group>
    </Group>
  );
};

const VibraniumSpark: React.FC<{
  index: number;
  cx: number;
  cy: number;
  baseRadius: number;
  progress: SharedValue<number>;
}> = ({ index, cx, cy, baseRadius, progress }) => {
  const angle = (index / 18) * Math.PI * 2;
  const color = index % 3 === 0 ? '#60a5fa' : index % 2 === 0 ? '#fbbf24' : '#ffffff';

  const pos = useDerivedValue(() => {
    const p = Math.sin((progress.value * Math.PI) / 2);
    const r = baseRadius * 0.85 + p * 65;
    return vec(
      cx + Math.cos(angle + p * 1.2) * r,
      cy + Math.sin(angle + p * 1.2) * r
    );
  });

  const opacity = useDerivedValue(() => {
    return Math.max(0, 1 - progress.value);
  });

  return <Circle c={pos} r={2.8} color={color} opacity={opacity} />;
};
