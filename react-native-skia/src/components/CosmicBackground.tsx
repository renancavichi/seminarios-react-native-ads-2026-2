import React from 'react';
import {
  Rect,
  Circle,
  RadialGradient,
  BlurMask,
  Group,
  vec,
} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { Star } from '../types';
import { SLIDES, SlideId, THEME } from '../constants/theme';

interface CosmicBackgroundProps {
  width: number;
  height: number;
  stageCenterX: number;
  stageCenterY: number;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  slideParallaxX: SharedValue<number>;
  distantStars: Star[];
  foregroundStars: Star[];
  currentSlideId: SlideId;
  skiaEffectsEnabled: boolean;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  width,
  height,
  stageCenterX,
  stageCenterY,
  tiltX,
  tiltY,
  slideParallaxX,
  distantStars,
  foregroundStars,
  currentSlideId,
  skiaEffectsEnabled,
}) => {
  const slide = SLIDES.find((s) => s.id === currentSlideId) ?? SLIDES[0];

  // Nebulosa primária centrada atrás do palco do emblema (lado esquerdo 55%)
  const nebula1Center = useDerivedValue(() => {
    return vec(
      stageCenterX + tiltX.value * 22 + slideParallaxX.value * 0.25,
      stageCenterY - 20 + tiltY.value * 22
    );
  });

  // Nebulosa secundária atrás do card de vidro fosco (lado direito 45%) para evidenciar o BackdropBlur
  const nebula2Center = useDerivedValue(() => {
    return vec(
      width * 0.76 - tiltX.value * 18 + slideParallaxX.value * 0.18,
      height * 0.52 - tiltY.value * 18
    );
  });

  const distantStarsTransform = useDerivedValue(() => [
    { translateX: tiltX.value * 14 + slideParallaxX.value * 0.15 },
    { translateY: tiltY.value * 14 },
  ]);

  const foregroundStarsTransform = useDerivedValue(() => [
    { translateX: tiltX.value * 30 + slideParallaxX.value * 0.35 },
    { translateY: tiltY.value * 30 },
  ]);

  if (!skiaEffectsEnabled) {
    return (
      <Group>
        <Rect x={0} y={0} width={width} height={height} color={THEME.flat.bg} />
        {distantStars.slice(0, 28).map((star) => (
          <Circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={1.1}
            color="rgba(120, 125, 145, 0.35)"
          />
        ))}
      </Group>
    );
  }

  return (
    <Group>
      {/* 1. Gradiente de Fundo Espacial Cinematográfico */}
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient
          c={vec(stageCenterX, stageCenterY)}
          r={Math.max(width, height) * 0.85}
          colors={slide.bgGradient}
        />
      </Rect>

      {/* 2. Nebulosa Primária no Palco Esquerdo */}
      <Circle c={nebula1Center} r={height * 0.62}>
        <RadialGradient
          c={nebula1Center}
          r={height * 0.62}
          colors={[slide.nebulaPrimary, 'rgba(0,0,0,0)']}
        />
        <BlurMask style="normal" blur={22} />
      </Circle>

      {/* 3. Nebulosa Secundária atrás do Card Direito (Realça o BackdropBlur) */}
      <Circle c={nebula2Center} r={height * 0.55}>
        <RadialGradient
          c={nebula2Center}
          r={height * 0.55}
          colors={[slide.nebulaSecondary, 'rgba(0,0,0,0)']}
        />
        <BlurMask style="normal" blur={20} />
      </Circle>

      {/* 4. Camada 1: Estrelas Distantes */}
      <Group transform={distantStarsTransform}>
        {distantStars.map((star) => (
          <Circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.radius}
            color={`rgba(255, 255, 255, ${star.alpha})`}
          />
        ))}
      </Group>

      {/* 5. Camada 2: Poeira Cósmica & Partículas da GPU em Primeiro Plano */}
      <Group transform={foregroundStarsTransform}>
        <BlurMask style="normal" blur={2.5} />
        {foregroundStars.map((star, idx) => (
          <Circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.radius * 1.15}
            color={slide.sparks[idx % slide.sparks.length]}
            opacity={star.alpha}
          />
        ))}
      </Group>
    </Group>
  );
};
