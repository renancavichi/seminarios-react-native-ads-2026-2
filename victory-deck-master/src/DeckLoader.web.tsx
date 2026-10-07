import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { colors, space, type } from "./theme/tokens";

/**
 * Caminho web: o Skia roda via CanvasKit, um build WebAssembly de ~2,9 MB
 * carregado de forma assíncrona. Nenhum componente Skia pode renderizar
 * antes disso — daí o carregamento preguiçoso do deck.
 *
 * `locateFile` aponta para onde o `npx setup-skia-web` colocou o .wasm.
 * Confira com `dir public` e ajuste o caminho se necessário.
 */
export default function DeckLoaderWeb() {
  return (
    <WithSkiaWeb
      opts={{ locateFile: (file) => `/${file}` }}
      getComponent={() => require("./DeckRoot")}
      fallback={
        <View style={styles.fallback}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.texto}>Carregando CanvasKit…</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.md,
    backgroundColor: colors.canvas,
  },
  texto: {
    ...type.label,
    color: colors.textFaint,
  },
});
