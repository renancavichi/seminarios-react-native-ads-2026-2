import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line } from "victory-native";
import { SlideLayout } from "../components/SlideLayout";
import { ActionButton, SegmentedControl } from "../components/Controls";
import { Nota } from "../components/Nota";
import { MESES, VARIACOES } from "../data/datasets";
import { chartFontFile, colors, space, type } from "../theme/tokens";

const MODOS = ["timing", "spring"] as const;
type Modo = (typeof MODOS)[number];

const CODE = `<Line
  points={points.vendas}
  animate={{ type: "spring", damping: 14 }}
/>

// A API de nível mais baixo, se você precisar:
const { path } = useLinePath(points.vendas);
const animado = useAnimatedPath(path, { type: "spring" });

<Path path={animado} style="stroke" strokeWidth={3} />`;

export function S15Animacao() {
  const [indice, setIndice] = useState(0);
  const [extra, setExtra] = useState(false);
  const [modo, setModo] = useState<Modo>("spring");
  const font = useFont(chartFontFile, 13);

  const base = VARIACOES[indice % VARIACOES.length].map((vendas, i) => ({
    mes: MESES[i],
    vendas,
  }));
  const dados = extra ? [...base, { mes: "13º", vendas: 58 }] : base;

  return (
    <SlideLayout
      title="Animação"
      lead="Uma prop resolve a transição entre estados. E existe uma restrição que vale conhecer antes de encontrar em produção."
      code={CODE}
      emphasize={[2]}
      controls={
        <>
          <SegmentedControl
            label="Tipo de animação"
            value={modo}
            options={MODOS}
            onChange={setModo}
          />
          <ActionButton
            label="Trocar valores · 12 pontos"
            tone="accent"
            onPress={() => setIndice((i) => i + 1)}
          />
          <ActionButton
            label={extra ? "Remover o 13º ponto" : "Adicionar um 13º ponto"}
            onPress={() => setExtra((v) => !v)}
          />
          <View style={[styles.contador, extra && styles.contadorAlerta]}>
            <Text style={[styles.contadorTexto, extra && styles.contadorTextoAlerta]}>
              {dados.length} pontos {extra ? "· sem animação" : "· animando"}
            </Text>
          </View>
        </>
      }
      visual={
        <View style={styles.chartBox}>
          <CartesianChart
            data={dados}
            xKey="mes"
            yKeys={["vendas"]}
            domain={{ y: [0, 120] }}
            domainPadding={{ left: 32, right: 32, top: 32, bottom: 12 }}
            xAxis={{
              font,
              lineColor: colors.grid,
              labelColor: colors.axisLabel,
              tickCount: dados.length,
            }}
            yAxis={[{ font, lineColor: colors.grid, labelColor: colors.axisLabel, tickCount: 6 }]}
          >
            {({ points }) => (
              <Line
                points={points.vendas}
                color={extra ? colors.series[2] : colors.series[0]}
                strokeWidth={3}
                curveType="natural"
                animate={
                  modo === "spring"
                    ? { type: "spring", damping: 14, stiffness: 120 }
                    : { type: "timing", duration: 450 }
                }
              />
            )}
          </CartesianChart>
        </View>
      }
    >
      <Nota titulo="Trocando valores, ele interpola">
        Doze pontos antes, doze depois. O Skia interpola cada coordenada e a
        linha se deforma suavemente de um estado ao outro, na thread de UI.
      </Nota>

      <Nota titulo="Mudando a contagem, ele salta">
        O Skia só interpola caminhos com o mesmo número de pontos. Adicione um
        ponto e a transição simplesmente não acontece.
      </Nota>

      <Nota titulo="timing e spring">
        timing usa duração fixa. spring usa física, com damping e stiffness — a
        mesma configuração do Reanimated, porque é o Reanimated por baixo.
      </Nota>

      <Nota titulo="Consequência de projeto">
        Gráfico com dados em tempo real precisa de janela de tamanho fixo:
        descarte o ponto mais antigo ao inserir o mais novo, e a animação se
        mantém.
      </Nota>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  chartBox: { flex: 1, padding: space.lg },
  contador: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: space.sm,
  },
  contadorAlerta: { borderColor: colors.series[2] },
  contadorTexto: { ...type.code, fontSize: 13, color: colors.textMuted, textAlign: "center" },
  contadorTextoAlerta: { color: colors.series[2] },
});
