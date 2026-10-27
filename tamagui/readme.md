# Tamagui — Guia de Estudos

Material de referência sobre o Tamagui, uma biblioteca de UI cross-platform para React Native e Web.

## 1. Mapa de conteúdo por página

- **Página 2 — O que é o Tamagui:** conceito, arquitetura e pilares principais da biblioteca.
- **Página 3 — Por que usar o Tamagui:** produtividade, performance, TypeScript e Design Systems.
- **Página 4 — Como a biblioteca funciona:** compilação, extração estática, otimização e achatamento da árvore de renderização.
- **Página 5 — Usos básicos:** `XStack`, `YStack`, `Text`, `Heading` e `styled()`.
- **Páginas 7–8 — Design System e Tokens:** cores, espaçamentos, raios de borda, z-index e criação de tokens personalizados.
- **Página 9 — Variantes:** criação de componentes com diferentes tamanhos, estados e estilos, utilizando propriedades tipadas.
- **Página 10 — Themes:** temas claros e escuros, aplicação de temas em partes da interface e resolução de valores.
- **Página 11 — Responsividade:** breakpoints e estilos específicos para Web e dispositivos nativos.
- **Página 12 — Outros recursos:** animações, pseudoestados, fontes tipadas e ferramentas de depuração.
- **Página 14 — Vantagens e limitações:** desempenho, API unificada, curva de aprendizado, configuração e ecossistema.
- **Página 15 — Conclusão:** síntese das vantagens do Tamagui e recomendação de começar com `@tamagui/core`.

*Observação: as páginas 1 e 6 e 13 não apresentam conteúdo técnico relevante na extração do documento; a página 1 funciona como capa.*

## 2. Conceitos importantes

### 2.1. Arquitetura e compilador — página 4

O Tamagui combina componentes de UI, um sistema de estilos e um compilador que otimiza a interface durante a build.

- **Definição:** o desenvolvedor utiliza componentes e propriedades de estilo.
- **Compilação:** ferramentas como Babel ou Vite analisam o código durante a build.
- **Extração:** estilos estáticos e determinados padrões são identificados e otimizados.
- **Achatamento (flattening):** simplificação da árvore de renderização.

**Ponto importante:** estilos estáticos podem ser processados durante a build, enquanto valores dinâmicos continuam sendo resolvidos em runtime.

### 2.2. Componentes fundamentais — página 5

- `XStack`: organização horizontal baseada em Flexbox.
- `YStack`: organização vertical baseada em Flexbox.
- `Text` e `Heading`: componentes para conteúdo textual e hierarquia tipográfica.
- `styled()`: criação de componentes personalizados com estilos predefinidos.

Estude como combinar componentes menores para construir interfaces maiores e consistentes.

### 2.3. Tokens e Design System — páginas 7–8

Tokens são valores reutilizáveis que definem a linguagem visual do projeto.

- **Cores:** exemplo `$blue10`, para uma paleta nomeada e escalonada.
- **Espaçamentos:** exemplo `$4`, para margens e preenchimentos.
- **Raios:** exemplo `$2`, para arredondamento de bordas.
- **Z-index:** exemplo `$top`, para camadas de empilhamento visual.
- **Tokens personalizados:** a página 8 apresenta o uso de `createTokens()`.

**Para estudar:** criação de escalas de cores, espaçamentos e outros valores reutilizáveis para manter a consistência visual.

### 2.4. Variantes — página 9

Variantes permitem modificar o estilo de um componente por meio de propriedades.

- `size="small"` e `size="large"` para diferentes tamanhos.
- `active` para representar um estado ativo.
- Tipagem automática das variantes com TypeScript.

**Para estudar:** criação de botões primários e secundários, tamanhos padronizados e estados visuais reutilizáveis.

### 2.5. Temas — página 10

Themes permitem modificar a aparência da interface conforme o tema ativo.

