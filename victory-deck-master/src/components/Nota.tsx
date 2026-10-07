import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, space, type } from "../theme/tokens";

/** Bloco de anotação da coluna esquerda: um conceito por bloco. */
export function Nota({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.nota}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.texto}>{children}</Text>
    </View>
  );
}

/** Faixa de destaque para a frase-chave de um slide. */
export function Destaque({ children }: { children: ReactNode }) {
  return (
    <View style={styles.destaque}>
      <Text style={styles.destaqueTexto}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nota: {
    borderLeftWidth: 2,
    borderLeftColor: colors.borderStrong,
    paddingLeft: space.md,
  },
  titulo: { ...type.code, color: colors.accent, marginBottom: space.xs },
  texto: { ...type.body, fontSize: 15, lineHeight: 23, color: colors.textMuted },

  destaque: {
    borderWidth: 1,
    borderColor: colors.accentLine,
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    padding: space.md,
  },
  destaqueTexto: {
    ...type.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});
