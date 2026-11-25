import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomTabBar, Tabs } from 'expo-router/tabs';
import { View } from 'react-native';

import { MiniPlayer } from '@/components/MiniPlayer';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      // Barra de abas customizada: mini player em cima + abas embaixo.
      tabBar={(props) => (
        <View style={{ backgroundColor: colors.bg }}>
          <MiniPlayer />
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="recorder"
        options={{
          title: 'Gravar',
          tabBarIcon: ({ color, size }) => <Ionicons name="mic" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="present"
        options={{
          title: 'Slides',
          tabBarIcon: ({ color, size }) => <Ionicons name="easel" color={color as string} size={size} />,
        }}
        // A aba "Slides" abre a apresentação em tela cheia (fora das abas).
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/slides');
          },
        }}
      />
    </Tabs>
  );
}
