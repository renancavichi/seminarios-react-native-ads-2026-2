import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="accelerometer">
        <NativeTabs.Trigger.Label>Accelerometer</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="speedometer" md="speed" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="gyroscope">
        <NativeTabs.Trigger.Label>Gyroscope</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="steeringwheel" md="sports_motorsports" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="barometer">
        <NativeTabs.Trigger.Label>Barometer</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wind" md="air" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="pedometer">
        <NativeTabs.Trigger.Label>Pedometer</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="figure.walk" md="directions_walk" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
