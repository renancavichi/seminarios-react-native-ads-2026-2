import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SlideLayout } from "../components/SlideLayout";
import { colors, radius, space, type } from "../theme/tokens";

const SINTOMAS = [
  {
    sintoma: "O gráfico engasga quando a tela rola",
    causa: "Views SVG competindo com o scroll na mesma thread",
  },
  {
    sintoma: "O tooltip atrasa em relação ao dedo",
    causa: "O gesto vai ao JavaScript, calcula e volta pela ponte",
  },
  {
    sintoma: "O app trava com alguns milhares de pontos",
    causa: "Uma view nativa por elemento desenhado",
  },
  {
    sintoma: "A animação sai picada, ou nem existe",
    causa: "Interpolação rodando na thread de JavaScript",
  },
  {
    sintoma: "No Android é sempre pior que no iOS",
    causa: "Custo mais alto de ponte e de composição de views",
  },
];

export function S05Custo() {
  return (
    <SlideLayout
      fullWidth
      title="O que isso custa na prática"
      lead="A consequência não aparece no código. Aparece no dedo do usuário."
    >
      <View style={styles.tabela}>
        <View style={[styles.linha, styles.cabecalho]}>
          <Text style={[styles.celula, styles.celulaCabecalho]}>O que o usuário sente</Text>
          <Text style={[styles.celula, styles.celulaCabecalho, styles.colCausa]}>
            Causa técnica
          </Text>
        </View>

        {SINTOMAS.map((s) => (
          <View key={s.sintoma} style={styles.linha}>
            <Text style={[styles.celula, styles.celulaSintoma]}>{s.sintoma}</Text>
            <Text style={[styles.celula, styles.colCausa]}>{s.causa}</Text>
          </View>
        ))}
      </View>

      <View style={styles.fecho}>
        <Text style={styles.fechoTexto}>
          A saída de sempre: reduzir o dataset, remover a animação, desligar a
          interação.
        </Text>
        <Text style={styles.fechoDestaque}>
          O gráfico volta a funcionar — mas virou uma imagem.
        </Text>
      </View>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  tabela: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
    maxWidth: 1050,
  },
  linha: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.border },
  cabecalho: { backgroundColor: colors.surface },
  celula: {
    ...type.body,
    fontSize: 16,
    color: colors.textMuted,
    flex: 1,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  celulaCabecalho: { ...type.label, fontSize: 14, color: colors.text },
  celulaSintoma: { color: colors.text },
  colCausa: { flex: 1.1, color: colors.textMuted },

  fecho: { marginTop: space.xl, gap: space.sm, maxWidth: 1050 },
  fechoTexto: { ...type.lead, fontSize: 19, color: colors.textMuted },
  fechoDestaque: { ...type.title, fontSize: 30, lineHeight: 38, color: colors.accent },
});
