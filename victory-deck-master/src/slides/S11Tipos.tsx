import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { Area, Bar, CartesianChart, Line, Pie, PolarChart, Scatter } from "victory-native";
import { SlideLayout } from "../components/SlideLayout";
import { NumberControl, SegmentedControl } from "../components/Controls";
import { Nota } from "../components/Nota";
import { VENDAS_2026 } from "../data/datasets";
import { chartFontFile, colors, space } from "../theme/tokens";

const TIPOS = ["Linha", "Área", "Barra", "Pontos", "Pizza"] as const;
type Tipo = (typeof TIPOS)[number];

const DADOS_PIZZA = [
  { rotulo: "Linha", valor: 34, cor: colors.series[0] },
  { rotulo: "Barra", valor: 26, cor: colors.series[1] },
  { rotulo: "Área", valor: 18, cor: colors.series[2] },
  { rotulo: "Pizza", valor: 14, cor: colors.series[3] },
  { rotulo: "Outros", valor: 8, cor: colors.series[4] },
];

const CODE_CARTESIANO = `// Cartesiano: mesma casca, filho diferente
<CartesianChart data={dados} xKey="mes" yKeys={["vendas"]}>
  {({ points, chartBounds }) => (
    <Bar
      points={points.vendas}
      chartBounds={chartBounds}
      innerPadding={0.35}
      roundedCorners={{ topLeft: 6, topRight: 6 }}
    />
  )}
</CartesianChart>`;

const CODE_POLAR = `// Polar: componente raiz próprio
<PolarChart
  data={DADOS}
  labelKey="rotulo"
  valueKey="valor"
  colorKey="cor"
>
  <Pie.Chart innerRadius="50%" />
</PolarChart>`;

export function S11Tipos() {
  const [tipo, setTipo] = useState<Tipo>("Linha");
  const [innerRadius, setInnerRadius] = useState(0);
  const font = useFont(chartFontFile, 13);
  const polar = tipo === "Pizza";

  return (
    <SlideLayout
      title="Tipos de gráfico"
      lead="Cinco tipos, duas famílias. Trocar de tipo cartesiano significa trocar uma linha de código."
      code={polar ? CODE_POLAR : CODE_CARTESIANO}
      emphasize={polar ? [7] : [3, 4, 5]}
      controls={
        <>
          <SegmentedControl label="Tipo" value={tipo} options={TIPOS} onChange={setTipo} />
          {polar && (
            <NumberControl
              label="innerRadius"
              value={innerRadius}
              onChange={setInnerRadius}
              min={0}
              max={80}
              step={10}
              suffix="%"
            />
          )}
        </>
      }
      visual={
        <View style={styles.chartBox}>
          {polar ? (
            <PolarChart data={DADOS_PIZZA} labelKey="rotulo" valueKey="valor" colorKey="cor">
              <Pie.Chart innerRadius={`${innerRadius}%`} />
            </PolarChart>
          ) : (
            <CartesianChart
              data={VENDAS_2026}
              xKey="mes"
              yKeys={["vendas"]}
              domain={{ y: [0, 120] }}
              domainPadding={{ left: 40, right: 40, top: 32, bottom: 12 }}
              xAxis={{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 12 }}
              yAxis={[{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 6 }]}
            >
              {({ points, chartBounds }) => {
                if (tipo === "Área") {
                  return (
                    <>
                      <Area
                        points={points.vendas}
                        y0={chartBounds.bottom}
                        color={colors.accentLine}
                        curveType="natural"
                        animate={{ type: "timing", duration: 320 }}
                      />
                      <Line
                        points={points.vendas}
                        color={colors.accent}
                        strokeWidth={2}
                        curveType="natural"
                        animate={{ type: "timing", duration: 320 }}
                      />
                    </>
                  );
                }
                if (tipo === "Barra") {
                  return (
                    <Bar
                      points={points.vendas}
                      chartBounds={chartBounds}
                      color={colors.series[0]}
                      innerPadding={0.35}
                      roundedCorners={{ topLeft: 6, topRight: 6 }}
                      animate={{ type: "spring", damping: 15 }}
                    />
                  );
                }
                if (tipo === "Pontos") {
                  return (
                    <Scatter
                      points={points.vendas}
                      shape="circle"
                      radius={7}
                      style="fill"
                      color={colors.series[0]}
                      animate={{ type: "timing", duration: 320 }}
                    />
                  );
                }
                return (
                  <Line
                    points={points.vendas}
                    color={colors.series[0]}
                    strokeWidth={3}
                    curveType="natural"
                    animate={{ type: "timing", duration: 320 }}
                  />
                );
              }}
            </CartesianChart>
          )}
        </View>
      }
    >
      <Nota titulo="Cartesianos">
        Line, Area, Bar, Scatter e Candlestick. Todos recebem points e vivem
        dentro do mesmo CartesianChart, na mesma função.
      </Nota>

      <Nota titulo="Bar precisa de chartBounds">
        Diferente dos outros, a barra precisa saber onde é o chão do gráfico para
        calcular a própria altura.
      </Nota>

      <Nota titulo="Polares">
        Pizza e rosca usam PolarChart com labelKey, valueKey e colorKey. A mesma
        pizza vira rosca só mudando innerRadius.
      </Nota>

      <Nota titulo="Combinar é o normal">
        Em Área, o que você vê são dois elementos empilhados: o preenchimento e a
        linha por cima.
      </Nota>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  chartBox: { flex: 1, padding: space.lg },
});
