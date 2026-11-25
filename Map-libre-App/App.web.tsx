// Versão WEB do app (o Metro usa este arquivo automaticamente no navegador).
// O @maplibre/maplibre-react-native é só nativo (Android/iOS), então aqui usamos maplibre-gl JS
// com a mesma lista de mapas de ./mapModes.
import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_MODES, type MapMode } from "./mapModes";

// O Metro não empacota o worker do maplibre-gl v6; ele é servido pela pasta public/
// (copiado no "postinstall" do package.json).
maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

const styleOf = (m: MapMode) =>
  (m.web?.mapStyle ?? m.mapStyle) as maplibregl.StyleSpecification | string;

const FALLBACK_CENTER: [number, number] = [-46.6333, -23.5505];
const INITIAL_ZOOM = 14;

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const geolocateRef = useRef<maplibregl.GeolocateControl | null>(null);
  const [mode, setMode] = useState<MapMode>(MAP_MODES[0]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleOf(MAP_MODES[0]),
      center: FALLBACK_CENTER,
      zoom: INITIAL_ZOOM,
    });
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    // Ponto azul + centralização na localização do usuário (pede permissão ao navegador)
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      fitBoundsOptions: { maxZoom: INITIAL_ZOOM },
    });
    map.addControl(geolocate, "bottom-right");
    map.on("load", () => geolocate.trigger());

    mapRef.current = map;
    geolocateRef.current = geolocate;
    return () => map.remove();
  }, []);

  const selectMode = (m: MapMode) => {
    setMode(m);
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(styleOf(m));
    map.easeTo({ pitch: m.pitch ?? 0, ...(m.zoom ? { zoom: m.zoom } : {}), duration: 800 });
  };

  return (
    <View style={styles.container}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      <View style={styles.selectorWrapper}>
        <FlatList
          horizontal
          data={MAP_MODES}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorContent}
          renderItem={({ item }) => {
            const selected = item.id === mode.id;
            return (
              <Pressable
                onPress={() => selectMode(item)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {item.icon} {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <View style={styles.infoCard} pointerEvents="none">
        <Text style={styles.infoTitle}>
          {mode.icon} {mode.label}
        </Text>
        <Text style={styles.infoText}>{mode.web?.description ?? mode.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, height: "100%" as unknown as number },
  selectorWrapper: { position: "absolute", top: 12, left: 0, right: 60 },
  selectorContent: { paddingHorizontal: 12, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  },
  chipSelected: { backgroundColor: "#1E6FD9" },
  chipText: { fontSize: 14, fontWeight: "600", color: "#222" },
  chipTextSelected: { color: "#fff" },
  infoCard: {
    position: "absolute",
    left: 12,
    bottom: 36,
    maxWidth: 420,
    marginRight: 60,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.93)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  },
  infoTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  infoText: { fontSize: 12, color: "#444", marginTop: 2 },
});
