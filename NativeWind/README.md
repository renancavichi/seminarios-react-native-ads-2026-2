# NativeWind — Tailwind para React Native

## Introdução

O **NativeWind** é uma biblioteca de estilização que une os conceitos do Tailwind CSS ao React Native. Ela permite criar interfaces mobile nativas e multiplataforma de forma rápida, utilizando a propriedade `className` para aplicar estilos aos componentes.

O NativeWind não executa simplesmente o Tailwind CSS dentro do React Native. Ele adapta a experiência e os conceitos das classes utilitárias para o ambiente do React Native.

## Como funciona?

O React Native não utiliza o CSS da web para renderizar layouts. Tradicionalmente, os estilos são escritos em JavaScript por meio de objetos com o `StyleSheet`.

O Tailwind apresenta uma abordagem alternativa: utilizar classes curtas e predefinidas, como `flex-1` e `bg-blue-500`, diretamente nos componentes.

Com o NativeWind, o fluxo é:

1. O desenvolvedor escreve as classes na propriedade `className`.
2. O NativeWind interpreta o código e converte as classes em estilos compatíveis com o React Native.
3. O componente aparece estilizado na interface do aplicativo.

## Tailwind CSS x NativeWind

| Tailwind CSS | NativeWind |
|---|---|
| Desenvolvimento web | Desenvolvimento mobile |
| HTML | Componentes React Native |
| CSS | Estilos do React Native |
| `class` | `className` |
| Classes utilitárias | Classes utilitárias |

As ferramentas compartilham a ideia de estilização por classes, mas são destinadas a ambientes diferentes.

## Vantagens

- **Desenvolvimento mais rápido:** aplicação de estilos diretamente nos componentes.
- **Classes utilitárias:** uso de classes curtas e predefinidas.
- **Adaptado ao React Native:** abordagem pensada para o ambiente mobile.
- **Padronização visual:** facilita manter consistência entre telas e componentes.
- **Reutilização de estilos:** permite reaproveitar classes em diferentes partes do aplicativo.
- **Familiaridade com Tailwind:** facilita para quem já conhece Tailwind CSS.

## Desvantagens

- **Aprendizado das classes:** é necessário conhecer as classes disponíveis e suas funções.
- **`className` muito grande:** muitos estilos podem deixar a propriedade extensa.
- **Configuração inicial:** é necessário preparar o projeto para utilizar a biblioteca.
- **Leitura de componentes complexos:** o excesso de classes pode dificultar a leitura do código.
- **Diferenças em relação ao CSS:** nem todo conceito do CSS existe no React Native.
- **Conhecimento de React Native:** o NativeWind não substitui o conhecimento da plataforma.

## Instalação

Os comandos apresentados no seminário consideram que um projeto Expo já foi criado.

### 1. Instalar as dependências

```bash
npm install nativewind react-native-reanimated react-native-safe-area-context
```

### 2. Instalar as dependências de desenvolvimento

```bash
npm install --save-dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 babel-preset-expo
```

### 3. Criar o arquivo de configuração do Tailwind

```bash
npx tailwindcss init
```

Esse comando cria o arquivo `tailwind.config.js`. Nele, a configuração `content` indica ao Tailwind onde procurar as classes utilizadas no projeto.

## Arquivos de configuração

Além da instalação, o seminário apresenta a criação e configuração dos seguintes arquivos:

| Arquivo | Função apresentada |
|---|---|
| `tailwind.config.js` | Configura o Tailwind e indica, pela propriedade `content`, onde procurar as classes. |
| `global.css` | Arquivo CSS global criado na raiz do projeto. |
| `babel.config.js` | Configura o processamento das classes `className` pelo NativeWind. |
| `metro.config.js` | Integra o NativeWind ao Metro, bundler utilizado pelo React Native/Expo, por meio de `withNativeWind`. |
| `app.json` | Recebe a configuração do bundler Metro para a plataforma web. |
| `nativewind-env.d.ts` | Declara os tipos do NativeWind para o TypeScript. |

### Configurações adicionais mencionadas

No `app.json`, o seminário orienta adicionar a configuração:

```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

No arquivo `nativewind-env.d.ts`, adicionar:

```ts
/// <reference types="nativewind/types" />
```

O seminário também orienta importar o arquivo `global.css` no arquivo principal do projeto.

> **Observação:** os slides apresentam os arquivos `tailwind.config.js`, `global.css`, `babel.config.js` e `metro.config.js`, mas o conteúdo completo desses arquivos não está disponível no texto extraído do PDF. Por isso, este README descreve suas funções sem inventar configurações que não aparecem no material.

## Demonstração prática

O seminário inclui uma demonstração de componentes estilizados com NativeWind e uma comparação com a abordagem CSS. A ideia é observar como a estilização por classes pode deixar a aplicação de estilos mais direta no código.

## Quando escolher NativeWind?

De acordo com a conclusão do seminário, escolha NativeWind quando você:

- Busca maior velocidade no desenvolvimento;
- Deseja reaproveitar conhecimentos de Tailwind CSS adquiridos no desenvolvimento web;
- Precisa criar aplicativos multiplataforma;
- Procura escrever um código mais limpo e produtivo.

## Conclusão

O NativeWind oferece uma forma prática de estilizar aplicações React Native utilizando classes utilitárias inspiradas no Tailwind CSS. Ele pode acelerar o desenvolvimento, facilitar a padronização visual e aproveitar conhecimentos já adquiridos no desenvolvimento web.

Apesar das vantagens, é importante considerar a configuração inicial, aprender as classes e evitar o excesso de estilos em uma única propriedade `className`.

**Em resumo:** o NativeWind é uma alternativa para desenvolver interfaces mobile de maneira mais rápida e produtiva, especialmente para quem já está familiarizado com Tailwind CSS.
