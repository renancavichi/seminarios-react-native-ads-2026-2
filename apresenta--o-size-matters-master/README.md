# 📱 React Native Size Matters — Responsividade em Aplicações Híbridas

## 📖 Sobre o projeto

Este projeto apresenta os principais recursos da biblioteca **[react-native-size-matters](https://github.com/nirsky/react-native-size-matters)**, explorando sua aplicação na construção de interfaces responsivas com React Native.

A apresentação aborda os desafios de adaptar dimensões, espaçamentos e tipografia para diferentes dispositivos, demonstrando como combinar as funções de escalonamento da biblioteca com recursos nativos do React Native, como `Platform` e `useWindowDimensions`.

O conteúdo também explora limitações do escalonamento proporcional, diferenças entre estratégias de responsividade e boas práticas relacionadas à performance, acessibilidade e desenvolvimento de aplicações híbridas.

---

## 1. 🎯 Que problema a biblioteca resolve?

Um dos principais desafios no desenvolvimento de aplicações multiplataforma é garantir que uma interface mantenha proporções e uma boa experiência visual em dispositivos com dimensões diferentes.

No React Native, os valores de layout são definidos em **Density-independent Pixels (dp)**, que permitem manter dimensões físicas consistentes entre telas com diferentes densidades de pixels.

Entretanto, isso não significa que um componente ocupará a mesma proporção da tela em todos os dispositivos.

Por exemplo, um elemento com `width: 300` pode ocupar aproximadamente 80% da largura de um smartphone de 375dp, mas menos da metade de um tablet de 768dp.

É nesse cenário que entra a biblioteca `react-native-size-matters`.

Ela utiliza uma referência de design para calcular proporcionalmente as dimensões dos elementos, permitindo que larguras, alturas e espaçamentos sejam adaptados de acordo com o tamanho da tela atual.

**O principal objetivo é reduzir a necessidade de ajustes manuais para cada dimensão de dispositivo, facilitando a criação de interfaces com proporções mais consistentes.**

## 2. 🛠️ Quais são os principais recursos?

A biblioteca disponibiliza três funções principais de escalonamento, além de uma alternativa para organizar estilos responsivos.

### `scale()` — Escalonamento horizontal

Realiza o escalonamento proporcional considerando a largura da tela.

É especialmente indicada para dimensões e espaçamentos horizontais.

**Principais aplicações:**
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

### `verticalScale()` — Escalonamento vertical

Realiza o escalonamento considerando a altura da tela.

É indicada para dimensões e espaçamentos que dependem do espaço vertical disponível.

**Principais aplicações:**
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

### `moderateScale()` — Escalonamento moderado

Permite controlar a intensidade do escalonamento, aplicando apenas uma fração do crescimento proporcional.

É especialmente útil para tipografia e elementos que não devem aumentar excessivamente em telas maiores.

Seu fator de moderação padrão é `0.5`, mas pode ser personalizado.

```tsx
import { moderateScale } from 'react-native-size-matters';

const styles = {
  fontSize: moderateScale(16),
  padding: moderateScale(20, 0.3),
};
```

O fator de moderação ajuda a preservar a harmonia visual, evitando que elementos como fontes e ícones cresçam excessivamente em tablets.

### `ScaledSheet` — Organização de estilos responsivos

O `ScaledSheet.create()` permite aplicar as funções de escalonamento diretamente na declaração dos estilos, utilizando sufixos específicos.

| Sufixo | Função correspondente |
|---|---|
| `@s` | `scale()` |
| `@vs` | `verticalScale()` |
| `@ms` | `moderateScale()` |
| `@ms0.3` | `moderateScale()` com fator personalizado de 0.3 |

**Exemplo:**

```tsx
import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    width: '300@s',
    height: '200@vs',
    padding: '16@ms',
  },
  title: {
    fontSize: '24@ms0.3',
  },
});
```

Esse recurso facilita a manutenção dos estilos e evita a necessidade de escrever chamadas individuais de escalonamento para cada propriedade.

### Integração com recursos nativos do React Native

Além das funções da biblioteca, a apresentação demonstra como utilizar duas ferramentas nativas para complementar a estratégia de responsividade.

**`Platform.OS` — Identificação da plataforma**

Permite identificar o ambiente de execução da aplicação e aplicar comportamentos específicos para cada plataforma.

```tsx
import { Platform } from 'react-native';

const isDesktop =
  Platform.OS === 'web' ||
  Platform.OS === 'macos';
```

Entre as plataformas demonstradas estão `ios`, `android`, `web` e `macos`.

**`useWindowDimensions()` — Leitura das dimensões da tela**

É um hook que fornece a largura e a altura atuais da janela, atualizando seus valores quando as dimensões disponíveis mudam.

```tsx
import { useWindowDimensions } from 'react-native';

const { width, height } = useWindowDimensions();

const isMobile = width < 768;
```

Com essas informações, é possível estabelecer breakpoints e alterar a organização do layout conforme o espaço disponível.

A combinação dos três recursos permite desenvolver uma estratégia mais completa:

1. `Platform.OS` identifica onde a aplicação está sendo executada.
2. `useWindowDimensions()` identifica o espaço disponível.
3. `react-native-size-matters` adapta proporcionalmente as dimensões dos componentes.

## 3. ⚠️ A biblioteca possui alguma limitação?

Apesar de facilitar o escalonamento de interfaces, `react-native-size-matters` não é uma solução completa para todos os cenários de responsividade.

A apresentação destaca algumas situações que exigem atenção.

### Adaptação para Web/Desktop

A biblioteca foi concebida principalmente pensando em dimensões de dispositivos móveis. Em telas desktop muito largas, o escalonamento proporcional pode produzir elementos excessivamente grandes.

Por exemplo, uma resolução de 1920px pode resultar em um fator de escalonamento muito superior ao esperado para um design originalmente desenvolvido para smartphones.

**Solução apresentada:** combinar a biblioteca com `useWindowDimensions()`, identificação de plataforma e limites de largura, como `max-width`.

### Mudanças na orientação da tela

Quando um dispositivo alterna entre Portrait e Landscape, suas dimensões disponíveis são modificadas.

Estilos calculados estaticamente fora do componente podem não acompanhar essas mudanças automaticamente.

**Solução apresentada:** reconstruir os estilos quando necessário ou utilizar hooks que permitam atualizar a renderização conforme as dimensões da tela mudam.

### Acessibilidade e aumento de fontes

O escalonamento proporcional não garante, sozinho, uma boa experiência para usuários que aumentam o tamanho das fontes nas configurações do sistema.

O uso de dimensões fixas em botões e outros componentes pode causar cortes, sobreposições e problemas de leitura.

**Solução apresentada:** utilizar `moderateScale()` quando apropriado, evitar alturas rígidas em componentes com textos e preferir estruturas flexíveis utilizando `padding`.

### Crescimento excessivo de elementos

Aplicar `scale()` indiscriminadamente pode fazer com que fontes, ícones e componentes cresçam mais do que o necessário.

**Solução apresentada:** escolher a função de escalonamento adequada para cada propriedade e utilizar o fator de moderação de `moderateScale()` quando for necessário controlar esse crescimento.

### Necessidade de estratégias complementares

A biblioteca não substitui a necessidade de identificar plataformas, estabelecer breakpoints e definir limites para os componentes.

Para aplicações híbridas, é importante combinar o escalonamento com ferramentas nativas do React Native e regras específicas de layout.

## 4. ⚖️ Quais são as diferenças entre recursos similares?

A apresentação também compara diferentes estratégias e ferramentas utilizadas para construir interfaces responsivas.

### `scale()` vs `verticalScale()` vs `moderateScale()`

Embora as três funções tenham o objetivo de adaptar dimensões, cada uma utiliza uma estratégia diferente.

| Recurso | Característica | Principal aplicação |
|---|---|---|
| `scale()` | Escalonamento proporcional à largura | Larguras e margens horizontais |
| `verticalScale()` | Escalonamento proporcional à altura | Alturas e margens verticais |
| `moderateScale()` | Crescimento proporcional controlado | Tipografia e elementos que exigem moderação |

A principal diferença está na intensidade e na direção do escalonamento.

Enquanto `scale()` e `verticalScale()` acompanham diretamente suas respectivas dimensões de referência, `moderateScale()` permite controlar quanto do crescimento proporcional será aplicado.

### `ScaledSheet` vs `StyleSheet`

Ambos permitem organizar estilos no React Native, mas apresentam diferenças na forma de declarar as propriedades.

| Característica | StyleSheet | ScaledSheet |
|---|---|---|
| Definição de estilos | Valores convencionais | Valores convencionais e sufixos de escalonamento |
| Funções responsivas | Chamadas separadas | Sufixos como `@s`, `@vs` e `@ms` |
| Organização | Centralização de estilos | Centralização com escalonamento integrado |
| Objetivo | Organização dos estilos | Simplificação dos estilos responsivos |

O `ScaledSheet` é especialmente interessante quando existem muitas propriedades que precisam utilizar diferentes estratégias de escalonamento.

### Escalonamento vs porcentagens

Uma alternativa comum para adaptar layouts é utilizar valores percentuais, como `width: '80%'`.

Entretanto, o comportamento percentual acompanha o espaço disponível no elemento pai, podendo resultar em componentes excessivamente largos em telas maiores.

Já o `scale()` utiliza uma referência de design para calcular as dimensões proporcionais.

| Característica | Porcentagens | `scale()` |
|---|---|---|
| Referência | Espaço disponível no elemento pai | Dimensão de referência do design |
| Comportamento | Ocupa uma proporção do espaço | Calcula uma dimensão escalonada |
| Principal vantagem | Flexibilidade na ocupação do espaço | Consistência com as proporções do design |
| Atenção necessária | Pode exigir limites de largura | Pode crescer excessivamente em telas grandes |

As duas abordagens podem ser utilizadas em conjunto, conforme as necessidades do layout.

### `Platform.OS` vs `useWindowDimensions()`

Embora sejam complementares, esses recursos possuem finalidades diferentes.

| Característica | `Platform.OS` | `useWindowDimensions()` |
|---|---|---|
| Finalidade | Identificar a plataforma | Identificar as dimensões disponíveis |
| Retorno | Identificador do sistema | Largura e altura da janela |
| Identifica Web/Desktop? | Sim, por meio do sistema | Não diretamente |
| Acompanha redimensionamento? | Não é sua finalidade | Sim |
| Principal utilização | Regras específicas por plataforma | Breakpoints e adaptação do layout |

Saber que uma aplicação está sendo executada na Web não significa necessariamente que ela esteja em um desktop. Ela também pode estar aberta em um navegador de smartphone.

Por isso, identificar a plataforma e consultar as dimensões disponíveis são etapas diferentes e complementares.

### React Native Size Matters vs bibliotecas de componentes e Tailwind

Outra diferença importante está na finalidade de cada ferramenta.

- **React Native Size Matters:** concentra-se no escalonamento de dimensões e na adaptação proporcional de elementos, sendo especialmente útil para interfaces personalizadas.
- **Bibliotecas de componentes UI:** oferecem componentes previamente desenvolvidos, como botões, campos de formulário e outros elementos de interface.
- **Tailwind CSS:** utiliza classes utilitárias de estilização, sendo uma alternativa voltada ao desenvolvimento Web.

Na comparação apresentada, o Size Matters se destaca pela simplicidade de utilização em aplicações mobile nativas e pela possibilidade de trabalhar com designs personalizados. Já o Tailwind CSS possui suporte direto ao ambiente Web, enquanto o Size Matters exige cuidados adicionais, como limites de largura, em aplicações desktop.

## 5. ✅ Boas práticas e recomendações

Com base nos conceitos apresentados, algumas recomendações ajudam a aproveitar melhor os recursos da biblioteca:

| Cenário | Recomendação |
|---|---|
| Larguras e margens horizontais | Utilizar `scale()` |
| Alturas e espaçamentos verticais | Utilizar `verticalScale()` |
| Tipografia e elementos com crescimento controlado | Utilizar `moderateScale()` |
| Organização dos estilos | Utilizar `ScaledSheet` |
| Identificação da plataforma | Utilizar `Platform.OS` |
| Identificação das dimensões da janela | Utilizar `useWindowDimensions()` |
| Interfaces Web/Desktop | Estabelecer limites com `max-width` |
| Acessibilidade | Evitar alturas fixas em componentes com textos |
| Mudanças de orientação | Garantir a atualização dos estilos responsivos |

## 📚 Considerações finais

A biblioteca `react-native-size-matters` simplifica o processo de adaptação proporcional de interfaces, oferecendo diferentes estratégias para escalonar dimensões, espaçamentos e tipografia.

Entretanto, seu uso deve considerar as características de cada dispositivo e ambiente de execução. Recursos como `Platform.OS` e `useWindowDimensions()` complementam suas funcionalidades, permitindo desenvolver layouts que respondam não apenas ao tamanho da tela, mas também às particularidades de cada plataforma.

A principal conclusão é que **responsividade não significa apenas aumentar ou diminuir elementos proporcionalmente**, mas encontrar um equilíbrio entre escalonamento, organização do layout, acessibilidade e consistência visual.

---

**Projeto educacional — apresentação técnica sobre React Native Size Matters e estratégias de responsividade em aplicações híbridas.**