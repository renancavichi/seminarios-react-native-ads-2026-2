import { Skia, SkPath } from '@shopify/react-native-skia';

export interface XMenPaths {
  letterX: SkPath;
  bevelTopLeft: SkPath;
  bevelTopRight: SkPath;
  bevelBottomLeft: SkPath;
  bevelBottomRight: SkPath;
  clawSlashes: SkPath;
}

/**
 * Emblema "X" dos X-Men matematicamente simétrico e centrado em (0, 0).
 */
export function createXMenPaths(size: number): XMenPaths {
  const scale = size / 200;
  // Converte coordenada centrada [-100..+100] para pixels relativos a (0,0)
  const s = (u: number) => (u * scale).toFixed(2);

  // Emblema "X" 100% simétrico nos 4 quadrantes ao redor de (0, 0)
  const letterXSvg = `
    M ${s(-52)} ${s(-52)}
    L ${s(-24)} ${s(-52)}
    L ${s(0)} ${s(-18)}
    L ${s(24)} ${s(-52)}
    L ${s(52)} ${s(-52)}
    L ${s(18)} ${s(0)}
    L ${s(52)} ${s(52)}
    L ${s(24)} ${s(52)}
    L ${s(0)} ${s(18)}
    L ${s(-24)} ${s(52)}
    L ${s(-52)} ${s(52)}
    L ${s(-18)} ${s(0)}
    Z
  `;

  // 4 Facetas chanfradas convergindo no centro exato (0, 0) para efeito 3D metálico
  const bevelTLSvg = `
    M ${s(-52)} ${s(-52)} L ${s(0)} ${s(0)} L ${s(-24)} ${s(-52)} Z
  `;
  const bevelTRSvg = `
    M ${s(24)} ${s(-52)} L ${s(0)} ${s(0)} L ${s(52)} ${s(-52)} Z
  `;
  const bevelBLSvg = `
    M ${s(-52)} ${s(52)} L ${s(0)} ${s(0)} L ${s(-24)} ${s(52)} Z
  `;
  const bevelBRSvg = `
    M ${s(24)} ${s(52)} L ${s(0)} ${s(0)} L ${s(52)} ${s(52)} Z
  `;

  // 3 Cortes diagonais afiados de Garras de Adamantium centrados em (0, 0)
  const clawSlashesSvg = `
    M ${s(-78)} ${s(-50)} Q ${s(-18)} ${s(-22)} ${s(54)} ${s(76)}
    Q ${s(-14)} ${s(-16)} ${s(-78)} ${s(-50)} Z
    M ${s(-64)} ${s(-64)} Q ${s(0)} ${s(0)} ${s(64)} ${s(64)}
    Q ${s(4)} ${s(-4)} ${s(-64)} ${s(-64)} Z
    M ${s(-50)} ${s(-78)} Q ${s(22)} ${s(-18)} ${s(76)} ${s(54)}
    Q ${s(16)} ${s(-14)} ${s(-50)} ${s(-78)} Z
  `;

  const fallback = Skia.Path.Make();
  const parse = (svg: string) => Skia.Path.MakeFromSVGString(svg.trim()) ?? fallback;

  return {
    letterX: parse(letterXSvg),
    bevelTopLeft: parse(bevelTLSvg),
    bevelTopRight: parse(bevelTRSvg),
    bevelBottomLeft: parse(bevelBLSvg),
    bevelBottomRight: parse(bevelBRSvg),
    clawSlashes: parse(clawSlashesSvg),
  };
}
