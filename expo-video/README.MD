# Expo Video — Uma análise prática e moderna da biblioteca

Apresentação sobre a biblioteca **[`expo-video`](https://docs.expo.dev/versions/latest/sdk/video/)**, realizada como requisito da disciplina de **Desenvolvimento para Dispositivos Móveis** do curso de Análise e Desenvolvimento de Sistemas do IFSP Caraguatatuba.

---

## 👤 Autoria

- **Aluna:** Ana Julia Andrade Santana ([@ana-andrades](https://github.com/ana-andrades))
- **Professor:** Renan Cavichi de Freitas ([@renancavichi](https://github.com/renancavichi))

---

## 📋 Resumo dos Conteúdos e Assuntos Principais

O material aborda desde os desafios inerentes ao streaming de mídia móvel até os recursos avançados e arquitetura moderna do `expo-video`:

### 1. Por que vídeo é complicado no Mobile? (Slides 3 e 4)
- **Comparativo `expo-video` vs `expo-av`:**
  - **Separação de Lógica e Interface:** No legado `expo-av`, existia um único componente `<Video />` controlado por `ref`. No `expo-video`, há separação clara entre `VideoPlayer` (lógica) e `VideoView` (renderização visual).
  - **Chamadas Síncronas vs. Assíncronas:** Métodos do `expo-av` como `playAsync()` e `pauseAsync()` davam lugar a esperas assíncronas; no `expo-video`, os métodos são síncronos e imediatos (`player.play()`, `player.pause()`).
  - **Ciclo de Estados e Eventos:** Saída do gargalo de um único `onPlaybackStatusUpdate` para hooks orientados a eventos pontuais (`useEvent` e `useEventListener`).
- **Desafios do ecossistema:** Pluralidade de plataformas nativas (Android ExoPlayer/Media3, iOS AVPlayer, Web HTML5), instabilidade de rede e buffering, adaptação de streaming dinâmico (HLS / DASH) e integração de recursos do SO.

---

### 2. O que é o `expo-video`? (Slides 5 a 7)
- Biblioteca oficial do ecossistema Expo SDK projetada para alto desempenho, consistência multiplataforma e baixo consumo de recursos.
- **O caminho do vídeo:** Da rede (`Internet`) para o `Buffer` local e deste para a renderização na `Tela`. O `expo-video` gerencia todo esse pipeline automaticamente.
- **As duas peças-chave:**
  - **`useVideoPlayer` (O controle remoto):** Instancia o player, gerencia play/pause, volume, taxa de reprodução, loop e pré-carregamento. O player pode existir sem a tela (permitindo pré-carregamento em background ou transições suaves de tela).
  - **`VideoView` (A tela):** Componente puramente visual responsável por desenhar os frames do vídeo.

---

### 3. Integração com o Ciclo de Vida do React (Slides 8 e 9)
Alterar uma propriedade interna do player nativo não dispara renderizações no React automaticamente. Para refletir o estado na UI:
- **`useEvent(player, 'statusChange', ...)`:** Converte eventos nativos do player em estado do React, atualizando a interface quando o status de reprodução muda.
- **`useEventListener(player, 'playToEnd', callback)`:** Dispara efeitos colaterais e ações em resposta a eventos (ex.: logs, analytics, tocar próximo vídeo) sem provocar re-renderizações desnecessárias.
- **`player.addListener`:** Manipulação manual de eventos para cenários fora do ciclo de vida padrão do React.

---

### 4. Instalação e Exemplos Práticos (Slides 10 a 14)
- **Instalação:**
  ```bash
  npx expo install expo-video
  ```
- **Exemplo 1 (Tocar com poucas linhas):**
  Uso de `useVideoPlayer(source)` e exibição via `<VideoView player={player} nativeControls={true} />`.
- **Exemplo 2 (Controle do Player):**
  Uso de `player.play()`, `player.pause()`, `player.seekBy(-10)` (retroceder) e configuração de `loop`.
- **Exemplo 3 (Posição, Velocidade e Volume):**
  Controle preciso com `player.currentTime = 42`, ajuste de taxa de velocidade `player.playbackRate = 1.5` (suporta de 0 a 16x) e silenciamento `player.muted = true`.
- **Exemplo 4 (Enquadramento de Vídeo - Content Fit):**
  Ajuste visual no componente `<VideoView contentFit="cover" />` (opções: `contain`, `cover`, `fill`).

---

### 5. Recursos Nativos e de Sistema (Slides 15 e 16)
- **Picture-in-Picture (PiP):** Permite continuar assistindo ao vídeo em uma janela flutuante quando o app é minimizado (`ref.current?.startPictureInPicture()`).
- **Background Playback:** Continua reproduzindo áudio mesmo com a tela do celular bloqueada (`player.staysActiveInBackground = true`).
  - *Configuração no `app.json`:*
    ```json
    ["expo-video", {
      "supportsPictureInPicture": true,
      "supportsBackgroundPlayback": true
    }]
    ```
- **Notificações e Tela de Bloqueio:** Integração com a central de mídia nativa do SO (`player.showNowPlayingNotification = true`).
- **Gerenciamento de Buffer:** Limitação de pré-carregamento via `player.bufferOptions = { preferredForwardBufferDuration: 15 }` para economizar dados e bateria.
- **Headers e Caching:** Passagem de token de autorização via `headers`, metadados customizados (`title`, `artist`) e flag `useCaching: true`.

---

### 6. Fontes de Vídeo, Recursos Avançados e Casos de Uso (Slides 17 a 19)
- **Origens suportadas:**
  - **Links remotos:** URLs HTTP/HTTPS (`.mp4`, `.m3u8` HLS, DASH).
  - **Assets locais:** Mídias empacotadas via `require('./assets/video.mp4')`.
  - **Galeria do dispositivo:** Integração com `expo-media-library` usando `player.replaceAsync({ uri: asset.uri })`.
- **Recursos Avançados:**
  - Seleção dinâmica de legendas e áudio (`player.subtitleTrack`, `player.availableSubtitleTracks`).
  - Geração de miniaturas/thumbnails sob demanda via `player.generateThumbnailsAsync(seconds)`.
  - Detecção de transmissões ao vivo (`player.isLive`) e suporte a transmissão externa (`AirPlay` no iOS via `allowsExternalPlayback`).
- **Quando usar:**
  - **Ideal para:** Feeds de vídeos curtos (Reels/TikTok) com pré-carregamento, plataformas EAD, tutoriais, streaming HLS e apps com PiP.
  - **Pontos de atenção:** PiP e background playback exigem build de desenvolvimento próprio (prebuild); para casos onde o foco é estritamente áudio, recomenda-se a biblioteca irmã `expo-audio`.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- **Node.js** (versão LTS recomendada: 20+)
- **NPM** ou **Yarn**
- App **Expo Go** instalado no smartphone (Android/iOS)

### Execução

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```

3. **No Celular:** Abra o aplicativo Expo Go e escaneie o QR Code exibido no terminal.  
   **No Navegador:** Pressione `w` no terminal para rodar no navegador.

---

## 🔗 Referências Oficiais

- [Documentação Oficial do Expo Video](https://docs.expo.dev/versions/latest/sdk/video/)
- [Repositório dos Seminários ADS 2026-2](https://github.com/renancavichi/seminarios-react-native-ads-2026-2)
