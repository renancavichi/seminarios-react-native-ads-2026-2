# Tamagui — Guia de Estudos e Referência Técnica

Material de estudo sobre o **Tamagui**, uma biblioteca de interface (UI) para React Native e Web que permite desenvolver aplicações multiplataforma utilizando componentes, estilos, tokens e um sistema de Design System compartilhado.

O objetivo deste documento é apresentar o conceito da biblioteca, seus principais recursos, processo de instalação, configurações e exemplos práticos de utilização.

---

## 1. O que é o Tamagui?

O Tamagui é um conjunto de ferramentas para desenvolvimento de interfaces utilizando React e React Native. Ele oferece componentes reutilizáveis, sistema de estilização, gerenciamento de temas, tokens de design e ferramentas de otimização.

Sua proposta é permitir que desenvolvedores construam interfaces para Web, Android e iOS compartilhando componentes e padrões visuais.

### 1.1. Para que serve?

O Tamagui serve para:

- Desenvolver interfaces reutilizáveis.
- Compartilhar componentes entre aplicações Web e Mobile.
- Criar e manter Design Systems.
- Padronizar cores, tipografia, espaçamentos e outros elementos visuais.
- Implementar temas claros e escuros.
- Criar interfaces responsivas.
- Otimizar a renderização e a geração de estilos durante a compilação.

### 1.2. Qual problema resolve?

Em projetos que possuem versões Web e Mobile, é comum encontrar diferenças na implementação dos componentes, duplicação de código e inconsistências visuais.

O Tamagui procura reduzir esses problemas por meio de uma API unificada, componentes compartilhados e um sistema centralizado de estilos.

**Exemplo:** um botão pode ser desenvolvido uma única vez e utilizado em diferentes plataformas, mantendo a mesma identidade visual e comportamento compatível com cada ambiente.

---

## 2. Arquitetura e funcionamento

O Tamagui combina três elementos principais:

- **Componentes de UI:** elementos utilizados para construir a interface.
- **Sistema de estilos:** responsável por organizar propriedades visuais, tokens, temas e variantes.
- **Compilador:** ferramenta que analisa o código durante a build e realiza otimizações.

### 2.1. Arquitetura e compilador

O compilador do Tamagui analisa os componentes e estilos durante o processo de build.

Seu funcionamento envolve:

1. O desenvolvedor escreve componentes utilizando a API do Tamagui.
2. Ferramentas de compilação, como Babel ou integrações específicas, analisam o código.
3. Estilos estáticos e determinados padrões são identificados.
4. Parte dos estilos pode ser extraída e otimizada durante a build.
5. A árvore de renderização pode ser simplificada por meio de otimizações.

**Ponto importante:** estilos estáticos podem ser processados durante a build, enquanto valores dinâmicos continuam sendo resolvidos em runtime.

O uso do compilador é especialmente relevante para aproveitar os recursos de otimização da biblioteca.

---

## 3. Instalação e configuração

O processo de instalação depende do ambiente utilizado. A seguir, está um exemplo de configuração para um projeto React com Vite.

### 3.1. Pré-requisitos

Antes de instalar, é necessário possuir:

- Node.js em versão compatível com as dependências do projeto.
- npm, yarn ou pnpm.
- Conhecimentos básicos de React e TypeScript.
- Um projeto React configurado ou criado.

### 3.2. Criando o projeto

Para criar um projeto React com Vite:

```bash
npm create vite@latest meu-projeto -- --template react-ts
```

Entre na pasta:

```bash
cd meu-projeto
```

Instale as dependências:

```bash
npm install
```

### 3.3. Instalando o Tamagui

Instale os pacotes principais:

```bash
npm install tamagui @tamagui/core
```

Para utilizar os ícones e outros recursos adicionais, podem ser instalados pacotes específicos conforme a necessidade do projeto.

**Observação:** a configuração completa do Tamagui depende da versão, do ambiente e das integrações utilizadas. Consulte a documentação oficial para verificar os pacotes e procedimentos atuais.

### 3.4. Configuração inicial

