import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {
  Circle,
  Marker,
  Polygon,
  Polyline,
  type LatLng,
  type MapPressEvent,
  type Region,
} from 'react-native-maps';

type Shape = 'marker' | 'circle' | 'polyline' | 'polygon';
type MapStyle = 'standard' | 'satellite' | 'hybrid' | 'terrain';

const initialRegion: Region = {
  latitude: -23.5631,
  longitude: -46.6544,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

const initialPoints: LatLng[] = [
  { latitude: -23.5631, longitude: -46.6544 },
  { latitude: -23.569, longitude: -46.648 },
  { latitude: -23.56, longitude: -46.641 },
];

const shapeOptions: { id: Shape; name: string; icon: string; hint: string }[] = [
  { id: 'marker', name: 'Marcador', icon: '📍', hint: 'Toque no mapa para fixar pontos' },
  { id: 'circle', name: 'Círculo', icon: '⭕', hint: 'Toque no mapa para criar uma área' },
  { id: 'polyline', name: 'Polilinha', icon: '〰️', hint: 'Toque no mapa para traçar um caminho' },
  { id: 'polygon', name: 'Polígono', icon: '⬡', hint: 'Toque no mapa para desenhar uma região' },
];

const mapStyles: { id: MapStyle; label: string }[] = [
  { id: 'standard', label: 'Padrão' },
  { id: 'satellite', label: 'Satélite' },
  { id: 'hybrid', label: 'Híbrido' },
  ...(Platform.OS === 'android' ? [{ id: 'terrain' as const, label: 'Relevo' }] : []),
];

export default function App() {
  const [selectedShape, setSelectedShape] = useState<Shape>('marker');
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [markers, setMarkers] = useState<LatLng[]>([initialPoints[0]]);
  const [circleCenter, setCircleCenter] = useState<LatLng>(initialPoints[1]);
  const [linePoints, setLinePoints] = useState<LatLng[]>(initialPoints);
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>(initialPoints);
  const [notice, setNotice] = useState('');

  const selected = useMemo(
    () => shapeOptions.find((shape) => shape.id === selectedShape)!,
    [selectedShape],
  );

  const onMapPress = (event: MapPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;
    if (selectedShape === 'marker') {
      setMarkers((current) => [...current, coordinate]);
      setNotice('Marcador adicionado');
    } else if (selectedShape === 'circle') {
      setCircleCenter(coordinate);
      setNotice('Círculo reposicionado');
    } else if (selectedShape === 'polyline') {
      setLinePoints((current) => [...current, coordinate]);
      setNotice('Ponto adicionado ao caminho');
    } else {
      setPolygonPoints((current) => [...current, coordinate]);
      setNotice('Ponto adicionado à região');
    }
  };

  const resetDemo = () => {
    setMarkers([initialPoints[0]]);
    setCircleCenter(initialPoints[1]);
    setLinePoints(initialPoints);
    setPolygonPoints(initialPoints);
    setNotice('Demonstração restaurada');
  };

  const clearSelected = () => {
    if (selectedShape === 'marker') setMarkers([]);
    if (selectedShape === 'circle') setCircleCenter({ latitude: 0, longitude: 0 });
    if (selectedShape === 'polyline') setLinePoints([]);
    if (selectedShape === 'polygon') setPolygonPoints([]);
    setNotice(`${selected.name} removido`);
  };

  const selectedCount =
    selectedShape === 'marker'
      ? markers.length
      : selectedShape === 'circle'
        ? circleCenter.latitude === 0 && circleCenter.longitude === 0 ? 0 : 1
        : selectedShape === 'polyline'
          ? linePoints.length
          : polygonPoints.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>M</Text></View>
          <View>
            <Text style={styles.eyebrow}>MAP LAB · EXPO</Text>
            <Text style={styles.title}>React Native Maps</Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Restaurar demonstração" onPress={resetDemo} style={styles.resetButton}>
          <Text style={styles.resetIcon}>↻</Text>
        </Pressable>
      </View>

      <View style={styles.mapFrame}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          mapType={mapStyle}
          onPress={onMapPress}
          showsCompass
          showsScale
          toolbarEnabled
          accessibilityLabel="Mapa interativo de demonstração"
        >
          {markers.map((marker, index) => (
            <Marker
              key={`marker-${index}`}
              coordinate={marker}
              title={`Ponto ${index + 1}`}
              description={`${marker.latitude.toFixed(5)}, ${marker.longitude.toFixed(5)}`}
              pinColor="#4F46E5"
            />
          ))}
          {circleCenter.latitude !== 0 && (
            <Circle
              center={circleCenter}
              radius={650}
              strokeColor="rgba(79, 70, 229, 0.8)"
              fillColor="rgba(79, 70, 229, 0.16)"
              strokeWidth={2}
            />
          )}
          {linePoints.length > 1 && (
            <Polyline coordinates={linePoints} strokeColor="#F97316" strokeWidth={4} />
          )}
          {polygonPoints.length > 2 && (
            <Polygon
              coordinates={polygonPoints}
              strokeColor="#0F766E"
              fillColor="rgba(20, 184, 166, 0.20)"
              strokeWidth={2}
            />
          )}
        </MapView>
        <View pointerEvents="none" style={styles.mapBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.mapBadgeText}>SÃO PAULO, BR</Text>
        </View>
        <View style={styles.mapHint}>
          <Text style={styles.mapHintIcon}>{selected.icon}</Text>
          <Text style={styles.mapHintText}>Toque para adicionar · {selected.name}</Text>
        </View>
      </View>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Elementos do mapa</Text>
            <Text style={styles.sectionSubtitle}>Escolha uma ferramenta e toque no mapa</Text>
          </View>
          <View style={styles.countBadge}><Text style={styles.countText}>{selectedCount} pts</Text></View>
        </View>

        <View style={styles.shapeGrid}>
          {shapeOptions.map((shape) => {
            const active = shape.id === selectedShape;
            return (
              <Pressable
                key={shape.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => { setSelectedShape(shape.id); setNotice(''); }}
                style={[styles.shapeCard, active && styles.shapeCardActive]}
              >
                <Text style={styles.shapeIcon}>{shape.icon}</Text>
                <Text style={[styles.shapeName, active && styles.shapeNameActive]}>{shape.name}</Text>
                <View style={[styles.selectionDot, active && styles.selectionDotActive]} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.hintRow}>
          <Text style={styles.hintText}>{notice || selected.hint}</Text>
          <Pressable onPress={clearSelected} accessibilityRole="button" style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpar {selected.name.toLowerCase()}</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />
        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Estilo do mapa</Text>
            <Text style={styles.sectionSubtitle}>Alterne a camada visual</Text>
          </View>
          <Text style={styles.layerIcon}>▦</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mapStyleList}>
          {mapStyles.map((style) => {
            const active = mapStyle === style.id;
            return (
              <Pressable
                key={style.id}
                onPress={() => setMapStyle(style.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.mapStyleChip, active && styles.mapStyleChipActive]}
              >
                <Text style={[styles.mapStyleText, active && styles.mapStyleTextActive]}>{style.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.footerCard}>
          <Text style={styles.footerIcon}>⌘</Text>
          <View style={styles.footerCopy}>
            <Text style={styles.footerTitle}>Feito com react-native-maps</Text>
            <Text style={styles.footerSubtitle}>Arraste, aproxime e explore o mapa</Text>
          </View>
          <Text style={styles.footerArrow}>↗</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8FC' },
  header: { height: 72, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandMark: { height: 42, width: 42, borderRadius: 14, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#FFFFFF', fontSize: 21, fontWeight: '800' },
  eyebrow: { fontSize: 9, letterSpacing: 1.7, color: '#81849A', fontWeight: '800' },
  title: { marginTop: 2, color: '#17182B', fontSize: 17, fontWeight: '800' },
  resetButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ECEEF5' },
  resetIcon: { color: '#44465A', fontSize: 24, lineHeight: 27 },
  mapFrame: { height: '43%', marginHorizontal: 14, borderRadius: 24, overflow: 'hidden', backgroundColor: '#E7EAF1' },
  mapBadge: { position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 99, paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: '#16A36A' },
  mapBadgeText: { color: '#36384C', fontSize: 9, letterSpacing: 1.1, fontWeight: '800' },
  mapHint: { position: 'absolute', bottom: 13, alignSelf: 'center', backgroundColor: '#17182B', borderRadius: 99, paddingHorizontal: 13, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 7 },
  mapHintIcon: { fontSize: 13 },
  mapHintText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  panel: { flex: 1, marginTop: 10 },
  panelContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 22 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: '#1D1E31', fontSize: 15, fontWeight: '800' },
  sectionSubtitle: { color: '#87899A', fontSize: 11, marginTop: 4 },
  countBadge: { backgroundColor: '#ECEBFF', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 },
  countText: { color: '#4F46E5', fontSize: 10, fontWeight: '800' },
  shapeGrid: { flexDirection: 'row', gap: 9, marginTop: 14 },
  shapeCard: { flex: 1, minHeight: 80, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECEEF5', borderRadius: 16, paddingHorizontal: 9, paddingTop: 11, paddingBottom: 9 },
  shapeCardActive: { backgroundColor: '#F0EFFF', borderColor: '#7068EC' },
  shapeIcon: { fontSize: 17, marginBottom: 7 },
  shapeName: { color: '#686A7C', fontSize: 10, fontWeight: '700' },
  shapeNameActive: { color: '#4338CA' },
  selectionDot: { position: 'absolute', top: 10, right: 10, height: 7, width: 7, borderRadius: 4, backgroundColor: '#E5E7EF' },
  selectionDotActive: { backgroundColor: '#5B52E8' },
  hintRow: { minHeight: 37, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  hintText: { flex: 1, color: '#8A8C9D', fontSize: 10 },
  clearButton: { paddingVertical: 8, paddingLeft: 8 },
  clearButtonText: { color: '#6863C8', fontSize: 10, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E9EAF1', marginVertical: 11 },
  layerIcon: { color: '#6662C8', fontSize: 21 },
  mapStyleList: { gap: 8, paddingTop: 11, paddingBottom: 3 },
  mapStyleChip: { borderRadius: 99, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECEEF5' },
  mapStyleChipActive: { backgroundColor: '#25263B', borderColor: '#25263B' },
  mapStyleText: { color: '#717385', fontSize: 10, fontWeight: '700' },
  mapStyleTextActive: { color: '#FFFFFF' },
  footerCard: { marginTop: 14, paddingHorizontal: 13, paddingVertical: 12, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECEEF5', flexDirection: 'row', alignItems: 'center' },
  footerIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: '#F0EFFF', color: '#4F46E5', fontSize: 20, lineHeight: 30, textAlign: 'center', fontWeight: '700' },
  footerCopy: { marginLeft: 10, flex: 1 },
  footerTitle: { color: '#303145', fontSize: 10, fontWeight: '800' },
  footerSubtitle: { color: '#9092A2', fontSize: 9, marginTop: 3 },
  footerArrow: { color: '#77798A', fontSize: 17, paddingHorizontal: 4 },
});
