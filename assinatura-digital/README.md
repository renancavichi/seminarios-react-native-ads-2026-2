# Assinatura Digital

- **Autor** — Matheus Manfredini
- **Instituição** — Instituto Federal de São Paulo (IFSP)
- **Curso** — Análise e Desenvolvimento de Sistemas
- **Disciplina** — Programação para Dispositivos Móveis

## Resumo do projeto

Aplicativo acadêmico que demonstra como capturar uma assinatura manuscrita em uma tela sensível ao toque e converter o desenho em uma imagem PNG codificada em Base64. O objetivo é mostrar como integrar uma biblioteca externa ao React Native, tratar eventos de desenho e usar a imagem gerada no aplicativo.

## Biblioteca principal

**Nome e versão** — `react-native-signature-canvas` (`^5.1.1`).

**Problema que resolve** — Aplicativos que precisam coletar assinaturas na tela teriam de implementar a captura de toques, o desenho dos traços e a conversão do resultado em imagem.

**Solução proposta** — A biblioteca oferece um componente React Native com um canvas HTML dentro de uma WebView para Android e iOS. O componente captura os traços, permite desfazer ou limpar o desenho e exporta a assinatura como imagem. [Documentação oficial](https://github.com/YanYuanFE/react-native-signature-canvas)

**Uso no projeto** — Em [App.js](App.js), o componente `SignatureScreen` é configurado para exportar em PNG. A interface chama `undo()` para desfazer o último traço, `clearSignature()` para limpar o canvas e `readSignature()` para solicitar a imagem.

## Fluxo da assinatura

1. O usuário desenha com o dedo. O evento `onBegin` pausa a rolagem da tela para evitar que ela se mova durante o desenho. O evento `onEnd` reativa a rolagem e incrementa o contador de traços.
2. Ao confirmar, o app verifica se há traços e solicita a imagem ao componente. O evento `onOK` recebe o PNG em Base64, e o app verifica o tamanho do conteúdo como critério para rejeitar desenhos muito curtos.
3. O app associa ao registro a data e hora em formato ISO, a plataforma e o número de traços.
4. O resultado aparece na tela e entra no histórico da sessão. O usuário pode copiar a imagem ou os dados do registro.

## Funcionalidades

- Área de assinatura com guia visual, contador de traços e opções de desfazer e limpar.
- Verificação de assinaturas vazias ou com imagem abaixo do tamanho mínimo.
- Registro com data, hora, plataforma, quantidade de traços e tamanho da imagem.
- Cópia da imagem em Base64 e dos dados em JSON, com plataforma, data e hora e a imagem completa.
- Histórico em memória durante a sessão.

## Tecnologias

- **Expo SDK 58, React Native 0.88.1 e React 19.3.0** — base do aplicativo móvel.
- **`react-native-webview`** — executa o canvas HTML usado pelo componente de assinatura.
- **`expo-clipboard`** — copia a imagem ou os dados do registro para a área de transferência.
- **`@expo/vector-icons`** — fornece os ícones da interface.

As dependências e os comandos estão no [package.json](package.json).

## Como executar

### 1. Prepare o ambiente

- Use Node.js 24 LTS (24.3.0 ou posterior na linha 24) com npm. Confira a instalação com `node -v` e `npm -v`. [Referência do Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)
- Instale o Expo Go compatível com o SDK 58 no Android ou iPhone e conecte o celular e o computador à mesma rede Wi-Fi. [Versões do Expo Go](https://expo.dev/go)

### 2. Instale e inicie

Se ainda precisar baixar o projeto, use os comandos abaixo. Se já tiver o código, abra o terminal na pasta que contém `package.json` e `package-lock.json` e comece pelo `npm ci`.

```bash
git clone https://github.com/renancavichi/seminarios-react-native-ads-2026-2.git
cd seminarios-react-native-ads-2026-2/assinatura-digital
npm ci
npm start
```

O `npm ci` instala as versões registradas no `package-lock.json`.

### 3. Abra e teste no celular

- **Android** — abra o Expo Go e escaneie o QR Code exibido no terminal.
- **iPhone** — entre na mesma conta Expo no aplicativo e no terminal (`npx expo login`, antes de iniciar o servidor). Escaneie o QR Code com a câmera do iPhone. [Guia do Expo](https://docs.expo.dev/get-started/start-developing/)
- **Emuladores** — com o servidor rodando, pressione `a` para abrir no emulador Android já configurado ou `i` para abrir no simulador iOS, disponível no macOS.

Mantenha o terminal aberto. No app, desenhe uma assinatura, confirme e verifique se a imagem aparece no histórico. Faça esse teste em Android ou iOS, pois a captura usa uma WebView nativa.

### Se algo falhar

| Sintoma | O que fazer |
| --- | --- |
| `npm ci` não encontra o `package.json` ou o `package-lock.json` | Abra o terminal na pasta raiz do projeto e rode o comando novamente. |
| Expo Go informa que a versão do SDK é incompatível | Confira se a versão instalada do [Expo Go](https://expo.dev/go) suporta o SDK 58. |
| O QR Code abre, mas o celular não conecta ao servidor | Confira se os dois dispositivos estão na mesma rede. Se a rede bloquear a conexão local, pare o servidor com `Ctrl+C` e rode `npm start -- --tunnel`. Escaneie o novo QR Code. |
| O Metro continua exibindo um erro após reinstalar as dependências | Pare o servidor e rode `npm start -- --clear` para limpar o cache. Use `npx expo install --check` para conferir as versões das dependências. |

## Escopo e licença

A imagem registra a aparência da assinatura para fins de demonstração acadêmica. A verificação de identidade e a certificação digital ficam fora do escopo do aplicativo.

Licença [MIT](LICENSE).