O Tamagui utiliza um arquivo de configuração para centralizar os padrões visuais da aplicação.

Um exemplo simplificado de configuração:

```tsx
import { createTamagui } from 'tamagui'

const config = createTamagui({
  // Configurações de temas,
  // tokens, fontes e breakpoints.
})

export default config

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
```

O arquivo de configuração pode definir:

- Tokens de design.
- Temas.
- Fontes.
- Breakpoints.
- Configurações de componentes.

A configuração também deve ser registrada na aplicação por meio do `TamaguiProvider`.

### 3.5. Utilizando o Provider

O `TamaguiProvider` disponibiliza a configuração da biblioteca para os componentes da aplicação.

Exemplo:

```tsx
import { TamaguiProvider } from 'tamagui'
import config from './tamagui.config'

function App() {
  return (
    <TamaguiProvider config={config}>
      {/* Componentes da aplicação */}
    </TamaguiProvider>
  )
}

export default App
```

**Importante:** em projetos reais, também é necessário configurar corretamente a integração de build correspondente ao ambiente escolhido. Em projetos Expo/React Native, os procedimentos são diferentes dos utilizados com Vite.

---

## 4. Componentes fundamentais

O Tamagui disponibiliza componentes que facilitam a construção de interfaces.

### 4.1. XStack

Organiza elementos horizontalmente utilizando conceitos do Flexbox.

```tsx
import { XStack, Text } from 'tamagui'

<XStack gap="$3" padding="$4">
  <Text>Elemento 1</Text>
  <Text>Elemento 2</Text>
</XStack>
```

### 4.2. YStack

Organiza elementos verticalmente.

```tsx
import { YStack, Text } from 'tamagui'

<YStack gap="$2" padding="$4">
  <Text>Título</Text>
  <Text>Descrição</Text>
</YStack>
```

### 4.3. Text e Heading

São utilizados para apresentar conteúdos textuais e estabelecer hierarquia tipográfica.

```tsx
import { Text, Heading } from 'tamagui'

<YStack>
  <Heading size="$8">
    Meu título
  </Heading>

  <Text color="$color">
    Texto de exemplo
  </Text>
</YStack>
```

### 4.4. styled()

Permite criar componentes personalizados a partir de componentes existentes, estabelecendo estilos e propriedades reutilizáveis.

```tsx
import { styled, Button } from 'tamagui'

const MeuBotao = styled(Button, {
  backgroundColor: '$blue10',
  borderRadius: '$4',
})
```

**Aplicação prática:** criar componentes padronizados para botões, cartões, campos de formulário e outros elementos de uma interface.

---

## 5. Design System e Tokens

Tokens são valores reutilizáveis que representam decisões visuais de um projeto.

Eles ajudam a manter a consistência e facilitam alterações globais na interface.

### 5.1. Tipos de tokens

| Categoria | Exemplo | Finalidade |
|---|---|---|
| Cores | `$blue10` | Identidade visual e estados |
| Espaçamentos | `$4` | Margens e preenchimentos |
| Raios | `$2` | Arredondamento de bordas |
| Z-index | `$top` | Organização de camadas |

### 5.2. Utilizando tokens

```tsx
<XStack
  backgroundColor="$blue10"
  padding="$4"
  borderRadius="$2"
>
  <Text color="white">
    Exemplo de componente
  </Text>
</XStack>
```

Em vez de definir valores manualmente em cada componente, os tokens permitem utilizar uma escala visual centralizada.

### 5.3. Criando tokens personalizados

A função `createTokens()` permite definir conjuntos de valores personalizados.

Exemplo simplificado:

```tsx
import { createTokens } from 'tamagui'

const tokens = createTokens({
  color: {
    primary: '#084E80',
    secondary: '#F5F5F5',
  },
  space: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
  },
})
```

Os tokens devem ser integrados à configuração do Tamagui.

**Aplicação prática:** desenvolver um Design System com cores, espaçamentos e padrões visuais próprios.

---

## 6. Variantes de componentes

Variantes permitem modificar a aparência de um componente por meio de propriedades.

