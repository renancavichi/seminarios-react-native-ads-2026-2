import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { colors, layout, space, type } from "../theme/tokens";

export type Slide = {
  id: string;
  /** Rótulo curto exibido no rodapé. */
  tag: string;
  /** Parte do roteiro a que este slide pertence. Aparece no cabeçalho. */
  section?: string;
  render: () => ReactNode;
  /**
   * true nos slides com gráfico interativo (toque, pan, zoom).
   * Desliga o arraste do deck para que o gesto pertença ao gráfico —
   * sem isso, arrastar sobre o gráfico troca de slide.
   */
  locksGestures?: boolean;
};

export function Deck({ slides }: { slides: Slide[] }) {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      listRef.current?.scrollToOffset({ offset: clamped * width, animated: true });
      setIndex(clamped);
    },
    [slides.length, width],
  );

  /**
   * Navegação por teclado no navegador. Além das setas, cobre PageUp e
   * PageDown — que é o que a maioria dos apresentadores remotos envia.
   */
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(index + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
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

      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!current?.locksGestures}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => <View style={{ width }}>{item.render()}</View>}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        // Mantém todos os slides montados: evita o gráfico remontar e
        // "pular" quando você volta a um slide durante a apresentação.
        initialNumToRender={slides.length}
        maxToRenderPerBatch={slides.length}
        windowSize={slides.length * 2 + 1}
        removeClippedSubviews={false}
      />

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
  section: {
    ...type.label,
    color: colors.textFaint,
    letterSpacing: 0.5,
  },
  progress: { flexDirection: "row", gap: space.sm, alignItems: "center" },
  pip: { width: 20, height: 3, borderRadius: 2, backgroundColor: colors.border },
  pipActive: { backgroundColor: colors.accent },

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
