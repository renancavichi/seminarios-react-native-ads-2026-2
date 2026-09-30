import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const GRAVITY = 9.80665; // m/s², pra converter de g's (unidade do Accelerometer) pra m/s²
// quanto mais perto de 1, mais devagar o filtro "aprende" a orientação parada do celular
const GRAVITY_SMOOTHING = 0.9;

export type LinearAcceleration = { x: number; y: number; z: number; timestamp: number };

/**
 * O `Accelerometer` sozinho mistura o movimento real com a gravidade (que muda de eixo
 * conforme você gira o celular). Este hook estima a gravidade com um filtro passa-baixa
 * lento e subtrai ela da leitura crua, sobrando só a aceleração linear — o mesmo que o
 * `DeviceMotion.acceleration` entrega pronto, mas calculado a partir do Accelerometer puro.
 */
export function useLinearAccelerometer(
  onUpdate: (accel: LinearAcceleration) => void,
  updateIntervalMs: number,
  enabled: boolean
) {
  const gravityRef = useRef({ x: 0, y: 0, z: 0 });
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    // expo-sensors não expõe o Accelerometer no navegador, só em dispositivos reais
    if (!enabled || Platform.OS === 'web') return;

    Accelerometer.setUpdateInterval(updateIntervalMs);
    const subscription = Accelerometer.addListener((raw) => {
      const gravity = gravityRef.current;
      gravity.x = gravity.x * GRAVITY_SMOOTHING + raw.x * (1 - GRAVITY_SMOOTHING);
      gravity.y = gravity.y * GRAVITY_SMOOTHING + raw.y * (1 - GRAVITY_SMOOTHING);
      gravity.z = gravity.z * GRAVITY_SMOOTHING + raw.z * (1 - GRAVITY_SMOOTHING);

      onUpdateRef.current({
        x: (raw.x - gravity.x) * GRAVITY,
        y: (raw.y - gravity.y) * GRAVITY,
        z: (raw.z - gravity.z) * GRAVITY,
        timestamp: raw.timestamp,
      });
    });

    return () => subscription.remove();
  }, [enabled, updateIntervalMs]);
}
