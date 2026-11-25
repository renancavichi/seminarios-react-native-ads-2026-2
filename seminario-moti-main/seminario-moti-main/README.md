Autor: Kauan Edson Leonel Lira

# Moti: animações declarativas no React Native

[Moti](https://moti.fyi/) é uma biblioteca de animações para React Native e web que usa o Reanimated como base. Sua API declarativa permite descrever os valores visuais de início e destino de um componente; a biblioteca cuida da transição entre eles. Assim, a lógica React continua responsável pelo estado da aplicação, enquanto Moti anima sua representação visual.

Criado por Fernando Rojo, Moti foi inspirado por ferramentas como Framer Motion, React Spring, React Native Animatable e CSS. Uma [proposta de 2020](https://github.com/nandorojo/dripsy/issues/46) apresenta a ideia de uma API de animação compartilhada entre plataformas.

## Instalação no Expo SDK 54

Os exemplos deste material usam Moti 0.30.0 em um projeto **Expo SDK 54 já criado**. No diretório desse aplicativo, instale as dependências:

```sh
npx expo install react-native-reanimated react-native-worklets
npm install moti@0.30.0 --legacy-peer-deps
npx expo start --clear
```

O `expo install` seleciona as versões indicadas para o SDK do projeto. A opção `--legacy-peer-deps` altera a resolução de dependências pares do npm, mas não garante que versões incompatíveis funcionarão juntas. No SDK 54, o `babel-preset-expo` configura o plugin necessário para Reanimated; consulte a [documentação do Expo para essa versão](https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/) antes de adaptar a instalação a outro ambiente.

## Primeira animação

Os componentes `MotiView` e `MotiText` aceitam propriedades de animação junto aos estilos comuns do React Native:

```jsx
import { MotiView } from 'moti';

<MotiView
  from={{ opacity: 0, scale: 0.55, translateY: 35 }}
  animate={{ opacity: 1, scale: 1, translateY: 0 }}
  transition={{ type: 'timing', duration: 1200 }}
  style={{ width: 125, height: 125, backgroundColor: '#d8bb7d' }}
/>
```

- `from` define os valores iniciais quando o componente é montado.
- `animate` define os valores de destino: aqui o bloco aparece, cresce e sobe até a posição original.
- `transition` determina como a mudança acontece. Neste caso, `timing` usa uma duração de 1.200 milissegundos.
- `style` continua sendo usado para a aparência estática do componente.

A entrada não recomeça automaticamente em toda renderização. No laboratório, mudar a `key` monta uma nova instância para repetir o efeito.

## Animar mudanças de estado

O destino também pode depender do estado React. Quando `selected` muda, o mesmo componente transita para os novos valores:

```jsx
const [selected, setSelected] = useState(false);

<MotiView
  animate={{
    translateX: selected ? 45 : -45,
    scale: selected ? 1.2 : 1,
    backgroundColor: selected ? '#62dec0' : '#d8bb7d',
  }}
  transition={{ type: 'spring', damping: 12, stiffness: 110 }}
/>
```

Esse padrão pode destacar uma seleção ou mover um painel. Para experimentar, importe `useState` de `react` e altere `selected` por meio de um controle, como um botão.

## Transições, atraso e repetição

- **`timing`** usa uma duração configurada em milissegundos, por exemplo `transition={{ type: 'timing', duration: 1200 }}`.
- **`spring`** usa uma dinâmica de mola. Parâmetros como `damping` (amortecimento) e `stiffness` (rigidez) mudam o comportamento do movimento.
- **`delay`** adia o início da animação. Um atraso calculado a partir do índice de cada elemento pode criar entradas escalonadas.
- **`loop`** repete a animação continuamente. Em um giro, `repeatReverse: false` permite reiniciar o ciclo sem percorrer o caminho de volta.

`duration` descreve quanto tempo uma transição `timing` leva; `delay` descreve quanto tempo ela espera antes de começar. O comportamento de uma mola depende de seus parâmetros e não precisa necessariamente ultrapassar o destino.

## Sequências e saída de componentes

Uma propriedade pode receber uma sequência de valores intermediários. Por exemplo, `animate={{ scale: [0.75, 1.08, 1] }}` faz o elemento passar por tamanhos diferentes até chegar à escala final.

Para animar a remoção, combine `exit` com `AnimatePresence`:

```jsx
import { AnimatePresence, MotiView } from 'moti';

<AnimatePresence>
  {visible && (
    <MotiView
      key="bloco"
      from={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: 'timing', duration: 900 }}
    />
  )}
</AnimatePresence>
```

Quando `visible` passa a ser falso, `AnimatePresence` mantém o filho presente durante a animação definida em `exit`, antes de concluir sua remoção. A `key` identifica o elemento.

## Transformações e conclusão

Deslocamento, escala e rotações podem ser combinados para criar movimentos mais expressivos. No jogo de exemplo, `rotateX`, `rotateY`, `rotateZ` e `perspective` ajudam a dar aparência de profundidade às cartas; a ordem das transformações, as faces e `backfaceVisibility` também influenciam o resultado.

O callback `onDidAnimate` permite reagir à conclusão de uma propriedade animada. Como uma cena pode animar várias propriedades, a aplicação deve verificar qual terminou, se foi concluída e qual era o destino antes de avançar sua lógica.

Considere também a preferência de **movimento reduzido**: uma alternativa com menos animação ou resultado imediato pode preservar a informação e os controles para quem precisa dela. Teste efeitos com muitas camadas em dispositivos reais para avaliar desempenho e legibilidade.

## Quando usar Moti

Moti mantém início, destino e transição próximos do componente, facilitando animações de entrada, seleção e saída. Em contrapartida, acrescenta dependências ao projeto e exige atenção à compatibilidade entre versões.

| Ferramenta | Abordagem e exemplo de uso |
| --- | --- |
| **Moti** | Props declarativas sobre Reanimated; útil para transições de estado e presença. |
| **Reanimated** | Shared values e estilos animados; útil para gestos e controle mais detalhado. |
| **Animated do React Native** | API integrada para compor animações; o native driver atende às propriedades suportadas. |
| **Lottie** | Reprodução de arquivos de animação preparados previamente, como ilustrações e loaders. |

## Exemplos deste material

O [laboratório](project-snapshot/src/seminar/MotiLab.js) reúne exemplos de entrada, estado, `timing` e `spring`, e saída. O jogo de pedra, papel e tesoura combina esses conceitos em cartas, efeitos de batalha e preferências de movimento. Seus trechos estão em [project-snapshot/components/game](project-snapshot/components/game) e [project-snapshot/src/game](project-snapshot/src/game).

Para consultar os slides e executar as demonstrações incluídas nesta pasta, use Node.js:

```sh
node build.cjs
node serve.cjs
```

Abra a URL exibida no terminal. Os slides e exemplos locais funcionam sem internet; links externos exigem conexão. O [repositório do jogo](https://github.com/KauanLeonel/Rock-Paper-Scissors) contém o projeto de origem.

## Referências

- [Documentação do Moti](https://moti.fyi/) e [guia de animações](https://moti.fyi/animations)
- [Reanimated no Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)
