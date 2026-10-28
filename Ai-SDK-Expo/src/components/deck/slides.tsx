import type { ReactNode } from "react";
import { SlideShell, P, C, Card, Callout, CodeBlock, Flow, Steps, Bullets } from "./primitives";
import { StreamingDemo, MultiStepDemo } from "./demos";
import * as K from "./code";

export type Slide = {
  id: string;
  section: string;
  title: string;
  minutes: number;
  notes: string;
  render: () => ReactNode;
};

export const DOCS = {
  expo: "https://ai-sdk.dev/docs/getting-started/expo",
  streamText: "https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text",
  settings: "https://ai-sdk.dev/docs/ai-sdk-core/settings",
  tools: "https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling",
  useChat: "https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat",
  providers: "https://ai-sdk.dev/providers/ai-sdk-providers",
  prompt: "https://ai-sdk.dev/docs/advanced/prompt-engineering",
  streaming: "https://ai-sdk.dev/docs/foundations/streaming",
};

const Ref = ({ href }: { href: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className="slide-chrome text-muted-foreground hover:text-cyan underline decoration-dotted">
    Fonte: {href.replace("https://", "")}
  </a>
);

const Two = ({ children, cols = "grid-cols-2" }: { children: ReactNode; cols?: string }) => (
  <div className={`grid ${cols} gap-14 h-full`}>{children}</div>
);

export const slides: Slide[] = [
  // ───────────── Parte 1 — Introdução
  {
    id: "capa",
    section: "Introdução",
    title: "AI SDK com Expo",
    minutes: 0.4,
    notes:
      "Boa tarde a todos. Hoje eu vou apresentar o AI SDK integrado ao Expo. A ideia é mostrar, passo a passo, como construir um aplicativo móvel com um chat de inteligência artificial: desde a criação do projeto, passando pela rota no servidor que conversa com o modelo, até a interface que mostra a resposta chegando aos poucos. No final, vamos ver como o modelo pode usar ferramentas, que são funções definidas pela própria aplicação. Toda a apresentação foi construída com base na documentação oficial do AI SDK.",
    render: () => (
      <div className="absolute inset-0 flex flex-col justify-center px-[140px]">
        <div className="slide-kicker text-cyan mb-8">Programação para Dispositivos Móveis</div>
        <h1 className="slide-title-lg text-gradient pb-4">AI SDK com Expo</h1>
        <p className="slide-subtitle text-foreground/85 mt-8 max-w-[1350px] font-normal">
          Construindo aplicações móveis com inteligência artificial, respostas em streaming e ferramentas.
        </p>
      </div>
    ),
  },
  {
    id: "objetivo",
    section: "Introdução",
    title: "Nosso ponto de partida",
    minutes: 0.4,
    notes:
      "O objetivo é mostrar como integrar um modelo de inteligência artificial a um aplicativo Expo. Isso envolve três capacidades: enviar a mensagem do usuário, receber a resposta de forma progressiva — o que chamamos de streaming — e permitir que o modelo use ferramentas externas, como uma função que consulta o clima. O caminho que vamos seguir é: primeiro os conceitos e a arquitetura; depois a preparação do projeto; em seguida o backend, com a API Route e o streamText; depois a interface com o useChat; e por fim as Tools e as chamadas em várias etapas.",
    render: () => (
      <SlideShell kicker="Introdução" title="Nosso ponto de partida">
        <P className="max-w-[1500px] slide-body-lg">
          A ideia é integrar um modelo de IA a um app Expo capaz de <strong>enviar mensagens</strong>,{" "}
          <strong>receber a resposta aos poucos</strong> e permitir que o modelo <strong>use ferramentas</strong> definidas
          pela aplicação.
        </P>
        <div className="mt-12">
          <Flow
            steps={[
              { label: "Conceitos", sub: "prompt, streaming, arquitetura" },
              { label: "Preparação", sub: "projeto, dependências, chave", tone: "blue" },
              { label: "Backend", sub: "API Route, streamText, configurações", tone: "violet" },
              { label: "Interface", sub: "useChat, mensagens, parts", tone: "blue" },
              { label: "Tools", sub: "ferramentas e multi-step", tone: "green" },
            ]}
          />
        </div>
      </SlideShell>
    ),
  },
  {
    id: "o-que-e",
    section: "Introdução",
    title: "O que é AI SDK?",
    minutes: 0.5,
    notes:
      "Antes de tudo, é importante deixar claro: o AI SDK não é um modelo de inteligência artificial. Ele não é o GPT, nem o Claude, nem o Gemini. Ele é um conjunto de ferramentas em TypeScript que fica entre a nossa aplicação e esses modelos. Do lado do servidor, o AI SDK Core oferece funções como streamText, que padronizam a forma de chamar modelos de provedores diferentes. Do lado da interface, o AI SDK UI oferece hooks como o useChat, que cuidam do estado da conversa. A grande vantagem é organização: em vez de escrever código específico para cada provedor e gerenciar o streaming na mão, a gente usa uma API única e consistente.",
    render: () => (
      <SlideShell kicker="Introdução" title="O que é o AI SDK?">
        <Two>
          <div>
            <P className="slide-body-lg">
              É um <strong>conjunto de ferramentas em TypeScript</strong> para integrar modelos de IA a aplicações
              JavaScript e TypeScript.
            </P>
            <P>
              Ele padroniza a forma de conversar com modelos de provedores diferentes e simplifica a construção da
              interface de chat, incluindo o streaming das respostas.
            </P>
            <Callout kind="warn" className="mt-8">
              O AI SDK <b>não é</b> um modelo de IA. Ele é a camada que conecta a sua aplicação aos modelos.
            </Callout>
          </div>
          <div className="flex flex-col gap-6">
            <Card title={<>AI SDK Core — pacote <C>ai</C></>} tone="cyan">
              Funções usadas no servidor, como <C>streamText</C>, para gerar texto e chamar ferramentas.
            </Card>
            <Card title={<>AI SDK UI — <C>@ai-sdk/react</C></>} tone="violet">
              Hooks para a interface, como <C>useChat</C>, que gerenciam mensagens e o estado da conversa.
            </Card>
            <Card title="Providers" tone="blue">
              Adaptadores que conectam o SDK a cada provedor de modelos (aqui: Vercel AI Gateway).
            </Card>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  // ───────────── Parte 2 — Conceitos
  {
    id: "prompt",
    section: "Conceitos e arquitetura",
    title: "Prompt Engineering",
    minutes: 0.5,
    notes:
      "O primeiro conceito que a documentação recomenda conhecer é Prompt Engineering. Prompt é a instrução que enviamos ao modelo, e Prompt Engineering é a prática de formular essa instrução de forma clara. Três coisas fazem diferença: contexto, ou seja, quem está perguntando e para quê; clareza sobre o que se quer; e o formato esperado da resposta. Vejam o exemplo: 'fale sobre React Native' é vago — o modelo pode responder qualquer coisa. Já a versão melhorada define o público, o tamanho e o formato. Mas é importante dizer: um bom prompt aumenta a chance de uma resposta útil, não garante que ela esteja correta. A resposta continua precisando ser verificada.",
    render: () => (
      <SlideShell kicker="Conceitos" title="Prompt Engineering">
        <P className="max-w-[1550px]">
          O <strong>prompt</strong> é a instrução enviada ao modelo. Prompt Engineering é a prática de escrever essa
          instrução com <strong>contexto</strong>, <strong>clareza</strong> e <strong>objetivo</strong> definidos — porque a
          formulação influencia diretamente a resposta.
        </P>
        <div className="grid grid-cols-2 gap-10 mt-8">
          <Card title="Prompt vago" tone="amber">
            <p className="slide-body font-mono">“Fale sobre React Native.”</p>
            <p>Sem público, sem tamanho, sem formato: o modelo precisa adivinhar o que você quer.</p>
          </Card>
          <Card title="Prompt melhorado" tone="green">
            <p className="slide-body font-mono">
              “Explique para estudantes de computação, em 3 tópicos curtos, a diferença entre React Native e Expo.”
            </p>
            <p>Define público, quantidade e assunto exato.</p>
          </Card>
        </div>
        <Callout kind="info" className="mt-8">
          Um bom prompt ajuda, mas <b>não garante</b> uma resposta correta. A saída do modelo ainda precisa ser verificada.
        </Callout>
      </SlideShell>
    ),
  },
  {
    id: "streaming",
    section: "Conceitos e arquitetura",
    title: "HTTP Streaming",
    minutes: 0.7,
    notes:
      "O segundo conceito é HTTP Streaming. Em uma requisição tradicional, o servidor só responde quando tudo está pronto. Com um modelo de linguagem, gerar uma resposta longa pode levar vários segundos, e o usuário fica olhando uma tela parada. Com streaming, o servidor envia a resposta em pedaços, à medida que eles são gerados. Vou clicar em reproduzir para mostrar a diferença — e deixo claro que isso é uma animação no navegador, não um modelo real. Reparem: os dois lados terminam praticamente juntos. O streaming não necessariamente reduz o tempo total de processamento; o que ele melhora é a percepção de velocidade, porque o usuário começa a ler logo.",
    render: () => (
      <SlideShell kicker="Conceitos" title="HTTP Streaming: a resposta chega em partes">
        <P className="max-w-[1600px]">
          Sem streaming, o app espera o modelo terminar tudo. Com streaming, o servidor envia{" "}
          <strong>pedaços (chunks)</strong> assim que são gerados, e a interface mostra o texto progressivamente.
        </P>
        <div className="mt-6">
          <StreamingDemo />
        </div>
        <P className="mt-6 text-muted-foreground slide-caption">
          O ganho principal é na <b>percepção de velocidade</b>: o tempo total de geração não necessariamente diminui.
        </P>
      </SlideShell>
    ),
  },
  {
    id: "arquitetura",
    section: "Conceitos e arquitetura",
    title: "Arquitetura geral",
    minutes: 0.5,
    notes:
      "Agora a arquitetura. O usuário interage com a interface Expo. A interface não fala direto com o modelo: ela envia a mensagem para uma API Route, que é um endpoint executado no servidor. A API Route usa o AI SDK para chamar o modelo, que gera a resposta. Essa resposta volta em streaming pelo mesmo caminho até a interface. O motivo de existir esse servidor no meio é segurança: a chamada ao modelo exige uma chave de API. Se essa chave estivesse no aplicativo, qualquer pessoa poderia extraí-la do pacote do app e usar a sua conta. No servidor, ela fica protegida.",
    render: () => (
      <SlideShell kicker="Arquitetura" title="Arquitetura geral da aplicação">
        <Flow
          steps={[
            { label: "Usuário", sub: "digita a pergunta", tone: "blue" },
            { label: "Interface Expo", sub: "useChat", tone: "cyan" },
            { label: "API Route", sub: "servidor · /api/chat", tone: "violet" },
            { label: "AI SDK", sub: "streamText", tone: "violet" },
            { label: "Modelo de IA", sub: "via provider", tone: "green" },
          ]}
        />
        <div className="mt-4 mb-10 flex items-center justify-center gap-4 slide-caption text-cyan">
          <span>◀━━━━━━━━━━━━━━━━━━ resposta em streaming volta para a interface ━━━━━━━━━━━━━━━━━━</span>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <Card title="Cliente (app)" tone="cyan">
            Mostra a conversa, captura o texto digitado e exibe a resposta conforme ela chega.
          </Card>
          <Card title="Servidor (API Route)" tone="violet">
            Recebe as mensagens, chama o modelo com o AI SDK e devolve o stream.
          </Card>
          <Card title="Por que um servidor?" tone="amber">
            A <b>chave de API</b> fica só no servidor. Se estivesse no app, poderia ser extraída do pacote instalado.
          </Card>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "percurso",
    section: "Conceitos e arquitetura",
    title: "Como a mensagem percorre o sistema",
    minutes: 0.5,
    notes:
      "Vamos acompanhar uma mensagem concreta. O usuário digita 'O que é Expo?'. Primeiro, o useChat adiciona essa mensagem ao histórico local e envia todo o histórico para a rota /api/chat com uma requisição POST. No servidor, a rota converte as mensagens para o formato do modelo e chama o streamText. O modelo começa a gerar, e cada pedaço é repassado ao cliente. O useChat recebe esses pedaços e vai atualizando a mensagem do assistente na tela. Resumindo a divisão de responsabilidades: o frontend cuida da interação com o usuário, e o servidor cuida da comunicação com o modelo.",
    render: () => (
      <SlideShell kicker="Arquitetura" title="O caminho de uma mensagem">
        <Two cols="grid-cols-[1.2fr_1fr]">
          <Steps
            items={[
              { t: "Usuário digita “O que é Expo?”", d: "O texto fica no estado do campo de entrada do app." },
              { t: "useChat envia o histórico", d: <>Requisição <C>POST</C> para <C>/api/chat</C> com todas as mensagens.</> },
              { t: "API Route chama o modelo", d: <>Converte as mensagens e chama <C>streamText</C> no servidor.</> },
              { t: "O modelo gera em partes", d: "Cada pedaço é repassado ao cliente como stream." },
              { t: "A tela se atualiza", d: "useChat atualiza a mensagem do assistente a cada pedaço recebido." },
            ]}
          />
          <div className="flex flex-col gap-8 justify-center">
            <Card title="Frontend" tone="cyan">
              Gerencia a <b>interação</b>: entrada de texto, histórico e renderização.
            </Card>
            <Card title="Servidor" tone="violet">
              Gerencia a <b>comunicação com o modelo</b> e protege a chave.
            </Card>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  // ───────────── Parte 3 — Preparação
  {
    id: "prereq",
    section: "Preparação do projeto",
    title: "Pré-requisitos",
    minutes: 0.4,
    notes:
      "Para seguir o tutorial oficial, precisamos de três coisas. Node.js versão 22 ou superior — o Node é o ambiente que executa JavaScript fora do navegador, e é ele que roda as ferramentas de desenvolvimento. O pnpm, que é um gerenciador de pacotes, ou seja, a ferramenta que instala as bibliotecas do projeto; ele cumpre o mesmo papel do npm. E uma chave de API do Vercel AI Gateway, que é o serviço usado no tutorial para acessar os modelos. Além disso, a documentação informa que o guia requer Expo 52 ou superior.",
    render: () => (
      <SlideShell kicker="Preparação" title="Pré-requisitos">
        <div className="grid grid-cols-2 gap-8">
          <Card title="Node.js 22+" tone="green">
            Ambiente que executa JavaScript fora do navegador. Roda as ferramentas de desenvolvimento e o servidor local.
          </Card>
          <Card title="pnpm" tone="blue">
            Gerenciador de pacotes: instala e organiza as bibliotecas do projeto (mesmo papel do npm).
          </Card>
          <Card title="Chave do Vercel AI Gateway" tone="violet">
            Autentica a aplicação no gateway que dá acesso aos modelos usados no tutorial.
          </Card>
          <Card title="Expo 52 ou superior" tone="cyan">
            Versão mínima exigida pelo guia — necessária para o <C>expo/fetch</C> com suporte a streaming.
          </Card>
        </div>
        <div className="mt-10">
          <Ref href={DOCS.expo} />
        </div>
      </SlideShell>
    ),
  },
  {
    id: "criar",
    section: "Preparação do projeto",
    title: "Criando a aplicação",
    minutes: 0.4,
    notes:
      "O primeiro comando cria o projeto. pnpm create expo-app usa o pnpm para executar o criador oficial de projetos Expo. O @latest garante a versão mais recente desse criador, e my-ai-app é o nome da pasta que será criada. Dentro dela vem uma aplicação Expo básica, já com roteamento por arquivos, o Expo Router. Isso é importante porque é justamente o Expo Router que permite criar API Routes, que veremos daqui a pouco. Depois, basta entrar na pasta com cd.",
    render: () => (
      <SlideShell kicker="Preparação" title="Criando a aplicação">
        <Two cols="grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-8">
            <CodeBlock lang="bash" file="terminal" code={`pnpm create expo-app@latest my-ai-app\ncd my-ai-app`} />
          </div>
          <div>
            <Bullets
              items={[
                <><C>pnpm create</C> executa um criador de projetos usando o pnpm.</>,
                <><C>expo-app@latest</C> é o criador oficial do Expo, na versão mais recente.</>,
                <><C>my-ai-app</C> é o nome da pasta criada com o app básico.</>,
                <><C>cd my-ai-app</C> entra na pasta do projeto.</>,
              ]}
            />
            <P className="mt-8 text-muted-foreground">
              O projeto gerado usa o Expo Router (rotas por arquivos), que também permite criar as API Routes.
            </P>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "deps",
    section: "Preparação do projeto",
    title: "Instalando as dependências",
    minutes: 0.5,
    notes:
      "Em seguida instalamos três pacotes. O pacote ai é o núcleo do SDK: nele estão funções como streamText, tool e os utilitários de streaming; e, segundo a documentação, o provider do Vercel AI Gateway já vem incluído nele. O @ai-sdk/react traz os hooks de React, como o useChat, que vamos usar na interface. E o zod é uma biblioteca de validação de esquemas: com ele descrevemos o formato dos dados de entrada das ferramentas, por exemplo, que a ferramenta de clima precisa de um campo location do tipo texto.",
    render: () => (
      <SlideShell kicker="Preparação" title="Instalando as dependências">
        <CodeBlock lang="bash" file="terminal" code={`pnpm add ai @ai-sdk/react zod`} className="max-w-[1100px]" />
        <div className="grid grid-cols-3 gap-8 mt-12">
          <Card title={<C>ai</C>} tone="cyan">
            Núcleo do AI SDK: <C>streamText</C>, <C>tool</C>, utilitários de streaming. O provider do Vercel AI Gateway
            já vem incluído.
          </Card>
          <Card title={<C>@ai-sdk/react</C>} tone="violet">
            Hooks de React para a interface, como o <C>useChat</C>, que gerencia a conversa.
          </Card>
          <Card title={<C>zod</C>} tone="green">
            Validação de esquemas. Define o formato da entrada das ferramentas (Tools).
          </Card>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "chave",
    section: "Preparação do projeto",
    title: "Configurando a chave de API",
    minutes: 0.5,
    notes:
      "A chave de API vai em um arquivo .env.local na raiz do projeto, na variável AI_GATEWAY_API_KEY. O valor que aparece na tela é um marcador fictício. O provider do Vercel AI Gateway lê essa variável automaticamente, então não precisamos passá-la no código. Agora, um ponto de segurança muito importante: no Expo, variáveis que começam com EXPO_PUBLIC_ são embutidas no código do aplicativo e ficam acessíveis no cliente. Por isso, nunca devemos criar algo como EXPO_PUBLIC_AI_GATEWAY_API_KEY. A chave só deve ser usada no servidor, dentro da API Route. E o arquivo .env.local não deve ir para o repositório.",
    render: () => (
      <SlideShell kicker="Preparação" title="Configurando a chave de API com segurança">
        <Two>
          <div className="flex flex-col gap-8">
            <CodeBlock lang="bash" file=".env.local" code={K.ENV} />
            <P>
              O provider do Vercel AI Gateway lê <C>AI_GATEWAY_API_KEY</C> automaticamente — não é preciso passar a chave no
              código.
            </P>
          </div>
          <div className="flex flex-col gap-8">
            <Callout kind="security">
              Variáveis com prefixo <C>EXPO_PUBLIC_</C> são embutidas no app e ficam visíveis no cliente. <b>Nunca</b> use{" "}
              <C>EXPO_PUBLIC_AI_GATEWAY_API_KEY</C>.
            </Callout>
            <Bullets
              items={[
                "A chave deve existir apenas no ambiente do servidor.",
                "Quem lê a chave é a API Route, nunca a tela do app.",
                <>Não envie o <C>.env.local</C> para o repositório.</>,
              ]}
            />
          </div>
        </Two>
      </SlideShell>
    ),
  },
  // ───────────── Parte 4 — Backend
  {
    id: "api-route",
    section: "Backend e providers",
    title: "O que é uma API Route?",
    minutes: 0.4,
    notes:
      "Uma API Route é um arquivo do projeto que, em vez de desenhar uma tela, responde a requisições HTTP — e roda no servidor, não no celular. No Expo Router, ela é criada com o sufixo +api no nome do arquivo. Então app/api/chat+api.ts vira o endpoint /api/chat. Quando esse arquivo exporta uma função chamada POST, ela será executada sempre que alguém enviar uma requisição POST para esse endereço. É aqui que recebemos as mensagens e chamamos o modelo, longe do cliente e com acesso seguro à chave.",
    render: () => (
      <SlideShell kicker="Backend" title="O que é uma API Route?">
        <Two cols="grid-cols-[1.2fr_1fr]">
          <div>
            <P className="slide-body-lg">
              É um arquivo que <strong>responde a requisições HTTP</strong> e é executado <strong>no servidor</strong>, não no
              dispositivo.
            </P>
            <P>
              No Expo Router, o sufixo <C>+api</C> transforma o arquivo em endpoint. Uma função exportada com o nome{" "}
              <C>POST</C> trata as requisições POST.
            </P>
            <P>
              É ali que as mensagens são recebidas e o modelo é chamado — sem que o app precise falar diretamente com o
              provedor.
            </P>
          </div>
          <div className="flex flex-col gap-6 justify-center">
            <div className="rounded-2xl border border-border bg-code-bg p-8 font-mono slide-caption">
              <div className="text-muted-foreground">app/</div>
              <div className="pl-8 text-muted-foreground">(tabs)/index.tsx <span className="text-cyan">→ tela</span></div>
              <div className="pl-8 text-muted-foreground">api/</div>
              <div className="pl-16">
                chat+api.ts <span className="text-violet">→ POST /api/chat</span>
              </div>
            </div>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "criando-route",
    section: "Backend e providers",
    title: "Criando a API Route",
    minutes: 0.7,
    notes:
      "Este é o código oficial da rota. Nas linhas 1 a 7, importamos tudo do pacote ai. Na linha 9, exportamos a função assíncrona POST. Na linha 10, lemos o corpo da requisição e extraímos messages, que é o histórico completo da conversa — o modelo precisa dele para entender o contexto. O tipo UIMessage indica que essas mensagens estão no formato da interface. Nas linhas 12 a 15 chamamos streamText, passando o modelo e as mensagens. Repare que usamos convertToModelMessages: ele converte as mensagens do formato da interface para o formato que o modelo entende. Por fim, nas linhas 17 a 23, transformamos o resultado em uma resposta HTTP. Vamos detalhar cada parte nos próximos slides.",
    render: () => (
      <SlideShell kicker="Backend" title={<>Criando a API Route: <C>app/api/chat+api.ts</C></>}>
        <Two cols="grid-cols-[1.25fr_1fr]">
          <CodeBlock code={K.ROUTE_BASIC} file="app/api/chat+api.ts" highlight={[9, 10, 12, 13, 14]} small />
          <div className="flex flex-col gap-5">
            <Card title={<>Handler <C>POST</C></>} tone="cyan">
              Executado a cada requisição para <C>/api/chat</C>.
            </Card>
            <Card title={<>Leitura de <C>messages</C></>} tone="blue">
              O histórico inteiro da conversa chega no corpo. O modelo precisa dele para manter o contexto.
            </Card>
            <Card title={<C>convertToModelMessages</C>} tone="violet">
              Converte as mensagens da interface (<C>UIMessage</C>) para o formato do modelo.
            </Card>
            <Card title="Chamada ao modelo" tone="green">
              <C>streamText</C> inicia a geração; o retorno vira uma resposta em streaming.
            </Card>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "streamtext",
    section: "Backend e providers",
    title: "Entendendo streamText",
    minutes: 0.7,
    notes:
      "O streamText é a função central do backend. Ela recebe um objeto de configuração e inicia a geração de texto em modo streaming. Os dois parâmetros principais são model e messages. O model diz qual modelo usar — aqui, uma string como 'anthropic/claude-sonnet-5.5', que é o identificador usado no exemplo da documentação e que é resolvido pelo Vercel AI Gateway. O messages é o histórico convertido. O streamText não espera a resposta inteira: ele devolve imediatamente um objeto de resultado, e a propriedade stream desse resultado vai entregando os pedaços conforme o modelo gera. É isso que torna possível o efeito de texto aparecendo aos poucos.",
    render: () => (
      <SlideShell kicker="Backend" title={<>Entendendo <C>streamText</C></>}>
        <Two>
          <CodeBlock code={K.STREAMTEXT_CALL} file="trecho da rota" highlight={[3, 6]} />
          <div>
            <P>
              <C>streamText</C> inicia a geração de texto <strong>em modo streaming</strong> e retorna imediatamente um
              objeto de resultado, sem esperar a resposta completa.
            </P>
            <Bullets
              items={[
                <><C>model</C>: qual modelo usar. A string do exemplo oficial é resolvida pelo Vercel AI Gateway.</>,
                <><C>messages</C>: o histórico da conversa, já convertido.</>,
                <><C>result.stream</C>: os pedaços da resposta, entregues conforme são gerados.</>,
              ]}
            />
            <div className="mt-8">
              <Ref href={DOCS.streamText} />
            </div>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "resposta-http",
    section: "Backend e providers",
    title: "Transformando o resultado em resposta HTTP",
    minutes: 0.5,
    notes:
      "O streamText produz pedaços internos do AI SDK, mas o cliente precisa receber uma resposta HTTP. Duas funções fazem essa ponte. O toUIMessageStream pega o result.stream e o converte em um stream de mensagens de interface — o formato que o useChat sabe ler. Depois, o createUIMessageStreamResponse empacota esse stream em um objeto Response, que é o que a função POST retorna. Os cabeçalhos Content-Type e Content-Encoding aparecem no exemplo oficial do Expo para ajudar a evitar que a resposta seja armazenada inteira antes de ser enviada. A documentação inclusive avisa que, se o ambiente de deploy acumular a resposta, pode ser preciso hospedar o endpoint separadamente.",
    render: () => (
      <SlideShell kicker="Backend" title="Do resultado à resposta HTTP">
        <Flow
          className="mb-10"
          steps={[
            { label: "result.stream", sub: "pedaços do streamText", tone: "violet" },
            { label: "toUIMessageStream", sub: "converte para mensagens de UI", tone: "cyan" },
            { label: "createUIMessageStreamResponse", sub: "gera a Response HTTP", tone: "blue" },
            { label: "useChat no app", sub: "lê e exibe", tone: "green" },
          ]}
        />
        <Two cols="grid-cols-[1.1fr_1fr]">
          <CodeBlock code={K.RESPONSE_PART} file="trecho da rota" highlight={[2, 4, 5]} />
          <div>
            <P>
              Os cabeçalhos do exemplo oficial ajudam a evitar que a resposta seja <strong>acumulada</strong> antes de ser
              enviada, preservando o streaming.
            </P>
            <Callout kind="warn">
              A documentação avisa: se o deploy acumular a resposta mesmo assim, uma alternativa é hospedar o endpoint em
              uma função separada.
            </Callout>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  // ── Configurações avançadas de streamText
  {
    id: "config",
    section: "Backend e providers",
    title: "Configurando a geração com streamText",
    minutes: 0.5,
    notes:
      "Além do modelo e das mensagens, o streamText aceita configurações que controlam a geração. Vou destacar quatro: maxOutputTokens, temperature, maxRetries e timeout. Elas entram no mesmo objeto, dentro da nossa API Route, como está no código. Os valores que aparecem aqui são ilustrativos — servem para explicar, não são recomendações universais. Uma observação da documentação: essas configurações se dividem em dois grupos. maxOutputTokens e temperature são opções de chamada do modelo, influenciam como ele gera. Já maxRetries e timeout são opções de requisição: controlam a comunicação, as tentativas e o tempo, sem mudar o conteúdo gerado. E nem todo provider suporta todas as opções; quando não suporta, o SDK gera um aviso.",
    render: () => (
      <SlideShell kicker="Backend · configurações" title={<>Configurando a geração com <C>streamText</C></>}>
        <Two cols="grid-cols-[1.25fr_1fr]">
          <CodeBlock code={K.ROUTE_SETTINGS} file="app/api/chat+api.ts" tag="valores ilustrativos" highlight={[8, 9, 10, 11, 12, 13, 14, 15]} small />
          <div className="flex flex-col gap-6">
            <Card title="Opções do modelo" tone="violet">
              <C>maxOutputTokens</C> e <C>temperature</C> influenciam <b>como</b> o modelo gera a resposta.
            </Card>
            <Card title="Opções de requisição" tone="blue">
              <C>maxRetries</C> e <C>timeout</C> controlam tentativas e tempo, sem mudar o conteúdo gerado.
            </Card>
            <Callout kind="warn">
              Nem todo provider suporta todas as opções. Quando não há suporte, o SDK gera um aviso em <C>warnings</C>.
            </Callout>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "max-output-tokens",
    section: "Backend e providers",
    title: "maxOutputTokens",
    minutes: 0.5,
    notes:
      "O maxOutputTokens define o número máximo de tokens que o modelo pode gerar na resposta. Mas o que é um token? De forma simples, é um pedaço de texto que o modelo processa: pode ser uma palavra inteira, parte de uma palavra ou um sinal de pontuação. Por isso, token não é a mesma coisa que palavra: 500 tokens não significam 500 palavras. Limitar a saída ajuda a controlar o tamanho das respostas — e, em geral, o custo, já que os provedores costumam cobrar por token. O cuidado é que, se o limite for atingido, a resposta é interrompida, podendo terminar no meio de uma ideia. O valor 500 aqui é só um exemplo.",
    render: () => (
      <SlideShell kicker="Configurações · 1 de 4" title={<><C>maxOutputTokens</C>: limite de tamanho da resposta</>}>
        <Two>
          <div>
            <P className="slide-body-lg">
              Define o <strong>número máximo de tokens</strong> que o modelo pode gerar na resposta.
            </P>
            <Card title="O que é um token?" tone="cyan" className="mb-6">
              Um pedaço de texto processado pelo modelo: pode ser uma palavra, parte de uma palavra ou pontuação. Token{" "}
              <b>não equivale</b> exatamente a uma palavra.
            </Card>
            <div className="flex flex-wrap gap-3 slide-caption font-mono">
              {["Pro", "gram", "ação", " para", " dispositivos", " móveis", "."].map((t, i) => (
                <span key={i} className="rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
            <div className="slide-chrome text-muted-foreground mt-3">Divisão ilustrativa — cada modelo tokeniza de um jeito.</div>
          </div>
          <div className="flex flex-col gap-6">
            <CodeBlock code={`maxOutputTokens: 500, // valor ilustrativo`} file="streamText" />
            <Card title="Por que limitar?" tone="green">
              Controla o tamanho das respostas e evita textos longos demais para uma tela de celular.
            </Card>
            <Callout kind="warn">
              Ao atingir o limite, a resposta é <b>interrompida</b> e pode terminar antes de concluir a ideia.
            </Callout>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "temperature",
    section: "Backend e providers",
    title: "temperature",
    minutes: 0.5,
    notes:
      "O temperature influencia a aleatoriedade da geração. A cada passo, o modelo escolhe o próximo token entre várias opções possíveis. Com uma temperatura mais baixa, ele tende a escolher as opções mais prováveis, e as respostas tendem a ser mais previsíveis — útil para respostas objetivas. Com uma temperatura mais alta, ele arrisca mais, e as respostas podem ser mais variadas — útil para tarefas criativas. Dois cuidados. Primeiro, isso não garante resultados determinísticos: mesmo baixa, a resposta pode mudar. Segundo, a documentação diz que o valor é repassado ao provider e que a faixa válida depende do provider e do modelo. Ela também recomenda configurar temperature ou topP, mas não os dois.",
    render: () => (
      <SlideShell kicker="Configurações · 2 de 4" title={<><C>temperature</C>: aleatoriedade da geração</>}>
        <P className="max-w-[1600px]">
          Influencia o quanto o modelo “arrisca” ao escolher o próximo token. O valor é repassado ao provider — o efeito e a{" "}
          <strong>faixa válida dependem do provider e do modelo</strong>.
        </P>
        <div className="grid grid-cols-2 gap-10 mt-6">
          <Card title="Temperatura mais baixa" tone="blue">
            <p>Tende a escolher as opções mais prováveis.</p>
            <p>→ respostas <b>mais previsíveis</b>, boas para respostas objetivas.</p>
          </Card>
          <Card title="Temperatura mais alta" tone="violet">
            <p>Dá mais chance a opções menos prováveis.</p>
            <p>→ respostas <b>mais variadas</b>, boas para tarefas criativas.</p>
          </Card>
        </div>
        <div className="grid grid-cols-[1fr_1.4fr] gap-10 mt-8 items-start">
          <CodeBlock code={`temperature: 0.7, // valor ilustrativo`} file="streamText" />
          <Callout kind="warn">
            Não garante resultado determinístico e não existe uma escala universal. A documentação recomenda definir{" "}
            <C>temperature</C> <b>ou</b> <C>topP</C>, não os dois.
          </Callout>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "max-retries",
    section: "Backend e providers",
    title: "maxRetries",
    minutes: 0.5,
    notes:
      "O maxRetries define o número máximo de tentativas adicionais quando a chamada falha. Por exemplo, se o provedor estiver momentaneamente sobrecarregado, o SDK pode tentar de novo automaticamente. Segundo a documentação atual, o padrão é 2 — ou seja, mesmo sem configurar nada, já existem até duas novas tentativas. Se colocarmos 0, as tentativas adicionais são desativadas e a primeira falha já vira erro. É importante não exagerar na interpretação: nem toda falha é repetida — um erro de chave inválida, por exemplo, não se resolve tentando de novo — e retries não garantem sucesso. Eles só aumentam a tolerância a falhas temporárias.",
    render: () => (
      <SlideShell kicker="Configurações · 3 de 4" title={<><C>maxRetries</C>: novas tentativas em caso de falha</>}>
        <Two>
          <div>
            <P className="slide-body-lg">
              Número máximo de <strong>tentativas adicionais</strong> quando ocorre uma falha elegível na chamada ao modelo.
            </P>
            <div className="flex items-center gap-4 mt-8">
              {[
                { l: "Tentativa 1", s: "falha", c: "border-destructive/60" },
                { l: "Retry 1", s: "falha", c: "border-amber/60" },
                { l: "Retry 2", s: "sucesso ou erro", c: "border-green/60" },
              ].map((x, i) => (
                <div key={i} className={`flex-1 rounded-2xl border-2 bg-card/70 p-5 text-center ${x.c}`}>
                  <div className="slide-caption font-semibold">{x.l}</div>
                  <div className="slide-chrome text-muted-foreground mt-1">{x.s}</div>
                </div>
              ))}
            </div>
            <div className="slide-chrome text-muted-foreground mt-3">Exemplo com maxRetries: 2 (ilustrativo).</div>
          </div>
          <div className="flex flex-col gap-6">
            <CodeBlock code={`maxRetries: 2, // padrão documentado\nmaxRetries: 0, // desativa novas tentativas`} file="streamText" />
            <Callout kind="warn">
              Nem toda falha é repetida (ex.: chave inválida) e retries <b>não garantem</b> sucesso — só aumentam a
              tolerância a falhas temporárias.
            </Callout>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "timeout",
    section: "Backend e providers",
    title: "timeout",
    minutes: 0.7,
    notes:
      "Por último, o timeout, que define limites de tempo. Ele pode ser um número em milissegundos, que vale como limite total, ou um objeto com campos específicos. totalMs é o limite da operação inteira, incluindo todas as etapas. stepMs é o limite de cada etapa — isso faz sentido em fluxos com várias etapas, como as Tools que veremos adiante. E chunkMs é o tempo máximo sem receber um novo pedaço depois que a resposta começou; ele serve para detectar streams que travaram no meio. Quando um limite é atingido, a chamada é abortada e o cliente recebe um erro. E não confundam com maxRetries: o timeout limita o tempo; o maxRetries controla novas tentativas. Os valores aqui são exemplos e devem ser ajustados para cada modelo e caso de uso.",
    render: () => (
      <SlideShell kicker="Configurações · 4 de 4" title={<><C>timeout</C>: limites de tempo</>}>
        <Two cols="grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-6">
            <CodeBlock
              code={`// número: limite total em ms\ntimeout: 30_000,\n\n// ou objeto (valores ilustrativos)\ntimeout: {\n  totalMs: 30_000,\n  stepMs: 15_000,\n  chunkMs: 10_000,\n},`}
              file="streamText"
            />
            <Callout kind="info">
              <C>timeout</C> limita <b>tempo</b>; <C>maxRetries</C> controla <b>novas tentativas</b>. São coisas diferentes.
            </Callout>
          </div>
          <div className="flex flex-col gap-5">
            <Card title={<C>totalMs</C>} tone="cyan">
              Limite da operação inteira, incluindo todas as etapas.
            </Card>
            <Card title={<C>stepMs</C>} tone="violet">
              Limite de cada etapa de chamada ao modelo — útil em fluxos com várias etapas (Tools).
            </Card>
            <Card title={<C>chunkMs</C>} tone="blue">
              Tempo máximo sem novos pedaços depois que a resposta começou. Detecta streams parados.
            </Card>
            <P className="slide-caption text-muted-foreground">
              Ao atingir um limite, a chamada é <b>abortada</b> e resulta em erro. Ajuste os valores ao modelo e ao caso de uso.
            </P>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "provider",
    section: "Backend e providers",
    title: "Escolhendo um Provider",
    minutes: 0.5,
    notes:
      "Um provider é o adaptador que conecta o AI SDK a um serviço de modelos. Diferentes provedores oferecem acesso a modelos diferentes. O tutorial usa o Vercel AI Gateway, que é o provider global padrão: por isso basta escrever o modelo como uma string, no formato fornecedor barra modelo. A documentação mostra também que dá para importar o gateway explicitamente do pacote ai. E, se quisermos usar outro provedor diretamente, instalamos o pacote dele — por exemplo @ai-sdk/openai — e criamos a instância com o nome do modelo. Cada provedor pode exigir suas próprias chaves e configurações. Não vou comparar preço ou desempenho entre eles porque isso muda com frequência e depende do caso.",
    render: () => (
      <SlideShell kicker="Providers" title="Escolhendo um Provider">
        <Two cols="grid-cols-[1.2fr_1fr]">
          <CodeBlock code={K.PROVIDER} file="formas de definir o modelo" small highlight={[2, 6]} />
          <div>
            <P>
              Um <strong>provider</strong> conecta o AI SDK a um serviço de modelos. Cada serviço oferece modelos diferentes.
            </P>
            <P>
              O tutorial usa o <strong>Vercel AI Gateway</strong>, o provider global padrão: por isso o modelo pode ser uma
              simples string <C>'fornecedor/modelo'</C>.
            </P>
            <Callout kind="info">
              Outros provedores exigem o pacote e a configuração próprios. Não há comparação de preço ou desempenho aqui por
              falta de fonte verificada.
            </Callout>
            <div className="mt-6">
              <Ref href={DOCS.providers} />
            </div>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  // ───────────── Parte 5 — Interface
  {
    id: "interface",
    section: "Interface e mensagens",
    title: "Conectando a interface ao backend",
    minutes: 0.4,
    notes:
      "Com o backend pronto, vamos para a interface, no arquivo app/(tabs)/index.tsx. A tela tem duas áreas: uma lista rolável com as mensagens e um campo de texto embaixo. O papel do frontend é capturar o que o usuário digita, enviar para a rota /api/chat e mostrar a resposta conforme ela chega. Quem faz a ligação entre essa tela e o backend é o hook useChat. Um detalhe específico do Expo: usamos o fetch de expo/fetch, e não o fetch padrão, porque é ele que suporta o recebimento da resposta em streaming no app.",
    render: () => (
      <SlideShell kicker="Interface" title="Conectando a interface ao backend">
        <Two cols="grid-cols-[1fr_1fr]">
          <div>
            <P>
              A tela fica em <C>app/(tabs)/index.tsx</C>. O frontend captura o texto, envia para <C>/api/chat</C> e exibe a
              resposta conforme ela chega.
            </P>
            <Bullets
              items={[
                <><C>useChat</C> liga a tela ao backend e guarda as mensagens.</>,
                <><C>expo/fetch</C> substitui o fetch padrão para permitir streaming (Expo 52+).</>,
                <><C>generateAPIUrl</C> monta o endereço correto da rota.</>,
              ]}
            />
          </div>
          <div className="flex justify-center">
            <div className="w-[380px] rounded-[48px] border-4 border-border bg-code-bg p-6 flex flex-col gap-4 shadow-glow">
              <div className="slide-chrome text-center text-muted-foreground">ilustração da tela</div>
              <div className="self-end rounded-2xl bg-blue/30 px-4 py-3 slide-caption">O que é Expo?</div>
              <div className="rounded-2xl bg-card px-4 py-3 slide-caption caret">Expo é uma plataforma para</div>
              <div className="flex-1" />
              <div className="rounded-xl border border-border px-4 py-3 slide-chrome text-muted-foreground">Say something...</div>
            </div>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "usechat",
    section: "Interface e mensagens",
    title: "Entendendo useChat",
    minutes: 0.7,
    notes:
      "Este é o código oficial da tela. O hook useChat, importado de @ai-sdk/react, gerencia toda a conversa. Ele recebe um transport: um DefaultChatTransport, que define como as mensagens são enviadas. Nele passamos duas coisas: o fetch do Expo, com uma conversão de tipo porque a assinatura é um pouco diferente do fetch global; e a URL da API, gerada pelo generateAPIUrl. Também passamos um onError que registra erros no console. Em troca, o useChat devolve messages, que é a lista atual de mensagens; error, se algo der errado; e sendMessage, a função para enviar. Repare que o texto digitado fica num useState separado — o hook não controla o campo de entrada.",
    render: () => (
      <SlideShell kicker="Interface" title={<>Entendendo <C>useChat</C></>}>
        <Two cols="grid-cols-[1.3fr_1fr]">
          <CodeBlock code={K.USECHAT} file="app/(tabs)/index.tsx" small highlight={[10, 11, 12, 13, 14]} />
          <div className="flex flex-col gap-5">
            <Card title={<C>transport</C>} tone="cyan">
              <C>DefaultChatTransport</C> define <b>como</b> enviar: com o <C>expoFetch</C> e para a URL da rota.
            </Card>
            <Card title="O que o hook devolve" tone="violet">
              <C>messages</C> (conversa atual), <C>error</C> e <C>sendMessage</C> (enviar).
            </Card>
            <Card title={<C>useState</C>} tone="blue">
              O texto do campo é estado local da tela; o hook não controla o input.
            </Card>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "sendmessage",
    section: "Interface e mensagens",
    title: "Mensagens e sendMessage",
    minutes: 0.5,
    notes:
      "Cada mensagem da conversa é um objeto com três propriedades: id, um identificador; role, que indica quem falou — user ou assistant; e parts, o conteúdo, que veremos no próximo slide. O envio acontece no TextInput. A cada alteração, o onChange guarda o texto no estado input. Quando o usuário confirma, o onSubmitEditing chama sendMessage passando um objeto com a propriedade text, e logo depois limpa o campo com setInput vazio. O sendMessage adiciona a mensagem do usuário à lista, envia o histórico para o servidor e atualiza a tela conforme a resposta chega.",
    render: () => (
      <SlideShell kicker="Interface" title={<>Mensagens e <C>sendMessage</C></>}>
        <Two cols="grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <CodeBlock code={K.SEND} file="app/(tabs)/index.tsx" highlight={[4, 7, 8]} />
            <div className="rounded-2xl border border-border bg-code-bg p-6 font-mono slide-caption">
              <span className="text-muted-foreground">// cada mensagem</span>
              <br />
              {"{ "}<span className="text-blue">id</span>, <span className="text-blue">role</span>,{" "}
              <span className="text-blue">parts</span>{" }"}
            </div>
          </div>
          <Steps
            items={[
              { t: "Entrada", d: <><C>onChange</C> guarda o texto em <C>input</C>.</> },
              { t: "Envio", d: <><C>sendMessage({"{ text: input }"})</C> ao confirmar.</> },
              { t: "Atualização", d: <>A mensagem entra em <C>messages</C> e a resposta é adicionada aos poucos.</> },
              { t: "Limpeza", d: <><C>setInput('')</C> esvazia o campo.</> },
            ]}
          />
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "parts",
    section: "Interface e mensagens",
    title: "Entendendo as partes da resposta",
    minutes: 0.5,
    notes:
      "A resposta do modelo não é guardada como um texto único, e sim como um array ordenado chamado parts. Cada parte tem um type. A mais comum é text, com o texto da resposta. Mas a documentação lista outros tipos, como partes de ferramentas, que veremos já já. A ordem importa: ela representa a sequência em que o conteúdo foi gerado, por isso percorremos o array com map e renderizamos cada parte na posição dela. O switch permite decidir como desenhar cada tipo. Uma observação: alguns modelos podem gerar partes de raciocínio, mas isso depende do modelo e do provedor, não está sempre disponível, e o exemplo oficial só renderiza texto.",
    render: () => (
      <SlideShell kicker="Interface" title={<>Entendendo as <C>parts</C> da resposta</>}>
        <Two cols="grid-cols-[1.2fr_1fr]">
          <CodeBlock code={K.PARTS} file="app/(tabs)/index.tsx" highlight={[4, 5, 6, 7]} />
          <div>
            <P>
              Cada mensagem tem um array <strong>ordenado</strong> de <C>parts</C>. A ordem representa a sequência em que o
              conteúdo foi gerado.
            </P>
            <Bullets
              items={[
                <><C>type: 'text'</C>: texto da resposta.</>,
                <><C>type: 'tool-…'</C>: chamadas e resultados de ferramentas.</>,
                <>O <C>switch</C> decide como renderizar cada tipo compatível.</>,
              ]}
            />
            <Callout kind="info" className="mt-6">
              Partes de raciocínio dependem do modelo e do provider e não estão sempre disponíveis. O exemplo oficial
              renderiza apenas texto.
            </Callout>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "api-url",
    section: "Interface e mensagens",
    title: "Gerador de URL da API",
    minutes: 0.5,
    notes:
      "O generateAPIUrl continua presente na documentação atual, em um arquivo utils.ts. Por que ele existe? Como usamos o expo/fetch, precisamos da URL completa, com o endereço base correto para cada ambiente. Em desenvolvimento, a função pega o experienceUrl do expo-constants — o endereço do servidor de desenvolvimento — e troca exp:// por http://. Em produção, ela usa a variável EXPO_PUBLIC_API_BASE_URL, que deve apontar para o servidor onde a API está publicada; se essa variável não existir, a função lança um erro para o problema aparecer logo. Notem que aqui usar EXPO_PUBLIC_ é correto, porque é só um endereço, não um segredo.",
    render: () => (
      <SlideShell kicker="Interface" title={<>Gerador de URL: <C>generateAPIUrl</C></>}>
        <Two cols="grid-cols-[1.75fr_1fr]">
          <CodeBlock code={K.API_URL} file="utils.ts" small highlight={[4, 7, 8, 11, 17]} />
          <div className="flex flex-col gap-5">
            <P className="slide-caption">
              Continua presente no tutorial atual. Com <C>expo/fetch</C>, é preciso a URL completa e correta para cada
              ambiente.
            </P>
            <Card title="Desenvolvimento" tone="cyan">
              Usa <C>Constants.experienceUrl</C>, trocando <C>exp://</C> por <C>http://</C>.
            </Card>
            <Card title="Produção" tone="violet">
              Usa <C>EXPO_PUBLIC_API_BASE_URL</C>; se faltar, lança erro.
            </Card>
            <Callout kind="info">Aqui o prefixo público é adequado: é um endereço, não um segredo.</Callout>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  // ───────────── Parte 6 — Tools
  {
    id: "tools",
    section: "Tools e multi-step",
    title: "O que são Tools?",
    minutes: 0.5,
    notes:
      "Agora entramos nas Tools. Modelos de linguagem são ótimos para gerar texto, mas têm dificuldade com tarefas exatas, como cálculos, e não têm acesso ao mundo externo, como o clima de hoje. Tools são ações que o modelo pode invocar. Aqui há uma distinção muito importante: o modelo não executa nada. Ele apenas decide que precisa de uma ferramenta e gera uma solicitação, com o nome da ferramenta e os dados de entrada. Quem executa de verdade é a nossa aplicação, no servidor, através da função que nós definimos. Depois, o resultado pode ser devolvido ao modelo para ele usar na próxima resposta.",
    render: () => (
      <SlideShell kicker="Tools" title="O que são Tools?">
        <P className="max-w-[1600px] slide-body-lg">
          Tools são <strong>ações que o modelo pode solicitar</strong>. Elas dão acesso a dados e operações que o modelo,
          sozinho, não tem — como consultar o clima ou fazer um cálculo exato.
        </P>
        <div className="grid grid-cols-2 gap-10 mt-10">
          <Card title="O modelo decide e solicita" tone="violet">
            <p>Gera uma <b>tool call</b>: o nome da ferramenta e os dados de entrada.</p>
            <p>Ele não executa código.</p>
          </Card>
          <Card title="A aplicação executa" tone="green">
            <p>O servidor roda a função <C>execute</C> definida por nós.</p>
            <p>O resultado pode voltar ao modelo.</p>
          </Card>
        </div>
        <Callout kind="info" className="mt-10">
          Só as ferramentas que a aplicação definiu podem ser solicitadas — o controle do que é permitido é nosso.
        </Callout>
      </SlideShell>
    ),
  },
  {
    id: "definindo-tool",
    section: "Tools e multi-step",
    title: "Definindo uma ferramenta",
    minutes: 0.7,
    notes:
      "Este é o exemplo oficial da ferramenta weather. Ela é criada com a função tool, do pacote ai, e tem três partes. A description, em linguagem natural, ajuda o modelo a entender quando usar a ferramenta. O inputSchema, escrito com Zod, define a entrada: um objeto com location do tipo string, com uma descrição. O modelo vai tentar extrair essa informação da conversa; se não conseguir, pode perguntar ao usuário. E o execute é a função assíncrona que roda no servidor. Atenção: no tutorial, ela não consulta nenhum serviço meteorológico — ela gera um número aleatório entre 32 e 90 graus Fahrenheit. Ou seja, é um dado simulado. Como roda no servidor, ela poderia chamar uma API real.",
    render: () => (
      <SlideShell kicker="Tools" title={<>Definindo uma ferramenta com <C>tool</C> e Zod</>}>
        <Two cols="grid-cols-[1.3fr_1fr]">
          <CodeBlock code={K.TOOL_DEF} file="app/api/chat+api.ts" highlight={[5, 6, 7, 8, 9, 10]} small />
          <div className="flex flex-col gap-5">
            <Card title={<>Nome — <C>weather</C></>} tone="cyan">
              A chave do objeto. Também define o tipo de parte na interface: <C>tool-weather</C>.
            </Card>
            <Card title={<C>description</C>} tone="blue">
              Ajuda o modelo a decidir <b>quando</b> usar a ferramenta.
            </Card>
            <Card title={<C>inputSchema</C>} tone="violet">
              Esquema Zod da entrada. O modelo extrai <C>location</C> da conversa.
            </Card>
            <Card title={<C>execute</C>} tone="green">
              Roda no servidor. No tutorial, retorna temperatura <b>aleatória</b> (simulada).
            </Card>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "clima",
    section: "Tools e multi-step",
    title: "Exemplo prático: consultar o clima",
    minutes: 0.5,
    notes:
      "Vamos colocar a ferramenta em uma situação real de uso. O usuário pergunta: 'Como está o clima em São Paulo?'. Primeiro, a pergunta chega ao servidor. Segundo, o modelo percebe, pela descrição, que a ferramenta weather é adequada e solicita a chamada com location igual a São Paulo. Terceiro, o servidor executa a função. Quarto, o resultado volta para o fluxo do AI SDK. Quinto, o modelo pode usar esse resultado para formular a resposta. Repito: com o código do tutorial, a temperatura é um número aleatório, então isso não é o clima atual de São Paulo. Para dados reais, a função execute precisaria chamar um serviço meteorológico.",
    render: () => (
      <SlideShell kicker="Tools" title="Exemplo prático: “Como está o clima em São Paulo?”">
        <Two cols="grid-cols-[1.3fr_1fr]">
          <Steps
            items={[
              { t: "O usuário faz a pergunta", d: "A mensagem chega à API Route com o histórico." },
              { t: "O modelo solicita a ferramenta", d: <>Tool call <C>weather</C> com <C>{"{ location: 'São Paulo' }"}</C>.</> },
              { t: "O servidor executa a função", d: <>O AI SDK chama o <C>execute</C> que definimos.</> },
              { t: "O resultado volta ao fluxo", d: <>Ex.: <C>{"{ location, temperature }"}</C>.</> },
              { t: "O modelo formula a resposta", d: "Usando o resultado da ferramenta (com multi-step habilitado)." },
            ]}
          />
          <div className="flex flex-col justify-center gap-6">
            <Callout kind="sim">
              No tutorial, <C>temperature</C> é um <b>número aleatório</b>. Não é o clima atual de São Paulo.
            </Callout>
            <Card title="Para dados reais" tone="green">
              O <C>execute</C> roda no servidor, então poderia consultar uma API meteorológica de verdade.
            </Card>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "backend-ui-tools",
    section: "Tools e multi-step",
    title: "Atualizando o backend e a interface",
    minutes: 0.5,
    notes:
      "Para ativar a ferramenta, mudamos dois lugares. No servidor, adicionamos o objeto tools dentro do streamText, com a ferramenta weather — é ali que fica a lógica, a validação e a execução. Na interface, não existe código da ferramenta: o app só exibe o que aconteceu. A documentação explica que as partes de ferramenta se chamam tool- seguido do nome, então aqui é tool-weather. O exemplo oficial simplesmente mostra essa parte como JSON, com a chamada e o resultado. A documentação também observa que, nesse ponto, a resposta em texto pode ficar em branco: o modelo gerou a chamada da ferramenta e encerrou. Isso nos leva ao próximo conceito.",
    render: () => (
      <SlideShell kicker="Tools" title="Atualizando o backend e a interface">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-5">
            <div className="slide-kicker text-violet">Servidor · executa a ferramenta</div>
            <CodeBlock code={K.ROUTE_TOOLS} file="app/api/chat+api.ts" highlight={[4, 5, 6]} />
          </div>
          <div className="flex flex-col gap-5">
            <div className="slide-kicker text-cyan">Interface · só exibe o resultado</div>
            <CodeBlock code={K.UI_TOOLS} file="app/(tabs)/index.tsx" highlight={[4, 5, 6, 7, 8]} small />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 mt-8">
          <P className="slide-caption">
            Partes de ferramenta se chamam <C>tool-{"{nome}"}</C>: aqui, <C>tool-weather</C>. O exemplo oficial as mostra
            como JSON.
          </P>
          <Callout kind="warn">Nesta etapa a resposta em texto pode ficar vazia: o modelo gerou a tool call e parou.</Callout>
        </div>
      </SlideShell>
    ),
  },
  {
    id: "multistep",
    section: "Tools e multi-step",
    title: "Multi-step Tool Calls",
    minutes: 0.7,
    notes:
      "Por que o texto fica vazio? Porque, quando o modelo gera uma chamada de ferramenta, aquela geração tecnicamente terminou. Ele pediu a ferramenta, o servidor executou, mas o modelo não teve uma nova oportunidade de ler o resultado. A solução é permitir várias etapas com stopWhen. A documentação atual diz que o padrão é isStepCount(1) — para depois da primeira etapa. Uma observação: versões anteriores usavam stepCountIs; a documentação atual usa isStepCount. Com isStepCount(5), o modelo pode usar até 5 etapas: pedir a ferramenta, receber o resultado e continuar gerando, inclusive chamando outra ferramenta, como a conversão de Fahrenheit para Celsius do tutorial. O limite existe para controle: evita ciclos longos de chamadas, que gastariam tempo e recursos.",
    render: () => (
      <SlideShell kicker="Multi-step" title="Multi-step Tool Calls">
        <Two cols="grid-cols-[1.15fr_1fr]">
          <CodeBlock code={K.MULTISTEP} file="app/api/chat+api.ts" highlight={[6, 14]} small />
          <div>
            <P>
              Ao gerar uma tool call, a geração termina. Com <C>stopWhen</C>, o modelo ganha <strong>novas etapas</strong> para
              ler o resultado e continuar.
            </P>
            <Bullets
              items={[
                <>Padrão documentado: <C>isStepCount(1)</C>.</>,
                <><C>isStepCount(5)</C>: até 5 etapas por geração.</>,
                "Permite encadear ferramentas (ex.: clima → conversão para Celsius).",
                "O limite evita ciclos longos de chamadas.",
              ]}
            />
            <Callout kind="info" className="mt-6">
              Versões anteriores usavam <C>stepCountIs</C>; a documentação atual usa <C>isStepCount</C>.
            </Callout>
          </div>
        </Two>
      </SlideShell>
    ),
  },
  {
    id: "demo",
    section: "Tools e multi-step",
    title: "Fluxo completo e demonstração",
    minutes: 0.9,
    notes:
      "Para fechar a parte técnica, uma demonstração do fluxo completo. Deixo claro: é uma simulação feita nesta página, não existe nenhum modelo nem API conectados. Vou avançar etapa por etapa. Primeiro, o usuário pergunta sobre o clima. Na etapa um, o modelo decide chamar a ferramenta weather. O servidor executa o execute. O resultado volta — e esse número é simulado, como no tutorial. Graças ao stopWhen, o modelo tem uma segunda etapa: lê o resultado e continua. E, por fim, gera a resposta final em texto, que chega por streaming até a tela. Esse é o ciclo que conecta todos os conceitos que vimos: API Route, streamText, useChat, parts, Tools e multi-step.",
    render: () => (
      <SlideShell kicker="Demonstração" title="Fluxo completo — clique para avançar">
        <MultiStepDemo />
      </SlideShell>
    ),
  },
  // ───────────── Parte 7 — Encerramento
  {
    id: "resumo",
    section: "Encerramento",
    title: "Resumo e conclusão",
    minutes: 0.7,
    notes:
      "Para resumir. O AI SDK integra aplicações a modelos de IA com uma API consistente. O HTTP Streaming permite receber respostas progressivamente. A API Route separa o cliente da comunicação com o modelo e protege a chave. O streamText gera a resposta, e configurações como maxOutputTokens, temperature, maxRetries e timeout ajudam a controlar tamanho, variação, tentativas e tempo. O useChat gerencia a conversa na interface. Providers permitem configurar o acesso aos modelos. Tools conectam o modelo a funções definidas pela aplicação, e as multi-step tool calls permitem fluxos com várias etapas. Juntos, esses recursos formam a base para construir experiências de IA mais interativas em aplicativos Expo. As referências estão na tela. Obrigado, e fico à disposição para perguntas.",
    render: () => (
      <SlideShell kicker="Encerramento" title="Resumo e conclusão">
        <div className="grid grid-cols-[1.5fr_1fr] gap-14 h-full">
          <div className="grid grid-cols-2 gap-x-10 gap-y-4 content-start">
            {[
              ["AI SDK", "integra apps a modelos de IA"],
              ["HTTP Streaming", "resposta progressiva"],
              ["API Route", "separa cliente e modelo; protege a chave"],
              ["streamText + config.", "geração com limites de tamanho, variação, tentativas e tempo"],
              ["useChat", "gerencia a conversa na interface"],
              ["Providers", "configuram o acesso aos modelos"],
              ["Tools", "conectam o modelo a funções da aplicação"],
              ["Multi-step", "fluxos com várias etapas"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-border bg-card/60 px-6 py-4">
                <div className="slide-caption font-semibold text-cyan">{t}</div>
                <div className="slide-chrome !whitespace-normal text-foreground/80 mt-1">{d}</div>
              </div>
            ))}
            <P className="col-span-2 mt-4 slide-caption">
              Juntos, esses recursos formam a base para experiências de IA mais interativas em aplicativos Expo.
            </P>
          </div>
          <div className="rounded-2xl border border-border bg-code-bg p-7 flex flex-col gap-3">
            <div className="slide-kicker text-violet mb-2">Documentação oficial</div>
            {Object.values(DOCS).map((u) => (
              <a key={u} href={u} target="_blank" rel="noreferrer" className="slide-chrome !whitespace-normal break-all text-foreground/80 hover:text-cyan">
                {u.replace("https://", "")}
              </a>
            ))}
          </div>
        </div>
      </SlideShell>
    ),
  },
];

export const totalMinutes = slides.reduce((a, s) => a + s.minutes, 0);
