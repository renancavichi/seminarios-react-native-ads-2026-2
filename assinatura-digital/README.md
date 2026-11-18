# Assinatura Digital

**Matheus Manfredini**

Projeto desenvolvido para a disciplina de **Programação para Dispositivos Móveis**, do curso de Análise e Desenvolvimento de Sistemas do **IFSP**.

## Sobre o projeto

Este aplicativo demonstra a captura de assinaturas manuscritas em dispositivos móveis utilizando React Native e Expo. A assinatura é desenhada pelo usuário em uma área na tela e convertida em uma imagem PNG codificada em Base64.

A biblioteca principal é a [`react-native-signature-canvas`](https://github.com/YanYuanFE/react-native-signature-canvas). Ela fornece um canvas integrado com uma WebView, permitindo capturar movimentos, limpar ou desfazer traços e exportar o desenho sem a necessidade de implementar manualmente toda a lógica de desenho.

## Objetivo

Apresentar na prática como uma biblioteca externa pode ser integrada a uma aplicação móvel, como lidar com eventos de desenho e como transformar a assinatura capturada em dados utilizáveis pelo aplicativo.

## Funcionalidades

- Área de assinatura com guia visual.
- Contagem de traços e opção de desfazer.
- Limpeza da assinatura.
- Bloqueio da rolagem enquanto o usuário desenha.
- Validação de assinaturas vazias ou incompletas.
- Exportação da assinatura em Base64 e PNG.
- Exibição de data, hora e sistema operacional do registro.
- Cópia dos dados em formato JSON.
- Histórico das assinaturas da sessão.

## Como funciona

1. O usuário realiza a assinatura no canvas.
2. Cada traço é registrado pela biblioteca.
3. Ao confirmar, o aplicativo solicita a exportação da imagem.
4. O código valida o tamanho do desenho.
5. O aplicativo cria um registro com a imagem, data, hora e plataforma utilizada.
6. O registro fica na memória da sessão e pode ser copiado em JSON com a imagem completa em Base64. A confirmação funciona localmente, sem consultas de IP ou uploads.

## Pontos importantes para estudo

- O componente utiliza uma WebView internamente, portanto eventos e dados podem depender do ambiente de execução e precisam ser testados em Android e iOS.
- Operações como `onBegin`, `onEnd` e `onOK` controlam momentos diferentes do desenho e da exportação; elas não devem ser confundidas com uma validação jurídica da assinatura.
- O resultado exportado é uma imagem de representação visual. Ele não identifica automaticamente a pessoa que assinou.
- A demonstração verifica se existe pelo menos um traço e se o PNG atinge um tamanho mínimo. O tamanho do arquivo é uma heurística e varia com as dimensões e a compressão da imagem.
- Base64 facilita a transferência e o armazenamento temporário, mas aumenta o tamanho dos dados. Para uso real, pode ser necessário processar ou armazenar a imagem em formato PNG.
- A data e a hora vêm do relógio do dispositivo e são registradas em UTC. Esses metadados são informativos e não garantem autoria.
- O histórico desta demonstração existe somente na memória da sessão. Aplicações reais precisariam avaliar persistência, autenticação, criptografia e consentimento do usuário.
- Em um projeto de produção, uma assinatura eletrônica ou digital pode exigir integração com banco de dados, certificado digital, auditoria segura e requisitos legais específicos.

## Tecnologias utilizadas

- Expo SDK 58
- React Native 0.88
- React 19.3
- `react-native-signature-canvas`
- `react-native-webview`
- `expo-clipboard`
- `@expo/vector-icons`

## Executando o projeto

Pré-requisitos: Node.js 22.13 ou superior e Expo Go.

```bash
npm install
npm start
```

Também podem ser utilizados:

```bash
npm run android
npm run ios
```

A captura é destinada a Android e iOS. A WebView usada pelo canvas não oferece suporte à captura no navegador.

## Observação

Este projeto é uma demonstração acadêmica. Os registros são mantidos somente durante a sessão aberta no aplicativo e não representam uma assinatura digital com validade jurídica.

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE`.
