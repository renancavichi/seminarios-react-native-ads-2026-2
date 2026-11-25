import { Skia, SkPath } from '@shopify/react-native-skia';

export interface DoomMaskPaths {
  hoodOuter: SkPath;
  hoodInner: SkPath;
  hoodFolds: SkPath;
  maskFace: SkPath;
  maskLeftPlane: SkPath;
  maskRightPlane: SkPath;
  maskBrow: SkPath;
  maskCheekplates: SkPath;
  maskMouthGrill: SkPath;
  eyesSlits: SkPath;
  rivets: { x: number; y: number }[];
  runesList: SkPath[];
}

/**
 * Geometria realista da Máscara de Aço Escovado e Capuz de Victor von Doom
 * 100% simétrica e centrada na origem (0, 0).
 */
export function createDoomMaskPaths(size: number): DoomMaskPaths {
  const scale = size / 200;
  // Converte coordenadas de [-100..+100] para pixels centrados em (0, 0)
  const s = (u: number) => (u * scale).toFixed(2);

  // 1. Capuz Verde-Escuro de Latvéria (Simétrico em relação a x = 0)
  const hoodOuterSvg = `
    M ${s(0)} ${s(-88)}
    C ${s(-48)} ${s(-82)} ${s(-74)} ${s(-38)} ${s(-72)} ${s(22)}
    C ${s(-70)} ${s(58)} ${s(-82)} ${s(84)} ${s(-86)} ${s(90)}
    C ${s(-58)} ${s(88)} ${s(-30)} ${s(80)} ${s(0)} ${s(82)}
    C ${s(30)} ${s(80)} ${s(58)} ${s(88)} ${s(86)} ${s(90)}
    C ${s(82)} ${s(84)} ${s(70)} ${s(58)} ${s(72)} ${s(22)}
    C ${s(74)} ${s(-38)} ${s(48)} ${s(-82)} ${s(0)} ${s(-88)}
    Z
  `;

  const hoodInnerSvg = `
    M ${s(0)} ${s(-70)}
    C ${s(-36)} ${s(-66)} ${s(-54)} ${s(-28)} ${s(-50)} ${s(18)}
    C ${s(-48)} ${s(50)} ${s(-34)} ${s(70)} ${s(0)} ${s(74)}
    C ${s(34)} ${s(70)} ${s(48)} ${s(50)} ${s(50)} ${s(18)}
    C ${s(54)} ${s(-28)} ${s(36)} ${s(-66)} ${s(0)} ${s(-70)}
    Z
  `;

  const hoodFoldsSvg = `
    M ${s(0)} ${s(-88)} L ${s(0)} ${s(-54)}
    M ${s(-56)} ${s(-12)} C ${s(-62)} ${s(26)} ${s(-68)} ${s(56)} ${s(-78)} ${s(82)}
    M ${s(56)} ${s(-12)} C ${s(62)} ${s(26)} ${s(68)} ${s(56)} ${s(78)} ${s(82)}
    M ${s(-38)} ${s(-58)} C ${s(-58)} ${s(-25)} ${s(-58)} ${s(20)} ${s(-52)} ${s(64)}
    M ${s(38)} ${s(-58)} C ${s(58)} ${s(-25)} ${s(58)} ${s(20)} ${s(52)} ${s(64)}
  `;

  // 2. Máscara de Aço Forjado de Victor von Doom
  const maskFaceSvg = `
    M ${s(0)} ${s(-54)}
    L ${s(28)} ${s(-50)}
    L ${s(40)} ${s(-22)}
    L ${s(36)} ${s(22)}
    L ${s(24)} ${s(54)}
    L ${s(0)} ${s(66)}
    L ${s(-24)} ${s(54)}
    L ${s(-36)} ${s(22)}
    L ${s(-40)} ${s(-22)}
    L ${s(-28)} ${s(-50)}
    Z
  `;

  // Metade esquerda e direita para iluminação metálica chanfrada 3D
  const maskLeftPlaneSvg = `
    M ${s(0)} ${s(-54)}
    L ${s(0)} ${s(66)}
    L ${s(-24)} ${s(54)}
    L ${s(-36)} ${s(22)}
    L ${s(-40)} ${s(-22)}
    L ${s(-28)} ${s(-50)}
    Z
  `;

  const maskRightPlaneSvg = `
    M ${s(0)} ${s(-54)}
    L ${s(28)} ${s(-50)}
    L ${s(40)} ${s(-22)}
    L ${s(36)} ${s(22)}
    L ${s(24)} ${s(54)}
    L ${s(0)} ${s(66)}
    Z
  `;

  // Sobrancelha blindada em V
  const maskBrowSvg = `
    M ${s(-32)} ${s(-42)}
    L ${s(0)} ${s(-34)}
    L ${s(32)} ${s(-42)}
    L ${s(36)} ${s(-24)}
    L ${s(0)} ${s(-14)}
    L ${s(-36)} ${s(-24)}
    Z
  `;

  // Placas zigomáticas e ponte nasal
  const maskCheekplatesSvg = `
    M ${s(0)} ${s(-16)} L ${s(-6)} ${s(14)} L ${s(0)} ${s(18)} L ${s(6)} ${s(14)} Z
    M ${s(-36)} ${s(-2)} L ${s(-14)} ${s(8)} L ${s(-18)} ${s(30)} L ${s(-34)} ${s(20)} Z
    M ${s(36)} ${s(-2)} L ${s(14)} ${s(8)} L ${s(18)} ${s(30)} L ${s(34)} ${s(20)} Z
  `;

  // Respirador / Grade bucal metálica
  const maskMouthGrillSvg = `
    M ${s(-14)} ${s(28)} L ${s(14)} ${s(28)} L ${s(18)} ${s(48)} L ${s(-18)} ${s(48)} Z
    M ${s(-12)} ${s(34)} L ${s(12)} ${s(34)}
    M ${s(-14)} ${s(40)} L ${s(14)} ${s(40)}
    M ${s(0)} ${s(28)} L ${s(0)} ${s(48)}
    M ${s(-7)} ${s(28)} L ${s(-7)} ${s(48)}
    M ${s(7)} ${s(28)} L ${s(7)} ${s(48)}
  `;

  // Fendas oculares brilhando em verde intenso
  const eyesSlitsSvg = `
    M ${s(-28)} ${s(-17)}
    L ${s(-9)} ${s(-11)}
    L ${s(-12)} ${s(-4)}
    L ${s(-26)} ${s(-8)}
    Z
    M ${s(28)} ${s(-17)}
    L ${s(9)} ${s(-11)}
    L ${s(12)} ${s(-4)}
    L ${s(26)} ${s(-8)}
    Z
  `;

  // Rebites metálicos ao redor da máscara
  const rawRivets = [
    [-23, -45], [23, -45],
    [-34, -20], [34, -20],
    [-32, 16], [32, 16],
    [-20, 48], [20, 48],
    [-8, 57], [8, 57],
  ];
  const rivets = rawRivets.map(([rx, ry]) => ({
    x: rx * scale,
    y: ry * scale,
  }));

  // 10 Runas em órbita circular centradas em (0, 0)
  const runesList: SkPath[] = [];
  const rCircle = 92 * scale;
  const runeCount = 10;
  for (let i = 0; i < runeCount; i++) {
    const angle = (i / runeCount) * Math.PI * 2;
    const rx = rCircle * Math.cos(angle);
    const ry = rCircle * Math.sin(angle);
    const rs = 6.5 * scale;
    const rSvg = `
      M ${(rx - rs).toFixed(1)} ${(ry - rs).toFixed(1)} L ${(rx + rs).toFixed(1)} ${(ry + rs).toFixed(1)}
      M ${(rx - rs).toFixed(1)} ${(ry + rs).toFixed(1)} L ${(rx + rs).toFixed(1)} ${(ry - rs).toFixed(1)}
      M ${rx.toFixed(1)} ${(ry - rs * 1.35).toFixed(1)} L ${rx.toFixed(1)} ${(ry + rs * 1.35).toFixed(1)}
    `;
    runesList.push(Skia.Path.MakeFromSVGString(rSvg.trim()) ?? Skia.Path.Make());
  }

  const fallback = Skia.Path.Make();
  const parse = (svg: string) => Skia.Path.MakeFromSVGString(svg.trim()) ?? fallback;

  return {
    hoodOuter: parse(hoodOuterSvg),
    hoodInner: parse(hoodInnerSvg),
    hoodFolds: parse(hoodFoldsSvg),
    maskFace: parse(maskFaceSvg),
    maskLeftPlane: parse(maskLeftPlaneSvg),
    maskRightPlane: parse(maskRightPlaneSvg),
    maskBrow: parse(maskBrowSvg),
    maskCheekplates: parse(maskCheekplatesSvg),
    maskMouthGrill: parse(maskMouthGrillSvg),
    eyesSlits: parse(eyesSlitsSvg),
    rivets,
    runesList,
  };
}
