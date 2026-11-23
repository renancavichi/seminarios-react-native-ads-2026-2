# 📸 Seminário React Native — Expo Image Picker

Aplicativo prático de **Crachá Digital do IFSP** desenvolvido para demonstrar o uso da biblioteca oficial **`expo-image-picker`** no React Native com Expo.

- **Aluna:** Maíra Kobayashi
- **Curso:** Análise e Desenvolvimento de Sistemas (ADS) — IFSP Câmpus Caraguatatuba
- **Slides da Apresentação:** [Acessar no Google Apresentações](https://docs.google.com/presentation/d/16NuoSSNd38178k3-bP4yFWixkh6S_ID7xPS8gdxU7kg/edit?usp=sharing)
- **Documentação Oficial de Referência:** [Expo ImagePicker Docs](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

---

## 🎯 Sobre a Demonstração

Este projeto demonstra como integrar a galeria de fotos e a câmera nativa do celular em uma aplicação React Native utilizando o **`expo-image-picker`**:

1. **Acesso à Galeria de Fotos (`ImagePicker.launchImageLibraryAsync`)**: permite selecionar imagens salvas no dispositivo.
2. **Permissão e Captura com a Câmera (`ImagePicker.requestCameraPermissionsAsync` e `ImagePicker.launchCameraAsync`)**: solicita permissão ao usuário e abre a câmera para tirar uma foto na hora.
3. **Edição e Recorte Nativo (`allowsEditing: true` e `aspect: [1, 1]`)**: abre a ferramenta nativa de corte na proporção quadrada (`1:1`) antes de exibir a imagem no formato circular do crachá.

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) instalado no computador.
- Aplicativo **Expo Go** instalado no celular (Android ou iOS) — ou um emulador Android / simulador iOS configurado.

---

## 🚀 Como Rodar o Projeto (Passo a Passo)

1. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start
   ```

3. **Abra o aplicativo:**
   - **No celular físico (recomendado para testar a câmera real):** abra o aplicativo **Expo Go** (no Android) ou a câmera padrão (no iPhone) e escaneie o **QR Code** exibido no terminal. *(Certifique-se de que o celular e o computador estejam na mesma rede Wi-Fi)*.
   - **No Emulador Android:** pressione a tecla **`a`** no terminal.
   - **No Navegador Web:** pressione a tecla **`w`** no terminal.

---

## 🧪 Como Testar a Demonstração na Apresentação

1. Assim que o aplicativo abrir na tela **"Meu crachá"**, toque no **círculo com o ícone de câmera** localizado no centro do crachá do IFSP.
2. Será exibido um alerta com duas opções:
   - **Galeria:** abre as fotos do celular para escolher uma imagem existente.
   - **Tirar foto:** solicita a permissão de câmera do aparelho e abre a câmera fotográfica para captura imediata.
3. Após selecionar ou bater a foto, ajuste o **recorte quadrado (`1:1`)** na tela de edição e confirme.
4. A foto recortada aparecerá imediatamente no círculo do crachá. Para substituir a foto, basta tocar sobre ela novamente.

---

## 📂 Estrutura Principal do Código

```text
├── app.json                      # Configuração do plugin e permissões do expo-image-picker
├── src/
│   ├── app/
│   │   ├── _layout.tsx           # Carregamento das fontes Roboto e estilos globais
│   │   └── index.tsx             # Tela "Meu crachá" com toda a lógica do Expo Image Picker
│   ├── components/
│   │   ├── credential.tsx        # Layout do crachá do IFSP e exibição condicional da foto
│   │   ├── header.tsx            # Cabeçalho da tela
│   │   └── loading.tsx           # Indicador de carregamento inicial
│   └── styles/
│       ├── colors.ts             # Cores principais do tema
│       └── global.css            # Diretivas do Tailwind CSS (NativeWind)
```
