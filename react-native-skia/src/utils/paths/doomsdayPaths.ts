import { Skia, SkPath } from '@shopify/react-native-skia';

export interface DoomsdayPaths {
  ring: SkPath;
  ringRim: SkPath;
  letter: SkPath;
  innerCutout: SkPath;
  arrow: SkPath;
  runes: SkPath[];
  bevelLeft: SkPath;
  bevelRight: SkPath;
}

/**
 * Todos os caminhos são gerados perfeitamente centrados na origem (0, 0).
 * O componente pai posiciona o grupo em (cx, cy) = (stageWidth / 2, stageHeight / 2).
 */
export function createDoomsdayPaths(size: number): DoomsdayPaths {
  const scale = size / 200;
  // Converte coordenada do viewBox [0..200] para coordenada centrada em (0,0) [-100..+100]
  const c = (val: number) => ((val - 100) * scale).toFixed(2);
  const r = (val: number) => (val * scale).toFixed(2);

  const rOut = 84;
  const rIn = 68;

  const startRad = (28 * Math.PI) / 180;
  const endRad = (328 * Math.PI) / 180;

  const cosS = Math.cos(startRad);
  const sinS = Math.sin(startRad);
  const cosE = Math.cos(endRad);
  const sinE = Math.sin(endRad);

  // 1. Anel Chanfrado perfeitamente centrado em (0, 0) com abertura à direita para a seta
  const ringSvg = `
    M ${c(100 + rIn * cosS)} ${c(100 + rIn * sinS)}
    L ${c(100 + rOut * cosS)} ${c(100 + rOut * sinS)}
    A ${r(rOut)} ${r(rOut)} 0 1 1 ${c(100 + rOut * cosE)} ${c(100 + rOut * sinE)}
    L ${c(100 + rIn * cosE)} ${c(100 + rIn * sinE)}
    A ${r(rIn)} ${r(rIn)} 0 1 0 ${c(100 + rIn * cosS)} ${c(100 + rIn * sinS)}
    Z
  `;

  const rRim = 89;
  const rimSvg = `
    M ${c(100 + rRim * cosS)} ${c(100 + rRim * sinS)}
    A ${r(rRim)} ${r(rRim)} 0 1 1 ${c(100 + rRim * cosE)} ${c(100 + rRim * sinE)}
  `;

  // 2. Emblema "A" de Avengers: Doomsday centrado em (0, 0)
  const letterSvg = `
    M ${c(98)} ${c(18)}
    L ${c(115)} ${c(18)}
    L ${c(135)} ${c(82)}
    L ${c(158)} ${c(82)}
    L ${c(190)} ${c(102)}
    L ${c(158)} ${c(122)}
    L ${c(138)} ${c(122)}
    L ${c(156)} ${c(180)}
    L ${c(136)} ${c(180)}
    L ${c(122)} ${c(135)}
    L ${c(92)} ${c(135)}
    L ${c(76)} ${c(180)}
    L ${c(54)} ${c(180)}
    Z
    M ${c(105)} ${c(50)}
    L ${c(120)} ${c(96)}
    L ${c(87)} ${c(96)}
    Z
  `;

  const innerCutoutSvg = `
    M ${c(105)} ${c(50)}
    L ${c(120)} ${c(96)}
    L ${c(87)} ${c(96)}
    Z
  `;

  const arrowSvg = `
    M ${c(137)} ${c(88)}
    L ${c(158)} ${c(82)}
    L ${c(190)} ${c(102)}
    L ${c(158)} ${c(122)}
    L ${c(139)} ${c(116)}
    Z
  `;

  const bevelLeftSvg = `
    M ${c(98)} ${c(18)}
    L ${c(106.5)} ${c(18)}
    L ${c(68)} ${c(180)}
    L ${c(54)} ${c(180)}
    Z
  `;

  const bevelRightSvg = `
    M ${c(106.5)} ${c(18)}
    L ${c(115)} ${c(18)}
    L ${c(156)} ${c(180)}
    L ${c(144)} ${c(180)}
    Z
  `;

  // 3. Runas Arcanas gravadas no metal
  const rune1Svg = `
    M ${c(91)} ${c(65)} L ${c(97)} ${c(72)} L ${c(91)} ${c(79)}
    M ${c(94)} ${c(62)} L ${c(94)} ${c(82)}
  `;
  const rune2Svg = `
    M ${c(81)} ${c(108)} L ${c(87)} ${c(114)} L ${c(81)} ${c(120)}
    M ${c(84)} ${c(105)} L ${c(84)} ${c(123)}
    M ${c(80)} ${c(114)} L ${c(88)} ${c(114)}
  `;
  const rune3Svg = `
    M ${c(69)} ${c(148)} L ${c(75)} ${c(154)} L ${c(69)} ${c(160)}
    M ${c(72)} ${c(145)} L ${c(72)} ${c(163)}
  `;
  const rune4Svg = `
    M ${c(143)} ${c(148)} L ${c(137)} ${c(154)} L ${c(143)} ${c(160)}
    M ${c(140)} ${c(145)} L ${c(140)} ${c(163)}
  `;
  const rune5Svg = `
    M ${c(104)} ${c(28)} L ${c(110)} ${c(34)} L ${c(104)} ${c(40)}
    M ${c(107)} ${c(25)} L ${c(107)} ${c(43)}
  `;
  const rune6Svg = `
    M ${c(21)} ${c(94)} L ${c(27)} ${c(100)} L ${c(21)} ${c(106)}
    M ${c(24)} ${c(91)} L ${c(24)} ${c(109)}
  `;

  const fallback = Skia.Path.Make();
  const parse = (svg: string) => Skia.Path.MakeFromSVGString(svg.trim()) ?? fallback;

  return {
    ring: parse(ringSvg),
    ringRim: parse(rimSvg),
    letter: parse(letterSvg),
    innerCutout: parse(innerCutoutSvg),
    arrow: parse(arrowSvg),
    bevelLeft: parse(bevelLeftSvg),
    bevelRight: parse(bevelRightSvg),
    runes: [
      parse(rune1Svg),
      parse(rune2Svg),
      parse(rune3Svg),
      parse(rune4Svg),
      parse(rune5Svg),
      parse(rune6Svg),
    ],
  };
}
