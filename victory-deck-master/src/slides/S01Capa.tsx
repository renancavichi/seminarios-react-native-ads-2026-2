import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Area, CartesianChart, Line } from "victory-native";
import { SPARK, capaData } from "../data/datasets";
import { colors, layout, space, type } from "../theme/tokens";

/**
 * Capa. O gráfico de fundo é feito com a própria biblioteca: ela já está
 * trabalhando antes da primeira palavra da apresentação.
 */
export function S01Capa() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndice((i) => i + 1), 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.fundo} pointerEvents="none">
        <CartesianChart
          data={capaData(indice)}
          xKey="x"
          yKeys={["y"]}
          domain={{ y: [0, 130] }}
          domainPadding={{ top: 20 }}
        >
          {({ points, chartBounds }) => (
            <>
              <Area
                points={points.y}
                y0={chartBounds.bottom}
                color={colors.accentLine}
                curveType="natural"
                animate={{ type: "timing", duration: 1600 }}
              />
              <Line
                points={points.y}
                color={colors.accent}
                strokeWidth={3}
                curveType="natural"
                animate={{ type: "timing", duration: 1600 }}
              />
            </>
          )}
        </CartesianChart>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.materia}>React Native · Seminário</Text>
        <Text style={styles.titulo}>Victory Native</Text>
        <Text style={styles.subtitulo}>
          Visualização de dados em React Native com renderização por GPU
        </Text>
        <View style={styles.regua} />
        <Text style={styles.autor}>Arthur de Morais Marques</Text>
      </View>

      <View style={styles.faixa} pointerEvents="none">
        <CartesianChart data={SPARK} xKey="x" yKeys={["y"]}>
          {({ points }) => (
            <Line points={points.y} color={colors.series[1]} strokeWidth={1.5} />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", paddingHorizontal: layout.pagePadding },

  fundo: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: "34%",
    opacity: 0.22,
  },
  faixa: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    opacity: 0.28,
  },

  conteudo: { maxWidth: 820, width: "100%" },
  materia: {
    ...type.label,
    fontSize: 16,
    color: colors.accent,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: space.lg,
  },
  titulo: {
    fontFamily: "Inter-SemiBold",
    fontSize: 84,
    lineHeight: 92,
    color: colors.text,
    letterSpacing: -2,
  },
  subtitulo: {
    ...type.lead,
    fontSize: 22,
    lineHeight: 32,
    color: colors.textMuted,
    marginTop: space.lg,
    maxWidth: 560,
  },
  regua: {
    height: 2,
    width: 72,
    backgroundColor: colors.accent,
    marginTop: space.xl,
    marginBottom: space.lg,
  },
  autor: { ...type.lead, fontSize: 20, color: colors.text },
});
