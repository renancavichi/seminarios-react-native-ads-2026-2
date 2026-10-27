import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameSettingsProvider } from '../game/GameSettings';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GameSettingsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="signup" options={{ headerShown: true, title: 'Exemplo de cadastro' }} />
          <Stack.Screen name="smile" options={{ headerShown: true, title: 'Exemplo original' }} />
        </Stack>
      </GameSettingsProvider>
    </SafeAreaProvider>
  );
}
