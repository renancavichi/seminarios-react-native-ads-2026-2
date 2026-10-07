import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line, useChartTransformState } from "victory-native";
import { SlideLayout } from "../components/SlideLayout";
import { ActionButton, SegmentedControl } from "../components/Controls";
import { Destaque, Nota } from "../components/Nota";
import { SERIE_GRANDE } from "../data/datasets";
import { chartFontFile, colors, space, type } from "../theme/tokens";

const EIXOS = ["x", "y", "ambos"] as const;
type Eixo = (typeof EIXOS)[number];

const CODE = `const { state } = useChartTransformState({
  scaleX: 1,
  scaleY: 1,
});

<CartesianChart
  data={SERIE_GRANDE}          // 2.000 pontos
  transformState={state}
  transformConfig={{
    pan: { dimensions: "x" },
    pinch: { enabled: true },
  }}
/>`;

export function S14Escala() {
  const [eixo, setEixo] = useState<Eixo>("x");
  const [chave, setChave] = useState(0);
  const font = useFont(chartFontFile, 12);
  const { state } = useChartTransformState({ scaleX: 1, scaleY: 1 });

  const dimensions = eixo === "ambos" ? undefined : eixo;

  return (
    <SlideLayout
      title="Escala"
      lead="Duas mil amostras num gráfico. Arraste para navegar, use a roda do mouse para aproximar, toque duas vezes para voltar."
      code={CODE}
      emphasize={[0, 8, 9]}
      controls={
        <>
          <View style={styles.metrica}>
            <Text style={styles.metricaLabel}>pontos renderizados</Text>
            <Text style={styles.metricaValor}>2.000</Text>
          </View>

          <SegmentedControl
            label="Eixos liberados"
            value={eixo}
            options={EIXOS}
            onChange={setEixo}
          />
          <ActionButton
            label="Reiniciar transformação"
            tone="accent"
            onPress={() => setChave((k) => k + 1)}
          />

          <Destaque>
            O sintoma era travar com alguns milhares de pontos. Aqui são dois
            mil, com gesto contínuo.
          </Destaque>
        </>
      }
      visual={
        <View style={styles.chartBox}>
          <CartesianChart
            key={chave}
            data={SERIE_GRANDE}
            xKey="x"
            yKeys={["y"]}
            transformState={state}
            transformConfig={{
              pan: dimensions ? { dimensions } : {},
              pinch: { enabled: true },
            }}
            domainPadding={{ top: 24, bottom: 12 }}
            xAxis={{
              font,
              lineColor: colors.grid,
              labelColor: colors.axisLabel,
              tickCount: 8,
              formatXLabel: (v) => String(Math.round(Number(v))),
            }}
            yAxis={[{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 6 }]}
          >
            {({ points }) => (
              <Line points={points.y} color={colors.series[1]} strokeWidth={1.5} />
            )}
          </CartesianChart>
        </View>
      }
    >
      <Nota titulo="Um hook, três gestos">
        useChartTransformState entrega arraste, pinça e duplo toque de uma vez. O
        transformConfig restringe o que o usuário pode fazer.
      </Nota>

      <Nota titulo="Por que continua fluido">
        A transformação é aplicada na thread de UI pelo Reanimated e o redesenho
        acontece na GPU. O JavaScript não participa do gesto.
      </Nota>

      <Nota titulo="Um canvas, não dois mil nós">
        No modelo antigo, dois mil pontos seriam milhares de views nativas.
        Aqui é uma única superfície de desenho.
      </Nota>

      <Nota titulo="viewport e domain">
        domain define os limites absolutos dos dados. viewport define a janela
        visível — é o que permite abrir o gráfico já com zoom aplicado.
      </Nota>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  chartBox: { flex: 1, padding: space.lg },
  metrica: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: space.md,
    gap: space.xs,
    marginBottom: space.md,
  },
  metricaLabel: { ...type.label, fontSize: 12, color: colors.textFaint },
  metricaValor: { fontFamily: "JetBrainsMono-Regular", fontSize: 32, color: colors.accent },
});
