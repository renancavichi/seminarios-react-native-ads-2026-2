# React Native Gifted Charts

## Introdução

O **React Native Gifted Charts** é uma biblioteca de visualização de dados para React Native. Ela permite criar interfaces mobile com gráficos interativos e altamente customizáveis de forma rápida, utilizando componentes nativos e SVG para a renderização.

*(Apresentação original por Leticia Pacheco Cabral)*

## Como funciona?

O React Native por padrão não possui componentes visuais complexos para gráficos. Tradicionalmente, os desenvolvedores precisam construir gráficos do zero usando SVG ou depender de bibliotecas externas complexas.

O Gifted Charts apresenta uma abordagem simplificada: fornecer componentes prontos (como `<BarChart />`, `<LineChart />`, etc.) que recebem um array de objetos contendo os dados a serem exibidos.

O fluxo básico é:

1. O desenvolvedor importa o componente de gráfico desejado.
2. Cria-se um array de dados (ex: `[{value: 15}, {value: 30}]`).
3. O componente é renderizado na interface, desenhando o gráfico automaticamente.

## Tipos de Gráfico Disponíveis

A biblioteca oferece uma grande variedade de gráficos para diferentes casos de uso, divididos em categorias:

| Categoria | Tipos de Gráficos Suportados |
|---|---|
| **Barras e Velas** | Bar Chart, Horizontal Bar, Stacked Bar, Candle Stick |
| **Linhas e Áreas** | Line Chart, Area Chart, Bubble Chart |
| **Circulares e Radiais** | Pie Chart, Donut Chart, Radar Chart |
| **Distribuição** | Population Pyramid |

## Limitações

Apesar de ser uma ferramenta poderosa e de fácil uso, o Gifted Charts possui algumas limitações importantes a serem consideradas no seu projeto:

- **Performance:** Pode apresentar quedas de desempenho ao lidar com uma quantidade muito massiva de dados simultâneos.
- **Interações avançadas:** Falta de suporte nativo para gestos e animações muito complexas ou personalizadas.
- **Gráficos nichados:** Pode não atender a requisitos de visualizações de dados extremamente específicas ou fora dos padrões comuns (ex: gráficos 3D).

## Instalação

A biblioteca exige a instalação conjunta do `react-native-svg` para lidar com as renderizações vetoriais.

### Instalar as dependências

Em um projeto Expo, execute o seguinte comando:

```bash
npx expo install react-native-gifted-charts react-native-svg
```

## Demonstração prática

Abaixo, um exemplo simples de como implementar um Gráfico de Barras e um Gráfico de Linhas usando a biblioteca:

### Exemplo Simples (Bar Chart)

```tsx
import { BarChart } from "react-native-gifted-charts";

const App = () => {
  const barData = [
    { value: 15 }, 
    { value: 30 }, 
    { value: 26 }, 
    { value: 40 }
  ];
  
  return <BarChart data={barData} />;
};
```

### Exemplo com Customização (Line Chart / Area Chart)

```tsx
import { LineChart } from "react-native-gifted-charts";

const App = () => {
  const data = [
    { value: 15 }, 
    { value: 30 }, 
    { value: 26 }, 
    { value: 40 }
  ];

  return (
    <LineChart
      areaChart
      data={data}
      startFillColor="rgb(46, 217, 255)"
      startOpacity={0.8}
      endFillColor="rgb(203, 241, 250)"
      endOpacity={0.3}
    />
  );
};
```

## Conclusão

O **React Native Gifted Charts** oferece uma forma prática e direta de implementar visualizações de dados em aplicações mobile. Ele acelera o desenvolvimento de dashboards e telas analíticas, exigindo pouco código para gerar gráficos visualmente atraentes.

Apesar de suas limitações com performance extrema e interações avançadas, é uma das ferramentas mais completas do ecossistema React Native para a grande maioria dos casos de uso convencionais.