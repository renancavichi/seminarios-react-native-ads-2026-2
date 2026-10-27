import { StyleSheet, Text, View } from 'react-native';
import { MotiText, MotiView } from 'moti';
import DuelEffects from './DuelEffects';
import { OUTCOMES } from '../../src/game/rules';

const TITLES = { summon: 'INVOCAÇÃO SUPREMA', reveal: 'DESTINO REVELADO', clash: 'COLISÃO DOS ELEMENTOS' };

// Cenário cinematográfico: toda movimentação, brilho e partículas usam Moti.
export default function BattleCinema({ round, phase, size, timeScale }) {
  const result = phase === 'result';
  const color = result ? OUTCOMES[round.outcome].color : phase === 'reveal' ? '#b5a1ff' : round.player.color;
  const diameter = Math.min(size.width * 0.9, size.height * 0.8);
  return (
    <MotiView pointerEvents="none" testID="battle-cinema" from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 260 }} style={styles.scene}>
      <MotiView key={`aura-${phase}`} from={{ opacity: 0.12, scale: 0.6 }} animate={{ opacity: 0.35, scale: 1.15 }}
        transition={{ type: 'timing', duration: 1400 * timeScale, loop: true }}
        style={[styles.aura, { width: diameter, height: diameter, borderRadius: diameter / 2, backgroundColor: color }]} />
      {[0, 1, 2].map((ring) => (
        <MotiView key={`orbit-${ring}`} from={{ rotate: ring % 2 ? '360deg' : '0deg', scale: 0.85, opacity: 0.25 }}
          animate={{ rotate: ring % 2 ? '0deg' : '360deg', scale: 1.05, opacity: 0.7 }}
          transition={{ type: 'timing', duration: (5200 + ring * 1400) * timeScale, loop: true, repeatReverse: false }}
          style={[styles.orbit, { width: diameter * (0.72 + ring * 0.22), height: diameter * (0.72 + ring * 0.22),
            borderRadius: diameter, borderColor: `${color}${ring === 1 ? '95' : '50'}`, borderStyle: ring === 1 ? 'dashed' : 'solid' }]} />
      ))}
      {Array.from({ length: 14 }, (_, index) => (
        <View key={`ray-${index}`} style={[styles.rayAxis, { transform: [{ rotate: `${index * (360 / 14)}deg` }] }]}>
          <MotiView from={{ opacity: 0, scaleY: 0.2, translateY: 10 }} animate={{ opacity: 0.5, scaleY: 1, translateY: -30 }}
            transition={{ type: 'timing', duration: 1700 * timeScale, delay: index * 70, loop: true }}
            style={[styles.ray, { backgroundColor: color, height: diameter * 0.55 }]} />
        </View>
      ))}
      {Array.from({ length: 18 }, (_, index) => (
        <MotiView key={`ember-${index}`} from={{ opacity: 0, translateY: 45, scale: 0.2 }}
          animate={{ opacity: [0, 0.8, 0], translateY: -90, scale: [0.2, 1.2, 0.3] }}
          transition={{ type: 'timing', duration: (1500 + (index % 4) * 250) * timeScale, delay: index * 90, loop: true, repeatReverse: false }}
          style={[styles.ember, { left: `${8 + (index * 31) % 84}%`, top: `${20 + (index * 19) % 65}%`, backgroundColor: index % 3 ? color : '#fff0cd' }]} />
      ))}
      <View style={styles.heading}>
        <Text style={styles.round}>✦ DUEL ARENA / ROUND {String(round.number).padStart(2, '0')} ✦</Text>
        <MotiText key={`title-${phase}`} from={{ opacity: 0, translateY: -15, scale: 0.75 }}
          animate={{ opacity: 1, translateY: 0, scale: [0.75, 1.08, 1] }} transition={{ type: 'timing', duration: 180 }}
          style={[styles.title, { color, fontSize: size.width < 330 ? 16 : 20 }]}>
          {result ? round.outcome === 'draw' ? 'EQUILÍBRIO ABSOLUTO' : 'PODER SUPREMO' : TITLES[phase]}
        </MotiText>
      </View>
      <View style={styles.caption} accessibilityLiveRegion="polite">
        <MotiText key={`caption-${phase}`} from={{ opacity: 0, scale: 0.65, translateY: 14 }} animate={{ opacity: 1, scale: [0.65, 1.12, 1], translateY: 0 }}
          transition={{ type: 'timing', duration: 180 }} style={[styles.captionTitle, { color, fontSize: size.width < 330 ? 20 : 26 }]}>
          {result ? OUTCOMES[round.outcome].title : phase === 'clash' ? 'CHOQUE FINAL!' : phase === 'reveal' ? `${round.player.title.toUpperCase()} × ${round.opponent.title.toUpperCase()}` : round.player.name.toUpperCase()}
        </MotiText>
        <Text style={styles.captionDetail}>{result ? round.description : phase === 'clash' ? 'Só um elemento dominará a arena.' : 'O poder dos elementos foi despertado.'}</Text>
      </View>
      {phase === 'clash' && <DuelEffects key={`impact-${round.id}`} color={color} timeScale={timeScale} size={Math.min(size.width, size.height) * 0.7} />}
      {result && <DuelEffects key={`finale-${round.id}`} color={color} timeScale={timeScale} size={Math.min(size.width, size.height) * 0.8} />}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  scene: { ...StyleSheet.absoluteFillObject, backgroundColor: '#080b16f5', borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  aura: { position: 'absolute', opacity: 0.2 },
  orbit: { position: 'absolute', borderWidth: 2 },
  rayAxis: { position: 'absolute', top: '50%', left: '50%' },
  ray: { position: 'absolute', width: 2, bottom: 0, borderRadius: 2 },
  ember: { position: 'absolute', width: 3, height: 7, borderRadius: 2 },
  heading: { position: 'absolute', top: 9, left: 8, right: 8, alignItems: 'center', gap: 5 },
  round: { color: '#c4b58c', fontSize: 8, letterSpacing: 1.7, fontWeight: '700' },
  title: { fontWeight: '900', letterSpacing: 1, textAlign: 'center' },
  caption: { position: 'absolute', bottom: 10, left: 10, right: 10, alignItems: 'center', gap: 4 },
  captionTitle: { fontWeight: '900', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10 },
  captionDetail: { color: '#d0d6e4', fontSize: 10, textAlign: 'center' },
});
