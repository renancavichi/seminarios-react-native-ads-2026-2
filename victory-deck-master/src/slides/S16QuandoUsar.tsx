import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SlideLayout } from "../components/SlideLayout";
import { colors, radius, space, type } from "../theme/tokens";

const VALE = [
  "Muitos pontos por tela",
  "Gesto e interação de verdade",
  "Animação entre estados",
  "Identidade visual própria",
];

const TALVEZ = [
  "Um único gráfico simples e estático",
  "Projeto que precisa rodar no Expo Go",
  "Prazo muito curto, sem espaço para aprender a API",
];

const ADENDOS = [
  "Exige build nativo ou build web — não roda no Expo Go",
  "Rótulo de eixo depende de um arquivo de fonte carregado",
  "Animação só ocorre entre datasets do mesmo tamanho",
];

export function S16QuandoUsar() {
  return (
    <SlideLayout
      fullWidth
      title="Quando vale o custo"
      lead="A biblioteca troca simplicidade inicial por capacidade. Essa troca compensa em alguns cenários e não em outros."
    >
      <View style={styles.colunas}>
        <View style={[styles.coluna, styles.colunaVale]}>
          <Text style={styles.colunaTitulo}>Vale o custo</Text>
          {VALE.map((v) => (
            <Text key={v} style={styles.item}>
              {v}
            </Text>
          ))}
        </View>

        <View style={styles.coluna}>
          <Text style={[styles.colunaTitulo, styles.colunaTituloNeutro]}>
            Talvez não valha
          </Text>
          {TALVEZ.map((t) => (
            <Text key={t} style={styles.item}>
              {t}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.adendos}>
        <Text style={styles.adendosTitulo}>Pontos a ter em mente</Text>
        <View style={styles.adendosLinha}>
          {ADENDOS.map((a) => (
            <Text key={a} style={styles.adendo}>
              {a}
            </Text>
          ))}
        </View>
      </View>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  colunas: { flexDirection: "row", gap: space.lg, maxWidth: 1000 },
  coluna: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.md,
  },
  colunaVale: { borderColor: colors.accentLine, backgroundColor: colors.accentSoft },
  colunaTitulo: { ...type.label, fontSize: 17, color: colors.accent },
  colunaTituloNeutro: { color: colors.textMuted },
  item: { ...type.lead, fontSize: 18, lineHeight: 26, color: colors.text },

  adendos: { marginTop: space.xl, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: space.lg },
  adendosTitulo: { ...type.label, color: colors.textFaint, marginBottom: space.md },
  adendosLinha: { flexDirection: "row", gap: space.xl },
  adendo: { ...type.body, fontSize: 15, lineHeight: 22, color: colors.textMuted, flex: 1 },
});
