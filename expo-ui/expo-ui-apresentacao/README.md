# Expo UI: apresentação + app de demonstração

Tudo o que você precisa para apresentar e demonstrar o Expo UI no seu computador.

```
expo-ui-apresentacao/
├── apresentacao/index.html   ← os slides (abrem direto no navegador)
├── app/App.js                ← código da demo real (7 telas com Expo UI)
├── setup.js                  ← cria o projeto Expo e instala tudo
└── package.json              ← atalhos: npm run slides / setup / start / app
```

---

# Sobre o Expo UI

**Expo UI** (`@expo/ui`) é uma biblioteca do Expo que permite montar telas com os **componentes nativos de verdade do iOS (SwiftUI) e do Android (Jetpack Compose)**, escrevendo em React / JavaScript. Ela é estável desde o SDK 56 e já vem incluída no Expo Go.

## Que problema ela resolve?

No React Native, as peças básicas (`View`, `Text`) são neutras. Quando o app precisa de controles com a cara do sistema (seletor, menu, bottom sheet, seletor de data, slider), surgem três problemas:

- **Visual "quase" nativo.** Muitos controles são recriados em JavaScript ou têm aparência própria, que não segue o sistema.
- **Dependências demais.** Cada controle costuma ser um pacote nativo separado, com release próprio, que pode quebrar a cada atualização de SDK.
- **Novidades do sistema demoram.** Um recurso novo do SwiftUI (como o `glassEffect()`) só chegava ao React Native depois que alguém escrevia o wrapper.

**A solução:** em vez de imitar, o Expo UI usa as primitivas que o iOS e o Android já entregam e as expõe como componentes React. Um `Switch` vira o `Toggle` do SwiftUI no iPhone e o `Switch` do Material 3 no Android. Dá para adotar aos poucos, uma tela por vez.

## Quais os principais recursos?

- **`Host`:** a "moldura" que liga o React Native ao mundo nativo. Todo componente do Expo UI precisa ficar dentro de um `Host`.
- **Quatro camadas de import:**
  - `@expo/ui`: **universal**, um código para iOS e Android (web é experimental). É o ponto de partida.
  - `@expo/ui/swift-ui`: nomes iguais aos da Apple (Toggle, Form, `glassEffect()`), só iOS.
  - `@expo/ui/jetpack-compose`: nomes iguais aos do Google (LazyColumn, DockedSearchBar), só Android.
  - `@expo/ui/community`: **drop-ins**, substitutos de pacotes populares.
- **Componentes universais:** `BottomSheet`, `Button`, `Checkbox`, `Collapsible`, `Column`, `FieldGroup`, `Host`, `Icon`, `List`, `Picker`, `RNHostView`, `Row`, `ScrollView`, `Slider`, `Spacer`, `Switch`, `Text`, `TextInput`.
- **Drop-ins** (troque só o import): `@gorhom/bottom-sheet`, `@react-native-community/datetimepicker`, `@react-native-masked-view/masked-view`, `@react-native-menu/menu`, `react-native-pager-view`, `@react-native-picker/picker`, `@react-native-segmented-control/segmented-control` e `@react-native-community/slider`.
- **`FieldGroup`:** tela de ajustes pronta. Vira um `Form` agrupado no iOS e uma lista agrupada Material 3 no Android, sem arquivos `.ios.js` e `.android.js`.
- **Extensível:** quando falta um componente, dá para criar suas próprias views e modifiers em Swift ou Kotlin; o Expo UI cuida de props e eventos.
- **`useNativeState`:** estado compartilhado entre o JavaScript e as views nativas, para gestos contínuos (digitar, arrastar) sem flicker.
- **Plataforma:** cores dinâmicas do Material 3 (`useMaterialColors`), Material Symbols no Android, modifiers do SwiftUI no iOS e suporte a Apple TV e Android TV.
- **Expo Go:** já vem incluído, então dá para testar sem build próprio.

## Tem alguma limitação?

- **A camada universal é a primeira iteração.** Nem todo componente existe com o mesmo nível nas três plataformas.
- **Web é experimental.** `swift-ui` e `jetpack-compose` não funcionam na web.
- **Cobertura parcial.** SwiftUI e Compose têm centenas de views; só parte está embrulhada. O resto exige estender com Swift ou Kotlin.
- **Layout dentro do `Host` é diferente.** Não vale o flexbox do Yoga nos filhos nem estilos no padrão CSS (como NativeWind). Use `Row` e `Column` (ou `HStack` e `VStack`). O flexbox vale só no próprio `Host`.
- **O visual segue cada sistema.** Não é pixel igual entre iOS e Android; essa é a ideia.
- **Drop-ins são quase compatíveis, não idênticos.** Algumas props não são suportadas e o comportamento muda. Exemplos nesta demo:
  - `DateTimePicker`: no Android o padrão é abrir como diálogo (aqui usamos `presentation="inline"`) e o evento de mudança é `onValueChange`.
  - `MenuView`: no Android os grupos (`displayInline`) aparecem só como linha divisória, sem o título da seção.
  - `PagerView`: exige iOS 17 ou superior para parar em cada página e não funciona na web.
- **TV:** algumas APIs nativas do SwiftUI e do Compose não existem em Apple TV e Android TV.
- **Precisa do ecossistema Expo.** Em um app React Native puro é preciso instalar o pacote `expo` (Expo Modules) antes.

## Quais as principais diferenças entre recursos similares?

