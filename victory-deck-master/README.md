# Victory Native — deck de seminário

Apresentação sobre a biblioteca **Victory Native**, construída com a própria
biblioteca. Os gráficos dos slides não são imagens: são componentes reais,
com controles que alteram props ao vivo durante a apresentação.

<img width="1919" height="937" alt="image" src="https://github.com/user-attachments/assets/e583bfa8-db49-4652-85e4-8780a866d1ea" />
<img width="1912" height="869" alt="image" src="https://github.com/user-attachments/assets/b6336a42-97c2-424b-bbd7-ff1aaa6304fa" />



Seminário da disciplina de React Native — Arthur de Morais Marques.

---

## Sobre

O deck tem 17 slides e segue um arco em quatro partes: o problema dos gráficos
em React Native, a apresentação da biblioteca, como ela funciona por dentro, e
três capacidades demonstradas na prática.

A escolha de construir a apresentação na própria biblioteca é o argumento
central: cada slide interativo é a demonstração daquilo que está sendo
explicado.

## Estrutura da apresentação

| Parte | Slides | Conteúdo |
|---|---|---|
| Abertura | 1–2 | Capa e roteiro |
| 01 · O problema | 3–5 | Contexto, causa arquitetural, consequências |
| 02 · A solução | 6–7 | Victory Native e vitrine com quatro gráficos vivos |
| 03 · Como funciona | 8–12 | Pilha, anatomia da API, tipos, eixos |
| 04 · Na prática | 13–15 | Interação, escala, animação |
| Fechamento | 16–17 | Quando usar e conclusão |

Sete slides têm controles interativos que alteram props do gráfico em tempo
real, e o painel de código de cada um destaca as linhas correspondentes.

## Stack

| Camada | Biblioteca |
|---|---|
| Gráficos | `victory-native` |
| Renderização | `@shopify/react-native-skia` |
| Animação | `react-native-reanimated` + `react-native-worklets` |
| Gestos | `react-native-gesture-handler` |
| Plataforma | Expo SDK 57 · React Native 0.86 |
| Web | `react-native-web` + CanvasKit (WebAssembly) |

## Rodar localmente

**Pré-requisito:** Node 22 LTS. O React Native 0.86 exige
  

```bash
git clone https://github.com/ArthurTiso/victory-deck.git
cd victory-deck
npm install
npm start
```

O `postinstall` já executa o `setup-skia-web`, que posiciona o `canvaskit.wasm`
na pasta pública. O deck abre no navegador — pressione `F11` para tela cheia.

Se o npm pedir aprovação de scripts de instalação:

```bash
npm install-scripts approve @shopify/react-native-skia
npm install
```

### Rodar no Android

O deck foi pensado para o navegador, mas funciona em nativo:

```bash
npx expo prebuild
npx expo run:android
```

## Navegação

| Tecla | Ação |
|---|---|
| Seta direita, espaço, Enter, PageDown | Avança |
| Seta esquerda, Backspace, PageUp | Volta |
| Home / End | Primeiro e último slide |

Os marcadores no cabeçalho são atalhos diretos, úteis para voltar a um slide
durante perguntas. Os botões do rodapé fazem o mesmo.

## Estrutura de pastas

```
App.tsx                      Carrega fontes e monta o loader da plataforma
src/
  DeckRoot.tsx               Registro dos 17 slides
  DeckLoader.tsx             Nativo: importa o deck direto
  DeckLoader.web.tsx         Web: espera o CanvasKit antes de montar
  theme/tokens.ts            Cores, tipografia, espaçamento
  components/
    Deck.tsx                 Navegação, progresso, slides empilhados
    SlideLayout.tsx          Grade de duas colunas
    CodePanel.tsx            Painel de código colapsável
    Controls.tsx             Sliders, toggles e botões
    Nota.tsx                 Blocos de conceito
    Cursor.tsx               Tooltip em Skia
    DiagramaFluxo.tsx        Diagramas dos slides 4 e 6
  data/datasets.ts           Dados determinísticos
  slides/                    Um arquivo por slide
assets/fonts/                Inter e JetBrains Mono
```

### Duas decisões de arquitetura

**Slides empilhados, sem rolagem.** O `Deck` mantém todos os slides montados em
posição absoluta e exibe apenas o ativo. Isso evita que os gráficos remontem ao
navegar e elimina o conflito entre gestos do gráfico e troca de slide.

**Fonte com função dupla.** O `JetBrainsMono-Regular.ttf` é usado tanto no
painel de código quanto pelo `useFont` do Skia, que desenha os rótulos dos
eixos. Sem esse arquivo, os eixos aparecem sem texto — sem erro e sem aviso.

## Referências

- [Documentação do Victory Native](https://nearform.com/open-source/victory-native/docs)
- [Repositório da biblioteca](https://github.com/FormidableLabs/victory-native-xl)
- [React Native Skia](https://shopify.github.io/react-native-skia/)

## Licença

O código deste deck é livre para uso educacional. As bibliotecas utilizadas
seguem suas próprias licenças.
