# React Native Reanimated

É uma biblioteca JavaScript para React Native utilizada na criação de
animações e interações visuais fluidas, melhorando a experiência do
usuário e o desempenho da interface.

### 1. Que problema ela resolve?

Reduz problemas de lentidão e travamentos em animações, permitindo
executar sua lógica diretamente na UI Thread, sem depender
constantemente da JavaScript Thread.

### 2. Quais os principais recursos?

-   **Shared Values:** compartilham valores utilizados nas animações.
-   **Worklets:** permitem executar funções na UI Thread.
-   **Animated Styles:** criam estilos dinâmicos.
-   **Spring e Timing:** criam animações com efeitos físicos ou duração
    definida.
-   **Gesture Integration:** permite animações que respondem a gestos.

### 3. Tem alguma limitação?

-   Pode exigir configurações específicas no projeto.
-   Possui uma curva de aprendizado maior.
-   Apresenta restrições de comunicação entre threads.
-   A compatibilidade depende das versões do React Native e da
    biblioteca.

### 4. Quais as diferenças entre recursos similares?

  Tecnologia            Principal característica
  --------------------- ---------------------------------------------------
  **Reanimated**        Animações complexas e alto desempenho.
  **Animated**          Animações básicas e tradicionais do React Native.
  **LayoutAnimation**   Anima automaticamente mudanças no layout.
  **Gesture Handler**   Reconhece e gerencia gestos do usuário.

**Conclusão:** o Reanimated se destaca pela flexibilidade e pelo
desempenho, sendo indicado para aplicações que exigem animações
complexas e interações mais elaboradas.

### Documentação oficial

[React Native Reanimated -- Documentação
oficial](https://docs.swmansion.com/react-native-reanimated/)
