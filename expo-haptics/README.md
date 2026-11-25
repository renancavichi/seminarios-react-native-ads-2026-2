# Expo Haptics — Feedback Tátil no React Native

Apresentação interativa sobre o uso da biblioteca **`expo-haptics`** para fornecer feedback tátil (vibrações curtas e precisas de seleção, impacto e notificação) em aplicativos e jogos desenvolvidos com React Native e Expo.

## 👤 Autor

- **Vinícius Garcia** ([@vinikyo](https://github.com/vinikyo))

## 🚀 Como rodar a apresentação

A apresentação foi construída em um único arquivo HTML interativo, sem necessidade de instalar dependências externas.

1. Faça o clone deste repositório ou baixe o arquivo [`apresentacao_expo_haptics.html`](./apresentacao_expo_haptics.html).
2. Abra o arquivo `apresentacao_expo_haptics.html` diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

### ⌨️ Controles da Apresentação

- **Setas `←` / `→`**, **`Espaço`** ou **`PageUp` / `PageDown`**: Navegar entre os slides.
- **Tecla `F`** (ou botão **Tela cheia**): Alternar modo de tela cheia.
- **Teclas `Home` / `End`**: Ir para o primeiro ou último slide.
- **No celular**: Deslize para os lados para trocar de slide. No slide do **Simulador de Haptics**, se aberto em um aparelho Android compatível, os botões acionam a vibração real do dispositivo via Web Vibration API.

## 📦 Como usar o `expo-haptics` em um projeto Expo

### 1. Instalação

```bash
npx expo install expo-haptics
```

### 2. Exemplo básico de uso

```tsx
import * as Haptics from 'expo-haptics';

// 1. Toque leve de seleção (troca de opção, roleta, abas)
Haptics.selectionAsync();

// 2. Toque de impacto físico (Light, Medium, Heavy, Rigid, Soft)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// 3. Notificação de resultado (Success, Warning, Error)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

## 🔗 Referências

- [Documentação Oficial — Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
