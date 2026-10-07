import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, layout, space, type } from "../theme/tokens";

export type Slide = {
  id: string;
  /** Rótulo curto exibido no rodapé. */
  tag: string;
  /** Parte do roteiro a que este slide pertence. Aparece no cabeçalho. */
  section?: string;
  render: () => ReactNode;
  /**
   * Mantido por compatibilidade e não é mais necessário: o deck não usa
   * rolagem, então gesto de gráfico nunca disputa com navegação de slide.
   */
  locksGestures?: boolean;
};

/**
 * Deck sem rolagem.
 *
 * Todos os slides ficam montados e empilhados em posição absoluta; só o
 * ativo tem `display: flex`. Duas consequências importantes:
 *
 * 1. Nenhum gráfico remonta ao navegar — sem salto visual ao voltar.
 * 2. Não há ScrollView, então gestos de gráfico (arraste, pinça) não
 *    competem com a troca de slide. A versão anterior alternava
 *    `scrollEnabled`, e no navegador isso cancelava a rolagem
 *    programática, travando a navegação nos slides interativos.
 *
 * Navegação: teclado no navegador, botões do rodapé, e os marcadores de
 * progresso como atalho direto.
 */
export function Deck({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(slides.length - 1, next)));
    },
    [slides.length],
  );

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        goTo(index + 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(e.key)) {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(slides.length - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index, slides.length]);

  const current = slides[index];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.section}>{current?.section ?? ""}</Text>
        <View style={styles.progress}>
          {slides.map((s, i) => (
            <Pressable key={s.id} onPress={() => goTo(i)} hitSlop={8}>
              <View style={[styles.pip, i === index && styles.pipActive]} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.palco}>
        {slides.map((s, i) => (
          <View
            key={s.id}
            style={[styles.slide, { display: i === index ? "flex" : "none" }]}
            pointerEvents={i === index ? "auto" : "none"}
          >
            {s.render()}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <NavButton label="Anterior" onPress={() => goTo(index - 1)} disabled={index === 0} />
        <Text style={styles.counter}>
          {index + 1} / {slides.length}
          {current?.tag ? `   ·   ${current.tag}` : ""}
        </Text>
        <NavButton
          label="Próximo"
          onPress={() => goTo(index + 1)}
          disabled={index === slides.length - 1}
          primary
        />
      </View>
    </View>
  );
}

function NavButton({
  label,
  onPress,
  disabled,
  primary,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.navBtn,
        primary && styles.navBtnPrimary,
        disabled && styles.navBtnDisabled,
        pressed && !disabled && styles.navBtnPressed,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.navLabel, primary && styles.navLabelPrimary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },

  header: {
    height: layout.headerHeight,
    paddingHorizontal: layout.pagePadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section: { ...type.label, color: colors.textFaint, letterSpacing: 0.5 },
  progress: { flexDirection: "row", gap: 6, alignItems: "center" },
  pip: { width: 16, height: 3, borderRadius: 2, backgroundColor: colors.border },
  pipActive: { backgroundColor: colors.accent },

  palco: { flex: 1 },
  slide: { ...StyleSheet.absoluteFillObject },

  footer: {
    height: layout.footerHeight,
    paddingHorizontal: layout.pagePadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counter: { ...type.label, color: colors.textFaint },
  navBtn: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 110,
    alignItems: "center",
  },
  navBtnPrimary: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine },
  navBtnDisabled: { opacity: 0.3 },
  navBtnPressed: { backgroundColor: colors.surfaceRaised },
  navLabel: { ...type.label, color: colors.textMuted },
  navLabelPrimary: { color: colors.accent },
});
