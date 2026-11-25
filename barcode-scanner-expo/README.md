# Barcode Scanner — React Native + Expo

Projeto demonstrativo para uma apresentação curta sobre **leitura de códigos de barras** em React Native usando **Expo SDK 54** e o pacote `expo-camera`.

## O que a aplicação faz

- Solicita permissão de câmera.
- Abre a câmera traseira com `CameraView`.
- Detecta códigos EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39 e QR Code.
- Exibe o tipo do código, o conteúdo lido e o horário da leitura.
- Permite reiniciar o scanner para uma nova leitura.

## Tecnologias

- React Native 0.81.5
- React 19.1
- Expo SDK 54
- Expo Router
- `expo-camera` ~17.0.10

A estrutura foi mantida próxima ao projeto de referência da disciplina (`expo-router/entry`, `src/app` e Expo SDK 54).

## Como executar

Requisito recomendado para o Expo SDK 54: **Node.js 20.19.x ou superior compatível**.

```bash
npm install
npx expo start
```

Para testar a câmera, prefira um celular físico com o **Expo Go**. Leia o QR Code exibido no terminal e abra o projeto.

## Trecho principal

```jsx
<CameraView
  style={StyleSheet.absoluteFill}
  facing="back"
  onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
  barcodeScannerSettings={{
    barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
  }}
/>
```

O callback `onBarcodeScanned` recebe os dados reconhecidos pela câmera. Depois de uma leitura, o exemplo desativa temporariamente o callback para evitar várias leituras do mesmo código.

## Estrutura

```text
barcode-scanner-expo/
├─ app.json
├─ package.json
└─ src/
   └─ app/
      ├─ _layout.js
      ├─ index.js
      └─ scanner.js
```

## Autor

Vinícius — ADS / IFSP
