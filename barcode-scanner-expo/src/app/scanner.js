import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const SUPPORTED_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'];

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);

  const formattedTime = useMemo(() => {
    if (!result?.timestamp) return '';
    return new Date(result.timestamp).toLocaleTimeString('pt-BR');
  }, [result]);

  if (!permission) {
    return <View style={styles.loading} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={54} color="#38bdf8" />
          <Text style={styles.permissionTitle}>Permissão da câmera</Text>
          <Text style={styles.permissionText}>
            O aplicativo precisa acessar a câmera para identificar o código de barras.
          </Text>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Permitir acesso</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setResult({ type, data, timestamp: Date.now() });
  };

  const scanAgain = () => {
    setResult(null);
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: SUPPORTED_TYPES }}
      />

      <View style={styles.overlay}>
        <View style={styles.topHint}>
          <Ionicons name="barcode-outline" size={22} color="#e0f2fe" />
          <Text style={styles.topHintText}>Aponte a câmera para um código</Text>
        </View>

        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          {!scanned && <View style={styles.scanLine} />}
        </View>

        <View style={styles.bottomPanel}>
          {result ? (
            <>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={26} color="#4ade80" />
                <Text style={styles.resultTitle}>Código identificado</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.label}>Tipo</Text>
                <Text style={styles.value}>{result.type}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.label}>Valor</Text>
                <Text style={styles.codeValue} numberOfLines={2}>{result.data}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.label}>Horário</Text>
                <Text style={styles.value}>{formattedTime}</Text>
              </View>

              <Pressable style={styles.scanAgainButton} onPress={scanAgain}>
                <Ionicons name="refresh" size={19} color="#082f49" />
                <Text style={styles.scanAgainText}>Escanear novamente</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.waitingText}>
              O resultado aparecerá aqui automaticamente após a leitura.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  loading: { flex: 1, backgroundColor: '#0b1220' },
  permissionScreen: {
    flex: 1,
    backgroundColor: '#0b1220',
    justifyContent: 'center',
    padding: 24,
  },
  permissionCard: {
    backgroundColor: '#111c2e',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
  },
  permissionTitle: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginTop: 18 },
  permissionText: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
  },
  permissionButton: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 22,
  },
  permissionButtonText: { color: '#082f49', fontWeight: '800', fontSize: 15 },
  overlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.42)', padding: 22 },
  topHint: {
    marginTop: 34,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
  },
  topHintText: { color: '#e0f2fe', fontWeight: '700' },
  scanFrame: {
    width: '92%',
    aspectRatio: 1.45,
    alignSelf: 'center',
    marginTop: 86,
    position: 'relative',
  },
  corner: { position: 'absolute', width: 42, height: 42, borderColor: '#38bdf8' },
  topLeft: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 14 },
  topRight: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 14 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 14 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 14 },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: '50%',
    height: 2,
    backgroundColor: '#7dd3fc',
  },
  bottomPanel: {
    marginTop: 'auto',
    marginBottom: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: 24,
    padding: 20,
  },
  waitingText: { color: '#cbd5e1', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 15 },
  resultTitle: { color: '#f8fafc', fontSize: 19, fontWeight: '800' },
  resultRow: { marginTop: 10 },
  label: { color: '#64748b', fontSize: 12, textTransform: 'uppercase', fontWeight: '700' },
  value: { color: '#e2e8f0', fontSize: 16, fontWeight: '600', marginTop: 3 },
  codeValue: { color: '#7dd3fc', fontSize: 18, fontWeight: '800', marginTop: 3 },
  scanAgainButton: {
    height: 48,
    borderRadius: 15,
    marginTop: 20,
    backgroundColor: '#7dd3fc',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanAgainText: { color: '#082f49', fontSize: 15, fontWeight: '800' },
});
