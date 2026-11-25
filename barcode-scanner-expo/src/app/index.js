import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const features = [
  ['scan-outline', 'Leitura rápida', 'Detecta EAN, UPC, Code 128, Code 39 e QR Code.'],
  ['camera-outline', 'Câmera nativa', 'Usa o CameraView do expo-camera.'],
  ['checkmark-circle-outline', 'Resultado imediato', 'Mostra tipo, valor e horário da leitura.'],
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroIcon}>
          <Ionicons name="barcode-outline" size={62} color="#7dd3fc" />
        </View>

        <Text style={styles.title}>Barcode Scanner</Text>
        <Text style={styles.subtitle}>
          Demonstração curta de leitura de códigos de barras com React Native + Expo.
        </Text>

        <View style={styles.card}>
          {features.map(([icon, title, description]) => (
            <View key={title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={icon} size={22} color="#38bdf8" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDescription}>{description}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/scanner')}
        >
          <Ionicons name="scan" size={22} color="#04131f" />
          <Text style={styles.buttonText}>Abrir leitor</Text>
        </Pressable>

        <Text style={styles.footer}>Projeto demonstrativo • Vinícius</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b1220' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  heroIcon: {
    width: 112,
    height: 112,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#132238',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: { color: '#f8fafc', fontSize: 32, fontWeight: '800', textAlign: 'center' },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 28,
  },
  card: { backgroundColor: '#111c2e', borderRadius: 24, padding: 18, gap: 18 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0f2b3b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureText: { flex: 1 },
  featureTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  featureDescription: { color: '#94a3b8', fontSize: 13, lineHeight: 18, marginTop: 3 },
  button: {
    marginTop: 24,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#38bdf8',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.82 },
  buttonText: { color: '#04131f', fontSize: 17, fontWeight: '800' },
  footer: { color: '#64748b', textAlign: 'center', marginTop: 22, fontSize: 12 },
});
