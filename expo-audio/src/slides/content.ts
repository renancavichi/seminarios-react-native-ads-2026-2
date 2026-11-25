/**
 * Conteúdo da apresentação.
 *
 * Campos de cada slide:
 *  section   parte da apresentação (aparece no topo do slide)
 *  code      trecho de código; codeLabel é o título do bloco (padrão: file)
 *  file      arquivo do projeto onde o código está
 *  table     tabela simples (cabeçalho + linhas)
 *  demo      botão que abre a tela correspondente do app
 */
export type Slide = {
  section?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  code?: string;
  codeLabel?: string;
  file?: string;
  table?: { head: string[]; rows: string[][]; monoCols?: number[] };
  demo?: { label: string; href: '/' | '/player' | '/recorder' };
  cover?: boolean;
};

const P1 = 'Parte 1 · Contexto';
const P2 = 'Parte 2 · O essencial';
const P3 = 'Parte 3 · Sessão e sistema';
const P4 = 'Parte 4 · Gravação';
const P5 = 'Parte 5 · Mais do player';
const P6 = 'Parte 6 · Extras';
const END = 'Encerramento';

export const SLIDES: Slide[] = [
  // 1
  {
    cover: true,
    title: 'expo-audio',
    subtitle: 'Reprodução e gravação de áudio em React Native, na prática: construindo um player de música.',
  },
  // 2
  {
    title: 'Roteiro',
    bullets: [
      '1. Contexto: o problema e o que é o expo-audio',
      '2. O essencial: criar o player, ler o status, tocar e pular',
      '3. Sessão de áudio e tela de bloqueio',
      '4. Gravação com medidor de volume',
      '5. Mais do player: fila, eventos, shuffle, velocidade',
      '6. Extras: config plugin, APIs avançadas, migração e pegadinhas',
      'Demo ao vivo e perguntas',
    ],
  },
  // 3
  {
    section: P1,
    title: 'Por que áudio no celular dá trabalho',
    bullets: [
      'Cada sistema tem sua API nativa: AVFoundation no iOS, Media3/ExoPlayer no Android, HTMLAudioElement na web',
      'O sistema decide quem toca: ligação, alarme, outro app de música',
      'Tocar em segundo plano exige configuração específica por plataforma',
      'Microfone precisa de permissão e de texto explicando o uso',
      'Formatos, streaming, buffer e tela de bloqueio',
    ],
  },
  // 4
  {
    section: P1,
    title: 'O que é o expo-audio',
    bullets: [
      'Biblioteca oficial da Expo para tocar e gravar áudio',
      'API baseada em hooks: useAudioPlayer, useAudioRecorder, useAudioPlaylist',
      'O player é um "shared object": um objeto JS ligado a um objeto nativo',
      'Você chama métodos direto nele: player.play(), player.seekTo(30)',
      'Inclui playlist nativa, controles na tela de bloqueio, amostras de áudio e streaming do microfone',
    ],
  },
  // 5
  {
    section: P2,
    title: 'Instalação',
    bullets: [
      'Use npx expo install, e não npm install',
      'Ele escolhe a versão compatível com o SDK do projeto',
      'Neste projeto: Expo SDK 58, expo-audio 58',
    ],
    code: `npx expo install expo-audio`,
    codeLabel: 'terminal',
  },
  // 6
  {
    section: P2,
    title: 'useAudioPlayer',
    bullets: [
      'Cria o player e libera a memória sozinho quando o componente desmonta',
      'Retorna na hora, sem await',
      'updateInterval: de quantos em quantos ms o status atualiza (padrão 500)',
      'O Sonora começa com null e carrega cada faixa com replace()',
    ],
    code: `import { useAudioPlayer } from 'expo-audio';

const player = useAudioPlayer(null, { updateInterval: 250 });

// outras formas
useAudioPlayer(require('./assets/beep.mp3'));
useAudioPlayer('https://site.com/musica.mp3');
useAudioPlayer({ uri, headers: { Authorization: token } });`,
    file: 'src/audio/PlayerContext.tsx',
  },
  // 7
  {
    section: P2,
    title: 'useAudioPlayerStatus',
    bullets: [
      'Re-renderiza o componente quando o status muda',
      'playing, isLoaded, isBuffering: estado do botão e do carregamento',
      'currentTime e duration: barra de progresso, em segundos',
      'didJustFinish: a faixa acabou de terminar',
      'playbackRate, loop, error',
    ],
    code: `const status = useAudioPlayerStatus(player);

// barra de progresso do mini player
const progress = status.duration > 0
  ? status.currentTime / status.duration
  : 0;

// carregando ou tocando?
{status.isBuffering && !status.playing
  ? <ActivityIndicator />
  : <Ionicons name={status.playing ? 'pause' : 'play'} />}`,
    file: 'src/components/MiniPlayer.tsx',
    demo: { label: 'Ver o AudioStatus ao vivo', href: '/player' },
  },
  // 8
  {
    section: P2,
    title: 'Tocar uma faixa',
    bullets: [
      'play() e pause() são síncronos',
      'replace(source) troca a música no mesmo player',
      'Criar e destruir players nativos é caro; trocar a fonte é barato',
      'Volume, velocidade e configuração da tela de bloqueio se mantêm',
    ],
    code: `const playTrack = (index: number) => {
  const track = TRACKS[index];
  player.replace({ uri: track.uri, name: track.title });
  player.play();
  setCurrentIndex(index);
};

const togglePlay = () => {
  if (status.playing) player.pause();
  else player.play();
};`,
    file: 'src/audio/PlayerContext.tsx',
  },
  // 9
  {
    section: P2,
    title: 'Arquitetura do Sonora',
    bullets: [
      'Um único player para o app inteiro, criado no PlayerProvider',
      'O provider fica no layout raiz, então a música não para ao trocar de tela',
      'As telas só leem o status e chamam ações (play, next, seek)',
      'A tela de gravação tem o próprio recorder e um segundo player',
    ],
    code: `src/
  app/                     telas (Expo Router)
    _layout.tsx            <PlayerProvider> envolve tudo
    player.tsx             tela "Tocando agora"
    slides.tsx             esta apresentação
    (tabs)/index.tsx       lista de músicas
    (tabs)/recorder.tsx    gravação
  audio/
    PlayerContext.tsx      lógica do player
    audioMode.ts           configuração da sessão
  components/MiniPlayer.tsx
  data/tracks.ts           catálogo`,
    codeLabel: 'estrutura de pastas',
  },
  // 10
  {
    section: P2,
    title: 'Barra de progresso e seekTo',
    bullets: [
      'value acompanha status.currentTime',
      'Enquanto o dedo arrasta, a barra mostra o valor do dedo (scrubbing)',
      'O seekTo só é chamado quando o usuário solta',
      'Sem isso, a bolinha "briga" com o dedo e volta para trás',
    ],
    code: `const [scrubbing, setScrubbing] = useState<number | null>(null);
const position = scrubbing ?? status.currentTime;

<Slider
  value={position}
  maximumValue={status.duration}
  onValueChange={setScrubbing}
  onSlidingComplete={(v) => {
    seek(v);              // player.seekTo(v)
    setScrubbing(null);
  }}
/>`,
    file: 'src/app/player.tsx',
    demo: { label: 'Arrastar a barra', href: '/player' },
  },
  // 11
  {
    section: P3,
    title: 'Sessão de áudio: setAudioModeAsync',
    bullets: [
      'Diz ao sistema como o app usa áudio',
      'playsInSilentMode: tocar com o iPhone no modo silencioso',
      'shouldPlayInBackground: continuar com o app minimizado',
      'interruptionMode: o que acontece com o áudio de outros apps',
      'allowsRecording: libera o microfone (iOS)',
    ],
    code: `export const PLAYBACK_MODE = {
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'doNotMix',
  allowsRecording: false,
};

useEffect(() => {
  setAudioModeAsync(PLAYBACK_MODE);
}, []);`,
    file: 'src/audio/audioMode.ts',
  },
  // 12
  {
    section: P3,
    title: 'interruptionMode na prática',
    table: {
      head: ['Valor', 'Efeito em outros apps', 'Exemplo de uso'],
      monoCols: [0],
      rows: [
        ['doNotMix', 'Pausa o áudio deles', 'App de música, podcast'],
        ['doNotMixPersistent', 'Pausa, e eles não voltam sozinhos', 'Audiolivro, aula longa'],
        ['duckOthers', 'Abaixa o volume deles', 'GPS falando "vire à direita"'],
        ['mixWithOthers (padrão)', 'Toca junto', 'Jogo, efeitos sonoros'],
      ],
    },
  },
  // 13
  {
    section: P3,
    title: 'Tela de bloqueio e central de controle',
    bullets: [
      'setActiveForLockScreen(true, metadata, options)',
      'Mostra título, artista, álbum e capa',
      'options: showSeekForward, showSeekBackward, showNextTrack, showPreviousTrack',
      'updateLockScreenMetadata() e clearLockScreenControls()',
      'No Android vira a notificação de mídia; na web usa a Media Session do navegador',
    ],
    code: `player.setActiveForLockScreen(
  true,
  {
    title: track.title,
    artist: track.artist,
    albumTitle: track.album,
    artworkUrl: track.artwork,
  },
  { showSeekForward: true, showSeekBackward: true },
);`,
    file: 'src/audio/PlayerContext.tsx',
  },
  // 14
  {
    section: P4,
    title: 'Permissão de microfone',
    bullets: [
      'requestRecordingPermissionsAsync() abre o pedido do sistema',
      'getRecordingPermissionsAsync() só consulta, sem perguntar',
      'Resposta: granted, status, canAskAgain',
      'Se canAskAgain for false, só pelas configurações do aparelho',
    ],
    code: `useEffect(() => {
  requestRecordingPermissionsAsync()
    .then((res) => setGranted(res.granted));
}, []);

{granted === false && (
  <Text>Permissão negada. Libere nas configurações.</Text>
)}`,
    file: 'src/app/(tabs)/recorder.tsx',
  },
  // 15
  {
    section: P4,
    title: 'useAudioRecorder',
    bullets: [
      'Cria o gravador e libera sozinho, como o player',
      'RecordingPresets.HIGH_QUALITY: .m4a, AAC, 44.1 kHz, estéreo, 128 kbps',
      'LOW_QUALITY para voz, com arquivo bem menor',
      'Opções por plataforma: android, ios e web',
      'isMeteringEnabled liga o medidor de volume',
    ],
    code: `const recorder = useAudioRecorder({
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
});

const state = useAudioRecorderState(recorder, 100);
// isRecording, durationMillis, metering, canRecord, url`,
    file: 'src/app/(tabs)/recorder.tsx',
  },
  // 16
  {
    section: P4,
    title: 'Gravar, parar e ouvir',
    bullets: [
      'Pausa a música e troca a sessão para allowsRecording: true',
      'prepareToRecordAsync(), depois record()',
      'stop() finaliza; o arquivo fica em recorder.uri',
      'Volta a sessão para o modo de reprodução',
      'Um segundo useAudioPlayer toca as gravações',
    ],
    code: `async function start() {
  musicPlayer.pause();
  await setAudioModeAsync(RECORDING_MODE);
  await recorder.prepareToRecordAsync();
  recorder.record();
}

async function stop() {
  await recorder.stop();
  await setAudioModeAsync(PLAYBACK_MODE);
  const uri = recorder.uri;   // file:///.../gravacao.m4a
  if (uri) setRecordings((r) => [{ uri }, ...r]);
}`,
    file: 'src/app/(tabs)/recorder.tsx',
    demo: { label: 'Abrir o gravador', href: '/recorder' },
  },
  // 17
  {
    section: P4,
    title: 'Medidor de volume',
    bullets: [
      'metering vem em decibéis: perto de -160 é silêncio, 0 é o máximo',
      'Normalização de -60 dB a 0 dB para um valor de 0 a 1',
      'A cada 100ms, o app lê recorder.getStatus() e guarda as últimas 40 leituras',
      'Cada leitura vira uma barra',
    ],
    code: `function normalizeDb(db: number | undefined) {
  if (db == null) return 0;
  const min = -60;
  return Math.max(0, Math.min(1, (db - min) / -min));
}

useEffect(() => {
  if (!isRecording) return;
  const id = setInterval(() => {
    const level = normalizeDb(recorder.getStatus().metering);
    setLevels((l) => [...l.slice(-39), level]);
  }, 100);
  return () => clearInterval(id);
}, [isRecording, recorder]);`,
    file: 'src/app/(tabs)/recorder.tsx',
  },
  // 18
  {
    section: P5,
    title: 'Fila: próxima e anterior',
    bullets: [
      'A fila é um array de índices (order) mais a posição atual',
      'Regra dos 3 segundos: depois de 3s, "anterior" só reinicia a faixa',
      'No fim da fila sem repeat, pausa e volta para 0:00',
    ],
    code: `const previous = () => {
  if (status.currentTime > 3) {
    player.seekTo(0);
    return;
  }
  playTrack(order[pos - 1]);
};

const goNext = (auto: boolean) => {
  let nextPos = pos + 1;
  if (nextPos >= order.length) {
    if (auto && repeat === 'off') return stopAtEnd();
    nextPos = 0;
  }
  playTrack(order[nextPos]);
};`,
    file: 'src/audio/PlayerContext.tsx',
  },
  // 19
  {
    section: P5,
    title: 'Eventos: quando a faixa termina',
    bullets: [
      'player.addListener("playbackStatusUpdate", fn)',
      'É o que o useAudioPlayerStatus usa por baixo',
      'Quando didJustFinish vem true, o app toca a próxima',
      'useEffectEvent (React 19) evita closure com valores antigos',
    ],
    code: `const onTrackFinished = useEffectEvent(() => goNext(true));

useEffect(() => {
  const sub = player.addListener('playbackStatusUpdate', (s) => {
    if (s.didJustFinish) onTrackFinished();
  });
  return () => sub.remove();
}, [player]);`,
    file: 'src/audio/PlayerContext.tsx',
  },
  // 20
  {
    section: P5,
    title: 'Shuffle e repeat',
    bullets: [
      'Shuffle embaralha a ordem (Fisher-Yates) com a faixa atual em primeiro',
      'Repeat "all": no fim da fila volta para o começo (lógica do app)',
      'Repeat "one": player.loop = true, direto no nativo',
      'O loop nativo reinicia sem intervalo de silêncio',
    ],
    code: `const toggleShuffle = () => {
  const turnOn = !shuffle;
  setShuffle(turnOn);
  setOrder(turnOn
    ? shuffledOrder(TRACKS.length, currentIndex)
    : linearOrder(TRACKS.length));
};

useEffect(() => {
  player.loop = repeat === 'one';
}, [player, repeat, currentIndex]);`,
    file: 'src/audio/PlayerContext.tsx',
    demo: { label: 'Testar shuffle e repeat', href: '/player' },
  },
  // 21
  {
    section: P5,
    title: 'Velocidade e volume',
    bullets: [
      'setPlaybackRate(rate): de 0.5x a 2x, útil para podcast e audiolivro',
      'shouldCorrectPitch mantém o tom da voz em outras velocidades',
      'player.volume vai de 0 a 1 e é o volume do player, não o do sistema',
      'player.muted silencia sem perder o volume configurado',
    ],
    code: `const setRate = (rate: number) => {
  player.shouldCorrectPitch = true;
  player.setPlaybackRate(rate);
};

const setVolume = (v: number) => {
  player.volume = v;    // 0.0 a 1.0
  setVolumeState(v);    // o status não informa o volume
};`,
    file: 'src/audio/PlayerContext.tsx',
    demo: { label: 'Mudar a velocidade', href: '/player' },
  },
  // 22
  {
    section: P5,
    title: 'A API do AudioPlayer',
    table: {
      head: ['Métodos', 'Propriedades'],
      monoCols: [0, 1],
      rows: [
        ['play(), pause()', 'playing, paused'],
        ['seekTo(segundos)', 'currentTime, duration'],
        ['replace(source)', 'isLoaded, isBuffering'],
        ['setPlaybackRate(rate)', 'playbackRate, shouldCorrectPitch'],
        ['setActiveForLockScreen(...)', 'volume, muted, loop'],
        ['addListener(evento, fn)', 'id'],
        ['release()  (só em createAudioPlayer)', ''],
      ],
    },
  },
  // 23
  {
    section: P5,
    title: 'Fontes de áudio',
    bullets: [
      'require("./som.mp3"): arquivo empacotado no app',
      'Uma URL: streaming direto da internet',
      '{ uri, headers }: URL com headers, por exemplo um token',
      'null: player vazio, a música entra depois',
      'No Sonora: 8 músicas do Djavan por streaming (prévias de 30 s do iTunes)',
    ],
    code: `export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Oceano',
    artist: 'Djavan',
    album: 'Djavan (1989)',
    artwork: cover('...'),   // capa do álbum
    uri: preview('...'),     // https://audio-ssl.itunes.apple.com/...m4a
  },
  // ...
];`,
    file: 'src/data/tracks.ts',
  },
  // 24
  {
    section: P6,
    title: 'Onde roda',
    table: {
      head: ['', 'Expo Go', 'Development build'],
      rows: [
        ['Tocar e gravar', 'Sim', 'Sim'],
        ['Android, iOS, tvOS e Web', 'Sim', 'Sim'],
        ['Texto próprio da permissão de microfone', 'Não', 'Sim'],
        ['Tocar em segundo plano (config plugin)', 'Limitado', 'Sim'],
        ['Controles na tela de bloqueio', 'Limitado', 'Sim'],
      ],
    },
  },
  // 25
  {
    section: P6,
    title: 'Config plugin',
    bullets: [
      'Roda no prebuild e escreve no Info.plist (iOS) e no AndroidManifest (Android)',
      'microphonePermission: texto do pedido de microfone no iOS',
      'enableBackgroundPlayback: tocar com o app em segundo plano',
      'enableBackgroundRecording: gravar em segundo plano',
      'recordAudioAndroid: liga ou desliga a permissão RECORD_AUDIO',
    ],
    code: `"plugins": [
  "expo-router",
  ["expo-audio", {
    "microphonePermission": "O Sonora usa o microfone para gravar seus áudios.",
    "enableBackgroundPlayback": true,
    "enableBackgroundRecording": false
  }]
]`,
    file: 'app.json',
  },
  // 26
  {
    section: P6,
    title: 'useAudioPlaylist',
    bullets: [
      'Fila gerenciada pelo próprio módulo nativo',
      'next(), previous(), skipTo(i), add(), insert(), remove()',
      'loop: "none", "single" ou "all"',
      'Integra próxima e anterior na tela de bloqueio',
      'O Sonora fez a fila na mão para fins didáticos',
    ],
    code: `const playlist = useAudioPlaylist({
  sources: TRACKS.map((t) => t.uri),
  loop: 'all',
});
const status = useAudioPlaylistStatus(playlist);

playlist.play();
playlist.next();
playlist.skipTo(3);
// status.currentIndex, status.trackCount`,
    codeLabel: 'exemplo',
  },
  // 27
  {
    section: P6,
    title: 'createAudioPlayer e preload',
    bullets: [
      'createAudioPlayer cria um player fora de componente',
      'Útil para serviços e efeitos sonoros globais',
      'Não é liberado sozinho: chame release()',
      'preload(source) carrega antes de tocar, para a troca ser imediata',
    ],
    code: `// som de clique usado no app todo
const click = createAudioPlayer(require('./click.mp3'));
click.play();
click.release();   // senão, vazamento de memória

// deixar a próxima faixa pronta
await preload(TRACKS[1].uri);`,
    codeLabel: 'exemplo',
  },
  // 28
  {
    section: P6,
    title: 'Amostras de áudio e streaming do microfone',
    bullets: [
      'useAudioSampleListener: recebe as amostras do que está tocando',
      'Cada amostra tem canais com valores de -1 a 1',
      'Serve para desenhar um visualizador de ondas',
      'No Android exige a permissão RECORD_AUDIO',
      'useAudioStream: áudio cru do microfone em tempo real (PCM)',
    ],
    code: `useAudioSampleListener(player, (sample) => {
  const frames = sample.channels[0].frames;
  // frames: number[] de -1.0 a 1.0
  setBars(toBars(frames));
});`,
    codeLabel: 'exemplo',
  },
  // 29
  {
    section: P6,
    title: 'De onde ele veio',
    bullets: [
      'Antes, áudio e vídeo ficavam juntos no expo-av',
      'A API do expo-av era cheia de Promises e callbacks, e exigia descarregar o som manualmente',
      'A Expo separou em dois pacotes: expo-audio e expo-video',
      'O expo-av foi depreciado; o expo-audio é o substituto oficial para áudio',
    ],
  },
  // 30
  {
    section: P6,
    title: 'Migrando do expo-av',
    bullets: [
      'Sem createAsync e unloadAsync: o hook cuida do ciclo de vida',
      'Sem callback de status: useAudioPlayerStatus re-renderiza',
      'play e pause síncronos em vez de Promises',
      'Tempo em segundos em vez de milissegundos',
    ],
    code: `// antes (expo-av)
const { sound } = await Audio.Sound.createAsync(require('./musica.mp3'));
sound.setOnPlaybackStatusUpdate((s) => setPos(s.positionMillis));
await sound.playAsync();
await sound.unloadAsync();   // fácil de esquecer

// depois (expo-audio)
const player = useAudioPlayer(require('./musica.mp3'));
const status = useAudioPlayerStatus(player);   // status.currentTime
player.play();`,
    codeLabel: 'comparação',
  },
  // 31
  {
    section: P6,
    title: 'Boas práticas',
    bullets: [
      'Um player por "canal" de áudio, reaproveitado com replace()',
      'Players globais em Context ou fora dos componentes',
      'updateInterval só tão baixo quanto a interface precisa',
      'Sempre limpar listeners e liberar players criados com create',
      'Pedir permissão no momento em que ela faz sentido',
      'Testar em aparelho real: simulador não tem tela de bloqueio nem microfone de verdade',
    ],
  },
  // 32
  {
    section: P6,
    title: 'Pegadinhas',
    bullets: [
      'Player em segundos, gravador em milissegundos (durationMillis)',
      'status.mute e player.muted: nomes diferentes para a mesma coisa',
      'Android: sem a tela de bloqueio ativa, o som em segundo plano para depois de uns 3 minutos',
      'Web: o navegador bloqueia autoplay antes do primeiro clique do usuário',
      'Tela de bloqueio só funciona com doNotMix ou doNotMixPersistent',
      'Mudanças no config plugin só valem em um novo build nativo',
    ],
  },
  // 33
  {
    section: END,
    title: 'Demo',
    bullets: [
      '1. Tocar uma música e ver o mini player',
      '2. Trocar de aba: a música continua',
      '3. Abrir "Tocando agora" e arrastar a barra',
      '4. Velocidade 2x e volume',
      '5. Shuffle e repeat one',
      '6. Bloquear o celular e usar os controles',
      '7. Aba Gravar: gravar, ver o medidor e ouvir',
    ],
    demo: { label: 'lista de músicas', href: '/' },
  },
  // 34
  {
    section: END,
    title: 'Resumo',
    bullets: [
      'useAudioPlayer + useAudioPlayerStatus resolvem a reprodução',
      'replace() para trocar de faixa; seekTo, loop, rate e volume para o resto',
      'setAudioModeAsync define como o app convive com o sistema',
      'useAudioRecorder + permissão + allowsRecording para gravar',
      'Playlist, preload e amostras para casos avançados',
    ],
  },
  // 35
  {
    cover: true,
    title: 'Perguntas',
    subtitle: 'docs.expo.dev/versions/latest/sdk/audio',
  },
];
