import { useEvent, useEventListener } from 'expo';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useVideoPlayer, VideoContentFit, VideoView } from 'expo-video';
import { VIDEOS } from './videos';

// Qual vídeo cada tipo de slide usa (veja src/deck/videos.ts)
const SOURCE_BY_KIND: Record<string, number> = {
  controls: VIDEOS.ex02, position: VIDEOS.ex03, events: VIDEOS.ex04, fit: VIDEOS.ex05, react: VIDEOS.react,
};
import SlideCanvas, { Hit, ItemView, TextView } from './SlideCanvas';
import { Item, Slide, TextLine } from './types';

const VIOLET = '#6D4AFF';
const VIOLET_TEXT = '#5B3BE0';

const mmss = (t: number) => {
  const v = Math.max(0, Math.floor(Number.isFinite(t) ? t : 0));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`;
};

/* ============================================================
   EXEMPLO PRÁTICO 01 — o código mais simples: useVideoPlayer + VideoView
   com nativeControls ligado (a barra de tempo vem da própria biblioteca)
   ============================================================ */
export function Live01({ slide, u }: { slide: Slide; u: number }) {
  const player = useVideoPlayer(VIDEOS.ex01); // sem loop: configuração mais pura possível
  const frame = slide.items.find((i) => i.id === 'frame') as Item;
  return (
    <SlideCanvas slide={slide} u={u}>
      <View style={{ position: 'absolute', left: frame.x * u, top: frame.y * u, width: frame.w * u, height: frame.h * u, borderRadius: (frame.r ?? 0) * u, overflow: 'hidden', backgroundColor: VIOLET }}>
        <VideoView
          style={{ width: '100%', height: '100%' }} player={player} contentFit="cover"
          nativeControls={true}
        />
      </View>
    </SlideCanvas>
  );
}

/* ============================================================
   EXEMPLO 02 (4 slides) e exemplo do React: vídeo real + o que o código faz
   ============================================================ */
type Btn = { key: string; onPress: () => void; active?: boolean };

export function LiveDemo({ slide, u }: { slide: Slide; u: number }) {
  const kind = slide.live;
  const source = SOURCE_BY_KIND[kind ?? 'controls'];
  const player = useVideoPlayer(source, (p) => {
    p.loop = kind !== 'react';
    p.timeUpdateEventInterval = 0.25;
  });
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [fit, setFit] = useState<VideoContentFit>('contain');
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [last, setLast] = useState('statusChange: idle → readyToPlay');
  const [status, setStatus] = useState<string>('idle');
  const [ended, setEnded] = useState(false);

  useEventListener(player, 'timeUpdate', ({ currentTime }) => { setCur(currentTime); setDur(player.duration); });
  useEventListener(player, 'statusChange', ({ status: s, oldStatus }) => {
    setLast(`statusChange: ${oldStatus ?? 'idle'} → ${s}`); setStatus(String(s)); setDur(player.duration);
  });
  useEventListener(player, 'playToEnd', () => setEnded(true));

  const item = (id: string): Item | undefined => slide.items.find((i) => i.id === id);
  const text = (id: string): TextLine | undefined => slide.texts.find((t) => t.id === id);
  const hidden = {
    items: slide.items.map((it, i) => (it.live ? i : -1)).filter((i) => i >= 0),
    texts: slide.texts.map((t, i) => (t.live ? i : -1)).filter((i) => i >= 0),
  };
  const frame = item('frame') as Item;
  const play = () => { setEnded(false); player.play(); };

  let btns: Btn[] = [];
  let ro1: string | undefined; let ro2: string | undefined;
  if (kind === 'controls') {
    btns = [
      { key: 'b1', onPress: play }, { key: 'b2', onPress: () => player.pause() },
      { key: 'b3', onPress: () => player.seekBy(-10) }, { key: 'b4', onPress: () => player.seekBy(10) },
    ];
    ro1 = `${mmss(cur)} / ${mmss(dur)}`;
  } else if (kind === 'position') {
    const setSpeed = (r: number) => { const n = rate === r ? 1 : r; player.playbackRate = n; setRate(n); };
    btns = [
      { key: 'b1', onPress: play }, { key: 'b2', onPress: () => player.pause() },
      { key: 'b3', active: muted, onPress: () => { const n = !muted; player.muted = n; setMuted(n); } },
      { key: 'b4', active: rate === 1.5, onPress: () => setSpeed(1.5) },
      { key: 'b5', active: rate === 2, onPress: () => setSpeed(2) },
      { key: 'b6', onPress: () => { player.currentTime = 42; } },
    ];
    ro1 = `currentTime: ${cur.toFixed(1)}`;
    ro2 = `playbackRate: ${rate} · muted: ${muted}`;
  } else if (kind === 'events') {
    btns = [
      { key: 'b1', onPress: play }, { key: 'b2', onPress: () => player.pause() },
      { key: 'b3', onPress: () => { try { (player as any).replaceAsync ? (player as any).replaceAsync(source) : player.replace(source); } catch {} } },
    ];
    ro1 = last;
  } else if (kind === 'fit') {
    btns = [
      { key: 'b1', onPress: play }, { key: 'b2', onPress: () => player.pause() },
      ...(['contain', 'cover', 'fill'] as VideoContentFit[]).map((f, i) => ({ key: 'b' + (i + 3), active: fit === f, onPress: () => setFit(f) })),
    ];
    ro1 = `contentFit="${fit}"`;
  } else if (kind === 'react') {
    btns = [
      { key: 'b1', onPress: play }, { key: 'b2', onPress: () => player.pause() },
      { key: 'b3', onPress: () => { setEnded(false); player.currentTime = Math.max(0, (player.duration || 0) - 3); player.play(); } },
    ];
    ro1 = status;
    ro2 = ended ? 'Acabou!' : 'aguardando…';
  }

  return (
    <SlideCanvas slide={slide} u={u} hidden={hidden}>
      <View style={{ position: 'absolute', left: frame.x * u, top: frame.y * u, width: frame.w * u, height: frame.h * u, borderRadius: (frame.r ?? 0) * u, overflow: 'hidden', backgroundColor: VIOLET }}>
        <VideoView style={{ width: '100%', height: '100%' }} player={player} contentFit={kind === 'fit' ? fit : 'cover'} nativeControls={false} />
      </View>
      {btns.map((b) => {
        const it = item(b.key) as Item; const t = text(b.key + 't') as TextLine;
        return (
          <View key={b.key} pointerEvents="box-none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
            <ItemView it={it} u={u} over={b.active ? { fill: VIOLET } : { fill: '#FFFFFF', line: { c: VIOLET, w: 0.026 } }} />
            <TextView t={t} u={u} color={b.active ? '#FFFFFF' : VIOLET_TEXT} />
            <Hit it={it} u={u} onPress={b.onPress} />
          </View>
        );
      })}
      {ro1 !== undefined && text('ro1') ? <TextView t={text('ro1') as TextLine} u={u} text={ro1} /> : null}
      {ro2 !== undefined && text('ro2') ? <TextView t={text('ro2') as TextLine} u={u} text={ro2} /> : null}
    </SlideCanvas>
  );
}


/* ============================================================
   EXEMPLO PRÁTICO 06 — tela cheia, PiP e background (vídeo real)
   ============================================================ */
export function LivePip({ slide, u }: { slide: Slide; u: number }) {
  const ref = useRef<VideoView>(null);
  const player = useVideoPlayer(VIDEOS.ex06, (p) => { p.loop = true; p.staysActiveInBackground = true; });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const [bg, setBg] = useState(true);
  const [msg, setMsg] = useState('');
  const [fs, setFs] = useState(false);

  const item = (id: string) => slide.items.find((i) => i.id === id) as Item;
  const text = (id: string) => slide.texts.find((t) => t.id === id) as TextLine;
  const hidden = {
    items: slide.items.map((it, i) => (it.live ? i : -1)).filter((i) => i >= 0),
    texts: slide.texts.map((t, i) => (t.live ? i : -1)).filter((i) => i >= 0),
  };
  const frame = item('frame');
  const run = async (fn: () => unknown, fail: string) => {
    try { await fn(); setMsg(''); } catch { setMsg(fail); }
  };
  const btns: { key: string; label?: string; active?: boolean; onPress: () => void }[] = [
    { key: 'p1', label: isPlaying ? 'Pause' : 'Play', onPress: () => (isPlaying ? player.pause() : player.play()) },
    { key: 'p2', onPress: () => run(() => ref.current?.enterFullscreen(), 'Tela cheia indisponível aqui') },
    { key: 'p3', onPress: () => run(() => ref.current?.startPictureInPicture(), 'PiP indisponível aqui') },
    { key: 'bg', active: bg, onPress: () => { const n = !bg; player.staysActiveInBackground = n; setBg(n); } },
  ];

  return (
    <SlideCanvas slide={slide} u={u} hidden={hidden}>
      <View style={{ position: 'absolute', left: frame.x * u, top: frame.y * u, width: frame.w * u, height: frame.h * u, borderRadius: (frame.r ?? 0) * u, overflow: 'hidden', backgroundColor: VIOLET }}>
        <VideoView
          ref={ref} style={{ width: '100%', height: '100%' }} player={player} contentFit="cover"
          nativeControls={fs} fullscreenOptions={{ enable: true }} allowsPictureInPicture
          onFullscreenEnter={() => setFs(true)} onFullscreenExit={() => setFs(false)}
        />
      </View>
      {msg ? (
        <View style={{ position: 'absolute', left: (frame.x + 0.3) * u, top: (frame.y + 0.25) * u, backgroundColor: 'rgba(31,36,51,0.78)', borderRadius: 0.2 * u, paddingHorizontal: 0.25 * u, paddingVertical: 0.1 * u }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 0.24 * u }}>{msg}</Text>
        </View>
      ) : null}
      {btns.map((b) => {
        const it = item(b.key); const t = text(b.key + 't');
        return (
          <View key={b.key} pointerEvents="box-none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
            <ItemView it={it} u={u} over={b.active ? { fill: VIOLET } : { fill: '#FFFFFF', line: { c: VIOLET, w: 0.026 } }} />
            <TextView t={t} u={u} text={b.label} color={b.active ? '#FFFFFF' : VIOLET_TEXT} />
            <Hit it={it} u={u} onPress={b.onPress} />
          </View>
        );
      })}
    </SlideCanvas>
  );
}
