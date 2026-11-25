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
import { createFantasticFourPaths } from '../../utils/paths/fantasticFourPaths';
import { THEME } from '../../constants/theme';

interface FantasticFourModeProps {
  cx: number;
  cy: number;
  size: number;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  touchActive: SharedValue<number>;
  flameCycle: SharedValue<number>;
  skiaEffectsEnabled: boolean;
}

export const FantasticFourMode: React.FC<FantasticFourModeProps> = ({
  cx,
  cy,
  size,
  tiltX,
  tiltY,
  touchX,
  touchY,
  touchActive,
  flameCycle,
  skiaEffectsEnabled,
}) => {
  // Todos os caminhos estão centrados em (0, 0)
  const paths = useMemo(() => createFantasticFourPaths(size), [size]);
  const scale = size / 200;
  const rOuter = 88 * scale;
  const rInner = 73 * scale;
  const rHalf = size / 2;

  // Ponto central único (cx, cy) com parallax do Giroscópio
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

  // Escudo hexagonal translúcido da Mulher Invisível
  const forcefieldTransform = useDerivedValue(() => [
    { translateX: touchActive.value > 0.05 ? touchX.value : cx + 48 * scale },
    { translateY: touchActive.value > 0.05 ? touchY.value : cy - 32 * scale },
    { scale: 0.85 + touchActive.value * 0.3 },
  ]);

  if (!skiaEffectsEnabled) {
    return (
      <Group transform={emblemTransform}>
        <Circle cx={0} cy={0} r={rOuter} color={THEME.f4.circleBlue} />
        <Circle
          cx={0}
          cy={0}
          r={rOuter}
          style="stroke"
          strokeWidth={10 * scale}
          color={THEME.flat.metal}
        />
        <Path path={paths.numberFour} color={THEME.f4.circleWhite} fillType="evenOdd" />
      </Group>
    );
  }

  return (
    <Group>
      {/* 1. Aura Azul-Cósmica & Brilho Térmico do Tocha Humana centrado em (cx, cy) */}
      <Circle cx={cx} cy={cy} r={size * 0.56}>
        <RadialGradient
          c={vec(cx, cy)}
          r={size * 0.56}
          colors={['rgba(2, 132, 199, 0.36)', 'rgba(249, 115, 22, 0.16)', 'rgba(0, 0, 0, 0)']}
        />
        <BlurMask style="normal" blur={22} />
      </Circle>

      {/* 2. Faíscas de Plasma Laranja/Amarelo subindo continuamente pelo palco */}
      <Group>
        <BlurMask style="normal" blur={3.5} />
        {Array.from({ length: 16 }).map((_, i) => (
          <AmbientFlameSpark
            key={`amb-flame-${i}`}
            index={i}
            cx={cx}
            cy={cy}
            size={size}
            cycle={flameCycle}
          />
        ))}
      </Group>

      {/* 3. Emblema Circular "4" Perfeitamente Centralizado em (0, 0) -> (cx, cy) */}
      <Group transform={emblemTransform}>
        {/* Sombra Externa Projetada */}
        <Circle cx={0} cy={0} r={rOuter} color="#020b18">
          <Shadow dx={6} dy={14} blur={20} color="rgba(0, 0, 0, 0.92)" />
        </Circle>

        {/* Disco Interno Azul Cobalto Metálico */}
        <Circle cx={0} cy={0} r={rInner}>
          <RadialGradient
            c={vec(-15 * scale, -18 * scale)}
            r={rOuter}
            colors={['#0ea5e9', '#0284c7', '#0369a1', '#082f49']}
          />
          <Shadow dx={-2} dy={-2} blur={5} color="rgba(186, 230, 253, 0.4)" inner />
          <Shadow dx={3} dy={4} blur={7} color="rgba(0, 0, 0, 0.8)" inner />
        </Circle>

        {/* Borda Metálica Prateada & Azul Cobalto (Anel Circular Externo) */}
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
              '#f8fafc',
              '#38bdf8',
              '#0284c7',
              '#e2e8f0',
              '#0369a1',
              '#bae6fd',
              '#f8fafc',
            ]}
          />
        </Circle>

        {/* Friso Prateado Brilhante */}
        <Circle
          cx={0}
          cy={0}
          r={rInner}
          style="stroke"
          strokeWidth={2 * scale}
          color="#e0f2fe"
          opacity={0.85}
        />

        {/* Número "4" Centralizado na Origem (0, 0) com Sombra e Metal Escovado */}
        <Path path={paths.numberFour} fillType="evenOdd" color="#082f49">
          <Shadow dx={5} dy={10} blur={12} color="rgba(0, 0, 0, 0.85)" />
        </Path>

        <Path path={paths.numberFour} fillType="evenOdd">
          <LinearGradient
            start={metalStart}
            end={metalEnd}
            colors={['#ffffff', '#e0f2fe', '#94a3b8', '#f8fafc', '#bae6fd']}
          />
          <Shadow dx={-2} dy={-2} blur={4} color="rgba(255, 255, 255, 0.7)" inner />
          <Shadow dx={2} dy={3} blur={4} color="rgba(2, 132, 199, 0.65)" inner />
        </Path>

        {/* Faceta Chanfrada 3D do "4" */}
        <Path path={paths.bevelFour} color="rgba(255, 255, 255, 0.42)" />
      </Group>

      {/* 4. Hexágono Translúcido Brilhante (Campo de Força da Mulher Invisível) */}
      <Group transform={forcefieldTransform}>
        <Path path={paths.singleHex} color="rgba(56, 189, 248, 0.14)" />
        <Path
          path={paths.hexagonMesh}
          style="stroke"
          strokeWidth={1.6}
          color="rgba(56, 189, 248, 0.65)"
        >
          <BlurMask style="normal" blur={3} />
        </Path>
        <Path
          path={paths.singleHex}
          style="stroke"
          strokeWidth={1.8}
          color="#e0f2fe"
          opacity={0.85}
        />
      </Group>

      {/* 5. Rastros de Chamas de Plasma Interativas ao Arrastar o Dedo */}
      <Group opacity={touchActive}>
        <BlurMask style="normal" blur={4.5} />
        {Array.from({ length: 16 }).map((_, i) => (
          <TouchFlameParticle
            key={`touch-flame-${i}`}
            index={i}
            touchX={touchX}
            touchY={touchY}
            cycle={flameCycle}
          />
        ))}
      </Group>
    </Group>
  );
};

