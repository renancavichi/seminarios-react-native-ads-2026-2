export interface Star {
  id: number;
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
}

export interface OrbitalParticle {
  id: number;
  baseRadius: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  colorIndex: number;
  zOffset: number; // para simular profundidade elíptica 3D
}

export interface ExplosionSpark {
  id: number;
  originX: number;
  originY: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  progress: number; // 0 a 1
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  active: boolean;
}
