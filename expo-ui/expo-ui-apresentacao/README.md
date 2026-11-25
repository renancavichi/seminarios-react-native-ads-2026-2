# Expo UI: apresentação + app de demonstração

Tudo o que você precisa para apresentar e demonstrar o Expo UI no seu computador.

```
expo-ui-apresentacao/
├── apresentacao/index.html   ← os slides (abrem direto no navegador)
├── app/App.js                ← código da demo real (7 telas com Expo UI)
├── setup.js                  ← cria o projeto Expo e instala tudo
└── package.json              ← atalhos: npm run slides / setup / start / app
```

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
