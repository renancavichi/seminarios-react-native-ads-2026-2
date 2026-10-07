import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { colors, radius, space, type } from "../theme/tokens";

type Props = {
  /** Código exibido. Use template literal, sem indentação extra à esquerda. */
  code: string;
  /** Índices de linha (base 0) que ficam destacados enquanto você explica. */
  emphasize?: number[];
  /** Texto do botão. Padrão: "Ver código". */
  label?: string;
  /** Altura máxima do painel aberto. */
  maxHeight?: number;
};

/**
 * Painel de código colapsável.
 *
 * Em vez de colorização de sintaxe genérica, ele destaca as linhas que
 * você está explicando naquele momento. Numa apresentação isso vale mais:
 * a plateia olha para a linha certa em vez de varrer o bloco inteiro.
 */
export function CodePanel({ code, emphasize = [], label = "Ver código", maxHeight = 260 }: Props) {
  const [open, setOpen] = useState(false);
  const lines = code.replace(/\n+$/, "").split("\n");
  const marked = new Set(emphasize);

  return (
    <Animated.View style={styles.wrap} layout={LinearTransition.duration(180)}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text style={styles.caret}>{open ? "▾" : "▸"}</Text>
        <Text style={styles.toggleLabel}>{open ? "Ocultar código" : label}</Text>
      </Pressable>

      {open && (
        <Animated.View entering={FadeIn.duration(140)} style={[styles.panel, { maxHeight }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {lines.map((line, i) => {
              const hot = marked.has(i);
              return (
                <View key={i} style={[styles.row, hot && styles.rowHot]}>
                  <Text style={styles.gutter}>{String(i + 1).padStart(2, " ")}</Text>
                  <Text style={[styles.line, hot && styles.lineHot]}>{line || " "}</Text>
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.md,
  },
  togglePressed: {
    opacity: 0.6,
  },
  caret: {
    color: colors.accent,
    fontSize: 14,
    width: 14,
  },
  toggleLabel: {
    ...type.label,
    color: colors.textMuted,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: space.md,
    marginBottom: space.md,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: space.md,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  rowHot: {
    backgroundColor: colors.accentSoft,
    borderLeftColor: colors.accent,
  },
  gutter: {
    ...type.code,
    color: colors.textFaint,
    marginRight: space.md,
  },
  line: {
    ...type.code,
    color: colors.text,
    flex: 1,
  },
  lineHot: {
    color: colors.text,
  },
});
