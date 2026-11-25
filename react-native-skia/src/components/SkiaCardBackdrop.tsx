import React from 'react';
import {
  Group,
  RoundedRect,
  BackdropBlur,
  Fill,
  LinearGradient,
  rrect,
  rect,
  vec,
  Circle,
  BlurMask,
} from '@shopify/react-native-skia';
import { SLIDES, SlideId, THEME } from '../constants/theme';

interface SkiaCardBackdropProps {
  cardX: number;
  cardY: number;
  cardWidth: number;
  cardHeight: number;
  currentSlideId: SlideId;
  skiaEffectsEnabled: boolean;
}

export const SkiaCardBackdrop: React.FC<SkiaCardBackdropProps> = ({
  cardX,
  cardY,
  cardWidth,
  cardHeight,
  currentSlideId,
  skiaEffectsEnabled,
}) => {
  const slide = SLIDES.find((s) => s.id === currentSlideId) ?? SLIDES[0];
  const cardRRect = rrect(rect(cardX, cardY, cardWidth, cardHeight), 20, 20);

  if (!skiaEffectsEnabled) {
    return (
      <Group>
        <RoundedRect rect={cardRRect} color={THEME.flat.cardBg} />
        <RoundedRect
          rect={cardRRect}
          style="stroke"
          strokeWidth={1}
          color={THEME.flat.cardBorder}
        />
      </Group>
    );
  }

  return (
    <Group>
      {/* 1. Vidro Fosco Acelerado pela GPU (<BackdropBlur blur={16}> otimizado para intermediários) */}
      <BackdropBlur blur={16} clip={cardRRect}>
        <Fill color="rgba(6, 12, 18, 0.74)" />
      </BackdropBlur>

      {/* 2. Reflexo Interno Sutil de Vidro */}
      <RoundedRect rect={cardRRect} opacity={0.14}>
        <LinearGradient
          start={vec(cardX, cardY)}
          end={vec(cardX + cardWidth, cardY + cardHeight)}
          colors={['#ffffff', 'rgba(255,255,255,0)', slide.accentColor]}
        />
      </RoundedRect>

      {/* 3. Borda Metálica Sutil Lapidada */}
      <RoundedRect
        rect={cardRRect}
        style="stroke"
        strokeWidth={1.4}
      >
        <LinearGradient
          start={vec(cardX, cardY)}
          end={vec(cardX + cardWidth, cardY + cardHeight)}
          colors={[
            slide.accentColor,
            'rgba(255, 255, 255, 0.32)',
            slide.secondaryColor,
            'rgba(255, 255, 255, 0.12)',
          ]}
        />
      </RoundedRect>

      {/* 4. Ponto Luminoso de Status no Canto do Card */}
      <Circle
        cx={cardX + cardWidth - 20}
        cy={cardY + 20}
        r={3.5}
        color={slide.accentColor}
      >
        <BlurMask style="normal" blur={3} />
      </Circle>
    </Group>
  );
};