- Tema claro: fundo branco e texto preto.
- Tema escuro: fundo preto e texto branco.
- Aplicação de temas em partes específicas da interface.
- Resolução de valores: o Tamagui procura primeiro no tema ativo e depois nos tokens.

**Para estudar:** implementação de dark mode e utilização de cores semânticas, como `$background` e `$color`.

### 2.6. Responsividade e plataformas — página 11

O Tamagui oferece propriedades para adaptar os estilos a diferentes tamanhos de tela e plataformas.

- `$gtSm`: aplica estilos em telas maiores que o breakpoint `sm`.
- `$platform-web`: define estilos específicos para Web.
- `$platform-native`: define estilos específicos para dispositivos iOS e Android.

**Para estudar:** layouts adaptáveis, breakpoints, diferenças entre Web e mobile e compartilhamento de componentes entre plataformas.

### 2.7. Recursos adicionais — página 12

- **Animações:** suporte a integrações com Moti e Reanimated.
- **Pseudoestados:** estilização de estados como `hover`, `press` e `focus`.
- **Fontes tipadas:** sistema tipográfico com tamanhos predefinidos.
- **Depuração:** ferramentas e propriedades para inspecionar estilos e entender as otimizações do compilador.

## 3. Pontos de atenção

### Vantagens — página 14

- API unificada para diferentes plataformas.
- Compartilhamento de código entre Web e mobile.
- Potencial de otimização de CSS na Web.
- Sistema de temas e tokens.
- Suporte a TypeScript.

### Limitações — página 14

- Curva de aprendizado inicial moderada.
- Configuração inicial mais complexa que a de bibliotecas simples.
- Dependência do compilador para alcançar o máximo de otimização.
- Comunidade menor que a de algumas alternativas, segundo o material.

**Importante:** os benefícios de desempenho dependem da configuração e do uso da biblioteca; não significam que toda interface será automaticamente mais rápida.

## 4. Assuntos interessantes para aprofundar

Os tópicos abaixo são sugestões de estudo derivadas do conteúdo do PDF, não assuntos desenvolvidos integralmente nele.

1. **Compilação estática vs. runtime:** compreender quais estilos podem ser extraídos na build e quais dependem de valores dinâmicos.
2. **Design Systems escaláveis:** estruturar tokens semânticos, escalas tipográficas, espaçamentos e cores.
3. **TypeScript aplicado a UI:** estudar como variantes e propriedades tipadas ajudam a reduzir erros.
4. **Responsividade cross-platform:** entender quais padrões de layout funcionam em Web, Android e iOS.
5. **Acessibilidade:** investigar foco visível, navegação por teclado, contraste e semântica dos componentes.
6. **Animações e desempenho:** comparar Moti, Reanimated e animações CSS, considerando as diferenças entre plataformas.
7. **Depuração e build:** aprender a identificar problemas de configuração e verificar os resultados da compilação.
8. **Comparação com alternativas:** estudar Tamagui em relação a NativeWind, Styled Components e outras soluções de UI.

## 5. Roteiro prático de estudos

- Ler as páginas 2–4 para compreender a arquitetura.
- Reproduzir exemplos com `XStack`, `YStack` e `styled()`, usando a página 5.
- Criar um conjunto de tokens próprios, com base nas páginas 7–8.
- Construir um botão com variantes de tamanho e estado, com base na página 9.
- Implementar temas claro e escuro, com base na página 10.
- Criar uma interface responsiva para Web e mobile, com base na página 11.
- Experimentar animações e pseudoestados, com base na página 12.
- Comparar a configuração e o desempenho de uma interface simples, considerando as limitações da página 14.

## 6. Referência rápida

- Arquitetura e compilador: página 4.
- Componentes básicos: página 5.
- Tokens e Design System: páginas 7–8.
- Variantes: página 9.
- Temas: página 10.
- Responsividade e plataformas: página 11.
- Animações, pseudoestados e depuração: página 12.
- Vantagens e limitações: página 14.
- Conclusão do material: página 15.
