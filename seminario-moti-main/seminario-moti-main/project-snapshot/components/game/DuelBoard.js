import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import MotiCard from './MotiCard';
import BattleCinema from './BattleCinema';
import { CHOICES, OUTCOMES } from '../../src/game/rules';

const PHASE_LABELS = { idle: 'Escolha sua carta', summon: 'Rival preparando carta…', reveal: 'Revelando o rival…', clash: 'Hora do duelo!', result: 'Duelo concluído' };

export default function DuelBoard({ duel, deployedId, travel, onChoose, onArrive, cardWidth, handWidth, focused, timeScale, reduced, tight }) {
  const boardRef = useRef(null);
  const targetRef = useRef(null);
  const rivalRef = useRef(null);
  const handRefs = useRef({});
  const [positions, setPositions] = useState({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const result = duel.phase === 'result' && duel.round;
  const outcome = result && OUTCOMES[result.outcome];
  const cinema = focused && !reduced && !!duel.round && duel.phase !== 'idle';
  const disabled = duel.busy || !!travel || cinema;
  const centerY = size.height / 2;
  const heroWidth = Math.max(80, Math.min(240, size.width * 0.64, (size.height - 112) / 1.5));
  const resultHeroWidth = Math.max(80, Math.min(heroWidth, (size.height - 146) / 1.5));
  const duelWidth = Math.max(70, Math.min(176, size.width * 0.43, (size.height - 100) / 1.5));
  const frame = (width, centerX, y = centerY) => ({ x: centerX - width / 2, y: y - width * 0.75, width, height: width * 1.5 });
  let playerDestination = positions.target;
  let rivalDestination = positions.rival;
  if (cinema) {
    if (duel.phase === 'summon') {
      playerDestination = frame(heroWidth, size.width * 0.5);
      rivalDestination = frame(cardWidth * 0.8, size.width * 0.83, size.height * 0.28);
    } else if (duel.phase === 'reveal') {
      playerDestination = frame(duelWidth, size.width * 0.27);
      rivalDestination = frame(duelWidth, size.width * 0.73);
    } else if (duel.phase === 'clash') {
      playerDestination = frame(duelWidth * 1.06, size.width * 0.42);
      rivalDestination = frame(duelWidth * 1.06, size.width * 0.58);
    } else if (duel.round.outcome === 'draw') {
      playerDestination = frame(duelWidth, size.width * 0.27);
      rivalDestination = frame(duelWidth, size.width * 0.73);
    } else {
      playerDestination = duel.round.outcome === 'win' ? frame(resultHeroWidth, size.width * 0.5) : frame(cardWidth * 0.65, size.width * 0.13, centerY + 20);
      rivalDestination = duel.round.outcome === 'lose' ? frame(resultHeroWidth, size.width * 0.5) : frame(cardWidth * 0.65, size.width * 0.87, centerY + 20);
    }
  }

  const measure = useCallback(() => {
    if (!focused || !boardRef.current) return;
    const anchors = { target: targetRef.current, rival: rivalRef.current, ...handRefs.current };
    Object.entries(anchors).forEach(([key, anchor]) => {
      anchor?.measureLayout(boardRef.current, (x, y, width, height) => {
        if (!width || !height) return;
        setPositions((previous) => {
          const old = previous[key];
          if (old && old.x === x && old.y === y && old.width === width && old.height === height) return previous;
          return { ...previous, [key]: { x, y, width, height } };
        });
      }, () => {});
    });
  }, [focused]);

  useLayoutEffect(() => { measure(); }, [measure, cardWidth, handWidth]);

  return (
    <View ref={boardRef} collapsable={false} onLayout={(event) => {
      const { width, height } = event.nativeEvent.layout;
      setSize((previous) => previous.width === width && previous.height === height ? previous : { width, height });
      measure();
    }} style={[styles.board, tight && { gap: 8 }]}>
      <View accessibilityElementsHidden={cinema} importantForAccessibility={cinema ? 'no-hide-descendants' : 'auto'} style={[styles.arena, tight && { padding: 8 }, cinema && { opacity: 0.04 }]}>
        <View style={styles.arenaHeader}>
          <Text style={styles.fieldLabel}>CAMPO DE DUELO</Text>
          <Text style={styles.roundLabel}>{duel.round ? `ROUND ${String(duel.round.number).padStart(2, '0')}` : 'PREPARE SUA CARTA'}</Text>
        </View>
        <View style={[styles.stage, tight && { paddingVertical: 6 }]}>
          <View pointerEvents="none" style={styles.table}>
            {[0, 1, 2, 3, 4].map((index) => <View key={`h${index}`} style={[styles.gridLine, { top: `${index * 25}%` }]} />)}
            {[0, 1, 2, 3, 4].map((index) => <View key={`v${index}`} style={[styles.gridColumn, { left: `${index * 25}%` }]} />)}
          </View>
          <View style={styles.stageSlot}>
            <Text style={[styles.playerLabel, { color: '#62dec0' }]}>SUA INVOCAÇÃO</Text>
            <View ref={targetRef} collapsable={false} onLayout={measure} testID="player-field" style={[styles.emptySlot, { width: cardWidth, height: cardWidth * 1.5 }]}>
              {!deployedId && <Text style={styles.emptyText}>ESCOLHA{ '\n' }UMA CARTA</Text>}
            </View>
          </View>
          <View style={styles.vs}><Text style={styles.vsText}>VS</Text><View style={styles.vsLine} /></View>
          <View style={styles.stageSlot}>
            <Text style={[styles.playerLabel, { color: '#b5a1ff' }]}>CARTA DO RIVAL</Text>
            <View ref={rivalRef} collapsable={false} onLayout={measure} style={{ width: cardWidth, height: cardWidth * 1.5 }} />
          </View>
        </View>
        <View style={[styles.status, tight && { height: 44, paddingTop: 4 }]} accessibilityLiveRegion="polite">
          <AnimatePresence exitBeforeEnter>
            <MotiView key={`${duel.round?.id}-${duel.phase}-${deployedId}`} from={{ opacity: reduced ? 1 : 0, translateY: reduced ? 0 : 5 }}
              animate={{ opacity: 1, translateY: 0 }} exit={{ opacity: 0 }} transition={{ type: 'timing', duration: reduced ? 0 : 120 }} style={styles.statusContent}>
              <Text style={[styles.statusTitle, tight && { fontSize: 13 }, outcome && { color: outcome.color }]}>{outcome ? outcome.title : duel.phase === 'idle' && deployedId ? 'Carta pronta para batalhar' : PHASE_LABELS[duel.phase]}</Text>
              <Text numberOfLines={tight ? 1 : 2} style={[styles.statusDetail, tight && { fontSize: 10 }]}>{result ? result.description : duel.busy ? 'As cartas estão em jogo.' : deployedId ? 'Toque em batalhar para enfrentar o rival.' : 'Toque em uma carta para levá-la ao campo.'}</Text>
            </MotiView>
          </AnimatePresence>
        </View>
      </View>
      <View accessibilityElementsHidden={cinema} importantForAccessibility={cinema ? 'no-hide-descendants' : 'auto'} style={cinema && { opacity: 0.04 }}>
        <View style={styles.handHeading}><Text style={styles.fieldLabel}>SUA MÃO</Text><Text style={styles.handHint}>ESCOLHA SEU ELEMENTO</Text></View>
        <View style={[styles.hand, tight && { paddingTop: 6, paddingBottom: 4 }]}>
          {CHOICES.map((choice) => (
            <View key={choice.id} ref={(node) => { handRefs.current[choice.id] = node; }} collapsable={false} onLayout={measure}
              testID={`hand-slot-${choice.id}`} style={[styles.handSlot, { width: handWidth, height: handWidth * 1.5 }]}>
              {deployedId === choice.id && <Text style={styles.emptyText}>EM CAMPO</Text>}
            </View>
          ))}
        </View>
      </View>
      <AnimatePresence>
        {cinema && <BattleCinema key={`cinema-${duel.round.id}`} round={duel.round} phase={duel.phase} size={size} timeScale={timeScale} />}
      </AnimatePresence>
      {/* Cada carta existe uma única vez. A seleção move esse mesmo componente. */}
      <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { zIndex: 4 }]}>
        {positions.rival && rivalDestination && <MotiView testID="rival-card"
          from={{ translateX: positions.rival.x, translateY: positions.rival.y, scale: 1, opacity: 1 }}
          animate={{ translateX: rivalDestination.x + (rivalDestination.width - cardWidth) / 2,
            translateY: rivalDestination.y + (rivalDestination.height - cardWidth * 1.5) / 2,
            scale: rivalDestination.width / cardWidth, opacity: cinema && result && result.outcome === 'win' ? 0.18 : 1 }}
          transition={{ type: 'timing', duration: reduced ? 0 : (duel.phase === 'clash' ? 200 : 480) * timeScale }}
          style={[styles.movingCard, { zIndex: cinema && result && result.outcome === 'lose' ? 9 : 4 }]}>
          <MotiCard key={`rival-${duel.round?.id || 'empty'}`} choice={duel.round?.opponent} width={cardWidth} compact={cardWidth < 100} appear={false}
            faceDown={!duel.round || duel.phase === 'summon'} tilt={cinema && result && result.outcome === 'lose' ? 0 : cinema && duel.phase === 'summon' ? 20 : 7} phase={duel.phase} side="opponent" intense={cinema}
            winner={result && result.outcome === 'lose'} timeScale={timeScale} reduced={reduced} />
        </MotiView>}
        {CHOICES.map((choice, index) => {
          const home = positions[choice.id];
          if (!home || !positions.target) return null;
          const deployed = deployedId === choice.id;
          const destination = deployed ? playerDestination : home;
          return (
            <MotiView key={choice.id} testID={`moving-card-${choice.id}`}
              from={{ translateX: home.x, translateY: home.y, scale: 1, opacity: 1 }}
              animate={{ translateX: destination.x + (destination.width - handWidth) / 2,
                translateY: destination.y + (destination.height - handWidth * 1.5) / 2, scale: destination.width / handWidth,
                opacity: cinema ? !deployed ? 0 : result && result.outcome === 'lose' ? 0.18 : 1 : 1 }}
              transition={{ type: 'timing', duration: reduced ? 0 : (duel.phase === 'clash' ? 200 : 480) * timeScale }}
              onDidAnimate={(property, finished, value, { attemptedValue }) => {
                const targetY = destination.y + (destination.height - handWidth * 1.5) / 2;
                if (!cinema && property === 'translateY' && finished && attemptedValue === targetY && deployed && travel?.choice === choice.id) onArrive(travel.token);
              }} style={[styles.movingCard, { zIndex: deployed ? 8 : 2 }]}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Escolher ${choice.title}`} accessibilityState={{ selected: deployed, disabled }}
                disabled={disabled} onPress={() => onChoose(choice.id)}>
                <MotiCard choice={choice} width={handWidth} compact appear={false} tilt={deployed ? cinema && result && result.outcome === 'win' ? 0 : -7 : (index - 1) * 9}
                  phase={deployed ? duel.phase : 'idle'} dim={duel.busy && !deployed} winner={deployed && result && result.outcome === 'win'} intense={deployed && cinema}
                  timeScale={timeScale} reduced={reduced} />
              </Pressable>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { gap: 12 },
  arena: { backgroundColor: '#121a29', borderWidth: 1, borderColor: '#354057', borderRadius: 16, padding: 12 },
  arenaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  fieldLabel: { color: '#d6bc80', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  roundLabel: { color: '#8895ad', fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  stage: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  stageSlot: { alignItems: 'center', gap: 8 },
  playerLabel: { fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  emptySlot: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#62dec040', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#8895ad', fontSize: 8, lineHeight: 15, textAlign: 'center', letterSpacing: 1 },
  table: { position: 'absolute', width: '100%', height: '90%', borderWidth: 1, borderColor: '#62789e25', transform: [{ perspective: 650 }, { rotateX: '30deg' }], backgroundColor: '#1c284240' },
  gridLine: { position: 'absolute', height: 1, width: '100%', backgroundColor: '#62789e25' },
  gridColumn: { position: 'absolute', width: 1, height: '100%', backgroundColor: '#62789e25' },
  vs: { width: 36, gap: 10, alignItems: 'center' },
  vsText: { color: '#d6bc80', fontSize: 14, fontWeight: '900', fontStyle: 'italic' },
  vsLine: { width: 1, height: 30, backgroundColor: '#d6bc8050' },
  status: { height: 58, borderTopWidth: 1, borderColor: '#2b3548', paddingTop: 8, justifyContent: 'center' },
  statusContent: { alignItems: 'center', gap: 4 },
  statusTitle: { color: '#f3eee1', fontSize: 15, fontWeight: '800', textAlign: 'center' },
  statusDetail: { color: '#a3aec1', fontSize: 11, lineHeight: 16, textAlign: 'center' },
  handHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  handHint: { color: '#8895ad', fontSize: 8, letterSpacing: 0.8 },
  hand: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingTop: 14, paddingBottom: 10 },
  handSlot: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#354057', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  movingCard: { position: 'absolute', left: 0, top: 0 },
});
