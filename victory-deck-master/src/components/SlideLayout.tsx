import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { CodePanel } from "./CodePanel";
import { colors, layout, radius, space, type } from "../theme/tokens";

type Props = {
  title: string;
  /** Uma frase. É o que a plateia lê enquanto você fala. */
  lead?: string;
  /** Corpo da coluna esquerda: bullets, diagrama, texto. */
  children?: ReactNode;
  /** Sliders e toggles que alteram o gráfico ao vivo. */
  controls?: ReactNode;
  /** O gráfico. Ocupa a coluna direita inteira. */
  visual?: ReactNode;
  /** Código do slide. Omita para telas sem código. */
  code?: string;
  emphasize?: number[];
  /** Telas 1, 2 e 9 não têm gráfico: usam coluna única e tipo maior. */
  fullWidth?: boolean;
};

export function SlideLayout({
  title,
  lead,
  children,
  controls,
  visual,
  code,
  emphasize,
  fullWidth = false,
}: Props) {
  const { width } = useWindowDimensions();
  const usable = width - layout.pagePadding * 2 - layout.gutter;

  if (fullWidth) {
    return (
      <View style={styles.page}>
        <View style={styles.soloBlock}>
          <Text style={type.display as any} numberOfLines={2}>
            <Text style={{ color: colors.text }}>{title}</Text>
          </Text>
          {lead ? <Text style={styles.soloLead}>{lead}</Text> : null}
          <View style={styles.soloBody}>{children}</View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.page, styles.pageRow]}>
      <View style={[styles.left, { width: usable * layout.leftColumn }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{title}</Text>
          {lead ? <Text style={styles.lead}>{lead}</Text> : null}
          {children ? <View style={styles.body}>{children}</View> : null}
        </ScrollView>

        {controls ? (
          <View style={styles.controls}>
            <View style={styles.controlsRule} />
            {controls}
          </View>
        ) : null}
      </View>

      <View style={[styles.right, { width: usable * layout.rightColumn }]}>
        <View style={styles.canvas}>{visual}</View>
        {code ? <CodePanel code={code} emphasize={emphasize} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: layout.pagePadding,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  pageRow: {
    flexDirection: "row",
    gap: layout.gutter,
  },

  left: {
    justifyContent: "space-between",
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  lead: {
    ...type.lead,
    color: colors.textMuted,
    marginTop: space.md,
    maxWidth: 520,
  },
  body: {
    marginTop: space.lg,
    gap: space.md,
  },
  controls: {
    paddingTop: space.md,
  },
  controlsRule: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: space.md,
  },

  right: {
    justifyContent: "flex-end",
  },
  canvas: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  // variante de coluna única (abertura, arquitetura, fechamento)
  soloBlock: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
  },
  soloLead: {
    ...type.lead,
    color: colors.textMuted,
    marginTop: space.lg,
    maxWidth: 720,
  },
  soloBody: {
    marginTop: space.xl,
    gap: space.md,
  },
});
