import { Star, OrbitalParticle } from '../types';
import { THEME } from '../constants/theme';

export function generateStars(width: number, height: number): {
  distantStars: Star[];
  foregroundStars: Star[];
} {
  const distantStars: Star[] = [];
  for (let i = 0; i < THEME.counts.distantStars; i++) {
    distantStars.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.6 + Math.random() * 1.0,
      alpha: 0.25 + Math.random() * 0.65,
      twinkleSpeed: 0.5 + Math.random() * 2.0,
    });
  }

  const foregroundStars: Star[] = [];
  for (let i = 0; i < THEME.counts.foregroundStardust; i++) {
    foregroundStars.push({
      id: i + 1000,
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.4 + Math.random() * 2.0,
      alpha: 0.4 + Math.random() * 0.5,
      twinkleSpeed: 0.8 + Math.random() * 2.5,
    });
  }

  return { distantStars, foregroundStars };
}

export function generateOrbitalSparks(portalRadius: number): OrbitalParticle[] {
  const particles: OrbitalParticle[] = [];
  const count = THEME.counts.orbitalSparks;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    // Variação de raio formando uma coroa energética espessa
    const rVariation = (Math.random() - 0.5) * (portalRadius * 0.55);
    const baseRadius = portalRadius + rVariation;
    const speed = (0.7 + Math.random() * 1.2) * (Math.random() > 0.15 ? 1 : -0.7);

    particles.push({
      id: i,
      baseRadius,
      angle,
      speed,
      size: 1.5 + Math.random() * 3.2,
      opacity: 0.4 + Math.random() * 0.6,
      colorIndex: Math.floor(Math.random() * 5),
      zOffset: Math.sin(angle) * 15,
    });
  }

  return particles;
}
