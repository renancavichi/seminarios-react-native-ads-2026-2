import React from "react";
import {
  Circle,
  Line as SkiaLine,
  Text as SkiaText,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";
import { colors } from "../theme/tokens";

type Props = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  valor: SharedValue<number>;
  topo: number;
  base: number;
  font: ReturnType<typeof useFont>;
  prefixo?: string;
};

/**
 * Cursor do tooltip, desenhado em Skia.
 *
 * Todos os valores são shared values do Reanimated: a posição é atualizada
 * na thread de UI, sem passar pelo JavaScript e sem re-render do React.
 */
export function Cursor({ x, y, valor, topo, base, font, prefixo = "" }: Props) {
  const inicio = useDerivedValue(() => vec(x.value, topo));
  const fim = useDerivedValue(() => vec(x.value, base));
  const texto = useDerivedValue(() => `${prefixo}${Math.round(valor.value)}`);
  const textoX = useDerivedValue(() => x.value + 14);
  const textoY = useDerivedValue(() => y.value - 18);

  return (
    <>
      <SkiaLine p1={inicio} p2={fim} color={colors.accentLine} strokeWidth={1} />
      <Circle cx={x} cy={y} r={7} color={colors.accent} />
      {font && (
        <SkiaText x={textoX} y={textoY} text={texto} font={font} color={colors.text} />
      )}
    </>
  );
}