// Faíscas térmicas subindo continuamente pelo fundo do palco
const AmbientFlameSpark: React.FC<{
  index: number;
  cx: number;
  cy: number;
  size: number;
  cycle: SharedValue<number>;
}> = ({ index, cx, cy, size, cycle }) => {
  const seed = useMemo(() => {
    const angle = (index / 16) * Math.PI * 2;
    const radiusOffset = (0.35 + (index % 4) * 0.08) * size;
    return {
      baseX: cx + Math.cos(angle) * radiusOffset,
      baseY: cy + size * 0.45,
      travelY: size * 0.9,
      size: 2 + (index % 3) * 1.4,
      color: index % 3 === 0 ? '#ef4444' : index % 2 === 0 ? '#f97316' : '#fbbf24',
    };
  }, [index, cx, cy, size]);

  const pos = useDerivedValue(() => {
    const t = (cycle.value + index * 0.0625) % 1;
    const wobble = Math.sin(t * Math.PI * 4 + index) * 10;
    return vec(seed.baseX + wobble, seed.baseY - t * seed.travelY);
  });

  const opacity = useDerivedValue(() => {
    const t = (cycle.value + index * 0.0625) % 1;
    return Math.sin(t * Math.PI) * 0.85;
  });

  return <Circle c={pos} r={seed.size} color={seed.color} opacity={opacity} />;
};

// Rastros de fogo seguidor de toque
const TouchFlameParticle: React.FC<{
  index: number;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  cycle: SharedValue<number>;
}> = ({ index, touchX, touchY, cycle }) => {
  const seed = useMemo(() => ({
    angle: (index / 16) * Math.PI * 2,
    speed: 28 + (index % 5) * 9,
    size: 3.5 + (index % 4) * 2,
    color: index % 3 === 0 ? '#ef4444' : index % 2 === 0 ? '#f97316' : '#fbbf24',
  }), [index]);

  const sparkPos = useDerivedValue(() => {
    const time = (cycle.value + index * 0.15) % 1;
    const rise = time * seed.speed;
    const wobble = Math.sin(time * 6 + index) * 12;
    return vec(
      touchX.value + Math.cos(seed.angle) * 14 + wobble,
      touchY.value + Math.sin(seed.angle) * 14 - rise
    );
  });

  const sparkSize = useDerivedValue(() => {
    const time = (cycle.value + index * 0.15) % 1;
    return Math.max(0.5, seed.size * (1 - time));
  });

  return <Circle c={sparkPos} r={sparkSize} color={seed.color} />;
};
