import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import {
  Area,
  Bar,
  CartesianChart,
  Line,
  Pie,
  PolarChart,
  useChartPressState,
} from "victory-native";
import { Cursor } from "../components/Cursor";
import { ActionButton } from "../components/Controls";
import { CANAIS, TRIMESTRES, vitrineLinha, vitrineSpark } from "../data/datasets";
import { chartFontFile, colors, layout, radius, space, type } from "../theme/tokens";

/**
 * Vitrine. Quatro gráficos vivos ao mesmo tempo, todos animando juntos.
 * É o slide de prova: nenhuma explicação, só capacidade.
 */
export function S07Vitrine() {
  const [indice, setIndice] = useState(0);
  const font = useFont(chartFontFile, 12);
  const fontCursor = useFont(chartFontFile, 20);
  const { state, isActive } = useChartPressState({ x: "", y: { vendas: 0 } });

  const canais = CANAIS[indice % CANAIS.length].map((c, i) => ({
    ...c,
    cor: colors.series[i % colors.series.length],
  }));

  return (
    <View style={styles.page}>
      <View style={styles.topo}>
        <View>
          <Text style={styles.titulo}>O que dá para fazer</Text>
          <Text style={styles.lead}>
            Quatro gráficos, uma biblioteca, animando ao mesmo tempo. Arraste
            sobre o gráfico grande.
          </Text>
        </View>
        <View style={styles.acao}>
          <ActionButton
            label="Atualizar dados"
            tone="accent"
            onPress={() => setIndice((i) => i + 1)}
          />
        </View>
      </View>

      <View style={styles.grade}>
        <View style={styles.principal}>
          <Text style={styles.rotulo}>Vendas mensais · interativo</Text>
          <View style={styles.canvas}>
            <CartesianChart
              data={vitrineLinha(indice)}
              xKey="mes"
              yKeys={["vendas"]}
              chartPressState={state}
              domain={{ y: [0, 125] }}
              domainPadding={{ left: 24, right: 24, top: 28, bottom: 8 }}
              xAxis={{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 12 }}
              yAxis={[{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 5 }]}
            >
              {({ points, chartBounds }) => (
                <>
                  <Area
                    points={points.vendas}
                    y0={chartBounds.bottom}
                    color={colors.accentLine}
                    curveType="natural"
                    animate={{ type: "timing", duration: 700 }}
                  />
                  <Line
                    points={points.vendas}
                    color={colors.accent}
                    strokeWidth={3}
                    curveType="natural"
                    animate={{ type: "timing", duration: 700 }}
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
        </View>

        <View style={styles.lateral}>
          <View style={styles.cartao}>
            <Text style={styles.rotulo}>Receita por trimestre</Text>
            <View style={styles.canvas}>
              <CartesianChart
                data={TRIMESTRES[indice % TRIMESTRES.length]}
                xKey="periodo"
                yKeys={["receita"]}
                domain={{ y: [0, 230] }}
                domainPadding={{ left: 34, right: 34, top: 20, bottom: 6 }}
                xAxis={{ font, lineColor: "transparent", labelColor: colors.axisLabel }}
              >
                {({ points, chartBounds }) => (
                  <Bar
                    points={points.receita}
                    chartBounds={chartBounds}
                    color={colors.series[1]}
                    innerPadding={0.4}
                    roundedCorners={{ topLeft: 6, topRight: 6 }}
                    animate={{ type: "spring", damping: 15 }}
                  />
                )}
              </CartesianChart>
            </View>
          </View>

          <View style={styles.cartao}>
            <Text style={styles.rotulo}>Origem do tráfego</Text>
            <View style={styles.canvas}>
              <PolarChart data={canais} labelKey="rotulo" valueKey="valor" colorKey="cor">
                <Pie.Chart innerRadius="58%" />
              </PolarChart>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.faixa}>
        <Text style={styles.rotuloFaixa}>Monitoramento contínuo · 160 amostras</Text>
        <View style={styles.canvasFaixa}>
          <CartesianChart
            data={vitrineSpark(indice)}
            xKey="x"
            yKeys={["y"]}
            domain={{ y: [0, 110] }}
          >
            {({ points, chartBounds }) => (
              <>
                <Area
                  points={points.y}
                  y0={chartBounds.bottom}
                  color="rgba(76, 194, 255, 0.18)"
                  curveType="natural"
                  animate={{ type: "timing", duration: 900 }}
                />
                <Line
                  points={points.y}
                  color={colors.series[1]}
                  strokeWidth={1.5}
                  curveType="natural"
                  animate={{ type: "timing", duration: 900 }}
                />
              </>
            )}
          </CartesianChart>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: layout.pagePadding,
    paddingTop: space.md,
    paddingBottom: space.md,
    gap: space.md,
  },

  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  titulo: { ...type.title, color: colors.text },
  lead: { ...type.body, fontSize: 16, color: colors.textMuted, marginTop: space.xs, maxWidth: 640 },
  acao: { width: 200 },

  grade: { flex: 1, flexDirection: "row", gap: space.md },
  principal: { flex: 1.7, gap: space.sm },
  lateral: { flex: 1, gap: space.md },
  cartao: { flex: 1, gap: space.sm },

  rotulo: { ...type.label, fontSize: 12, color: colors.textFaint },
  canvas: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.md,
    overflow: "hidden",
  },

  faixa: { height: 110, gap: space.sm },
  rotuloFaixa: { ...type.label, fontSize: 12, color: colors.textFaint },
  canvasFaixa: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
});
