import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#101828' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0b1220' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Barcode Scanner' }} />
        <Stack.Screen name="scanner" options={{ title: 'Escanear código' }} />
      </Stack>
    </>
  );
}
