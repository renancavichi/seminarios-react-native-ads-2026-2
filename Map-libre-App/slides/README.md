# Slides — MapLibre na Prática

Apresentação de ~25 min (47 slides) feita em **React + Vite + TypeScript**, com mapas ao vivo (MapLibre GL JS) e o código de cada mapa ao lado. Ícones: [lucide-react](https://lucide.dev).

## Como rodar

Da **raiz do projeto**:

```bash
npm run slides:install   # só na primeira vez (instala as dependências de slides/)
npm run slides           # abre http://localhost:5173 no navegador
```

Ou de dentro de `slides/`: `npm install` e `npm run dev`.

### Gerar a versão para publicar

```bash
npm run slides:build     # gera slides/dist/ (site estático)
```

A pasta `slides/dist/` funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel…). Para testar o build localmente: `npm --prefix slides run preview`.

## Atalhos durante a apresentação

| Tecla | Ação |
|---|---|
| `→` `Espaço` / `←` | Próximo / anterior |
| `N` | Notas do apresentador |
| `F` | Tela cheia |
| `A` / `W` | Código **App (Android/iOS)** / **Web** em todos os slides |
| `T` | Zerar o cronômetro (amarelo aos 22 min, vermelho aos 25) |
| `?` | Ajuda |

O link guarda o slide atual (`#27`). Os mapas precisam de internet.

## Estrutura

```
src/
├── main.tsx              # entrada (fontes, CSS)
├── styles.css            # tema; 1rem = 1% da largura do slide (16:9)
├── deck/Deck.tsx         # navegação, rodapé, notas, cronômetro, atalhos
├── components/
│   ├── LiveMap.tsx       # mapa criado ao entrar no slide e destruído ao sair
│   ├── Code.tsx          # realce de sintaxe + abas App/Web (estado global)
│   └── ui.tsx            # Card, Callout, Tag, IconBox…
├── data/demos.ts         # os 13 mapas + geração do código exibido
└── slides/               # conteúdo, separado por parte da apresentação
    ├── intro.tsx  concepts.tsx  platforms.tsx
    ├── api.tsx    demos.tsx     closing.tsx
    └── index.ts          # ordem dos slides
```

- O código das demonstrações é **gerado a partir dos mesmos dados que desenham o mapa** (`DEMOS` em `data/demos.ts`) — o que aparece na tela é o que roda.
- Os slides usam `maplibre-gl@5.24` (build com worker embutido, sem configuração extra no Vite).
- Para adicionar um slide: crie um objeto `{ section, notes, Body }` no arquivo da parte certa.
