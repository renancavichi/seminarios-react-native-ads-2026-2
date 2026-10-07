import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, layout, space, type } from "../theme/tokens";

const TOPICOS = [
  {
    numero: "01",
    nome: "O problema",
    resumo: "Por que gráficos em React Native falham",
  },
  {
    numero: "02",
    nome: "A solução",
    resumo: "O que é o Victory Native e o que ele faz",
  },
  {
    numero: "03",
    nome: "Como funciona",
    resumo: "Arquitetura, API e estrutura do código",
  },
  {
    numero: "04",
    nome: "Na prática",
    resumo: "Interação, escala e animação",
  },
];

export function S02Roteiro() {
  const esquerda = TOPICOS.slice(0, 2);
  const direita = TOPICOS.slice(2);

  return (
    <View style={styles.page}>
      <Text style={styles.titulo}>Roteiro</Text>

      <View style={styles.colunas}>
        <View style={styles.coluna}>
          {esquerda.map((t) => (
            <Item key={t.numero} {...t} />
          ))}
        </View>
        <View style={styles.coluna}>
          {direita.map((t) => (
            <Item key={t.numero} {...t} />
          ))}
        </View>
      </View>
    </View>
  );
}

function Item({ numero, nome, resumo }: { numero: string; nome: string; resumo: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.numero}>{numero}</Text>
      <View style={styles.itemTexto}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.resumo}>{resumo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: layout.pagePadding,
    justifyContent: "center",
  },
  titulo: { ...type.display, color: colors.text, marginBottom: space.xl },

  colunas: { flexDirection: "row", gap: space.xxl },
  coluna: { flex: 1, gap: space.xl },

  item: { flexDirection: "row", gap: space.lg, alignItems: "flex-start" },
  numero: {
    fontFamily: "Inter-SemiBold",
    fontSize: 40,
    lineHeight: 44,
    color: colors.accent,
    width: 66,
  },
  itemTexto: { flex: 1, paddingTop: space.xs },
  nome: {
    ...type.title,
    fontSize: 30,
    lineHeight: 36,
    color: colors.text,
    marginBottom: space.xs,
  },
  resumo: { ...type.lead, fontSize: 18, lineHeight: 26, color: colors.textMuted },
});
