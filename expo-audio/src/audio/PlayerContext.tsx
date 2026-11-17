/**
 * PlayerContext: a lógica de áudio do Sonora.
 *
 * Existe um único player no app inteiro. Ele é criado aqui com useAudioPlayer
 * e compartilhado com as telas via React Context. Assim a música continua
 * tocando quando o usuário troca de tela.
 *
 * Os comentários [Slide N] indicam qual slide da apresentação explica o trecho.
 * Para abrir um slide direto: /slides?n=N
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioPlayer,
  type AudioStatus,
} from 'expo-audio';

import { PLAYBACK_MODE } from '@/audio/audioMode';
import { TRACKS, type Track } from '@/data/tracks';

export type RepeatMode = 'off' | 'all' | 'one';

type PlayerContextValue = {
  player: AudioPlayer;
  status: AudioStatus;
  queue: Track[];
  current: Track | null;
  currentIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  playTrack: (index: number) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setRate: (rate: number) => void;
  setVolume: (volume: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

/** Embaralha (Fisher-Yates) mantendo `first` na primeira posição. */
function shuffledOrder(length: number, first: number): number[] {
  const rest = Array.from({ length }, (_, i) => i).filter((i) => i !== first);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return first >= 0 ? [first, ...rest] : rest;
}

const linearOrder = (length: number) => Array.from({ length }, (_, i) => i);

export function PlayerProvider({ children }: { children: ReactNode }) {
  // [Slide 6] Criando o player.
  // null: começa sem música carregada (cada faixa entra depois com replace).
  // updateInterval: de quantos em quantos ms o status é atualizado. O padrão
  // é 500; com 250 a barra de progresso fica mais suave.
  // O hook libera o player sozinho quando o componente desmonta.
  const player = useAudioPlayer(null, { updateInterval: 250 });

  // [Slide 7] Status reativo: re-renderiza quando playing, currentTime etc. mudam.
  const status = useAudioPlayerStatus(player);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [order, setOrder] = useState<number[]>(() => linearOrder(TRACKS.length));
  const [volume, setVolumeState] = useState(1);

  // [Slide 11] Sessão de áudio, configurada uma vez quando o app abre.
  // Os valores estão em src/audio/audioMode.ts.
  useEffect(() => {
    setAudioModeAsync(PLAYBACK_MODE).catch((e) => console.warn('setAudioModeAsync falhou', e));
  }, []);

  // [Slide 8] Tocar uma faixa: replace() troca a fonte sem criar outro player.
  const playTrack = useCallback(
    (index: number) => {
      const track = TRACKS[index];
      if (!track) return;

      player.replace({ uri: track.uri, name: track.title });
      player.play();
      setCurrentIndex(index);

      // [Slide 13] Controles na tela de bloqueio e central de controle.
      player.setActiveForLockScreen(
        true,
        {
          title: track.title,
          artist: track.artist,
          albumTitle: track.album,
          artworkUrl: track.artwork,
        },
        { showSeekForward: true, showSeekBackward: true },
      );
    },
    [player],
  );

  const togglePlay = useCallback(() => {
    if (currentIndex < 0) {
      playTrack(order[0]);
      return;
    }
    if (status.playing) {
      player.pause();
    } else {
      // Se a faixa já tinha terminado, volta para o início antes de tocar.
      if (status.duration > 0 && status.currentTime >= status.duration - 0.5) {
        player.seekTo(0);
      }
      player.play();
    }
  }, [currentIndex, order, playTrack, player, status.playing, status.currentTime, status.duration]);

  // [Slide 18] Fila: próxima e anterior.
  // auto = true quando quem chamou foi o fim da faixa.
  const goNext = useCallback(
    (auto: boolean) => {
      const pos = order.indexOf(currentIndex);
      let nextPos = pos + 1;
      if (nextPos >= order.length) {
        if (auto && repeat === 'off') {
          // Fim da fila sem repeat: para no início da última faixa.
          player.pause();
          player.seekTo(0);
          return;
        }
        nextPos = 0; // repeat 'all' ou clique manual: volta para o começo
      }
      playTrack(order[nextPos]);
    },
    [order, currentIndex, repeat, player, playTrack],
  );

  const next = useCallback(() => goNext(false), [goNext]);

  const previous = useCallback(() => {
    // Regra dos 3 segundos (Spotify e Deezer fazem igual):
    // depois de 3s, "anterior" só reinicia a faixa atual.
    if (status.currentTime > 3 || currentIndex < 0) {
      player.seekTo(0);
      return;
    }
    const pos = order.indexOf(currentIndex);
    const prevPos = pos <= 0 ? order.length - 1 : pos - 1;
    playTrack(order[prevPos]);
  }, [status.currentTime, currentIndex, order, player, playTrack]);

  // [Slide 19] Eventos. Quando a faixa termina, o status vem com didJustFinish.
  // Assina o evento nativo do player em vez de reagir ao estado.
  // useEffectEvent (React 19) sempre enxerga a versão mais nova de goNext,
  // então não é preciso refazer a assinatura a cada troca de faixa.
  const onTrackFinished = useEffectEvent(() => {
    goNext(true);
  });
  useEffect(() => {
    const sub = player.addListener('playbackStatusUpdate', (s) => {
      if (s.didJustFinish) onTrackFinished();
    });
    return () => sub.remove();
  }, [player]);

  // [Slide 20] Shuffle e repeat.
  const toggleShuffle = useCallback(() => {
    const turnOn = !shuffle;
    setShuffle(turnOn);
    // Ligou: embaralha mantendo a faixa atual em primeiro. Desligou: ordem original.
    setOrder(turnOn ? shuffledOrder(TRACKS.length, currentIndex) : linearOrder(TRACKS.length));
  }, [shuffle, currentIndex]);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
  }, []);

  // Repeat "one" usa a propriedade nativa loop: a faixa reinicia sozinha
  // e o fim dela não dispara a troca de faixa.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- o player é um objeto nativo; a API é atribuir propriedades
    player.loop = repeat === 'one';
  }, [player, repeat, currentIndex]);

  // [Slide 21] Velocidade, volume e seek.
  const setRate = useCallback(
    (rate: number) => {
      // eslint-disable-next-line react-hooks/immutability -- objeto nativo
      player.shouldCorrectPitch = true; // mantém o tom da voz em 1.5x, 2x
      // 'high': na web, o shouldCorrectPitch vem deste 2º parâmetro.
      player.setPlaybackRate(rate, 'high');
    },
    [player],
  );

  const setVolume = useCallback(
    (v: number) => {
      // eslint-disable-next-line react-hooks/immutability -- objeto nativo
      player.volume = v; // 0.0 a 1.0 (volume do player, não do sistema)
      setVolumeState(v);
    },
    [player],
  );

  const seek = useCallback((seconds: number) => player.seekTo(seconds), [player]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      player,
      status,
      queue: TRACKS,
      current: TRACKS[currentIndex] ?? null,
      currentIndex,
      shuffle,
      repeat,
      volume,
      playTrack,
      togglePlay,
      next,
      previous,
      seek,
      toggleShuffle,
      cycleRepeat,
      setRate,
      setVolume,
    }),
    [player, status, currentIndex, shuffle, repeat, volume, playTrack, togglePlay, next, previous, seek, toggleShuffle, cycleRepeat, setRate, setVolume],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer precisa estar dentro de <PlayerProvider>');
  return ctx;
}
