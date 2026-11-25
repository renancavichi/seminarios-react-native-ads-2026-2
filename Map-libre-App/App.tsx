import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import {
  Camera,
  type CameraRef,
  type LngLat,
  Map,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { MAP_MODES, type MapMode } from "./mapModes";

// Fallback caso a permissão seja negada (São Paulo)
const FALLBACK_CENTER: LngLat = [-46.6333, -23.5505];
const INITIAL_ZOOM = 14;

export default function App() {
  const [mode, setMode] = useState<MapMode>(MAP_MODES[0]);
  const [location, setLocation] = useState<LngLat | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const cameraRef = useRef<CameraRef>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permissão de localização negada. Mostrando local padrão.");
          return;
        }
        setHasPermission(true);

        // Tenta a última posição conhecida (rápida) e depois a posição atual (precisa)
        const last = await Location.getLastKnownPositionAsync();
        if (last) setLocation([last.coords.longitude, last.coords.latitude]);

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords: LngLat = [current.coords.longitude, current.coords.latitude];
        setLocation(coords);
        cameraRef.current?.flyTo({ center: coords, zoom: INITIAL_ZOOM });
      } catch {
        setErrorMsg("Não foi possível obter a localização (o GPS está ativado?).");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectMode = (m: MapMode) => {
    setMode(m);
    // Ajusta inclinação/zoom: 3D inclina a câmera, os demais voltam à vista de cima
    cameraRef.current?.setStop({
      pitch: m.pitch ?? 0,
      ...(m.zoom ? { zoom: m.zoom } : {}),
      duration: 800,
    });
  };

  const recenter = async () => {
    if (!hasPermission) return;
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const coords: LngLat = [pos.coords.longitude, pos.coords.latitude];
      setLocation(coords);
      cameraRef.current?.flyTo({ center: coords, zoom: 16, duration: 1000 });
    } catch {
      setErrorMsg("Não foi possível obter a localização.");
    }
  };

  // Espera a primeira coordenada (ou a falha) antes de montar o mapa,
  // para que ele já abra centralizado no usuário.
  if (loading && !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Obtendo sua localização…</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  const isDark = !!mode.dark;

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={mode.mapStyle}
        compass
        compassPosition={{ top: 110, right: 12 }}
        attributionPosition={{ bottom: 8, right: 8 }}
        logo={false}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: location ?? FALLBACK_CENTER,
            zoom: INITIAL_ZOOM,
          }}
        />
        {hasPermission && <UserLocation accuracy heading />}
      </Map>

      {/* Seletor de estilos */}
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
        <Text style={styles.infoText}>{mode.description}</Text>
      </View>

      {errorMsg && (
        <Pressable style={styles.errorBox} onPress={() => setErrorMsg(null)}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </Pressable>
      )}

      {hasPermission && (
        <Pressable style={styles.recenterButton} onPress={recenter}>
          <Text style={styles.recenterText}>◎</Text>
        </Pressable>
      )}

      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#333" },
  selectorWrapper: { position: "absolute", top: 50, left: 0, right: 0 },
  selectorContent: { paddingHorizontal: 12, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    elevation: 4,
  },
  chipSelected: { backgroundColor: "#1E6FD9" },
  chipText: { fontSize: 14, fontWeight: "600", color: "#222" },
  chipTextSelected: { color: "#fff" },
  infoCard: {
    position: "absolute",
    left: 12,
    right: 84,
    bottom: 40,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.93)",
    elevation: 4,
  },
  infoTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  infoText: { fontSize: 12, color: "#444", marginTop: 2 },
  errorBox: {
    position: "absolute",
    top: 105,
    left: 12,
    right: 70,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(180,30,30,0.9)",
  },
  errorText: { color: "#fff", fontSize: 13 },
  recenterButton: {
    position: "absolute",
    right: 16,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  recenterText: { fontSize: 28, color: "#1E6FD9" },
});
