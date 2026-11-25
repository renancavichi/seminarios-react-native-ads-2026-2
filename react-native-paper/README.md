# React Native Paper — apresentação interativa

Apresentação (≈ 20 minutos) sobre a biblioteca **[React Native Paper](https://reactnativepaper.com/)**, o kit de componentes **Material Design 3** para React Native.

Os slides rodam no navegador (Vite + React) e as demonstrações dentro das molduras de celular são componentes **reais** do `react-native-paper`, renderizados via `react-native-web`. Há também um **Playground** para experimentar os componentes e ver o código gerado.

## 👤 Autor

- **Murillo Diogo dos Santos Moreira** ([@MrllMoreira](https://github.com/MrllMoreira))

## 📝 Resumo do conteúdo

**O problema.** Em React Native "puro" cada borda, cor e espaçamento é escrito à mão: há repetição de código, inconsistência visual, estados de interação (foco, toque, erro, carregando) para tratar e suporte a tema escuro e acessibilidade por conta do desenvolvedor.

**O que é.** O React Native Paper é uma biblioteca da Callstack com componentes prontos que seguem o Material Design 3 (padrão desde a v5; o MD2 continua disponível).

**Principais recursos.**
- Componentes prontos: botões, campos, listas, cards, diálogos, menus e barras de navegação
- Temas personalizáveis, definidos uma única vez no `PaperProvider`
- Tema claro e escuro prontos (`MD3LightTheme` e `MD3DarkTheme`)
- Tipografia (`variant`), tokens de cor e níveis de elevação
- Acessibilidade nos componentes e suporte a Android, iOS e web (via `react-native-web`)

**Limitações.**
- Visual com opinião forte (Material Design): interfaces fora do padrão exigem sobrescrever estilos
- Muitos tokens de tema para aprender
- Não cobre tudo: navegação entre telas vem do React Navigation, e o seletor de datas, de pacotes da comunidade
- Mudanças entre versões (MD2 → MD3; a v6 está em alpha) e mais uma dependência no projeto

**Comparação.** Paper × React Native puro × React Native Elements × NativeWind, comparando proposta, componentes prontos, sistema visual, personalização, facilidade de adoção e quando cada um faz sentido.

**Como usar.**
1. Instalação: `react-native-paper`, `react-native-safe-area-context` e uma biblioteca de ícones
2. Configuração: envolver o app com o `PaperProvider`, passando o tema

**Componentes demonstrados ao vivo (interativos).**

| Tema | Componentes |
| --- | --- |
| Antes e depois | `TextInput`, `Button`, `Text`, `useTheme` (comparado a `View`/`Text`/`TextInput`/`Pressable`) |
| Botões e ações | `Button` (5 modos, `loading`, `disabled`), `IconButton`, `SegmentedButtons`, `FAB` |
| Entradas de dados | `TextInput`, `HelperText`, `Searchbar`, `Chip`, `RadioButton`, `Switch`, `Checkbox` |
| Cards e listas | `Card`, `List.Item`, `List.Accordion`, `Avatar`, `Badge`, `Divider`, `DataTable` |
| Navegação | `Appbar.Header`, `Menu`, `BottomNavigation`, `Drawer.Section` / `Drawer.Item` |
| Diálogos e feedback | `Dialog`, `Portal`, `Snackbar`, `Banner`, `ProgressBar` |
| Tema claro e escuro | `PaperProvider` com tema dinâmico e paletas personalizadas |

## 📊 Os slides

São 16 slides em 5 partes:

| Parte | Slides | Conteúdo |
| --- | --- | --- |
| Introdução | 1–3 | Capa, o problema e comparação antes/depois |
| Conceitos | 4–7 | O que é, principais recursos, limitações e comparação com alternativas |
| Primeiros passos | 8–9 | Instalação e configuração inicial |
| Componentes | 10–14 | Botões, entradas, cards e listas, navegação, diálogos e feedback |
| Tema e conclusão | 15–16 | Tema claro/escuro, conclusão e referências |

## 🚀 Como rodar

**Pré-requisitos:** Node.js 18 ou superior e um navegador moderno (Chrome, Edge ou Firefox).

```bash
cd react-native-paper
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

Outros comandos:

```bash
npm run build      # checagem de tipos (tsc) + build de produção em dist/
npm run preview    # serve o build de produção
npm run typecheck  # apenas a checagem de tipos
```

> O arquivo `.npmrc` usa `legacy-peer-deps=true`: o Paper declara `react-native` como _peer dependency_, mas aqui ele é substituído pelo `react-native-web`. Sem essa opção o npm tentaria instalar o React Native completo.

## ⌨️ Navegação

| Ação | Como |
| --- | --- |
| Próximo / anterior | `→` / `←` (também `PageDown` / `PageUp`) ou botões da barra inferior |
| Primeiro / último slide | `Home` / `End` |
| Sumário | `T` ou botão **Sumário** |
| Playground | `P` ou botão **Playground** (voltar: `Esc`) |
| Tela cheia | `F` ou o botão ⛶ |

O slide atual fica na URL (`#/slide/7`), então dá para recarregar a página ou compartilhar o link de um slide.

## 🧪 Playground

Acesse por `P` ou por `#/playground`. Tem um **construtor de Button** (altere `mode`, `icon`, `loading`, `disabled`, `compact` e o texto, com o código gerado ao lado) e exemplos de botões, formulário, cards e listas, navegação, feedback e tema, com seletor **Claro / Escuro**.

## 📁 Estrutura

```text
react-native-paper/
├── index.html
├── vite.config.ts            # alias react-native → react-native-web, ícones, __DEV__
└── src/
    ├── components/           # interface da apresentação (shell, CodeBlock, PhoneFrame, sumário…)
    ├── slides/               # um arquivo por slide + index.ts (ordem e tempo de cada slide)
    ├── demos/paper/          # código React Native + Paper que roda (e é exibido) nos slides
    ├── pages/                # Playground e construtor de Button
    ├── data/                 # conteúdos, links e dados do apresentador
    └── theme/ styles/ hooks/
```

O código mostrado nos slides é exatamente o que está rodando: os arquivos de `src/demos/paper` são importados como componente e como texto (`?raw`).

## ⚠️ Limitações das demonstrações

- Rodam no navegador (`react-native-web`), não em um celular: a aparência é a mesma em essência, com pequenas diferenças de fonte, sombra e animação.
- Os ícones são desenhados em SVG (`@mdi/js`) no lugar das fontes usadas no app mobile.
- O console pode mostrar o aviso `useNativeDriver is not supported`; é esperado, as animações rodam em JavaScript.

## 🔗 Referências

- Site oficial: https://reactnativepaper.com/
- Documentação: https://callstack.github.io/react-native-paper/
- Instalação: https://callstack.github.io/react-native-paper/docs/guides/getting-started
- Temas: https://callstack.github.io/react-native-paper/docs/guides/theming
- Código-fonte: https://github.com/callstack/react-native-paper
