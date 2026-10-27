import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AnimatePresence, MotiText, MotiView } from 'moti';

// Laboratório didático do seminário. As animações abaixo executam Moti real.
function Control({ label, onPress, active, testID }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} testID={testID} onPress={onPress}
    style={[styles.control, active && styles.active]}><Text style={[styles.controlText, active && styles.activeText]}>{label}</Text></Pressable>;
}

function MountLab() {
  const [replay, setReplay] = useState(0);
  return <View style={styles.lesson}>
    <Text style={styles.hint}>from é o início. animate é o destino.</Text>
    <View style={styles.stage}>
      <MotiView key={replay} testID="lab-mount-box"
        from={{ opacity: 0, scale: 0.55, translateY: 35 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1200 }} style={styles.box}>
        <MotiText from={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 900, delay: 300 }} style={styles.boxText}>Moti</MotiText>
      </MotiView>
    </View>
    <Control label="Repetir entrada" testID="lab-replay" onPress={() => setReplay(value => value + 1)} />
    <Text style={styles.foot}>O botão troca a key para montar de novo e repetir from.</Text>
  </View>;
}

function StateLab() {
  const [selected, setSelected] = useState(false);
  return <View style={styles.lesson}>
    <Text style={styles.hint}>React muda selected. Moti anima o novo destino.</Text>
    <View style={styles.stage}>
      <MotiView testID="lab-state-box"
        animate={{ translateX: selected ? 45 : -45, scale: selected ? 1.2 : 1,
          backgroundColor: selected ? '#62dec0' : '#d8bb7d' }}
        transition={{ type: 'spring', damping: 12, stiffness: 110 }} style={styles.box}>
        <Text style={styles.boxText}>{selected ? 'Selecionado' : 'Em repouso'}</Text>
      </MotiView>
    </View>
    <Control label="Alternar estado" testID="lab-toggle" onPress={() => setSelected(value => !value)} />
    <Text testID="lab-state-value" style={styles.foot}>selected = {String(selected)}</Text>
  </View>;
}

function TimingLab() {
  const [target, setTarget] = useState(false);
  const [duration, setDuration] = useState(1200);
  const [delay, setDelay] = useState(0);
  return <View style={styles.lesson}>
    <Text style={styles.hint}>Mesmo deslocamento. Duas formas de chegar.</Text>
    <View style={styles.track}><Text style={styles.trackLabel}>TIMING · {duration} ms</Text>
      <MotiView testID="lab-timing-box" animate={{ translateX: target ? 135 : 0 }}
        transition={{ type: 'timing', duration, delay }} style={styles.dot} />
    </View>
    <View style={styles.track}><Text style={styles.trackLabel}>SPRING · damping 8 / stiffness 90</Text>
      <MotiView testID="lab-spring-box" animate={{ translateX: target ? 135 : 0 }}
        transition={{ type: 'spring', damping: 8, stiffness: 90, delay }} style={[styles.dot, styles.springDot]} />
    </View>
    <Control label="Mover os dois" testID="lab-move" onPress={() => setTarget(value => !value)} />
    <View style={styles.controls}>
      <Control label="500 ms" active={duration === 500} onPress={() => setDuration(500)} />
      <Control label="1.200 ms" active={duration === 1200} onPress={() => setDuration(1200)} />
      <Control label="Delay 700 ms" active={delay === 700} onPress={() => setDelay(value => value ? 0 : 700)} />
    </View>
    <Text style={styles.foot}>duration muda apenas timing. delay adia o início dos dois.</Text>
  </View>;
}

function PresenceLab() {
  const [visible, setVisible] = useState(true);
  return <View style={styles.lesson}>
    <Text style={styles.hint}>Ao ocultar, observe exit antes da remoção.</Text>
    <View style={styles.stage}>
      <AnimatePresence>
        {visible && <MotiView key="presence-box" testID="lab-presence-box"
          from={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={{ type: 'timing', duration: 900 }} style={styles.box}>
          <Text style={styles.boxText}>Até já!</Text>
        </MotiView>}
      </AnimatePresence>
    </View>
    <Control label={visible ? 'Ocultar com exit' : 'Mostrar novamente'} testID="lab-presence-toggle" onPress={() => setVisible(value => !value)} />
    <Text testID="lab-visible-value" style={styles.foot}>visible = {String(visible)} · exit dura 900 ms</Text>
  </View>;
}

export default function MotiLab() {
  const { lesson = 'api' } = useLocalSearchParams();
  const Lesson = { api: MountLab, state: StateLab, timing: TimingLab, presence: PresenceLab }[lesson] || MountLab;
  return <ScrollView testID="moti-lab" style={styles.root} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>LABORATÓRIO · MOTI EM EXECUÇÃO</Text><Lesson />
  </ScrollView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#101621' }, content: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  eyebrow: { color: '#d8bb7d', fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginBottom: 18 },
  lesson: { gap: 14 }, hint: { color: '#d8e0ef', fontSize: 14, lineHeight: 21 },
  stage: { height: 175, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  box: { width: 125, height: 125, backgroundColor: '#d8bb7d', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  boxText: { color: '#101621', fontSize: 15, fontWeight: '800' },
  control: { paddingHorizontal: 12, paddingVertical: 11, borderRadius: 8, borderWidth: 1, borderColor: '#d8bb7d70', alignItems: 'center' },
  controlText: { color: '#f4f0e7', fontSize: 12, fontWeight: '600' }, active: { backgroundColor: '#d8bb7d' }, activeText: { color: '#101621' },
  controls: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' }, foot: { color: '#a9b2c6', fontSize: 11, lineHeight: 17 },
  track: { height: 76, gap: 10, paddingHorizontal: 12 }, trackLabel: { color: '#a9b2c6', fontSize: 10 },
  dot: { width: 34, height: 34, borderRadius: 9, backgroundColor: '#d8bb7d' }, springDot: { backgroundColor: '#b5a1ff' },
});
