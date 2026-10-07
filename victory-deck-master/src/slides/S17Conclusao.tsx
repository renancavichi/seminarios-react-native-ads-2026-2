import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, layout, space, type } from "../theme/tokens";

const CONCLUSOES = [
  "O gargalo dos gráficos em React Native era arquitetural, não falta de biblioteca",
  "Victory Native troca o caminho de renderização: Skia e GPU em vez de SVG e CPU",
  "Gesto e animação saem da thread de JavaScript e passam para a thread de UI",
  "O ganho aparece exatamente onde o modelo antigo falhava: escala, interação e animação",
];

const REFERENCIAS = [
  { rotulo: "Documentação", url: "nearform.com/open-source/victory-native/docs" },
  { rotulo: "Repositório", url: "github.com/FormidableLabs/victory-native-xl" },
  { rotulo: "Pacote", url: "npmjs.com/package/victory-native" },
];

export function S17Conclusao() {
  return (
    <View style={styles.page}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Em resumo</Text>

        <View style={styles.lista}>
          {CONCLUSOES.map((c, i) => (
            <View key={c} style={styles.linha}>
              <Text style={styles.marcador}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={styles.item}>{c}</Text>
            </View>
          ))}
        </View>

        <View style={styles.rodape}>
          <View style={styles.refs}>
            {REFERENCIAS.map((r) => (
              <View key={r.url} style={styles.ref}>
                <Text style={styles.refRotulo}>{r.rotulo}</Text>
                <Text style={styles.refUrl}>{r.url}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.assinatura}>Arthur de Morais Marques</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: layout.pagePadding, justifyContent: "center" },
  conteudo: { maxWidth: 1020, alignSelf: "center", width: "100%" },
  titulo: { ...type.display, color: colors.text, marginBottom: space.xl },

  lista: { gap: space.md, maxWidth: 860 },
  linha: { flexDirection: "row", gap: space.md, alignItems: "flex-start" },
  marcador: { ...type.code, color: colors.accent, marginTop: 4 },
  item: { ...type.lead, fontSize: 19, lineHeight: 28, color: colors.text, flex: 1 },

  rodape: {
    marginTop: space.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: space.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  refs: { flexDirection: "row", gap: space.xl },
  ref: { gap: space.xs },
  refRotulo: { ...type.label, fontSize: 12, color: colors.textFaint },
  refUrl: { ...type.code, fontSize: 13, color: colors.textMuted },
  assinatura: { ...type.label, fontSize: 15, color: colors.text },
});
