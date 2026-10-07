import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { Area, CartesianChart, Line, useChartPressState } from "victory-native";
import { SlideLayout } from "../components/SlideLayout";
import { Cursor } from "../components/Cursor";
import { Destaque, Nota } from "../components/Nota";
import { VENDAS_2026 } from "../data/datasets";
import { chartFontFile, colors, space, type } from "../theme/tokens";

const CODE = `const { state, isActive } = useChartPressState({
  x: "",
  y: { vendas: 0 },
});

<CartesianChart chartPressState={state}>
  {({ points, chartBounds }) => (
    <>
      <Line points={points.vendas} />
      {isActive && (
        <Cursor
          x={state.x.position}          // pixel
          y={state.y.vendas.position}   // pixel
          valor={state.y.vendas.value}  // dado
        />
      )}
    </>
  )}
</CartesianChart>`;

export function S13Interacao() {
  const { state, isActive } = useChartPressState({ x: "", y: { vendas: 0 } });
  const font = useFont(chartFontFile, 13);
  const fontCursor = useFont(chartFontFile, 22);

  return (
    <SlideLayout
      title="Interação"
      lead="Arraste sobre o gráfico. O valor acompanha o dedo sem que o React renderize uma única vez."
      code={CODE}
      emphasize={[0, 5]}
      controls={
        <>
          <View style={styles.dica}>
            <Text style={styles.dicaTexto}>Arraste sobre o gráfico ao lado</Text>
          </View>

          <Destaque>
            No slide sobre custos, o sintoma era o tooltip atrasado em relação ao
            dedo. Aqui o gesto não passa mais pelo JavaScript.
          </Destaque>
        </>
      }
      visual={
        <View style={styles.chartBox}>
          <CartesianChart
            data={VENDAS_2026}
            xKey="mes"
            yKeys={["vendas"]}
            chartPressState={state}
            domain={{ y: [0, 120] }}
            domainPadding={{ left: 32, right: 32, top: 44, bottom: 12 }}
            xAxis={{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 12 }}
            yAxis={[{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 6 }]}
          >
            {({ points, chartBounds }) => (
              <>
                <Area
                  points={points.vendas}
                  y0={chartBounds.bottom}
                  color="rgba(255, 107, 74, 0.16)"
                  curveType="natural"
                />
                <Line
                  points={points.vendas}
                  color={colors.series[0]}
                  strokeWidth={3}
                  curveType="natural"
                />
                {isActive && (
                  <Cursor
                    x={state.x.position}
                    y={state.y.vendas.position}
                    valor={state.y.vendas.value}
                    topo={chartBounds.top}
                    base={chartBounds.bottom}
                    font={fontCursor}
                  />
                )}
              </>
            )}
          </CartesianChart>
        </View>
      }
    >
      <Nota titulo="O valor vive num shared value">
        O hook devolve valores compartilhados do Reanimated. A atualização
        acontece na thread de UI: sem ponte, sem re-render, sem perda de quadros.
      </Nota>

      <Nota titulo="value e position">
        Cada eixo expõe dois campos. value é o dado original, position é o pixel
        na tela. O tooltip usa os dois ao mesmo tempo.
      </Nota>

      <Nota titulo="O cursor é desenhado em Skia">
        A linha vertical, o círculo e o número são elementos Skia dentro do mesmo
        canvas — não são views do React Native posicionadas por cima.
      </Nota>

      <Nota titulo="Limitação a registrar">
        O rastreamento usa apenas a coordenada horizontal. O gráfico devolve o
        ponto mais próximo em x, sem detecção por proximidade vertical.
      </Nota>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  chartBox: { flex: 1, padding: space.lg },
  dica: {
    borderWidth: 1,
    borderColor: colors.accentLine,
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    padding: space.md,
    marginBottom: space.md,
  },
  dicaTexto: { ...type.label, color: colors.accent, textAlign: "center" },
});
