# 🗺️ MapLibre na Prática

Projeto desenvolvido para uma **apresentação acadêmica sobre o [MapLibre](https://maplibre.org)**, a biblioteca open source para mapas interativos na web e em dispositivos móveis.

O repositório tem duas partes que se complementam:

| Parte | O que é | Tecnologia |
|---|---|---|
| 🎞️ **Slides** ([`slides/`](slides/)) | A apresentação em si, com **mapas ao vivo** e o código de cada exemplo ao lado | React + Vite + MapLibre GL JS |
| 📱 **App de demonstração** (raiz) | Um app real para **Android, iOS e Web** que mostra a localização do usuário em 13 mapas diferentes | Expo + MapLibre React Native |

A ideia é mostrar, na teoria e na prática, que dá para construir mapas completos **sem API key e sem custo**, usando só ferramentas abertas.

---

## 🎯 Objetivos da apresentação

- Explicar **o que é o MapLibre**, de onde ele veio e por que usá-lo.
- Apresentar os **conceitos básicos de mapas digitais**: tiles, raster × vetorial, fontes de dados.
- Comparar o uso do MapLibre na **Web** (imperativo) e no **App** (declarativo).
- Construir um mapa **passo a passo**, do zero até dados próprios em GeoJSON.
- Mostrar o poder do **Style JSON** para criar mapas com finalidades diferentes.

---

## 📚 Roteiro da apresentação

### 1. Introdução — o que é o MapLibre
- **Origem:** nasceu em 2020 como um *fork* comunitário do Mapbox GL JS, quando este deixou de ser open source.
- **Comparação** com outras opções de mapas (licença, custo, necessidade de API key).
- **A família MapLibre:**
  - **MapLibre GL JS** — biblioteca para navegadores, renderiza com WebGL (`maplibre-gl`).
  - **MapLibre Native** — motor em C++ para Android, iOS e desktop (OpenGL, Vulkan, Metal).
  - **MapLibre React Native** — componentes React sobre o Native (`@maplibre/maplibre-react-native`).
  - **Style Spec** — a especificação do JSON de estilo, compartilhada por todos.
  - **Martin** — servidor de tiles vetoriais escrito em Rust.

### 2. Conceitos — como um mapa digital funciona
- O mundo dividido em **tiles** (ladrilhos) por nível de zoom (`{z}/{x}/{y}`).
- **Raster × Vetorial:** imagens prontas × dados desenhados no próprio aparelho.
- **Fontes gratuitas e sem API key:** OpenStreetMap, OpenFreeMap, Esri, OpenTopoMap etc.

### 3. Plataformas — Web × App
- O que muda entre as duas APIs e **o mesmo mapa escrito nas duas**.
- Instalação na web: via **npm** ou com uma **tag `<script>`** (CDN).
- Instalação no app: **Expo + config plugin**.

### 4. Construindo um mapa, passo a passo
1. **O mapa e a câmera** — centro, zoom, inclinação e rotação.
2. **Onde estou** — localização do usuário com `<UserLocation>`.
3. **Câmera e marcadores** — animações (`flyTo`), `Marker` e `ViewAnnotation`.
4. **Seus dados** — **GeoJSON** + `<Layer>` e os **tipos de geometry** (Point, LineString, Polygon…).

### 5. Estilização — tipos de mapas
Demonstrações ao vivo de mapas com finalidades diferentes (ruas, satélite, prédios 3D, relevo, topográfico, ciclismo, ferrovias…), cada uma com o código que a gera.

### 6. Style JSON — a receita do mapa
- Estrutura de um estilo: `sources`, `layers`, `glyphs`, `paint` e `layout`.
- **Criando um estilo do zero**, com prévia ao vivo.

### 7. Encerramento e perguntas

> Os exemplos usam o **Litoral Norte de São Paulo** (Caraguatatuba, Ilhabela e Ubatuba) como cenário.

---

## 🎞️ Rodando os slides

Precisa de [Node.js](https://nodejs.org) 20+ e conexão com a internet (os mapas carregam tiles online).

```bash
npm run slides:install   # só na primeira vez
npm run slides           # abre http://localhost:5173
```

### Atalhos durante a apresentação

| Tecla | Ação |
|---|---|
| `→` `Espaço` / `←` | Próximo / anterior |
| `N` | Notas do apresentador |
| `F` | Tela cheia |
| `A` / `W` | Mostrar o código do **App** ou da **Web** em todos os slides |
| `T` | Zerar o cronômetro (amarelo aos 22 min, vermelho aos 25) |
| `?` | Ajuda |

Para gerar uma versão estática (GitHub Pages, Netlify, Vercel…): `npm run slides:build` → pasta `slides/dist/`.

Mais detalhes em [`slides/README.md`](slides/README.md).

---

## 📱 App de demonstração

App multiplataforma que abre na localização do usuário e permite alternar entre **13 mapas**, todos gratuitos:

| | Mapa | Para que serve |
|---|---|---|
| 🏪 | Ruas e Lojas | Ruas, números, lojas e POIs (vetorial) |
| 🛰️ | Satélite | Foto aérea com ruas e nomes por cima |
| 🏙️ | Prédios 3D | Edifícios em 3D com câmera inclinada |
| 🤍 | Minimalista | Mapa limpo e claro |
| ⛰️ | Topográfico | Curvas de nível e trilhas |
| 🗻 | Relevo | Sombreamento do terreno (dados de elevação) |
| 🧭 | Explorador | Parques e reservas |
| 🚲 | Ciclismo | Ciclovias, bicicletários e oficinas |
| 🚌 | Transporte | Linhas e paradas de ônibus, metrô e trem |
| 🚆 | Ferrovias | Trilhos, estações e linhas ferroviárias |
| ⚓ | Náutico | Profundidade, boias e faróis |
| 🏥 | Serviços | Hospitais, escolas e serviços essenciais |
| 🌙 | Noturno | Mapa escuro para usar à noite |

**Versões:** Expo SDK 58 · React Native 0.88 · MapLibre React Native 11 · maplibre-gl 6.

### Rodar no navegador (mais rápido)

```bash
npm install
npx expo start --web
```

### Rodar no celular

> ⚠️ O app **não funciona no Expo Go**, porque o MapLibre tem código nativo. É preciso um *development build* ou um APK.

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview       # gera um .apk para instalar
npx eas-cli@latest build -p android --profile development   # app de desenvolvimento (com hot reload)
npx expo start                                              # depois, para desenvolver ao vivo
```

Com o Android Studio instalado, também dá para compilar localmente: `npx expo run:android`.

---

## 📦 Estrutura do projeto

```
├── App.tsx           → app Android/iOS (@maplibre/maplibre-react-native)
├── App.web.tsx       → app Web (maplibre-gl), usado automaticamente no navegador
├── mapModes.ts       → os 13 estilos de mapa (compartilhados entre as plataformas)
├── app.json          → config do Expo: plugins do MapLibre e permissão de localização
├── eas.json          → perfis de build na nuvem (APK, iOS, development)
└── slides/           → a apresentação
    └── src/
        ├── deck/         → navegação, notas, cronômetro e atalhos
        ├── components/   → mapa ao vivo, painel de código, componentes visuais
        ├── data/demos.ts → os mapas das demonstrações e o código exibido
        └── slides/       → o conteúdo, separado por parte da apresentação
```

O código mostrado nos slides é **gerado a partir dos mesmos dados que desenham o mapa** — o que aparece na tela é exatamente o que roda.

---

## 🧰 Comandos úteis

```bash
npx tsc --noEmit          # checa os tipos
npx expo lint             # lint
npx expo-doctor           # diagnostica problemas de config/dependências
```

## ❓ Problemas comuns

- **Mapa cinza / vazio** → sem internet, ou o servidor de tiles daquele mapa está fora do ar.
- **Não centraliza na minha posição** → ligue o GPS e aceite a permissão de localização.
- **App fecha ao abrir pelo Expo Go** → use o APK ou o development build.
- **Web: `Worker failed to load`** → rode `npm install` de novo e reinicie o `npx expo start --web`.

---

## 📜 Créditos

Dados dos mapas © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors · [OpenFreeMap](https://openfreemap.org) · Esri · [OpenTopoMap](https://opentopomap.org) · [CyclOSM](https://www.cyclosm.org) · [ÖPNVKarte](https://www.öpnvkarte.de) · [OpenRailwayMap](https://www.openrailwaymap.org) · [OpenSeaMap](https://openseamap.org) · HOT/OSM France · AWS Terrain Tiles.

Os servidores comunitários de tiles são para **uso pessoal e acadêmico**. Para publicar um app com muitos usuários, use um provedor próprio ou pago.

Projeto acadêmico, sem fins comerciais.
