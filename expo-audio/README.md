# Expo Audio — Sonora, um player de música feito com expo-audio

Apresentação sobre a biblioteca **[`expo-audio`](https://docs.expo.dev/versions/latest/sdk/audio/)** (Expo SDK 58), construída dentro do próprio app de exemplo: o **Sonora**, um player de música no estilo Spotify/Deezer.

Os slides ficam numa aba do app, e cada conceito explicado pode ser testado na tela correspondente: o player, a fila, a sessão de áudio, a tela de bloqueio e a gravação com medidor de volume.

## 👤 Autor

- **Luan Ibanhez** ([@luaniban](https://github.com/luaniban))

Repositório original: [luaniban/sonora](https://github.com/luaniban/sonora) · Versão web: [sonora.luanibanhez.tech](https://sonora.luanibanhez.tech)

## 🎵 O que o app faz

- Lista de músicas (prévias de 30 s e capas de álbuns do Djavan, via [iTunes Search API](https://performance-partners.apple.com/search-api))
- Um único player para o app inteiro: a música continua tocando ao trocar de tela
- Mini player acima das abas e tela "Tocando agora" com o painel **AudioStatus ao vivo**
- Barra de progresso com `seekTo`, velocidade, volume, shuffle e repeat
- Controles na tela de bloqueio e na central de controle
- Gravação de áudio com permissão de microfone, medidor de volume e um segundo player para ouvir as gravações

## 🚀 Como rodar

**Pré-requisito:** Node.js 20 ou superior.

```bash
npm install
npx expo start
```

- **No celular:** instale o [Expo Go](https://expo.dev/go) e escaneie o QR code que aparece no terminal.
- **No navegador:** aperte `w` no terminal.

> As músicas vêm por streaming, então é preciso estar com internet.

Para a plateia abrir o app no celular mesmo estando em outra rede (4G ou outro Wi-Fi), use o túnel:

```bash
npm i -g @expo/ngrok   # só na primeira vez
npx expo start --tunnel
```

## 📊 Os slides

Abra pela aba **Slides** do app (ou pelo botão "Slides" na tela inicial). No navegador, o endereço é `http://localhost:8081/slides`.

São 35 slides em 6 partes:

| Parte | Slides | Conteúdo |
|---|---|---|
| Abertura | 1–2 | Capa e roteiro |
| 1 · Contexto | 3–4 | Por que áudio no celular dá trabalho e o que é o expo-audio |
| 2 · O essencial | 5–10 | Instalação, `useAudioPlayer`, `useAudioPlayerStatus`, `replace`, arquitetura e `seekTo` |
| 3 · Sessão e sistema | 11–13 | `setAudioModeAsync`, `interruptionMode` e tela de bloqueio |
| 4 · Gravação | 14–17 | Permissão de microfone, `useAudioRecorder`, gravar/parar/ouvir e medidor de volume |
| 5 · Mais do player | 18–23 | Fila, eventos, shuffle e repeat, velocidade e volume, API do `AudioPlayer` e fontes de áudio |
| 6 · Extras | 24–32 | Expo Go x development build, config plugin, `useAudioPlaylist`, `createAudioPlayer`, amostras de áudio, migração do expo-av, boas práticas e pegadinhas |
| Encerramento | 33–35 | Demo, resumo e perguntas |

Alguns slides têm o botão **"Abrir no app"**, que leva direto para a tela onde aquele conceito pode ser testado.

### ⌨️ Navegação

| Ação | Teclado (navegador) | Celular |
|---|---|---|
| Próximo / anterior | setas, `Espaço`, `PageDown` / `PageUp` | botões ou deslizar para os lados |
| Sair dos slides | `Esc` | botão X |
| Ir direto a um slide | `/slides?n=8` | |

## 📁 Onde está cada coisa

| Arquivo | O que tem |
|---|---|
| `src/audio/PlayerContext.tsx` | toda a lógica do player: `useAudioPlayer`, `replace`, fila, shuffle, repeat, velocidade, volume e tela de bloqueio |
| `src/audio/audioMode.ts` | `setAudioModeAsync`: os modos de reprodução e de gravação |
| `src/app/(tabs)/recorder.tsx` | gravação: permissão, `useAudioRecorder`, medidor de volume e um segundo player |
| `src/app/player.tsx` | tela "Tocando agora" com o painel AudioStatus ao vivo |
| `src/components/MiniPlayer.tsx` | mini player acima das abas |
| `src/data/tracks.ts` | lista de músicas |
| `src/slides/content.ts` | texto e código de cada slide |
| `src/app/slides.tsx` / `src/components/SlideView.tsx` | tela dos slides |

O código tem comentários `[Slide N]` que indicam qual slide explica cada trecho.

## 🛠️ Tecnologias

- Expo SDK 58 · React Native 0.88 · React 19
- TypeScript
- Expo Router
- `expo-audio`

## 📝 Observações

- Controles na tela de bloqueio e áudio em segundo plano funcionam melhor em um *development build* (`npx expo run:android`). As opções do config plugin no `app.json` só valem em build nativo.
- No navegador, o microfone só é liberado em `localhost` ou em site com HTTPS.

## 🔗 Referências

- [Documentação oficial — expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [iTunes Search API](https://performance-partners.apple.com/search-api)
