import { Skia, SkPath } from '@shopify/react-native-skia';

export interface AvengersPaths {
  ring: SkPath;
  ringRim: SkPath;
  letter: SkPath;
  innerCutout: SkPath;
  arrow: SkPath;
  bevelLeft: SkPath;
  bevelRight: SkPath;
}

/**
 * Gera os caminhos SVG precisos do logotipo cinematográfico dos Vingadores
 * no espaço coordenado 200x200 e converte para SkPath com fator de escala ajustável.
 */
export function createAvengersPaths(size: number): AvengersPaths {
  const scale = size / 200;

  // Função auxiliar para formatar coordenadas em um path SVG
  const s = (val: number) => (val * scale).toFixed(2);

  // 1. Anel externo com corte para a passagem da flecha
  // Inicia em 28 graus, percorre até 328 graus, com espessura de 16 unidades
  const rOut = 84;
  const rIn = 68;
  const cx = 100;
  const cy = 100;

  const startRad = (28 * Math.PI) / 180;
  const endRad = (328 * Math.PI) / 180;

  const cosS = Math.cos(startRad);
  const sinS = Math.sin(startRad);
  const cosE = Math.cos(endRad);
  const sinE = Math.sin(endRad);

  const xOutStart = cx + rOut * cosS;
  const yOutStart = cy + rOut * sinS;
  const xOutEnd = cx + rOut * cosE;
  const yOutEnd = cy + rOut * sinE;

  const xInStart = cx + rIn * cosS;
  const yInStart = cy + rIn * sinS;
  const xInEnd = cx + rIn * cosE;
  const yInEnd = cy + rIn * sinE;

  // Path do anel: arco externo no sentido horário (sweep 1) e arco interno no anti-horário (sweep 0)
  const ringSvg = `
    M ${s(xInStart)} ${s(yInStart)}
    L ${s(xOutStart)} ${s(yOutStart)}
    A ${s(rOut)} ${s(rOut)} 0 1 1 ${s(xOutEnd)} ${s(yOutEnd)}
    L ${s(xInEnd)} ${s(yInEnd)}
    A ${s(rIn)} ${s(rIn)} 0 1 0 ${s(xInStart)} ${s(yInStart)}
    Z
  `;

  // 2. Borda fina externa decorativa (Rim)
  const rRim = 89;
  const xRimStart = cx + rRim * cosS;
  const yRimStart = cy + rRim * sinS;
  const xRimEnd = cx + rRim * cosE;
  const yRimEnd = cy + rRim * sinE;

  const rimSvg = `
    M ${s(xRimStart)} ${s(yRimStart)}
    A ${s(rRim)} ${s(rRim)} 0 1 1 ${s(xRimEnd)} ${s(yRimEnd)}
  `;

  // 3. Emblema estilizado "A" com a famosa seta embutida
  // Letra inclinada com a perna direita atravessando a abertura do anel
  const letterSvg = `
    M ${s(98)} ${s(22)}
    L ${s(115)} ${s(22)}
    L ${s(134)} ${s(84)}
    L ${s(156)} ${s(84)}
    L ${s(188)} ${s(102)}
    L ${s(156)} ${s(120)}
    L ${s(137)} ${s(120)}
    L ${s(156)} ${s(178)}
    L ${s(136)} ${s(178)}
    L ${s(122)} ${s(134)}
    L ${s(94)} ${s(134)}
    L ${s(78)} ${s(178)}
    L ${s(56)} ${s(178)}
    Z
    M ${s(105)} ${s(52)}
    L ${s(120)} ${s(96)}
    L ${s(88)} ${s(96)}
    Z
  `;

  // 4. Corte interno do triângulo do "A" (para efeitos isolados)
  const innerCutoutSvg = `
    M ${s(105)} ${s(52)}
    L ${s(120)} ${s(96)}
    L ${s(88)} ${s(96)}
    Z
  `;

  // 5. Ponta da seta destacada (para gradientes de ponta)
  const arrowSvg = `
    M ${s(138)} ${s(90)}
    L ${s(156)} ${s(84)}
    L ${s(188)} ${s(102)}
    L ${s(156)} ${s(120)}
    L ${s(139)} ${s(114)}
    Z
  `;

  // 6. Faceta esquerda para iluminação chanfrada (Bevel Left)
  const bevelLeftSvg = `
    M ${s(98)} ${s(22)}
    L ${s(107)} ${s(22)}
    L ${s(70)} ${s(178)}
    L ${s(56)} ${s(178)}
    Z
  `;

  // 7. Faceta direita chanfrada (Bevel Right)
  const bevelRightSvg = `
    M ${s(107)} ${s(22)}
    L ${s(115)} ${s(22)}
    L ${s(156)} ${s(178)}
    L ${s(144)} ${s(178)}
    Z
  `;

  const fallback = Skia.Path.Make();

  return {
    ring: Skia.Path.MakeFromSVGString(ringSvg.trim()) ?? fallback,
    ringRim: Skia.Path.MakeFromSVGString(rimSvg.trim()) ?? fallback,
    letter: Skia.Path.MakeFromSVGString(letterSvg.trim()) ?? fallback,
    innerCutout: Skia.Path.MakeFromSVGString(innerCutoutSvg.trim()) ?? fallback,
    arrow: Skia.Path.MakeFromSVGString(arrowSvg.trim()) ?? fallback,
    bevelLeft: Skia.Path.MakeFromSVGString(bevelLeftSvg.trim()) ?? fallback,
    bevelRight: Skia.Path.MakeFromSVGString(bevelRightSvg.trim()) ?? fallback,
  };
}
