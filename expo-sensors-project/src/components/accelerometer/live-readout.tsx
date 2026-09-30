import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { IFSP_GRAY } from '@/constants/ifsp-colors';

export function LiveReadout() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // expo-sensors não expõe o Accelerometer no navegador, só em dispositivos reais
    if (Platform.OS === 'web') return;

    Accelerometer.setUpdateInterval(200);
    const subscription = Accelerometer.addListener(setData);
    return () => subscription.remove();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.box}>
        <Text style={styles.notice}>sensor só funciona no celular, não no navegador</Text>
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Text style={styles.label}>leitura ao vivo do acelerômetro</Text>
      <View style={styles.row}>
        <Text style={styles.value}>x: {data.x.toFixed(2)}</Text>
        <Text style={styles.value}>y: {data.y.toFixed(2)}</Text>
        <Text style={styles.value}>z: {data.z.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: IFSP_GRAY,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  label: {
    color: '#c4c4c4',
    fontSize: 11,
    marginBottom: 4,
  },
  notice: {
    color: '#c4c4c4',
    fontSize: 12,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
