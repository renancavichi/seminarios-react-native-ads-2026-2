import React, { useMemo } from 'react';
import {
  Group,
  Path,
  LinearGradient,
  RadialGradient,
  Shadow,
  BlurMask,
  Circle,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { createDoomMaskPaths } from '../../utils/paths/doomMaskPaths';
import { THEME } from '../../constants/theme';

interface DoomModeProps {
  cx: number;
  cy: number;
  size: number;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  chargeProgress: SharedValue<number>;
  runeRotation: SharedValue<number>;
  skiaEffectsEnabled: boolean;
}

export const DoomMode: React.FC<DoomModeProps> = ({
  cx,
  cy,
  size,
  tiltX,
  tiltY,
  chargeProgress,
  runeRotation,
  skiaEffectsEnabled,
}) => {
  // Todos os caminhos centrados em (0, 0)
  const paths = useMemo(() => createDoomMaskPaths(size), [size]);
  const rHalf = size / 2;

  const doomTransform = useDerivedValue(() => [
    { translateX: cx + tiltX.value * 16 },
    { translateY: cy + tiltY.value * 16 },
  ]);

  const runeCircleTransform = useDerivedValue(() => [
    { translateX: cx },
    { translateY: cy },
    { rotate: runeRotation.value },
  ]);

  // Reflexo metálico prateado na máscara centrado em (0, 0)
  const metalStart = useDerivedValue(() => {
    return vec(-rHalf * 0.65 + tiltX.value * 65, -rHalf * 0.65 + tiltY.value * 65);
  });
  const metalEnd = useDerivedValue(() => {
    return vec(rHalf * 0.65 + tiltX.value * 65, rHalf * 0.65 + tiltY.value * 65);
  });

  const lightningOpacity = useDerivedValue(() => {
    return 0.25 + chargeProgress.value * 0.75;
  });

  const eyeGlowRadius = useDerivedValue(() => {
    return 10 + chargeProgress.value * 14;
  });

  if (!skiaEffectsEnabled) {
    return (
      <Group transform={doomTransform}>
        <Path path={paths.hoodOuter} color={THEME.doom.hood} />
        <Path path={paths.hoodInner} color="#000000" />
        <Path path={paths.maskFace} color={THEME.flat.metal} />
        <Path path={paths.eyesSlits} color={THEME.doom.eyesGlow} />
      </Group>
    );
  }

  return (
    <Group>
      {/* 1. Aura Mística de Latvéria centrada em (cx, cy) */}
      <Circle cx={cx} cy={cy} r={size * 0.56}>
        <RadialGradient
          c={vec(cx, cy)}
          r={size * 0.56}
          colors={['rgba(16, 185, 129, 0.36)', 'rgba(6, 78, 59, 0.14)', 'rgba(0, 0, 0, 0)']}
        />
        <BlurMask style="normal" blur={22} />
      </Circle>

      {/* 2. Círculo Místico de Runas Arcanas centrado em (cx, cy) */}
      <Group transform={runeCircleTransform}>
        <Circle
          cx={0}
          cy={0}
          r={size * 0.46}
          style="stroke"
          strokeWidth={1.8}
          color={THEME.doom.runicCircle}
          opacity={0.7}
        >
          <BlurMask style="normal" blur={4} />
        </Circle>

        <Circle
          cx={0}
          cy={0}
          r={size * 0.42}
          style="stroke"
          strokeWidth={1}
          color="rgba(0, 255, 136, 0.35)"
        />

        <Group>
          <BlurMask style="normal" blur={2.5} />
          {paths.runesList.map((rp, i) => (
            <Path
              key={`doom-rune-${i}`}
              path={rp}
              style="stroke"
              strokeWidth={1.8}
              color={THEME.doom.runicCircle}
            />
          ))}
        </Group>
      </Group>

      {/* 3. Raios de Magia Arcana Verde-Esmeralda */}
      <Group opacity={lightningOpacity}>
        <LightningBranch cx={cx} cy={cy} angle={-Math.PI * 0.22} length={size * 0.72} />
        <LightningBranch cx={cx} cy={cy} angle={Math.PI * 1.22} length={size * 0.74} />
        <LightningBranch cx={cx} cy={cy} angle={-Math.PI * 0.78} length={size * 0.70} />
        <LightningBranch cx={cx} cy={cy} angle={Math.PI * 0.22} length={size * 0.72} />
      </Group>

      {/* 4. Máscara de Aço Escovado e Capuz de Victor von Doom centrados em (0,0) -> (cx, cy) */}
      <Group transform={doomTransform}>
        {/* Capuz Verde-Escuro com Sombra e Volume */}
        <Path path={paths.hoodOuter} color={THEME.doom.hood}>
          <Shadow dx={6} dy={15} blur={22} color="rgba(0, 0, 0, 0.95)" />
          <Shadow dx={-3} dy={-3} blur={8} color="rgba(52, 211, 153, 0.25)" inner />
        </Path>

        {/* Dobras do Tecido do Capuz */}
        <Path
          path={paths.hoodFolds}
          style="stroke"
          strokeWidth={1.8}
          color={THEME.doom.hoodHighlight}
          opacity={0.75}
        />

        {/* Cavidade Interna Profunda */}
        <Path path={paths.hoodInner} color={THEME.doom.hoodShadow} />

        {/* Base da Máscara Metálica com Sombra */}
        <Path path={paths.maskFace} color="#1e293b">
          <Shadow dx={4} dy={10} blur={14} color="rgba(0, 0, 0, 0.9)" />
        </Path>

        {/* Aço Escovado Realista da Máscara (Reage ao Giroscópio) */}
        <Path path={paths.maskFace} opacity={0.96}>
          <LinearGradient
            start={metalStart}
            end={metalEnd}
            colors={['#f8fafc', '#cbd5e1', '#475569', '#94a3b8', '#ffffff', '#334155']}
          />
          <Shadow dx={-2} dy={-2} blur={4} color="rgba(255, 255, 255, 0.6)" inner />
          <Shadow dx={3} dy={4} blur={6} color="rgba(0, 0, 0, 0.85)" inner />
        </Path>

        {/* Sombreamento Bilateral 3D da Máscara */}
        <Path path={paths.maskLeftPlane} color="rgba(255, 255, 255, 0.14)" />
        <Path path={paths.maskRightPlane} color="rgba(0, 0, 0, 0.26)" />

        {/* Placa Frontal da Sobrancelha e Zigomáticos */}
        <Path path={paths.maskBrow} opacity={0.45}>
          <LinearGradient
            start={vec(0, -rHalf * 0.45)}
            end={vec(0, -rHalf * 0.12)}
            colors={['#ffffff', '#0f172a']}
          />
        </Path>

        <Path
          path={paths.maskCheekplates}
          color="rgba(15, 23, 42, 0.35)"
        />

        {/* Grade Respiradora Bucal */}
        <Path
          path={paths.maskMouthGrill}
          style="stroke"
          strokeWidth={1.6}
          color="#0f172a"
        />

        {/* Rebites Metálicos Realistas */}
        {paths.rivets.map((rivet, idx) => (
          <Group key={`rivet-${idx}`}>
            <Circle cx={rivet.x} cy={rivet.y} r={2.2} color="#0f172a" />
            <Circle cx={rivet.x - 0.5} cy={rivet.y - 0.5} r={1.3} color="#e2e8f0" />
          </Group>
        ))}

        {/* 5. Olhos Brilhando em Verde-Esmeralda Intenso */}
        <Path path={paths.eyesSlits} color={THEME.doom.eyesGlow}>
          <BlurMask style="normal" blur={eyeGlowRadius} />
        </Path>
        <Path path={paths.eyesSlits} color={THEME.doom.eyesGlow} />
        <Path path={paths.eyesSlits} color="#ffffff" opacity={0.85} />
      </Group>
    </Group>
  );
};

const LightningBranch: React.FC<{
  cx: number;
  cy: number;
  angle: number;
  length: number;
}> = ({ cx, cy, angle, length }) => {
  const branchPath = useMemo(() => {
    const pts = [vec(cx, cy)];
    const segments = 5;
    const step = length / segments;
    let currX = cx;
    let currY = cy;

    for (let i = 1; i <= segments; i++) {
      const segAngle = angle + (i % 2 === 0 ? 0.24 : -0.24);
      currX += Math.cos(segAngle) * step;
      currY += Math.sin(segAngle) * step;
      pts.push(vec(currX, currY));
    }

    let svg = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      svg += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
    }

    return Skia.Path.MakeFromSVGString(svg) ?? Skia.Path.Make();
  }, [cx, cy, angle, length]);

  return (
    <Group>
      <Path
        path={branchPath}
        style="stroke"
        strokeWidth={3.8}
        color={THEME.doom.lightning}
      >
        <BlurMask style="normal" blur={6} />
      </Path>
      <Path
        path={branchPath}
        style="stroke"
        strokeWidth={1.4}
        color={THEME.doom.lightningCore}
      />
    </Group>
  );
};
