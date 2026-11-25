import React from 'react';
import {
  Group,
  Circle,
  SweepGradient,
  BlurMask,
  vec,
} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { OrbitalParticle } from '../types';
import { THEME } from '../constants/theme';

interface EnergyPortalProps {
  cx: number;
  cy: number;
  radius: number;
  portalRotation: SharedValue<number>;
  particles: OrbitalParticle[];
  isOverloaded: boolean;
  skiaEffectsEnabled: boolean;
}

export const EnergyPortal: React.FC<EnergyPortalProps> = ({
  cx,
  cy,
  radius,
  portalRotation,
  particles,
  isOverloaded,
  skiaEffectsEnabled,
}) => {
  const currentTheme = isOverloaded ? THEME.overload : THEME.normal;

  // Derivação do ângulo de rotação contínua do portal
  const portalTransform = useDerivedValue(() => [
    { rotate: portalRotation.value },
  ]);

  const counterRotationTransform = useDerivedValue(() => [
    { rotate: -portalRotation.value * 0.75 },
  ]);

  // Modo comparativo sem Skia (sem blur, sem partículas, apenas contorno plano estático)
  if (!skiaEffectsEnabled) {
    return (
      <Group origin={vec(cx, cy)}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          style="stroke"
          strokeWidth={3}
          color={THEME.flat.portal}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={radius - 8}
          style="stroke"
          strokeWidth={1}
          color={THEME.flat.portal}
        />
      </Group>
    );
  }

  // Gradiente do vórtice do portal
  const sweepColors = isOverloaded
    ? [
        THEME.overload.portalPrimary,
        THEME.overload.portalSecondary,
        '#ffd700',
        THEME.overload.portalPrimary,
      ]
    : [
        THEME.normal.portalPrimary,
        THEME.normal.portalSecondary,
        '#ffffff',
        THEME.normal.portalPrimary,
      ];

  return (
    <Group origin={vec(cx, cy)}>
      {/* 1. Aura Externa de Glow Intenso (1 único BlurMask GPU) */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius + 4}
        style="stroke"
        strokeWidth={isOverloaded ? 20 : 14}
        color={currentTheme.portalGlow}
      >
        <BlurMask style="normal" blur={isOverloaded ? 16 : 10} />
      </Circle>

      {/* 2. Anel Principal Giratório com SweepGradient */}
      <Group origin={vec(cx, cy)} transform={portalTransform}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          style="stroke"
          strokeWidth={5}
        >
          <SweepGradient
            c={vec(cx, cy)}
            colors={sweepColors}
          />
        </Circle>
      </Group>

      {/* 3. Segundo Anel de Contra-Rotação (efeito de vórtice quântico) */}
      <Group origin={vec(cx, cy)} transform={counterRotationTransform}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius - 6}
          style="stroke"
          strokeWidth={2.5}
        >
          <SweepGradient
            c={vec(cx, cy)}
            colors={[
              'rgba(255, 255, 255, 0.8)',
              currentTheme.portalSecondary,
              'rgba(255, 255, 255, 0.2)',
              currentTheme.portalPrimary,
            ]}
          />
          <BlurMask style="normal" blur={3} />
        </Circle>
      </Group>

      {/* 4. Núcleo Interno Incandescente */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius - 12}
        style="stroke"
        strokeWidth={1.5}
        color="rgba(255, 255, 255, 0.7)"
      />

      {/* 5. 80+ Faíscas Orbitais Luminosas */}
      {/* OTIMIZAÇÃO CRÍTICA: 1 único BlurMask no grupo pai em vez de 88 filtros offscreen! */}
      <Group>
        <BlurMask style="normal" blur={isOverloaded ? 4.5 : 3} />
        {particles.map((p) => (
          <OrbitalSparkItem
            key={p.id}
            cx={cx}
            cy={cy}
            particle={p}
            portalRotation={portalRotation}
            colors={currentTheme.sparks}
            isOverloaded={isOverloaded}
          />
        ))}
      </Group>

      {/* Núcleo pontual das faíscas para brilho cintilante nítido */}
      <Group>
        {particles.slice(0, 45).map((p) => (
          <OrbitalSparkCore
            key={`core-${p.id}`}
            cx={cx}
            cy={cy}
            particle={p}
            portalRotation={portalRotation}
          />
        ))}
      </Group>
    </Group>
  );
};

// Componente unitário de Faísca Orbital
interface OrbitalSparkItemProps {
  cx: number;
  cy: number;
  particle: OrbitalParticle;
  portalRotation: SharedValue<number>;
  colors: string[];
  isOverloaded: boolean;
}

const OrbitalSparkItem: React.FC<OrbitalSparkItemProps> = ({
  cx,
  cy,
  particle,
  portalRotation,
  colors,
  isOverloaded,
}) => {
  const sparkColor = colors[particle.colorIndex % colors.length];

  const sparkPos = useDerivedValue(() => {
    const currentAngle =
      particle.angle + portalRotation.value * particle.speed;
    const radialPulse =
      particle.baseRadius +
      Math.sin(portalRotation.value * 2.5 + particle.id) * 8;

    return vec(
      cx + radialPulse * Math.cos(currentAngle),
      cy + radialPulse * 0.84 * Math.sin(currentAngle)
    );
  });

  return (
    <Circle
      c={sparkPos}
      r={particle.size * (isOverloaded ? 1.3 : 1)}
      color={sparkColor}
      opacity={particle.opacity}
    />
  );
};

// Núcleo branco super brilhante das faíscas
const OrbitalSparkCore: React.FC<{
  cx: number;
  cy: number;
  particle: OrbitalParticle;
  portalRotation: SharedValue<number>;
}> = ({ cx, cy, particle, portalRotation }) => {
  const sparkPos = useDerivedValue(() => {
    const currentAngle =
      particle.angle + portalRotation.value * particle.speed;
    const radialPulse =
      particle.baseRadius +
      Math.sin(portalRotation.value * 2.5 + particle.id) * 8;

    return vec(
      cx + radialPulse * Math.cos(currentAngle),
      cy + radialPulse * 0.84 * Math.sin(currentAngle)
    );
  });

  return (
    <Circle
      c={sparkPos}
      r={Math.max(0.8, particle.size * 0.45)}
      color="#ffffff"
      opacity={0.85}
    />
  );
};
