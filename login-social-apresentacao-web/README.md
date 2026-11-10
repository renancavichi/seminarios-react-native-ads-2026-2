# Login Social — apresentação web

Apresentação de Hyan Ferreira para Programação para Dispositivos Móveis. São 17 slides em português, com roteiro de 25 minutos, fluxo progressivo, códigos com syntax highlighting real e uma demonstração didática offline.

## Executar

Requer Node.js 20.19+ ou 22.12+ e npm.

```bash
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente http://localhost:5173). Para apresentar o build de produção:

```bash
npm run build
npm run preview
```

O `dist/` é uma aplicação estática. Sirva sua raiz por HTTP/HTTPS; não abra o index.html por `file://`. A aplicação usa caminhos a partir da raiz, portanto hospede em domínio/porta própria ou ajuste os caminhos antes de publicar em um subdiretório. Nenhuma publicação externa foi feita.

## Controles

| Comando                          | Ação                                   |
| -------------------------------- | -------------------------------------- |
| →, Espaço, PageDown              | Próxima etapa; depois, próximo slide   |
| ←, PageUp                        | Etapa anterior; depois, slide anterior |
| Home / End                       | Primeiro / último slide                |
| F                                | Alternar fullscreen nativo             |
| Esc                              | Fechar painel ou sair do fullscreen    |
| N                                | Abrir/fechar notas do apresentador     |
| G                                | Índice para acessar qualquer slide     |
| ? ou H                           | Ajuda de navegação                     |
| Deslizar para a esquerda/direita | Avançar/voltar em telas touch          |

Os mesmos controles estão no rodapé. Os slides 7 (dez etapas) e 14 (sete estados) consomem os comandos nas etapas internas antes de avançar. Voltar a um slide reinicia suas etapas para repetir a explicação. O botão “Recomeçar demonstração” repete a simulação.

A posição fica na URL: `/#slide-07`. Atualizar ou compartilhar o hash abre esse slide, começando pela primeira etapa. O histórico do navegador também funciona. Os painéis usam diálogo modal, suporte a teclado, foco controlado pelo navegador e fechamento por Esc. Notas ficam ocultas por padrão; abri-las na tela projetada as torna visíveis ao público (não há segunda janela privada).

## Preparar para a aula

1. Use o build de produção e abra a aplicação uma vez. Aguarde o carregamento completo para que o service worker termine de armazenar os recursos.
2. Teste o projetor e pressione F. Se o navegador não suportar ou bloquear fullscreen, o layout continua ocupando a janela.
3. Use N para estudar as falas, as perguntas possíveis e o tempo de cada slide. O roteiro soma 25 minutos; o tempo é estimado, sem cronômetro automático.
4. O índice G permite pular diretamente para o fluxo ou a demonstração.

As fontes, ícones, códigos e dependências de execução são locais. A navegação funciona sem internet; o cache de produção também permite recarregar a página offline após a primeira carga bem-sucedida. Na primeira abertura da máquina é preciso ter o servidor local acessível. Links de documentação precisam de internet. Para aplicar uma nova versão em uma instalação já em cache, feche as abas antigas e reabra após a atualização do service worker.

A demonstração é **uma simulação didática**, sem autenticação real, chamadas ao Google, cookies de login ou acesso a contas. A referência Laravel é material separado em [public/reference/README.md](public/reference/README.md). Não há backend PHP neste app nem necessidade de Client ID/Secret para apresentar.

## Arquitetura

- `src/App.tsx`: viewport de projeção, transições, gestos e composição.
- `src/hooks/usePresentation.ts`: navegação, etapas, hash e atalhos.
- `src/slides/Slides.tsx`: 17 composições com componentes compartilhados.
- `src/data/slides.ts`: roteiro, tempos e notas em português.
- `src/data/snippets.mjs`: código original dos exemplos.
- `src/data/highlighted.json`: tokens gerados pelo Shiki no build (sem carregar o highlighter no navegador).
- `src/components/presentation/`: janela de código, notas, índice, progresso e controles.
- `src/components/diagrams/`: diagrama progressivo com distinção entre navegador e backend.
- `src/styles/global.css`: identidade visual, projeção 16:9, adaptação ao retrato e reduced motion.
- `scripts/offline.mjs`: cache de produção versionado pelo conteúdo.
- `public/reference/`: referência Laravel, política de vinculação e [fontes oficiais](public/reference/SOURCES.md).

React 19, TypeScript, Vite, Tailwind CSS 4, Lucide, Motion e Shiki. Fontes Inter e JetBrains Mono distribuídas pelo npm. `CodeWindow` suporta PHP, TypeScript/TSX, JavaScript, JSON, Bash e ENV, números de linha opcionais, destaque de linhas, parâmetro `reveal` e copiar. O texto permanece selecionável e nítido. O build regenera os tokens quando os snippets mudam.

O slide ocupa `100vw` × `100dvh` (fallback `100vh`), sem rolagem da apresentação. Um canvas lógico de 1600×900 é dimensionado para projeção; retrato usa 800px de largura e altura adaptada ao viewport, reorganizando diagramas, tabelas e código. Telas com proporções diferentes preservam o conteúdo sobre o mesmo fundo integral. Somente os painéis auxiliares podem rolar.

## Verificações

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Os testes E2E usam o Chrome em `/usr/bin/google-chrome` neste ambiente. Em outra máquina, use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` para indicar seu executável ou instale Chromium com `npx playwright install chromium` e defina `PLAYWRIGHT_USE_BUNDLED=1`.

A suíte inicia o build de produção em `http://localhost:4173`, verifica os 17 slides em 1920×1080, 1366×768 e 390×844, navegação, etapas internas, hash/reload, painéis, fullscreen, toque e recarga offline. Falhas e capturas ficam em `test-results/`; a inspeção visual de desenvolvimento foi registrada em `.artifacts/` (ignorado pelo Git). O PHP de referência é verificado sintaticamente quando disponível, mas não foi executado contra banco ou provedor real.

O PDF opcional `skill-react-best-practices.pdf` não estava disponível entre os anexos locais.