Isso evita criar diversos componentes separados para representar pequenas diferenças visuais.

Exemplo:

```tsx
import { styled, Button } from 'tamagui'

const MeuBotao = styled(Button, {
  backgroundColor: '$blue10',

  variants: {
    size: {
      small: {
        padding: '$2',
      },
      large: {
        padding: '$4',
      },
    },

    active: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0.6,
      },
    },
  } as const,
})
```

Utilização:

```tsx
<MeuBotao size="small" active>
  Botão pequeno
</MeuBotao>

<MeuBotao size="large" active>
  Botão grande
</MeuBotao>
```

### 6.1. Vantagens das variantes

- Reutilização de componentes.
- Padronização de estilos.
- Menor duplicação de código.
- Integração com TypeScript.
- Facilidade de manutenção.

---

## 7. Themes — Temas

Themes permitem modificar a aparência da aplicação conforme o tema ativo.

São especialmente úteis para implementar modos claro e escuro.

### 7.1. Exemplos de temas

**Tema claro:**
- Fundo branco.
- Texto escuro.
- Elementos com cores mais claras.

**Tema escuro:**
- Fundo escuro.
- Texto claro.
- Elementos adaptados para ambientes com pouca iluminação.

### 7.2. Utilizando valores semânticos

```tsx
import { YStack, Text } from 'tamagui'

<YStack backgroundColor="$background" padding="$4">
  <Text color="$color">
    Conteúdo da aplicação
  </Text>
</YStack>
```

Os valores `$background` e `$color` são semânticos e podem assumir diferentes cores conforme o tema ativo.

### 7.3. Aplicação de temas

O Tamagui permite aplicar temas em diferentes partes da interface, possibilitando que determinadas regiões utilizem uma aparência diferente do restante da aplicação.

**Aplicação prática:** criar interfaces com alternância entre modo claro e escuro, mantendo a consistência visual.

---

## 8. Responsividade e plataformas

O Tamagui permite adaptar os estilos conforme o tamanho da tela e a plataforma utilizada.

### 8.1. Breakpoints

Breakpoints definem pontos de mudança no layout conforme a largura da tela.

Exemplo:

```tsx
<XStack
  flexDirection="column"
  $gtSm={{
    flexDirection: 'row',
  }}
>
  {/* Conteúdo */}
</XStack>
```

Nesse exemplo, o layout começa organizado verticalmente e passa a ser horizontal em telas maiores que o breakpoint `sm`.

### 8.2. Estilos específicos por plataforma

O Tamagui também permite definir propriedades específicas para Web e dispositivos nativos.

Exemplos:

```tsx
<XStack
  $platform-web={{
    cursor: 'pointer',
  }}
  $platform-native={{
    opacity: 0.9,
  }}
>
  {/* Conteúdo */}
</XStack>
```

### 8.3. Aplicações práticas

- Adaptar layouts para celulares, tablets e computadores.
- Reorganizar componentes conforme o espaço disponível.
- Compartilhar componentes entre Web e Mobile.
- Aplicar diferenças de apresentação entre plataformas.

---

## 9. Outros recursos

### 9.1. Animações

O Tamagui oferece recursos de animação e integração com soluções como Moti e React Native Reanimated, conforme a configuração do projeto.

### 9.2. Pseudoestados

Permitem modificar a aparência dos componentes conforme a interação do usuário.

Exemplos:

- `hover`: quando o ponteiro está sobre o elemento.
- `press`: quando o elemento está sendo pressionado.
- `focus`: quando o elemento recebe foco.

### 9.3. Fontes tipadas

O sistema tipográfico permite definir tamanhos, famílias e estilos de fontes reutilizáveis.

### 9.4. Depuração

O Tamagui oferece recursos para inspecionar estilos e compreender o comportamento dos componentes e das otimizações realizadas durante a compilação.

---

## 10. Vantagens e limitações

### 10.1. Vantagens

- API unificada para diferentes plataformas.
- Compartilhamento de código entre Web e Mobile.
- Sistema de temas e tokens.
- Integração com TypeScript.
- Criação de componentes reutilizáveis.
- Potencial de otimização durante a compilação.
- Desenvolvimento de Design Systems.

