module.exports = [
  {
    id: 'comparacao', type: 'comparison', chapter: 'Veja antes de aprender',
    title: 'Duas versões.', accent: 'As mesmas regras.',
    lead: 'Observe uma rodada básica e outra com Moti. A turma escolhe a carta e descreve o que mudou na experiência.',
    prompt: 'O que transmite seleção, movimento e impacto na segunda versão?',
    duration: '2:00', durationSeconds: 120,
    notes: '0:00–2:00. Comece direto pela comparação. Abra a versão básica, escolha com a turma e jogue uma vez. Depois abra Moti, ative a sequência previsível e deixe uma pessoa escolher a carta; use câmera lenta se necessário. Peça duas observações sobre movimento, escala, giro ou feedback. Explique que as regras são compartilhadas, e que React Native também permite animar: esta versão básica foi feita como resposta estática. O seminário ensina a biblioteca; o jogo será nosso exemplo concreto.'
  },
  {
    id: 'abertura', type: 'cover', chapter: 'O tema do seminário',
    title: 'Moti.', accent: 'Você descreve o destino. A interface se move.',
    lead: 'Um seminário sobre a biblioteca: o que ela é, como instalar e como usar sua API, com código real e participação da turma.',
    duration: '0:30', durationSeconds: 30,
    notes: '2:00–2:30. Apresente o tema e combine a dinâmica: prever antes de executar, votar com as mãos e discutir os desafios em dupla. Diga que todos os trechos têm arquivo e linhas de origem; os laboratórios foram adicionados ao projeto para explicar conceitos isolados, enquanto os exemplos do jogo mostram sua aplicação.'
  },
  {
    id: 'biblioteca', type: 'stack', chapter: 'O que é Moti',
    title: 'Uma API declarativa de animação.',
    lead: 'Moti descreve transições visuais por propriedades de componentes React Native. Reanimated é sua base de execução.',
    snippets: ['dependencies'], reference: 'https://moti.fyi/reanimated',
    callout: 'Neste exemplo: Moti 0.30.0, Expo SDK 54 e Reanimated 4.1.x. A combinação do projeto não representa garantia de compatibilidade com todas as versões.',
    duration: '1:30', durationSeconds: 90,
    notes: '2:30–4:00. Explique declarativo: descrevo os valores desejados, e a interface transita até eles. React organiza estados; React Native fornece componentes; Moti oferece a API de animação; Reanimated executa a base. Pergunte quem decide o vencedor do jogo: a lógica da aplicação, não Moti. Mostre as dependências reais. A documentação geral do Moti ainda menciona Reanimated 2/3, enquanto este Expo 54 usa Reanimated 4 com Worklets; apresente a configuração demonstrada sem afirmar compatibilidade universal ou desempenho garantido.'
  },
  {
    id: 'historia', type: 'history', chapter: 'História e motivação',
    title: 'Uma ideia para web e aplicativo.',
    lead: 'Fernando Rojo criou Moti para compartilhar animações entre plataformas, com uma API mais direta para os estados visuais.',
    milestones: [
      { label: '16/10/2020 · proposta', title: 'Uma biblioteca universal', text: 'No RFC do Dripsy, Fernando propôs animações sobre Reanimated 2, inspiradas em Framer Motion e transições CSS.', url: 'https://github.com/nandorojo/dripsy/issues/46' },
      { label: 'Motivação do autor', title: 'Objetos de estilo como destinos', text: 'A ideia era abstrair os hooks de animação em componentes que recebem valores visuais e fazem as transições.', url: 'https://moti.fyi/' },
      { label: 'Influências e colaboração', title: 'Uma API com referências conhecidas', text: 'O autor cita Framer Motion, React Spring, Animatable e CSS. Matt Perry ajudou na integração de AnimatePresence.', url: 'https://moti.fyi/' }
    ],
    prompt: 'Por que pode ser útil descrever a mesma animação para uma tela web e uma tela nativa?',
    duration: '1:30', durationSeconds: 90,
    notes: '4:00–5:30. Conte a origem com precisão: 16 de outubro de 2020 é a data da proposta publicada no Dripsy, não uma data de lançamento. Explique a motivação de reduzir diferenças entre plataformas e tornar a animação parte natural do componente. Cite Fernando Rojo e as influências do relato oficial, sem afirmar que Moti é uma cópia de Framer Motion ou um motor próprio. Ouça uma resposta curta à pergunta sobre compartilhar a descrição da animação.'
  },
  {
    id: 'demonstracoes', type: 'showcase', chapter: 'Experimente a biblioteca',
    title: 'Quatro movimentos.',
    lead: '',
    labModes: ['api', 'state', 'timing', 'presence'],
    prompt: 'O que muda quando o componente entra, quando seu estado muda e quando ele sai?',
    duration: '2:00', durationSeconds: 120,
    notes: '5:30–7:30. Mostre os quatro laboratórios: entrada, estado, timing/spring e presença. Escolha duas pessoas para selecionar os controles, alternando a pergunta e a execução. Faça comparações rápidas, sem explicar todo o código ainda: o bloco entra; o botão muda o destino; duas transições têm ritmos diferentes; exit anima antes da remoção. São componentes React Native executando Moti real, não animações imitadas em CSS. Deixe uma pergunta aberta para a leitura dos trechos nos próximos slides.'
  },
  {
    id: 'instalacao', type: 'installation', chapter: 'Código 1 · ambiente',
    title: 'Instalar neste Expo SDK 54.',
    lead: 'Na raiz de um projeto Expo 54, instale a base de animação e a biblioteca. Depois importe os componentes.',
    commands: [
      { label: 'Base compatível com o SDK', command: 'npx expo install react-native-reanimated react-native-worklets', detail: 'expo install escolhe as versões indicadas para o SDK do projeto.' },
      { label: 'Moti usado nos exemplos', command: 'npm install moti@0.30.0 --legacy-peer-deps', detail: 'O guia do Moti sugere essa opção no npm. Ela altera a resolução de peers; não garante compatibilidade de execução.' },
      { label: 'Reiniciar o desenvolvimento', command: 'npx expo start --clear', detail: 'Reinicia o Metro e limpa o cache após mudanças de dependências ou configuração.' }
    ],
    snippets: ['labImports', 'bootstrap'],
    cards: [
      { title: 'Expo 54 e Babel', text: 'babel-preset-expo configura o plugin de Reanimated automaticamente. Consulte o guia do SDK antes de copiar configurações antigas.' },
      { title: 'Este projeto já está configurado', text: 'Os imports e versões são reais. Para reproduzir o repositório, mantenha o arquivo de lock e as versões do exemplo.' }
    ],
    reference: 'https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/',
    callout: 'Em outro SDK ou em React Native sem Expo, consulte a documentação correspondente. Os comandos são demonstrados; a turma não precisa instalar durante a apresentação.',
    duration: '2:00', durationSeconds: 120,
    notes: '7:30–9:30. Explique npx, expo install e npm sem executar instalações ao vivo. Mostre que Reanimated e Worklets são a base indicada pelo Expo 54. Diga que --legacy-peer-deps ignora a resolução estrita de peers e não corrige incompatibilidades de execução. Nos trechos, diferencie comando do terminal, import JavaScript e componente JSX. Aponte MotiView, MotiText e AnimatePresence do laboratório. O projeto já está pronto para os exemplos; não transforme a atividade numa configuração de máquinas da turma.'
  },
  {
    id: 'apiprimeira', type: 'lab', chapter: 'Código 2 · primeira animação',
    title: 'from, animate e transition.',
    lead: 'from descreve a entrada; animate descreve o destino; transition descreve como chegar. O laboratório também anima o texto com MotiText.',
    snippets: ['labMount', 'labImports', 'motiText'],
    highlights: ['from', 'animate', 'transition', 'MotiText', 'key'],
    labMode: 'api',
    duration: '2:30', durationSeconds: 150,
    notes: '9:30–12:00. Dê 30 segundos para duplas lerem o trecho e preverem o movimento. Ouça uma explicação antes de clicar em Repetir entrada. from tem opacity 0, scale 0.55 e translateY 35; animate chega a 1, 1 e 0; timing usa 1200 ms. Explique que from é a entrada ao montar, não uma instrução para reiniciar a cada render. O botão troca a key para remontar intencionalmente o laboratório. Mostre MotiText, que recebe as mesmas ideias de propriedades, e diferencie o texto do laboratório do trecho do jogo mostrado na outra aba.'
  },
  {
    id: 'estado-react', type: 'lab', chapter: 'Código 3 · estado',
    title: 'O estado muda.', accent: 'O destino também.',
    lead: 'React alterna selected. A mesma instância MotiView recebe novos valores em animate.',
    snippets: ['labState'],
    highlights: ['selected', 'animate', 'translateX', 'scale', 'backgroundColor'],
    labMode: 'state',
    duration: '2:00', durationSeconds: 120,
    notes: '12:00–14:00. Convide uma pessoa a clicar em Alternar estado e outra a apontar a expressão condicional. selected muda; translateX vai de -45 para 45, a escala cresce e a cor muda. O componente continua montado e Moti anima o novo destino. Compare com trocar a key para repetir a entrada no slide anterior: aqui queremos preservar a identidade. Pergunte se precisamos de setInterval para desenhar cada quadro: não neste modelo. A lógica React decide o valor; a biblioteca anima sua apresentação.'
  },
  {
    id: 'timing-spring', type: 'lab', chapter: 'Código 4 · transição',
    title: 'Mesmo destino.', accent: 'Outro movimento.',
    lead: 'Compare timing e spring; altere duration e delay no laboratório.',
    snippets: ['labTiming'],
    highlights: ['timing', 'duration', 'spring', 'damping', 'stiffness', 'delay'],
    labMode: 'timing',
    duration: '2:30', durationSeconds: 150,
    notes: '14:00–16:30. Faça uma votação oral: timing ou spring para um fade de 800 ms? Peça uma justificativa e só depois execute o laboratório. Mostre que timing controla tempo com duration; spring deste exemplo usa damping 8 e stiffness 90 para uma dinâmica de mola. Compare 500 ms e 1200 ms. Ligue Delay 700 ms e mova os dois: ambos aguardam antes de iniciar. Pergunte qual controle altera apenas a faixa timing. Na configuração de mola usada aqui, a duração não é o parâmetro usado; não afirme que toda mola sempre ultrapassa o alvo, pois isso depende dos parâmetros.'
  },
  {
    id: 'ritmo', type: 'code', chapter: 'Código 5 · atraso e repetição',
    title: 'delay, loop e repeatReverse.',
    lead: 'Atraso organiza o início. Repetição mantém o efeito. O destino e o estilo continuam sendo escolhas do componente.',
    snippets: ['rays', 'orbit', 'aura'],
    highlights: ['delay', 'index', 'loop', 'repeatReverse', 'duration'],
    image: 'invocation.png', demo: 'moti',
    reference: 'https://moti.fyi/animations',
    callout: 'Nos raios, delay: index * 70. Nas órbitas, loop: true com repeatReverse: false. A aura usa repetição com retorno padrão.',
    duration: '2:00', durationSeconds: 120,
    notes: '16:30–18:30. Use rays para perguntar quanto aguarda o índice 3: 210 ms. Diferencie delay de duration. Na aba orbit, mostre o giro em loop e repeatReverse false; peça à turma que faça com a mão o gesto de uma volta contínua e de ida e volta. Na aura, a repetição reversa é o comportamento padrão descrito pelo Moti. Abra a demo apenas se ajudar a observar o conceito e volte ao trecho. Mudanças de configuração de repetição podem exigir remontagem; não recomende trocar keys continuamente.'
  },
  {
    id: 'sequencias', type: 'code', chapter: 'Código 6 · passos',
    title: 'Arrays também descrevem animação.',
    lead: 'Uma propriedade pode receber vários destinos: preparar, destacar e retornar.',
    snippets: ['sequence', 'motiText'],
    highlights: ['animate', 'scale'],
    image: 'clash.png', demo: 'moti',
    reference: 'https://moti.fyi/animations',
    callout: 'Um array de valores descreve passos da mesma propriedade. Ele não cria uma lista de componentes.',
    duration: '1:45', durationSeconds: 105,
    notes: '18:30–20:15. Mostre MotiText: scale passa por 0.75, 1.08 e 1. Pergunte qual valor deixa o texto maior que o tamanho final e peça uma previsão do efeito. Revele com uma execução breve ou a captura do jogo. Depois abra a sequência da carta e conecte preparação e impacto aos alvos intermediários. Diferencie sequência de valores, loop e map de componentes: passos, repetição e criação de elementos são conceitos distintos. Não atribua a regra da batalha ao array da animação.'
  },
  {
    id: 'entrada-saida', type: 'lab', chapter: 'Código 7 · presença',
    title: 'Antes de remover, anime a saída.',
    lead: 'exit descreve a saída. AnimatePresence permite que ela aconteça antes da remoção.',
    snippets: ['labPresence', 'presence', 'sceneExit'],
    highlights: ['AnimatePresence', 'visible', 'key', 'exit'],
    labMode: 'presence',
    duration: '2:30', durationSeconds: 150,
    notes: '20:15–22:45. Dê 20 segundos para a turma prever a saída e clique em Ocultar com exit. Observe opacidade e escala durante 900 ms. Explique a condição React, AnimatePresence, a identidade do filho e exit. Reabra o bloco para comparar entrada e saída. Nas abas do jogo, mostre o mesmo padrão em DuelBoard e BattleCinema. Pergunte o que verificar quando um elemento com exit desaparece imediatamente: a organização de AnimatePresence e suas keys. Uma View comum não recebe essa capacidade apenas porque escrevemos exit nela.'
  },
  {
    id: 'transformacoes', type: 'code', chapter: 'Código 8 · transformação',
    title: 'Da mão ao campo.', accent: 'Profundidade percebida.',
    lead: 'translate, scale e rotate animam a carta. Perspectiva e duas faces constroem a aparência 3D.',
    snippets: ['travel', 'transforms', 'flip'],
    highlights: ['translateX', 'translateY', 'scale', 'perspective', 'rotateY'],
    image: 'reveal.png', demo: 'moti',
    reference: 'https://moti.fyi/api/transforms',
    duration: '1:45', durationSeconds: 105,
    notes: '22:45–24:30. Na viagem, mostre que a key choice.id preserva a carta e destination define os novos valores. No helper, perspective vem antes das rotações; a ordem das transformações importa. rotateX inclina e rotateY gira a face; backfaceVisibility evita mostrar a face errada. Peça à turma que identifique qual propriedade explicaria a carta crescer e qual explicaria virar. É uma interface 2D com transformações, não um motor 3D; medidas de layout, estilos e imagens participam da aparência.'
  },
  {
    id: 'conclusao-animacao', type: 'code', chapter: 'Código 9 · conclusão e cuidado',
    title: 'Conclusão da animação.', accent: 'Preferências de movimento.',
    lead: 'onDidAnimate informa conclusões de propriedades. O aplicativo deve interpretar esse retorno e respeitar preferências de movimento.',
    snippets: ['arrival', 'reduced', 'instant'],
    highlights: ['onDidAnimate', 'finished', 'attemptedValue', 'motionReduced'],
    image: 'idle.png', demo: 'moti',
    callout: 'O callback verifica a propriedade, o término e o destino esperado. A preferência de movimento reduzido é tratada pela aplicação.',
    duration: '1:45', durationSeconds: 105,
    notes: '24:30–26:15. Mostre as verificações de propriedade, término e destino no callback. Abra reduced e instant para explicar como o projeto respeita a preferência de movimento do sistema e a opção local, mantendo escolha e resultado visíveis.'
  },
  {
    id: 'pros-contras', type: 'tradeoffs', chapter: 'Avalie a escolha',
    title: 'O que facilita.', accent: 'O que exige atenção.',
    lead: 'Escolha Moti pelo problema que precisa resolver. A biblioteca não substitui decisões de design, configuração e verificação.',
    pros: [
      { title: 'API por propriedades', text: 'Entrada, destino e transição ficam próximos do componente e do estado visual.' },
      { title: 'Recursos combináveis', text: 'Molas, atrasos, repetições, sequências e entrada/saída podem compor interfaces variadas.' },
      { title: 'Base compartilhada', text: 'Usa Reanimated e permite descrever animações para aplicações nativas e web.' }
    ],
    cons: [
      { title: 'Dependências e versões', text: 'É preciso configurar a base de animação e conferir a combinação do SDK. Guias antigos podem divergir do ambiente.' },
      { title: 'Controle complexo', text: 'Gestos e encadeamentos muito detalhados podem ser mais claros usando Reanimated diretamente.' },
      { title: 'Custo e conforto', text: 'Muitas camadas e efeitos exigem avaliação no dispositivo e opções de movimento adequado.' }
    ],
    prompt: 'Para um formulário, você manteria os mesmos efeitos intensos usados numa batalha? Por quê?',
    reference: 'https://moti.fyi/reanimated',
    duration: '1:30', durationSeconds: 90,
    notes: '26:15–27:45. Escolha dois benefícios e dois cuidados para explicar oralmente. Peça uma resposta sobre o formulário e outra sobre o jogo. Moti simplifica a descrição de estilos, mas não garante fluidez em qualquer aparelho, nem torna toda animação útil. O guia do próprio autor recomenda considerar Reanimated diretamente para controle granular de gestos e encadeamentos complicados. A comparação é de adequação e expressividade, não um benchmark de velocidade.'
  },
  {
    id: 'comparacao-bibliotecas', type: 'alternatives', chapter: 'Compare alternativas',
    title: 'Ferramentas próximas.', accent: 'Objetivos diferentes.',
    lead: 'Estas opções podem se complementar. A turma decide conforme a tarefa, sem um ranking absoluto.',
    rows: [
      { name: 'Moti', approach: 'Props de estado sobre Reanimated.', fit: 'Seleção, entrada e saída.', tradeoff: 'Mais uma camada de dependências.', url: 'https://moti.fyi/reanimated' },
      { name: 'Reanimated', approach: 'Shared values e estilos animados.', fit: 'Gestos e controle granular.', tradeoff: 'Mais lógica de controle explícita.', url: 'https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation/' },
      { name: 'Animated do RN', approach: 'API integrada: valores, timing e spring.', fit: 'Transições com APIs básicas do RN.', tradeoff: 'Native driver: propriedades suportadas.', url: 'https://reactnative.dev/docs/animated' },
      { name: 'Lottie React Native', approach: 'Reproduz arquivos de animação (ex.: JSON).', fit: 'Ilustrações e loaders de um designer.', tradeoff: 'Exige um asset compatível.', url: 'https://github.com/lottie-react-native/lottie-react-native' }
    ],
    scenarios: [
      { title: 'Um cartão deve destacar a seleção.', answer: 'Moti expressa essa mudança por estado de forma direta. Animated e Reanimated também podem resolver; considere o ambiente existente.' },
      { title: 'Um item acompanha um arrasto com limites precisos.', answer: 'Reanimated direto oferece controle granular. Moti pode integrar seus valores, mas não elimina a lógica dos gestos.' },
      { title: 'Um designer entregou uma ilustração animada.', answer: 'Lottie é uma opção quando o arquivo e seus recursos são compatíveis. O progresso também pode ser integrado a Animated ou Reanimated.' }
    ],
    prompt: 'Escolha uma ferramenta para cada situação e justifique o critério.',
    duration: '1:30', durationSeconds: 90,
    notes: '27:45–29:15. Mostre a tabela sem ler todas as células. Dê à turma as três situações; peça respostas rápidas e revele uma justificativa por vez. Não diga que Animated é sempre lento ou que Reanimated não é declarativo: estamos comparando a forma de uso e a adequação aos exemplos. Lottie trabalha com animações produzidas em assets; Moti anima valores de componentes. Não instale outras bibliotecas neste projeto para fazer esta comparação conceitual.'
  },
  {
    id: 'agradecimentos', type: 'thanks', chapter: 'Obrigado pela participação',
    title: 'Obrigado', lead: '',
    duration: '0:45', durationSeconds: 45,
    notes: '29:15–30:00. Agradeça pela atenção e encerre a apresentação. O slide mostra apenas Obrigado.'
  }
];
