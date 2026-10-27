// Falas sugeridas para o apresentador. Não são textos projetados nos slides.
module.exports = {
  comparacao: {
    speech: [
      'Antes de apresentar a biblioteca, quero mostrar duas versões do mesmo jogo de pedra, papel e tesoura. Na primeira, escolhemos uma opção, apertamos o botão e recebemos o resultado. Na segunda, a carta se desloca até o campo, aumenta, gira e participa de uma sequência de batalha.',
      'A regra do jogo continua a mesma. O que muda é a forma como a interface apresenta a escolha e o resultado. React Native também oferece recursos de animação; a primeira versão foi mantida simples para tornar essa diferença visível. Na segunda, usamos Moti para descrever os movimentos. Ao longo da apresentação, vamos entender como escrever essas animações.'
    ],
    demonstration: 'Abra a versão básica, ative o modo seminário, escolha pedra e jogue uma vez. Repita na versão Moti. Mostre a carta saindo da mão e a ampliação durante a batalha. Limite a comparação a uma rodada em cada versão.',
    transition: 'Agora que vimos o efeito na interface, vamos conhecer a biblioteca que usamos para construí-lo.'
  },
  abertura: {
    speech: [
      'O tema deste seminário é Moti. Vamos ver o que a biblioteca faz, de onde veio, como instalar e como usar suas principais propriedades. Os exemplos executam código real do projeto. Primeiro observaremos os movimentos; depois vamos relacionar cada efeito ao trecho responsável por ele.'
    ],
    demonstration: 'Apresente o tema e avance para a definição da biblioteca.',
    transition: 'Para começar, o que significa dizer que Moti é uma biblioteca declarativa de animação?'
  },
  biblioteca: {
    speech: [
      'Moti é uma biblioteca de animação para React Native. Sua API é declarativa: descrevemos os valores visuais que queremos, em vez de programar manualmente cada quadro do movimento. Por exemplo, podemos dizer que um componente deve chegar à opacidade um e à escala um.',
      'Neste diagrama, React organiza o estado da interface. Moti recebe os estilos de destino e as configurações da transição. Reanimated é a base usada para executar as animações. Assim, Moti não calcula quem venceu a rodada nem cria as imagens das cartas. Ele anima a apresentação dos valores que a aplicação definiu. Ao lado estão as dependências reais deste projeto; a combinação demonstrada usa Expo SDK 54.'
    ],
    demonstration: 'Aponte o fluxo React → Moti → Reanimated. Mostre no package.json a dependência moti e sua base de animação.',
    transition: 'Essa separação ajuda a entender também a motivação de quem criou Moti.'
  },
  historia: {
    speech: [
      'Moti foi criado por Fernando Rojo. A motivação era conseguir descrever animações para interfaces nativas e web com uma API mais simples e compartilhada. Em 16 de outubro de 2020, ele publicou no projeto Dripsy uma proposta de biblioteca universal de animação. Essa data é da proposta, não uma data de lançamento do Moti.',
      'Na proposta, a ideia era usar Reanimated 2 e permitir que os componentes recebessem valores visuais para fazer suas transições. O autor cita influências de Framer Motion, React Spring, React Native Animatable e CSS. A integração de AnimatePresence também contou com ajuda de Matt Perry. O ponto central dessa história é aproximar a animação da escrita do componente: passar objetos de estilo e deixar a biblioteca realizar a transição.'
    ],
    demonstration: 'Percorra os três marcos. Os links de fonte original permitem conferir a proposta e o relato do autor.',
    transition: 'Vamos observar alguns movimentos antes de entrar nos detalhes do código.'
  },
  demonstracoes: {
    speech: [
      'Aqui temos quatro exemplos pequenos para observar a biblioteca em funcionamento. Na entrada, o bloco aparece, sobe e aumenta. No exemplo de estado, um clique muda a posição, a escala e a cor. Na comparação de transições, dois elementos percorrem o mesmo deslocamento com comportamentos diferentes.',
      'O último exemplo mostra a saída: o elemento perde opacidade e diminui antes de ser removido. Esses quadros executam componentes React Native com Moti real. Eles isolam conceitos que depois aparecem juntos no jogo. Vou executar cada um rapidamente; nos próximos slides, vamos abrir os trechos e explicar as propriedades que produziram esses resultados.'
    ],
    demonstration: 'Use Entrada → Repetir entrada; Estado React → Alternar estado; timing × spring → Mover os dois; Entrada e saída → Ocultar com exit. Mostre cada efeito uma vez, sem prolongar a explicação.',
    transition: 'Para reproduzir os exemplos, precisamos preparar a instalação.'
  },
  instalacao: {
    speech: [
      'A instalação mostrada aqui parte de um projeto Expo SDK 54 já criado. O primeiro comando instala Reanimated e Worklets com expo install. Essa ferramenta escolhe as versões indicadas para o SDK do projeto. O segundo instala Moti 0.30.0, que é a versão usada nos exemplos.',
      'A opção legacy-peer-deps é apresentada no guia npm do Moti. Ela altera a resolução de dependências pares, mas não corrige uma incompatibilidade de execução. Depois de mudar as dependências, reiniciamos o Metro com o cache limpo. Neste SDK, babel-preset-expo configura automaticamente o plugin indicado para Reanimated. É por isso que precisamos consultar a documentação da versão do Expo, em vez de copiar configurações de ambientes diferentes.',
      'Depois da instalação, usamos import para trazer os componentes da biblioteca ao arquivo JavaScript. MotiView anima um bloco da interface; MotiText aplica a mesma ideia a um texto. AnimatePresence será usado quando explicarmos a saída de componentes.'
    ],
    demonstration: 'Leia os comandos sem instalar pacotes durante a apresentação. Aponte a diferença entre comando no terminal, import em JavaScript e componente JSX.',
    transition: 'Com o ambiente preparado, a primeira animação pode ser descrita com três propriedades.'
  },
  apiprimeira: {
    speech: [
      'As três propriedades centrais são from, animate e transition. From descreve os valores iniciais quando o componente é montado. Animate descreve os valores de destino. Transition configura como a mudança acontece.',
      'Neste trecho, a opacidade começa em zero, então o bloco está transparente. A escala começa em 0.55, menor que o tamanho final, e translateY começa em 35. No destino, a opacidade e a escala são um, e o deslocamento vertical é zero. O resultado é um bloco que aparece, cresce e sobe até sua posição. A transição é timing e dura 1.200 milissegundos.',
      'O texto usa MotiText com opacidade e atraso próprios. A aparência estática, como tamanho e formato do bloco, continua em style. O botão de repetição troca a key para montar esse exemplo novamente. Isso permite repetir from intencionalmente; from não significa reiniciar a animação a cada render.'
    ],
    demonstration: 'Clique em Repetir entrada. Destaque from, animate e transition no código. Compare os números iniciais com os finais e mostre a aba MotiText.',
    transition: 'Repetir uma entrada é diferente de manter um componente e mudar seu destino. Vamos ver esse segundo caso.'
  },
  'estado-react': {
    speech: [
      'Aqui React alterna um estado chamado selected. As expressões condicionais dentro de animate usam esse estado para escolher os próximos valores. Quando selected muda, translateX passa de menos 45 para 45. A escala muda de um para 1.2, e a cor também recebe um novo destino.',
      'O mesmo componente continua montado durante esse processo. React decide os valores e Moti anima a mudança visual. Não precisamos criar um intervalo que desenhe cada quadro. Essa ideia pode ser aplicada a um cartão selecionado, a um botão ativo ou a um painel que se expande.',
      'No exemplo anterior, trocamos a key para reiniciar a entrada. Neste, preservamos a identidade para que o elemento transite de um estado para outro. No jogo, essa continuidade é importante para a carta viajar da mão até o campo.'
    ],
    demonstration: 'Clique duas vezes em Alternar estado. Aponte selected, translateX, scale e backgroundColor; observe que a instância permanece no quadro.',
    transition: 'Já sabemos definir o destino. Agora vamos escolher como o elemento chega até ele.'
  },
  'timing-spring': {
    speech: [
      'Timing e spring são duas formas de configurar a transição. Com timing, descrevemos o tempo do movimento usando duration. Com spring, usamos uma dinâmica de mola. Na configuração deste exemplo, damping controla o amortecimento e stiffness representa a rigidez.',
      'Os dois elementos percorrem o mesmo deslocamento. O primeiro usa timing com duração de 1.200 milissegundos; o segundo usa spring com damping oito e stiffness noventa. A diferença está no comportamento durante o caminho, não no destino. Ao selecionar 500 milissegundos, mudamos a duração da faixa timing. A faixa spring continua usando seus parâmetros de mola.',
      'O controle delay faz os dois aguardarem 700 milissegundos antes de iniciar. Portanto, delay é atraso para começar, e duration é duração do movimento. Uma mola não precisa sempre ultrapassar o alvo: isso depende dos parâmetros escolhidos.'
    ],
    demonstration: 'Execute Mover os dois. Compare 1.200 ms com 500 ms e depois ative Delay 700 ms. Espere cada movimento terminar antes de alternar novamente.',
    transition: 'Além de escolher a transição, podemos organizar o começo e a repetição de vários efeitos.'
  },
  ritmo: {
    speech: [
      'Delay permite adiar o início de uma animação. No trecho dos raios, usamos index multiplicado por 70. O elemento de índice zero começa sem atraso, o de índice um aguarda 70 milissegundos, e o de índice três aguarda 210. Assim, criamos uma entrada escalonada com o mesmo padrão de componente.',
      'Loop faz a animação repetir continuamente. Nas órbitas, combinamos o giro com loop true e repeatReverse false. Desligar a reversão permite reiniciar o ciclo sem fazer o caminho de volta. Na aura, o retorno da repetição segue o padrão descrito pela biblioteca.',
      'Essas propriedades têm papéis diferentes: delay organiza o início, duration configura o tempo de uma transição timing, e loop organiza a repetição. Nos exemplos do jogo, elas compõem os efeitos de energia.'
    ],
    demonstration: 'Abra as abas delay, Loop e Aura. Destaque delay, loop e repeatReverse. Se necessário, execute uma rodada Moti em câmera lenta para observar as órbitas.',
    transition: 'Uma repetição refaz um movimento. Uma sequência permite passar por vários valores diferentes.'
  },
  sequencias: {
    speech: [
      'Em vez de um único destino, uma propriedade pode receber um array de valores. Cada valor representa um alvo intermediário da animação. No MotiText, a escala passa por 0.75, 1.08 e um. Isso produz uma preparação menor, um destaque ligeiramente maior e um retorno ao tamanho final.',
      'Na carta, os valores intermediários ajudam a criar a sensação de preparação e impacto. Essa sequência é uma descrição visual; ela não decide quem vence a batalha. Também não devemos confundir esse array com um map que cria vários componentes: aqui estamos descrevendo passos de uma mesma propriedade.',
      'Podemos combinar várias propriedades para construir um efeito, mas cada uma continua tendo seus valores e sua transição. A clareza do código ajuda a entender qual etapa produz cada parte do movimento.'
    ],
    demonstration: 'Abra MotiText e aponte o array de scale. Depois mostre a sequência da carta e relacione os valores ao impacto visto na captura ou na demonstração.',
    transition: 'Esses movimentos acontecem enquanto o componente existe. A saída exige organizar também sua remoção.'
  },
  'entrada-saida': {
    speech: [
      'Exit descreve os valores visuais da animação de saída. Mas, se React remover o componente imediatamente, não haverá mais um elemento para mostrar essa transição. AnimatePresence organiza a presença do filho para permitir a animação antes da remoção.',
      'Neste exemplo, visible controla a condição de renderização. O componente Moti tem uma key que identifica o elemento, valores de entrada, destino e saída. Ao ocultá-lo, a opacidade chega a zero e a escala diminui durante 900 milissegundos. Só depois a remoção se completa.',
      'Ao mostrar novamente, podemos comparar a entrada com a saída. As outras abas mostram o mesmo padrão no jogo: DuelBoard envolve a cena com AnimatePresence, e BattleCinema declara exit. A condição React, a identidade do elemento e os estilos da saída são partes distintas desse comportamento.'
    ],
    demonstration: 'Clique em Ocultar com exit e espere o bloco desaparecer. Clique em Mostrar novamente. Aponte visible, AnimatePresence, key e exit; depois abra as duas abas do jogo.',
    transition: 'Também podemos combinar deslocamento, escala e rotação para produzir uma sensação de profundidade.'
  },
  transformacoes: {
    speech: [
      'A viagem da carta usa deslocamento e escala. As posições da mão e do campo vêm das medidas do layout; o componente recebe um novo destino. A key baseada na identificação da carta preserva a instância durante essa mudança.',
      'A sensação de profundidade vem de uma combinação de transformações. RotateX inclina, rotateY gira a face e rotateZ dá a pose da carta. Perspective participa da percepção de profundidade, e a ordem das transformações importa. As duas faces e backfaceVisibility ajudam a mostrar o lado correto durante o giro.',
      'Isso é uma interface de componentes 2D com aparência 3D. Moti anima as transformações; imagens, estilos, sombras e o layout também participam da aparência. O efeito final vem da composição desses recursos.'
    ],
    demonstration: 'Mostre as abas Destino, Perspectiva e Revelação. No jogo, selecione uma carta e observe a continuidade do deslocamento até o campo.',
    transition: 'Quando uma animação termina, a aplicação pode precisar reagir a essa conclusão.'
  },
  'conclusao-animacao': {
    speech: [
      'OnDidAnimate é um callback de conclusão de propriedades animadas. Ele informa qual propriedade terminou, se o movimento foi concluído e qual valor se tentou alcançar. Um retorno isolado não significa necessariamente que toda a cena terminou.',
      'Neste trecho, a aplicação verifica translateY, finished, o destino esperado e a viagem atual antes de considerar a carta chegada. Uma animação interrompida ou a conclusão de outra propriedade não deve liberar a jogada por engano. Essa interpretação pertence à lógica da aplicação.',
      'As outras abas mostram como o projeto respeita a preferência de movimento reduzido do sistema e a opção local. Nesse modo, a rodada pode apresentar o resultado imediatamente. A escolha, o resultado e os controles continuam importantes, mesmo quando o espetáculo é reduzido.'
    ],
    demonstration: 'Destaque onDidAnimate, finished e attemptedValue. Abra Preferências e Rodada imediata. Se houver tempo, ative Reduzir movimento na demonstração e compare uma rodada.',
    transition: 'Com esses exemplos, já podemos avaliar os benefícios e os limites da biblioteca.'
  },
  'pros-contras': {
    speech: [
      'Um benefício do Moti é manter a descrição da animação perto do componente: fica fácil localizar os valores iniciais, os destinos e a configuração da transição. A biblioteca também oferece recursos combináveis, como molas, sequências e entrada e saída, sobre a base de Reanimated.',
      'Como limite, precisamos cuidar das dependências e da combinação de versões do ambiente. Para gestos ou encadeamentos que exigem controle muito detalhado, usar Reanimated diretamente pode ser mais claro. Muitas camadas, partículas e efeitos também precisam ser observados no dispositivo.',
      'O objetivo não é colocar o máximo de movimento em toda interface. Num jogo, o espetáculo pode fazer sentido; num formulário, clareza e rapidez podem pesar mais. A escolha da intensidade continua sendo uma decisão de design.'
    ],
    demonstration: 'Aponte um benefício e relacione-o a from/animate. Aponte um cuidado e relacione-o às muitas camadas da batalha. Evite ler todos os cartões palavra por palavra.',
    transition: 'Moti não é a única opção. Vamos comparar formas de trabalhar com animação.'
  },
  'comparacao-bibliotecas': {
    speech: [
      'Moti descreve estados visuais por propriedades e usa Reanimated como base. Reanimated diretamente oferece shared values, estilos animados e controle granular. Animated é uma API integrada ao React Native, com valores e composição de animações. Seu native driver atende propriedades suportadas.',
      'Lottie trabalha com arquivos de animação previamente produzidos, como ilustrações e loaders preparados por um designer. Portanto, não estamos comparando apenas bibliotecas intercambiáveis: as formas de criar e controlar o movimento são diferentes.',
      'Para destacar um cartão selecionado, Moti pode expressar a mudança de forma direta. Para um arrasto com limites precisos, Reanimated pode oferecer o controle necessário. Para uma ilustração entregue em um arquivo compatível, Lottie pode fazer sentido. As outras ferramentas também podem resolver alguns desses casos; a escolha depende do requisito e do ambiente existente.'
    ],
    demonstration: 'Percorra a tabela e clique nos três cenários para mostrar as justificativas. Compare adequação ao problema, sem apresentar um ranking de velocidade.',
    transition: 'Com isso, encerramos a apresentação da biblioteca e seus principais recursos.'
  },
  agradecimentos: {
    speech: ['Obrigado pela atenção!'],
    demonstration: 'Mantenha o slide apenas com Obrigado. Conclua a fala sem abrir outras demonstrações.',
    transition: ''
  }
};