### 10.2. Limitações

- Curva de aprendizado inicial moderada.
- Configuração inicial mais complexa que a de bibliotecas simples.
- Dependência de configuração adequada do compilador para aproveitar determinadas otimizações.
- Comunidade e ecossistema menores que os de algumas alternativas.
- Necessidade de verificar a compatibilidade de recursos e componentes entre plataformas.

**Importante:** os benefícios de desempenho dependem da configuração e da utilização da biblioteca. O Tamagui não torna automaticamente qualquer aplicação mais rápida.

---

## 11. Comparação com outras soluções

| Biblioteca | Característica principal |
|---|---|
| Tamagui | Componentes, tokens, temas e desenvolvimento cross-platform |
| NativeWind | Estilização baseada em classes utilitárias para React Native |
| Styled Components | Estilização de componentes utilizando CSS-in-JS |
| React Native Paper | Biblioteca de componentes baseada no Material Design |

A escolha depende das necessidades do projeto, da arquitetura e da experiência da equipe.

---

## 12. Assuntos interessantes para aprofundar

Os tópicos abaixo são sugestões complementares de estudo:

1. **Compilação estática vs. runtime:** compreender quais estilos podem ser extraídos na build e quais dependem de valores dinâmicos.
2. **Design Systems escaláveis:** estruturar tokens semânticos, escalas tipográficas, espaçamentos e cores.
3. **TypeScript aplicado a UI:** estudar como variantes e propriedades tipadas ajudam a reduzir erros.
4. **Responsividade cross-platform:** entender quais padrões de layout funcionam em Web, Android e iOS.
5. **Acessibilidade:** investigar foco visível, navegação por teclado, contraste e semântica dos componentes.
6. **Animações e desempenho:** comparar Moti, Reanimated e animações CSS.
7. **Depuração e build:** aprender a identificar problemas de configuração e verificar os resultados da compilação.
8. **Comparação com alternativas:** estudar Tamagui em relação a NativeWind, Styled Components e outras soluções.

---

## 13. Roteiro prático de estudos

Para consolidar o aprendizado, recomenda-se seguir esta sequência:

1. Criar um projeto React com TypeScript.
2. Instalar o Tamagui e configurar o ambiente.
3. Criar um arquivo de configuração com tokens e temas.
4. Reproduzir exemplos com `XStack`, `YStack`, `Text` e `styled()`.
5. Criar um conjunto de tokens próprios.
6. Construir um botão com variantes de tamanho e estado.
7. Implementar temas claro e escuro.
8. Criar uma interface responsiva para Web e Mobile.
9. Experimentar animações e pseudoestados.
10. Comparar a configuração e o desempenho de uma interface simples.

---

## 14. Conclusão

O Tamagui é uma solução voltada à construção de interfaces modernas e multiplataforma, reunindo componentes reutilizáveis, estilização, Design Systems e ferramentas de otimização.

Seu principal diferencial está na possibilidade de compartilhar padrões e componentes entre Web e Mobile, reduzindo duplicações e facilitando a manutenção da identidade visual de uma aplicação.

Apesar de exigir uma configuração inicial e apresentar uma curva de aprendizado, oferece recursos relevantes para projetos que precisam de consistência visual, escalabilidade e reutilização de código.

Uma boa forma de começar é desenvolver um projeto pequeno utilizando os componentes básicos e, gradualmente, incorporar tokens, variantes, temas e responsividade.

---

## 15. Referências oficiais

- Documentação: https://tamagui.dev/
- Documentação de configuração: https://tamagui.dev/docs/core/configuration
- Componentes: https://tamagui.dev/ui/intro
- Temas: https://tamagui.dev/docs/core/theme
- Tokens: https://tamagui.dev/docs/core/tokens
- Compilador: https://tamagui.dev/docs/intro/compiler-install

**Nota:** os exemplos de código deste guia são didáticos. A configuração de produção deve ser conferida na documentação oficial correspondente à versão do Tamagui e ao ambiente utilizado.
