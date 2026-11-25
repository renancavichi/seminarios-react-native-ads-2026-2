# 📱 React Native Size Matters — Responsividade em Aplicações Híbridas

## 📖 Sobre o projeto

Este projeto apresenta os principais recursos da biblioteca **[react-native-size-matters](https://github.com/nirsky/react-native-size-matters)** e sua aplicação na construção de interfaces responsivas utilizando React Native.

O conteúdo explora como adaptar dimensões, espaçamentos e tipografia para diferentes tamanhos de tela, combinando as funções de escalonamento da biblioteca com recursos nativos do React Native, como `Platform` e `useWindowDimensions`.

A proposta é demonstrar como essas ferramentas podem trabalhar em conjunto para desenvolver interfaces consistentes em smartphones, tablets e ambientes Web/Desktop, considerando também aspectos de performance, acessibilidade e organização de estilos.

## 🎯 Principais recursos da react-native-size-matters

A biblioteca `react-native-size-matters` oferece funções de escalonamento que permitem adaptar os elementos da interface proporcionalmente às dimensões de diferentes dispositivos.

Seu funcionamento considera uma resolução de referência para o design, comparando-a com as dimensões da tela atual para calcular os valores de escalonamento.

### 1. `scale()` — Escalonamento horizontal

Realiza o escalonamento proporcional de dimensões com base na largura da tela.

É especialmente útil para:
- Larguras de componentes.
- Margens horizontais.
- Espaçamentos laterais.
- Dimensões de elementos gráficos.

```tsx
import { scale } from 'react-native-size-matters';

const styles = {
  width: scale(100),
  marginHorizontal: scale(16),
};
```

### 2. `verticalScale()` — Escalonamento vertical

Realiza o escalonamento considerando a altura da tela.

É indicado principalmente para:
- Alturas de componentes.
- Margens verticais.
- Espaçamentos verticais.
- Dimensões de elementos posicionados verticalmente.

```tsx
import { verticalScale } from 'react-native-size-matters';

const styles = {
  height: verticalScale(200),
  marginVertical: verticalScale(16),
};
```

### 3. `moderateScale()` — Escalonamento moderado

Permite controlar a intensidade do escalonamento, aplicando apenas uma fração do crescimento proporcional calculado.

É especialmente interessante para tipografia, ícones e elementos que não devem aumentar excessivamente em telas maiores.

A função aceita um fator de moderação, cujo valor padrão é `0.5`.

```tsx
import { moderateScale } from 'react-native-size-matters';

const styles = {
  fontSize: moderateScale(16),
  padding: moderateScale(20, 0.3),
};
```

O fator de moderação permite encontrar um equilíbrio entre adaptação e preservação das proporções originais do design.

### 4. `ScaledSheet` — Simplificação da criação de estilos

A biblioteca também disponibiliza o `ScaledSheet.create()`, uma alternativa ao `StyleSheet.create()` que permite aplicar escalonamento diretamente nos valores dos estilos por meio de sufixos.

| Sufixo | Função correspondente |
|---|---|
| `@s` | `scale()` |
| `@vs` | `verticalScale()` |
| `@ms` | `moderateScale()` |
| `@ms0.3` | `moderateScale()` com fator personalizado de 0.3 |

Exemplo:

```tsx
import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    width: '300@s',
    height: '200@vs',
    padding: '16@ms',
    borderWidth: 1,
  },
  title: {
    fontSize: '24@ms0.3',
  },
});
```

Com esse recurso, é possível centralizar os estilos responsivos e reduzir a necessidade de escrever chamadas individuais de escalonamento em diferentes componentes.

## 📐 Dimensions e leitura das dimensões da tela

A adaptação de interfaces depende também da identificação das dimensões disponíveis em cada dispositivo.

A apresentação aborda o uso do hook **`useWindowDimensions`**, disponibilizado pelo React Native, que permite acompanhar a largura e a altura da janela em tempo real.

```tsx
import { useWindowDimensions } from 'react-native';

const { width, height } = useWindowDimensions();

const isMobile = width < 768;
```

Com essas informações, é possível estabelecer breakpoints e modificar a organização dos componentes de acordo com o espaço disponível.

**Principais aplicações:**
- Identificação de diferentes larguras e alturas de tela.
- Criação de breakpoints para layouts mobile e desktop.
- Adaptação dinâmica quando a janela do navegador é redimensionada.
- Identificação de mudanças de orientação entre Portrait e Landscape.
- Combinação das dimensões da tela com as funções de escalonamento da biblioteca.

O conteúdo também destaca que layouts responsivos não dependem apenas do escalonamento: conhecer as dimensões disponíveis permite definir limites e comportamentos específicos para cada cenário.

## 🖥️ Platform — Identificação do ambiente de execução

A API `Platform` do React Native permite identificar a plataforma na qual a aplicação está sendo executada por meio da propriedade `Platform.OS`.

Entre os ambientes abordados na apresentação estão:

- `ios` — dispositivos Apple com iOS.
- `android` — dispositivos Android.
- `web` — aplicações executadas em navegadores.
- `macos` — aplicações para macOS.

Exemplo:

```tsx
import { Platform } from 'react-native';

const isDesktop =
  Platform.OS === 'web' ||
  Platform.OS === 'macos';
```

A identificação da plataforma permite estabelecer regras específicas para cada ambiente, considerando que uma interface projetada para smartphones pode exigir adaptações quando executada em monitores maiores.

### Integração entre Platform, Dimensions e Size Matters

Um dos principais conceitos apresentados é a utilização conjunta dessas ferramentas.

Enquanto `Platform.OS` identifica o ambiente de execução, `useWindowDimensions` fornece as dimensões disponíveis e `react-native-size-matters` realiza os cálculos de escalonamento.

Essa combinação permite construir estratégias de adaptação mais completas:

1. Identificar a plataforma por meio de `Platform.OS`.
2. Consultar a largura e a altura disponíveis com `useWindowDimensions`.
3. Aplicar `scale()`, `verticalScale()` e `moderateScale()` conforme a necessidade.
4. Estabelecer limites de largura, como `max-width`, para evitar crescimento excessivo em monitores desktop.

## ⚖️ Escalonamento e proporções de layout

A apresentação também aborda a diferença entre utilizar porcentagens e funções de escalonamento.

Embora valores percentuais sejam úteis para ocupar espaços disponíveis, eles podem resultar em elementos excessivamente largos em telas maiores.

O uso de `scale()` permite manter uma relação proporcional com as dimensões do design de referência, enquanto outras restrições de layout podem ser utilizadas para preservar a composição visual.

Um exemplo importante é a utilização de `max-width` em aplicações Web/Desktop, evitando que componentes aumentem indefinidamente em monitores de alta resolução.

## 🔄 Orientação de tela: Portrait e Landscape

A mudança de orientação de um dispositivo altera as dimensões disponíveis para a aplicação.

A apresentação demonstra como a rotação de um smartphone modifica a relação entre largura e altura e destaca a importância de atualizar os estilos responsivos conforme essas dimensões mudam.

Nesse cenário, a combinação de `useWindowDimensions` com as funções de escalonamento permite adaptar o layout às novas condições de exibição.

## ⚡ Performance e organização de estilos

Outro aspecto abordado é a importância de organizar os cálculos de escalonamento para evitar operações repetidas desnecessariamente durante a renderização dos componentes.

O `ScaledSheet` é apresentado como uma alternativa para centralizar a definição dos estilos responsivos, reduzindo a repetição de chamadas de escalonamento diretamente no JSX.

A apresentação também destaca a importância dessa organização em cenários com listas extensas, animações e componentes que passam por renderizações frequentes.

## ♿ Acessibilidade e adaptação tipográfica

Interfaces responsivas também precisam considerar as necessidades de acessibilidade dos usuários.

A apresentação explora os problemas que podem ocorrer quando o usuário aumenta o tamanho das fontes nas configurações do sistema, principalmente em componentes que possuem alturas fixas.

Entre as boas práticas destacadas estão:

- Utilizar `moderateScale()` para controlar o crescimento da tipografia.
- Evitar dimensões rígidas em componentes que possuem textos.
- Preferir `padding` em vez de alturas fixas sempre que apropriado.
- Garantir espaço suficiente para textos maiores, evitando cortes e sobreposições.

## ✅ Boas práticas apresentadas

| Cenário | Recomendação |
|---|---|
| Larguras e margens horizontais | Utilizar `scale()` |
| Alturas e espaçamentos verticais | Utilizar `verticalScale()` |
| Tipografia e elementos que exigem crescimento controlado | Utilizar `moderateScale()` |
| Organização dos estilos responsivos | Utilizar `ScaledSheet` |
| Identificação do ambiente | Utilizar `Platform.OS` |
| Leitura das dimensões da janela | Utilizar `useWindowDimensions` |
| Aplicações Web/Desktop | Estabelecer limites com `max-width` |
| Acessibilidade | Evitar alturas fixas em componentes com textos |

## 📚 Considerações finais

A biblioteca `react-native-size-matters` oferece recursos para simplificar o escalonamento de interfaces no React Native, permitindo adaptar dimensões e elementos visuais com base em uma referência de design.

Entretanto, a construção de uma interface verdadeiramente responsiva exige mais do que apenas aplicar funções de escalonamento. É necessário considerar o ambiente de execução, as dimensões disponíveis, a orientação da tela e as necessidades de acessibilidade.

A combinação entre `react-native-size-matters`, `Platform` e `useWindowDimensions` permite desenvolver estratégias de responsividade mais completas, contribuindo para interfaces adaptáveis e visualmente consistentes em diferentes dispositivos.

---

**Projeto educacional — apresentação técnica sobre responsividade, escalonamento de interfaces e recursos do React Native.**