| Opção | O que renderiza | Melhor para | Troca (trade-off) |
| --- | --- | --- | --- |
| **Expo UI** | SwiftUI e Jetpack Compose reais | Telas com visual do sistema: ajustes, formulários, sheets, menus, pickers | Cobertura parcial; layout fora do flexbox nos filhos do Host |
| **React Native core** (`View`, `Text`) | Views nativas básicas com flexbox | Design próprio / design system | Controles de sistema exigem bibliotecas extras |
| **Pacotes da comunidade** (picker, slider, menu...) | UIKit e Android Views, um módulo por controle | Apps que já usam esses pacotes | Muitas dependências e releases (o Expo UI traz substitutos) |
| **Bibliotecas de UI em JS** (ex.: React Native Paper) | Visual reimplementado em JavaScript, com design próprio | Seguir um design system específico | Não são os componentes reais do sistema |
| **react-native-skia** | Canvas desenhado por você | Gráficos, shaders, animações | Não é UI nativa; você reconstrói o comportamento |
| **DOM components** | Código web dentro de uma webview | Reaproveitar o ecossistema web | Não é nativo |

Eles **não competem**: podem conviver na mesma tela, no nível do componente.

**Diferenças dentro do próprio Expo UI:**

| Comparação | Diferença |
| --- | --- |
| **Universal** vs **`swift-ui` / `jetpack-compose`** | O universal usa um código só para iOS e Android. As outras camadas dão acesso total e nomes iguais aos nativos, mas cada uma só roda na sua plataforma. |
| **Drop-in** vs **pacote original** | O drop-in mantém a API do pacote conhecido (troca só o import), mas é feito em SwiftUI e Compose, então algumas props mudam. |
| **Picker universal** vs **`community/picker`** | O universal é a API nova do Expo UI. O `community/picker` é só a camada de compatibilidade com `@react-native-picker/picker`. |

**Nomes equivalentes (universal, SwiftUI e Compose):**

| Universal (`@expo/ui`) | SwiftUI | Jetpack Compose |
| --- | --- | --- |
| `Row` | `HStack` | `Row` |
| `Column` | `VStack` | `Column` |
| `Switch` | `Toggle` | `Switch` |
| `FieldGroup` | `Form` | Lista agrupada Material 3 |

---

# Como rodar no seu computador

## Pré-requisitos

- **Node.js LTS** (https://nodejs.org). Confira com `node -v`.
- **VS Code** (opcional, mas recomendado).
- **Expo Go** no celular (App Store ou Google Play), ou um simulador/emulador.

## 1) Abrir no VS Code

1. Descompacte o zip.
2. No VS Code: **Arquivo > Abrir Pasta…** e escolha `expo-ui-apresentacao`.
3. Abra o terminal integrado: **Ctrl + '** (ou **Terminal > Novo Terminal**).

## 2) Abrir os slides

Qualquer uma das opções:

- Dê dois cliques em `apresentacao/index.html`.
- No VS Code, instale a extensão **Live Server**, clique com o botão direito em `index.html` e escolha **Open with Live Server**.
- No terminal: `npm run slides` e abra http://localhost:3000.

Teclas: **setas** ou **espaço** navegam, **N** mostra as notas do apresentador, **F** tela cheia, **T** reinicia o cronômetro.
As fontes vêm do Google Fonts. Sem internet, a página usa fontes do sistema e continua funcionando.

> O "Teste ao vivo" dos slides é uma simulação visual no navegador. Os componentes reais rodam no app abaixo.

## 3) Criar e rodar o app de demonstração

```bash
npm run setup      # ou: node setup.js
cd expo-ui-demo
npx expo start
```

O `setup.js` faz, nesta ordem: `npx create-expo-app@latest expo-ui-demo --template blank` (JavaScript), `npx expo install @expo/ui` e copia `app/App.js` para dentro do projeto.
Para fazer tudo e já iniciar o servidor: `npm start`.

Depois que o servidor subir:

- **Celular:** abra o Expo Go e escaneie o QR code (celular e computador na mesma rede Wi-Fi).
- **Rede bloqueando o QR?** Use `npx expo start --tunnel`.
- **Simulador iOS (só no Mac):** tecle `i`. **Emulador Android:** tecle `a`.
- **Mostrar o celular no computador:** Android com `scrcpy`; iPhone no Mac com o QuickTime (Arquivo > Nova gravação de filme, escolhendo o iPhone).

O app tem 7 abas: **Ajustes** (FieldGroup, Switch, Slider, Button), **Picker**, **Data**, **Sheet** (bottom sheet), **Texto** (TextInput), **Menu** (lista de produtos com ordenação) e **Pager**.

Edite `expo-ui-demo/App.js` e salve: o Expo Go atualiza sozinho (Fast Refresh). Para guardar suas alterações na pasta `app/`, copie o arquivo de volta.

## Em outra máquina

1. Copie esta pasta (pode apagar `expo-ui-demo/node_modules`) ou use git.
2. Instale o Node LTS.
3. `node setup.js` (se `expo-ui-demo` não existir) ou, se já existir, `cd expo-ui-demo && npm install && npx expo start`.

## Observações

- O Expo UI vem incluído no Expo Go. Use a versão mais recente do Expo Go, que acompanha o SDK mais novo do `create-expo-app@latest`.
- As telas **Data**, **Menu** e **Pager** usam os drop-ins de `@expo/ui/community` e funcionam só em Android e iOS (não na web).
- O **Pager** exige iOS 17 ou superior para parar em cada página.
- No Android, o seletor de data aparece inline porque a tela usa `presentation="inline"`.
- Se alguma API mudar em um SDK futuro, confira a documentação: https://docs.expo.dev/versions/latest/sdk/ui/
