import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SlideLayout } from "../components/SlideLayout";
import { colors, space, type } from "../theme/tokens";

const CAMADAS = [
  {
    nome: "Victory Native",
    papel: "Compõe as camadas abaixo numa API declarativa de gráficos",
    destaque: true,
  },
  { nome: "React Native Skia", papel: "Desenho 2D acelerado por GPU" },
  { nome: "Reanimated", papel: "Animação e estado na thread de UI" },
  { nome: "Gesture Handler", papel: "Toque, arraste e pinça nativos" },
  { nome: "D3", papel: "Escalas, domínios e matemática dos eixos" },
];

export function S08Pilha() {
  return (
    <SlideLayout
      fullWidth
      title="Victory Native não desenha nada"
      lead="Ele compõe quatro bibliotecas numa API de gráficos. Essa pilha explica tanto o desempenho quanto as limitações que veremos no fim."
    >
      <View style={styles.pilha}>
        {CAMADAS.map((c) => (
          <View key={c.nome} style={[styles.camada, c.destaque && styles.camadaDestaque]}>
            <Text style={[styles.nome, c.destaque && styles.nomeDestaque]}>{c.nome}</Text>
            <Text style={styles.papel}>{c.papel}</Text>
          </View>
        ))}
      </View>

      <View style={styles.notas}>
        <View style={styles.notaItem}>
          <Text style={styles.notaTitulo}>Skia</Text>
          <Text style={styles.notaTexto}>
            É o motor gráfico que roda por trás do Google Chrome, do Android e do
            Flutter. Desenhar direto na GPU é o que remove a limitação do SVG.
          </Text>
        </View>
        <View style={styles.notaItem}>
          <Text style={styles.notaTitulo}>Reanimated e Gesture Handler</Text>
          <Text style={styles.notaTexto}>
            Permitem que gesto e animação vivam fora da thread de JavaScript. É
            daqui que vem a resposta imediata ao toque.
          </Text>
        </View>
        <View style={styles.notaItem}>
          <Text style={styles.notaTitulo}>D3</Text>
          <Text style={styles.notaTexto}>
            Entra apenas para o cálculo: converter valores de dados em
            coordenadas de tela. Nada de manipulação de DOM.
          </Text>
        </View>
      </View>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  pilha: { gap: space.sm, maxWidth: 820 },
  camada: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: space.lg,
  },
  camadaDestaque: { borderColor: colors.accentLine, backgroundColor: colors.accentSoft },
  nome: { ...type.label, fontSize: 17, color: colors.text, width: 210 },
  nomeDestaque: { color: colors.accent },
  papel: { ...type.body, fontSize: 15, color: colors.textMuted, flex: 1 },

  notas: { flexDirection: "row", gap: space.xl, marginTop: space.lg },
  notaItem: { flex: 1, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: space.md },
  notaTitulo: { ...type.code, color: colors.accent, marginBottom: space.xs },
  notaTexto: { ...type.body, fontSize: 14, lineHeight: 21, color: colors.textMuted },
});
