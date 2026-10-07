import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SlideLayout } from "../components/SlideLayout";
import { colors, radius, space, type } from "../theme/tokens";

const DOMINIOS = [
  {
    area: "Financeiro",
    exige: "Candlestick, zoom em série histórica, atualização em tempo real",
  },
  {
    area: "Saúde e fitness",
    exige: "Frequência cardíaca, ciclos de sono, progresso semanal",
  },
  {
    area: "E-commerce",
    exige: "Vendas por período, funil de conversão, comparação de safras",
  },
  {
    area: "Monitoramento",
    exige: "Métricas contínuas, milhares de amostras por tela",
  },
];

export function S03Dados() {
  return (
    <SlideLayout
      fullWidth
      title="Quase todo app precisa mostrar dados"
      lead="Gráfico deixou de ser recurso de nicho. É requisito comum em categorias inteiras de aplicativo."
    >
      <View style={styles.grid}>
        {DOMINIOS.map((d) => (
          <View key={d.area} style={styles.card}>
            <Text style={styles.area}>{d.area}</Text>
            <Text style={styles.exige}>{d.exige}</Text>
          </View>
        ))}
      </View>

      <View style={styles.fecho}>
        <Text style={styles.fechoTexto}>
          A pergunta não é se o seu app vai ter gráficos. É quantos, e o quanto o
          usuário vai interagir com eles.
        </Text>
      </View>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", gap: space.md },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.lg,
  },
  area: { ...type.label, fontSize: 17, color: colors.accent, marginBottom: space.sm },
  exige: { ...type.body, fontSize: 15, lineHeight: 23, color: colors.textMuted },

  fecho: {
    marginTop: space.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: space.lg,
  },
  fechoTexto: { ...type.title, fontSize: 28, lineHeight: 36, color: colors.text, maxWidth: 900 },
});
