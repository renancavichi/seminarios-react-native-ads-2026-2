import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { getChoice } from '../../src/game/rules';
import ChoiceSymbol from './ChoiceSymbol';

// Todas as animações visuais das cartas são declaradas em Moti.
// A perspectiva vem primeiro para dar profundidade às rotações.
export default function MotiCard({ choice, width = 130, faceDown = false, tilt = 0,
  elevated = false, dim = false, phase = 'idle', side = 'player', winner = false,
  timeScale = 1, reduced = false, compact = false, appear = true, intense = false }) {
  const height = width * 1.5;
  const tiny = width < 75;
  const color = choice?.color || '#d6bc80';
  const clashing = phase === 'clash' && !reduced;
  const transforms = (x, y, angle, scale) => [
    { perspective: 900 }, { translateX: x }, { translateY: y },
    { rotateX: reduced ? '0deg' : '12deg' }, { rotateZ: reduced ? '0deg' : Array.isArray(angle) ? angle.map((value) => `${value}deg`) : `${angle}deg` }, { scale },
  ];
  return (
    <MotiView
      from={{ opacity: reduced || !appear ? 1 : 0, transform: transforms(0, reduced || !appear ? 0 : 35, tilt, reduced || !appear ? 1 : 0.85) }}
      animate={{ opacity: dim ? 0.5 : 1, transform: transforms(
        clashing ? [0, side === 'player' ? 18 : -18, side === 'player' ? -5 : 5, 0] : 0,
        clashing && intense ? [0, -10, 6, 0] : elevated && !reduced ? -18 : winner && !reduced ? -8 : 0,
        clashing && intense ? [tilt, tilt - 14, tilt + 12, tilt] : elevated ? 0 : tilt,
        intense && phase === 'summon' ? [1, 1.08, 1] : clashing && intense ? [1, 1.16, 0.96, 1] : elevated && !reduced ? 1.06 : 1) }}
      transition={{ type: 'timing', duration: reduced ? 0 : (clashing && intense ? 130 : 230) * timeScale }}
      style={[styles.card, { width, height, shadowColor: color, shadowOpacity: elevated || winner ? 0.5 : 0.18 }]}
      accessibilityElementsHidden={faceDown} importantForAccessibility={faceDown ? 'no-hide-descendants' : 'auto'}>
      <MotiView
        from={{ transform: [{ perspective: 900 }, { rotateY: faceDown ? '180deg' : '0deg' }] }}
        animate={{ transform: [{ perspective: 900 }, { rotateY: faceDown ? '180deg' : '0deg' }] }}
        transition={{ type: 'timing', duration: reduced ? 0 : 500 * timeScale }}
        style={[styles.face, { borderColor: color }]}>
        <LinearGradient colors={['#30384a', '#121926', '#293447']} style={[styles.front, compact && styles.compactFront, compact && tiny && styles.tinyFront]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.element, { color, fontSize: Math.max(tiny ? 7 : 8, width * 0.065) }]}>{choice?.element || 'ELEMENTO'}</Text>
            <Text style={[styles.rarity, { color }]}>✦</Text>
          </View>
          <Text numberOfLines={1} style={[styles.cardTitle, { fontSize: Math.max(tiny ? 10 : 12, width * 0.105) }]}>{choice?.title || 'Carta'}</Text>
          <LinearGradient colors={[`${color}35`, '#111827', `${color}18`]} style={[styles.art, { borderColor: `${color}65`, minHeight: compact ? tiny ? 24 : 28 : 46 }]}>
            <View style={[styles.ring, { width: width * 0.64, height: width * 0.64, borderColor: `${color}35` }]} />
            <View style={[styles.diamond, { width: width * 0.48, height: width * 0.48, borderColor: `${color}80`, backgroundColor: `${color}12` }]} />
            <ChoiceSymbol choice={choice} size={width * 0.45} color={color} />
            <Text style={[styles.artStar, { color }]}>✧</Text>
          </LinearGradient>
          {(!compact || width >= 100) && <Text numberOfLines={1} style={[styles.name, { fontSize: Math.max(8, width * 0.065) }]}>{choice?.name}</Text>}
          {!compact && width >= 125 && <Text numberOfLines={2} style={[styles.lore, { fontSize: Math.max(8, width * 0.06) }]}>{choice?.lore}</Text>}
          <View style={styles.footer}>
            <Text numberOfLines={1} style={[styles.footerText, { color, fontSize: Math.max(compact ? 7 : 8, width * 0.06) }]}>VENCE {choice ? getChoice(choice.beats).title.toUpperCase() : '—'}</Text>
            <Text style={styles.rarity}>◆</Text>
          </View>
        </LinearGradient>
      </MotiView>
      <MotiView
        from={{ transform: [{ perspective: 900 }, { rotateY: faceDown ? '0deg' : '-180deg' }] }}
        animate={{ transform: [{ perspective: 900 }, { rotateY: faceDown ? '0deg' : '-180deg' }] }}
        transition={{ type: 'timing', duration: reduced ? 0 : 500 * timeScale }}
        style={[styles.face, styles.back]}>
        <LinearGradient colors={['#2a2543', '#171c2c', '#312d42']} style={styles.backFill}>
          <View style={[styles.backBorder, width < 100 && { gap: width < 75 ? 4 : 6 }]}>
            <View style={[styles.backDiamond, width < 100 && { padding: width < 75 ? 5 : 7, marginBottom: 4 }]}><FontAwesome name="bolt" size={width * 0.28} color="#d6bc80" style={{ transform: [{ rotate: '-45deg' }] }} /></View>
            <Text style={[styles.backTitle, width < 100 && { fontSize: width < 75 ? 8 : 10, letterSpacing: width < 75 ? 1 : 2 }]}>TRÍADE</Text>
            <Text style={[styles.backSubtitle, width < 75 && { fontSize: 6, letterSpacing: 1 }]}>DUEL DECK</Text>
          </View>
        </LinearGradient>
      </MotiView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { shadowOffset: { width: 0, height: 10 }, shadowRadius: 16, elevation: 8, borderRadius: 10 },
  face: { ...StyleSheet.absoluteFillObject, borderWidth: 1.5, borderRadius: 10, overflow: 'hidden', backfaceVisibility: 'hidden', backgroundColor: '#151c2a' },
  front: { flex: 1, padding: 8, gap: 4 },
  compactFront: { padding: 6, gap: 3 },
  tinyFront: { padding: 4, gap: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  element: { fontWeight: '800', letterSpacing: 1.4 },
  rarity: { color: '#d6bc80', fontSize: 10 },
  cardTitle: { fontWeight: '800', color: '#f3eee1', marginBottom: 2 },
  art: { flex: 1, minHeight: 46, borderWidth: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  ring: { position: 'absolute', borderWidth: 1, borderRadius: 150 },
  diamond: { position: 'absolute', borderWidth: 1, transform: [{ rotate: '45deg' }] },
  artStar: { position: 'absolute', right: 6, top: 3, fontSize: 18 },
  name: { color: '#e4dfd2', fontWeight: '700', marginTop: 3 },
  lore: { color: '#b2b9c6', lineHeight: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#ffffff20', paddingTop: 4, marginTop: 2 },
  footerText: { fontWeight: '800', flex: 1 },
  back: { borderColor: '#a28b60' },
  backFill: { flex: 1, padding: 8 },
  backBorder: { flex: 1, borderWidth: 1, borderColor: '#d6bc8050', borderRadius: 4, alignItems: 'center', justifyContent: 'center', gap: 10 },
  backDiamond: { borderWidth: 1, borderColor: '#d6bc80', padding: 12, transform: [{ rotate: '45deg' }], marginBottom: 12 },
  backTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 3, color: '#d6bc80' },
  backSubtitle: { fontSize: 7, color: '#a99c85', letterSpacing: 2 },
});
