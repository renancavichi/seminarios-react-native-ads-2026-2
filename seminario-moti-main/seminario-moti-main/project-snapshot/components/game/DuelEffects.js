import { StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';

export default function DuelEffects({ color, timeScale = 1, size = 140 }) {
  return (
    <View pointerEvents="none" style={styles.layer}>
      {[0, 1, 2].map((index) => <MotiView key={`ring-${index}`} from={{ opacity: 0.9, scale: 0.05 }} animate={{ opacity: 0, scale: 3.5 }}
        transition={{ type: 'timing', duration: (800 + index * 140) * timeScale, delay: index * 90 }}
        style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: index % 2 ? '#fff0cd' : color }]} />)}
      <MotiView from={{ opacity: 0.55, scale: 0.1 }} animate={{ opacity: 0, scale: 4 }}
        transition={{ type: 'timing', duration: 550 * timeScale }} style={[styles.flash, { backgroundColor: color }]} />
      {Array.from({ length: 24 }, (_, index) => {
        const angle = (index * Math.PI) / 12;
        const distance = size * (0.65 + (index % 3) * 0.18);
        return <MotiView key={index} from={{ opacity: 1, translateX: 0, translateY: 0, rotate: `${index * 15}deg`, scale: 1.2 }}
          animate={{ opacity: 0, translateX: Math.cos(angle) * distance, translateY: Math.sin(angle) * distance, rotate: `${index * 15 + 150}deg`, scale: 0.15 }}
          transition={{ type: 'timing', duration: (700 + index % 4 * 110) * timeScale }} style={[styles.spark, { backgroundColor: index % 3 ? color : '#fff0cd' }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  ring: { position: 'absolute', borderWidth: 3 },
  flash: { position: 'absolute', width: 110, height: 110, borderRadius: 55 },
  spark: { position: 'absolute', width: 4, height: 24, borderRadius: 2 },
});
