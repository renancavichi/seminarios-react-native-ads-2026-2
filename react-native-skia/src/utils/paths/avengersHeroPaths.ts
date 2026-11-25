import { Skia, SkPath } from '@shopify/react-native-skia';

export interface CapShieldPaths {
  star: SkPath;
  starLightFacets: SkPath;
  starDarkFacets: SkPath;
  radii: {
    outerRed: number;
    silverRing: number;
    innerRed: number;
    blueCore: number;
  };
}

/**
 * Escudo de Vibranium do Capitão América matematicamente centrado em (0, 0).
 * Os 10 vértices da estrela de 5 pontas são calculados com Math.cos e Math.sin
 * usando a razão áurea exata do pentagrama regular (0.381966).
 */
export function createCapShieldPaths(size: number): CapShieldPaths {
  const scale = size / 200;

  const radii = {
    outerRed: 88 * scale,
    silverRing: 70 * scale,
    innerRed: 53 * scale,
    blueCore: 36.5 * scale,
  };

  // Cálculo matemático exato dos 10 vértices da estrela de 5 pontas em torno de (0, 0)
  const rOut = 35.5 * scale;
  const rIn = rOut * 0.381966011; // Razão exata sin(18°) / sin(54°)
  const pts: { x: number; y: number }[] = [];

  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const angle = ((i * 36 - 90) * Math.PI) / 180;
    pts.push({
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    });
  }

  let starSvg = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < 10; i++) {
    starSvg += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
  }
  starSvg += ' Z';

  // Facetas 3D da estrela (5 faces iluminadas e 5 faces sombreadas convergindo em (0, 0))
  let lightFacetsSvg = '';
  let darkFacetsSvg = '';
  for (let k = 0; k < 5; k++) {
    const tip = pts[k * 2];
    const nextValley = pts[(k * 2 + 1) % 10];
    const prevValley = pts[(k * 2 + 9) % 10];

    lightFacetsSvg += ` M 0 0 L ${tip.x.toFixed(2)} ${tip.y.toFixed(2)} L ${prevValley.x.toFixed(2)} ${prevValley.y.toFixed(2)} Z`;
    darkFacetsSvg += ` M 0 0 L ${tip.x.toFixed(2)} ${tip.y.toFixed(2)} L ${nextValley.x.toFixed(2)} ${nextValley.y.toFixed(2)} Z`;
  }

  const fallback = Skia.Path.Make();
  const parse = (svg: string) => Skia.Path.MakeFromSVGString(svg.trim()) ?? fallback;

  return {
    star: parse(starSvg),
    starLightFacets: parse(lightFacetsSvg),
    starDarkFacets: parse(darkFacetsSvg),
    radii,
  };
}
