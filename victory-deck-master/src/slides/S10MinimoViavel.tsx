import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line, Scatter } from "victory-native";
import { SlideLayout } from "../components/SlideLayout";
import { NumberControl, SegmentedControl, ToggleControl } from "../components/Controls";
import { Destaque, Nota } from "../components/Nota";
import { VENDAS_2026 } from "../data/datasets";
import { chartFontFile, colors, space } from "../theme/tokens";

const CURVAS = ["linear", "natural", "step"] as const;
type Curva = (typeof CURVAS)[number];

const CODE = `import { CartesianChart, Line } from "victory-native";
import { useFont } from "@shopify/react-native-skia";

const font = useFont(JetBrainsMono, 13);

<CartesianChart
  data={VENDAS_2026}
  xKey="mes"
  yKeys={["vendas"]}
  xAxis={{ font }}
  yAxis={[{ font }]}
>
  {({ points }) => (
    <Line
      points={points.vendas}
      color="#FF6B4A"
      strokeWidth={3}
      curveType="natural"
    />
  )}
</CartesianChart>`;

export function S10MinimoViavel() {
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [curveType, setCurveType] = useState<Curva>("natural");
  const [pontos, setPontos] = useState(false);
  const font = useFont(chartFontFile, 13);

  return (
    <SlideLayout
      title="O mínimo viável"
      lead="Este é o gráfico completo. Nada foi omitido do código ao lado."
      code={CODE}
      emphasize={[13, 14, 15, 16]}
      controls={
        <>
          <NumberControl
            label="strokeWidth"
            value={strokeWidth}
            onChange={setStrokeWidth}
            min={1}
            max={12}
          />
          <SegmentedControl
            label="curveType"
            value={curveType}
            options={CURVAS}
            onChange={setCurveType}
          />
          <ToggleControl label="Sobrepor <Scatter />" value={pontos} onChange={setPontos} />
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
            xAxis={{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 12 }}
            yAxis={[{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 6 }]}
          >
            {({ points }) => (
              <>
                <Line
                  points={points.vendas}
                  color={colors.series[0]}
                  strokeWidth={strokeWidth}
                  curveType={curveType}
                  animate={{ type: "timing", duration: 260 }}
                />
                {pontos && (
                  <Scatter
                    points={points.vendas}
                    shape="circle"
                    radius={5}
                    style="fill"
                    color={colors.series[1]}
                  />
                )}
              </>
            )}
          </CartesianChart>
        </View>
      }
    >
      <Destaque>
        Os controles à esquerda alteram props reais. Não há mágica: é o mesmo
        código do painel, com valores diferentes.
      </Destaque>

      <Nota titulo="Composição, não configuração">
        Ligar o Scatter não é uma flag. É adicionar um segundo elemento Skia
        dentro da mesma função, recebendo os mesmos pontos.
      </Nota>

      <Nota titulo="curveType">
        linear liga os pontos em reta, natural aplica interpolação suave, step
        desenha em degraus. A escolha muda a leitura do dado.
      </Nota>

      <Nota titulo="animate">
        Uma prop opcional. Com ela, qualquer mudança de valor vira transição em
        vez de salto.
      </Nota>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  chartBox: { flex: 1, padding: space.lg },
});
