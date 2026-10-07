import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line } from "victory-native";
import { SlideLayout } from "../components/SlideLayout";
import { NumberControl, SegmentedControl, ToggleControl } from "../components/Controls";
import { Destaque, Nota } from "../components/Nota";
import { VENDAS_2026 } from "../data/datasets";
import { chartFontFile, colors, space } from "../theme/tokens";

const POSICOES = ["outset", "inset"] as const;
type Posicao = (typeof POSICOES)[number];

const CODE = `const font = useFont(JetBrainsMono, 13);

<CartesianChart
  xAxis={{
    font,                       // sem isto, nada de rótulo
    tickCount: 12,
    labelPosition: "outset",
    labelColor: "#9B9BA2",
    lineColor: "rgba(255,255,255,0.1)",
    formatXLabel: (v) => String(v).toUpperCase(),
  }}
  yAxis={[{ font, tickCount: 6 }]}
/>`;

export function S12Eixos() {
  const [comFonte, setComFonte] = useState(true);
  const [tickY, setTickY] = useState(6);
  const [grade, setGrade] = useState(true);
  const [posicao, setPosicao] = useState<Posicao>("outset");
  const font = useFont(chartFontFile, 13);

  return (
    <SlideLayout
      title="Eixos e aparência"
      lead="Toda a configuração visual é declarativa. E há uma regra que economiza uma hora de depuração."
      code={CODE}
      emphasize={[4]}
      controls={
        <>
          <ToggleControl label="Passar font" value={comFonte} onChange={setComFonte} />
          <NumberControl
            label="yAxis tickCount"
            value={tickY}
            onChange={setTickY}
            min={2}
            max={12}
          />
          <ToggleControl label="Linhas de grade" value={grade} onChange={setGrade} />
          <SegmentedControl
            label="labelPosition"
            value={posicao}
            options={POSICOES}
            onChange={setPosicao}
          />
        </>
      }
      visual={
        <View style={styles.chartBox}>
          <CartesianChart
            data={VENDAS_2026}
            xKey="mes"
            yKeys={["vendas"]}
            domain={{ y: [0, 120] }}
            domainPadding={{ left: 32, right: 32, top: 32, bottom: 12 }}
            xAxis={{
              font: comFonte ? font : null,
              lineColor: grade ? colors.grid : "transparent",
              labelColor: colors.axisLabel,
              labelPosition: posicao,
              tickCount: 12,
            }}
            yAxis={[
              {
                font: comFonte ? font : null,
                lineColor: grade ? colors.grid : "transparent",
                labelColor: colors.axisLabel,
                labelPosition: posicao,
                tickCount: tickY,
              },
            ]}
          >
            {({ points }) => (
              <Line
                points={points.vendas}
                color={colors.series[0]}
                strokeWidth={3}
                curveType="natural"
              />
            )}
          </CartesianChart>
        </View>
      }
    >
      <Destaque>
        Desligue "Passar font" e os rótulos desaparecem. Sem erro, sem aviso no
        console.
      </Destaque>

      <Nota titulo="Por que a fonte é obrigatória">
        O gráfico é desenhado na GPU pelo Skia, que não tem acesso às fontes do
        sistema. É preciso carregar um arquivo real de fonte e entregá-lo ao
        gráfico.
      </Nota>

      <Nota titulo="yAxis é um array">
        Daí a sintaxe com colchetes. É assim que se declaram múltiplos eixos
        verticais, cada um com os seus próprios yKeys.
      </Nota>

      <Nota titulo="formatXLabel">
        Recebe o valor e devolve o texto. Aceita quebra de linha, e devolver
        string vazia esconde o rótulo sem reservar espaço.
      </Nota>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  chartBox: { flex: 1, padding: space.lg },
});
