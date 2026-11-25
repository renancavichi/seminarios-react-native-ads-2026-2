import { Skia, SkPath } from '@shopify/react-native-skia';

export interface FantasticFourPaths {
  numberFour: SkPath;
  bevelFour: SkPath;
  hexagonMesh: SkPath;
  singleHex: SkPath;
}

/**
 * Emblema "4" do Quarteto Fantástico matematicamente centralizado em (0, 0).
 * O centróide visual do símbolo "4" coincide exatamente com (0, 0).
 */
export function createFantasticFourPaths(size: number): FantasticFourPaths {
  const scale = size / 200;
  // Converte coordenada centrada [-100..+100] para pixels relativos a (0,0)
  const s = (u: number) => (u * scale).toFixed(2);

  // Número "4" perfeitamente centralizado em (0, 0):
  // Extensão X: de -42 a +42 (centro geométrico exato X = 0)
  // Extensão Y: de -54 a +54 (centro geométrico exato Y = 0)
  const numberFourSvg = `
    M ${s(6)} ${s(-54)}
    L ${s(26)} ${s(-54)}
    L ${s(26)} ${s(10)}
    L ${s(42)} ${s(10)}
    L ${s(42)} ${s(28)}
    L ${s(26)} ${s(28)}
    L ${s(26)} ${s(54)}
    L ${s(6)} ${s(54)}
    L ${s(6)} ${s(28)}
    L ${s(-42)} ${s(28)}
    L ${s(-42)} ${s(12)}
    L ${s(6)} ${s(-54)}
    Z
    M ${s(6)} ${s(-24)}
    L ${s(-20)} ${s(10)}
    L ${s(6)} ${s(10)}
    Z
  `;

  // Faceta chanfrada vertical e horizontal do "4" para brilho 3D
  const bevelFourSvg = `
    M ${s(6)} ${s(-54)}
    L ${s(15)} ${s(-54)}
    L ${s(15)} ${s(54)}
    L ${s(6)} ${s(54)}
    Z
    M ${s(-42)} ${s(12)}
    L ${s(6)} ${s(-54)}
    L ${s(6)} ${s(-40)}
    L ${s(-32)} ${s(12)}
    Z
  `;

  // Malha hexagonal (Colmeia de Campo de Força da Mulher Invisível) centrada em (0, 0)
  const makeHexSvg = (cx: number, cy: number, r: number) => {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = ((i * 60 - 30) * Math.PI) / 180;
      const px = (cx + r * Math.cos(a)).toFixed(2);
      const py = (cy + r * Math.sin(a)).toFixed(2);
      d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    return d + ' Z';
  };

  const hexR = 22 * scale;
  const dist = hexR * Math.sqrt(3);
  let meshSvg = makeHexSvg(0, 0, hexR);
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 * Math.PI) / 180;
    meshSvg += ' ' + makeHexSvg(dist * Math.cos(a), dist * Math.sin(a), hexR);
  }

  const singleHexSvg = makeHexSvg(0, 0, 34 * scale);

  const fallback = Skia.Path.Make();
  const parse = (svg: string) => Skia.Path.MakeFromSVGString(svg.trim()) ?? fallback;

  return {
    numberFour: parse(numberFourSvg),
    bevelFour: parse(bevelFourSvg),
    hexagonMesh: parse(meshSvg),
    singleHex: parse(singleHexSvg),
  };
}
