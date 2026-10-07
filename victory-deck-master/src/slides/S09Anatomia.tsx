import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line } from "victory-native";
import { SlideLayout } from "../components/SlideLayout";
import { SegmentedControl } from "../components/Controls";
import { Nota } from "../components/Nota";
import { VENDAS_2026 } from "../data/datasets";
import { chartFontFile, colors, space, type } from "../theme/tokens";

const ETAPAS = ["casca", "eixos", "desenho"] as const;
type Etapa = (typeof ETAPAS)[number];

const CODE = `<CartesianChart
  data={VENDAS_2026}
  xKey="mes"
  yKeys={["vendas"]}

  xAxis={{ font }}
  yAxis={[{ font }]}
>
  {({ points, chartBounds }) => (
    <Line points={points.vendas} />
  )}
</CartesianChart>`;

const DESTAQUES: Record<Etapa, number[]> = {
  casca: [0, 1, 2, 3],
  eixos: [5, 6],
  desenho: [8, 9],
};

const EXPLICACAO: Record<Etapa, { titulo: string; texto: string }[]> = {
  casca: [
    {
      titulo: "Três props obrigatórias",
      texto:
        "data recebe o array de objetos. xKey aponta o campo do eixo horizontal. yKeys é um array com os campos de cada série.",
    },
    {
      titulo: "Por que yKeys é array",
      texto:
        "O gráfico precisa conhecer todas as séries de antemão para calcular o domínio completo dos eixos antes de desenhar qualquer coisa.",
    },
    {
      titulo: "xKey aceita número ou texto",
      texto:
        "São os tipos que o Reanimated consegue transportar para a thread de UI.",
    },
  ],
  eixos: [
    {
      titulo: "Configuração declarativa",
      texto:
        "xAxis é um objeto, yAxis é um array — é assim que se declaram múltiplos eixos verticais.",
    },
    {
      titulo: "A fonte é obrigatória",
      texto:
        "Sem um objeto de fonte, os eixos aparecem sem nenhum rótulo. Nada de erro, nada de aviso.",
    },
  ],
  desenho: [
    {
      titulo: "children é uma função",
      texto:
        "Você não passa JSX filho. Passa uma função que recebe os dados já convertidos e devolve elementos Skia.",
    },
    {
      titulo: "points",
      texto:
        "Cada ponto vira { x, xValue, y, yValue }: pixel na tela e valor original, lado a lado. O gráfico calcula, você decide o que desenhar.",
    },
    {
      titulo: "chartBounds",
      texto:
        "Traz left, right, top e bottom da área útil. É o que Bar e Area usam para saber onde é o chão do gráfico.",
    },
  ],
};

export function S09Anatomia() {
  const [etapa, setEtapa] = useState<Etapa>("casca");
  const font = useFont(chartFontFile, 13);

  const mostrarEixos = etapa !== "casca";
  const mostrarLinha = etapa === "desenho";

  return (
    <SlideLayout
      title="Anatomia de um gráfico"
      lead="A estrutura é sempre a mesma. Avance as etapas para ver cada parte entrar em cena."
      code={CODE}
      emphasize={DESTAQUES[etapa]}
      controls={
        <SegmentedControl label="Etapa" value={etapa} options={ETAPAS} onChange={setEtapa} />
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
              font: mostrarEixos ? font : null,
              lineColor: mostrarEixos ? colors.grid : "transparent",
              labelColor: colors.axisLabel,
              tickCount: 12,
            }}
            yAxis={[
              {
                font: mostrarEixos ? font : null,
                lineColor: mostrarEixos ? colors.grid : "transparent",
                labelColor: colors.axisLabel,
                tickCount: 6,
              },
            ]}
          >
            {({ points }) =>
              mostrarLinha ? (
                <Line
                  points={points.vendas}
                  color={colors.series[0]}
                  strokeWidth={3}
                  curveType="natural"
                  animate={{ type: "timing", duration: 400 }}
                />
              ) : null
            }
          </CartesianChart>

          {etapa === "casca" && (
            <View style={styles.aviso} pointerEvents="none">
              <Text style={styles.avisoTexto}>
                A casca existe e já calculou as escalas. Só não desenhou nada
                ainda.
              </Text>
            </View>
          )}
        </View>
      }
    >
      {EXPLICACAO[etapa].map((e) => (
        <Nota key={e.titulo} titulo={e.titulo}>
          {e.texto}
        </Nota>
      ))}
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  chartBox: { flex: 1, padding: space.lg },
  aviso: {
    position: "absolute",
    left: space.xl,
    right: space.xl,
    top: "44%",
    alignItems: "center",
  },
  avisoTexto: {
    ...type.body,
    fontSize: 15,
    color: colors.textFaint,
    textAlign: "center",
    maxWidth: 340,
  },
});
