import React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import DeckLoader from "./src/DeckLoader";
import { colors, fontAssets } from "./src/theme/tokens";

export default function App() {
  const [ready] = useFonts(fontAssets);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar hidden />
      {ready ? (
        <DeckLoader />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
