import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { SLIDES } from './deck/data';
import { Live01, LiveDemo, LivePip } from './deck/Live';
import SlideCanvas from './deck/SlideCanvas';

/** Apresentação idêntica ao PPTX (21 slides). Os slides de exemplo prático têm vídeo de verdade. */
export default function DeckRoot() {
  const { width, height } = useWindowDimensions();
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => Math.min(SLIDES.length - 1, Math.max(0, v + d)));

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1);
      else if (e.key === 'Home') setI(0);
      else if (e.key === 'End') setI(SLIDES.length - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const W = Math.min(width, (height * 16) / 9);
  const u = W / 20; // pixels por polegada do slide
  const slide = SLIDES[i];
  const body = slide.live === 'ex01' ? <Live01 slide={slide} u={u} /> : slide.live === 'pip' ? <LivePip slide={slide} u={u} /> : slide.live ? <LiveDemo slide={slide} u={u} /> : <SlideCanvas slide={slide} u={u} />;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <View key={i}>{body}</View>
      {/* navegação discreta (também funciona com as setas do teclado) */}
      <View style={{ position: 'absolute', bottom: 6, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 10, opacity: 0.4 }}>
        <Pressable onPress={() => go(-1)} hitSlop={12}><Text style={{ fontSize: 22, color: '#5B6475' }}>‹</Text></Pressable>
        <Text style={{ fontSize: 12, color: '#5B6475' }}>{i + 1} / {SLIDES.length}</Text>
        <Pressable onPress={() => go(1)} hitSlop={12}><Text style={{ fontSize: 22, color: '#5B6475' }}>›</Text></Pressable>
      </View>
    </View>
  );
}
