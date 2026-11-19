# Seminário: Vercel AI SDK no Expo

* **Aluno:** Angelo Gabriel Machado Gonçalves de Souza
* **Prontuário (CG):** 3035132
* **Disciplina:** Programação para Dispositivos Móveis (ADS - 2026/2)[cite: 2, 43]
* **Link da Apresentação Online:** [https://pixel-perfect-replay-72801.lovable.app](https://pixel-perfect-replay-72801.lovable.app)[cite: 46]

---

## Sobre a Apresentação

Esta aplicação web interativa apresenta a integração do **Vercel AI SDK** em aplicativos mobile desenvolvidos com **React Native e Expo**[cite: 43, 44]. O material foi estruturado para explicar passo a passo a arquitetura, configuração e boas práticas de comunicação com Modelos de Linguagem (LLMs) em dispositivos móveis[cite: 43, 44, 45].

### Tópicos Abordados (Resumo para Consulta)

1. **Conceitos Fundamentais:**
   * **Prompt Engineering:** Contextualização de mensagens (`system`, `user`, `assistant`) para guiar o comportamento do modelo[cite: 43].
   * **HTTP Streaming:** Transmissão contínua da resposta em tempo real (reduzindo a latência percebida no mobile em comparação a requisições REST tradicionais)[cite: 43].
2. **Setup e Pré-requisitos:**
   * Ambiente com Node.js 22+ e gerenciador `pnpm`[cite: 43].
   * Criação do projeto (`pnpm create expo-app@latest`) e instalação dos pacotes principais: `ai`, `@ai-sdk/react` e `zod`[cite: 43].
   * Configuração da chave de API (`AI_GATEWAY_API_KEY`) no arquivo `.env.local`[cite: 43].
3. **API Route (Backend / Serverless):**
   * Criação do handler `POST` que recebe o histórico de `messages`[cite: 43].
   * Uso da função `streamText` para comunicação com o modelo[cite: 44].
   * Conversão e retorno do fluxo com `toUIMessageStream` e `createUIMessageStreamResponse`[cite: 44].
4. **Provedores de Modelos (Providers):**
   * Uso do **Vercel AI Gateway** como provedor padrão via identificador em string[cite: 44].
   * Flexibilidade para alternar entre provedores diretos (OpenAI, Anthropic, Google, etc.) sem reescrever a lógica do app[cite: 44].
5. **Interface Mobile com `useChat`:**
   * Consumo da rota `/api/chat` no React Native através do hook `useChat` (`@ai-sdk/react`)[cite: 44].
   * Gerenciamento de estado com `messages` e envio de prompts via `sendMessage`[cite: 44].
   * Renderização progressiva através do array ordenado `parts` (texto plano, tokens de raciocínio e chamadas de ferramentas)[cite: 45].
6. **Multi-Step Tool Calls (Ferramentas):**
   * Capacidade de permitir que o LLM execute funções/ações definidas no código[cite: 45].
   * Validação de parâmetros com esquemas `zod` e ciclo de execução em múltiplos passos[cite: 43, 45].

---

## Como Utilizar a Apresentação

### Opção 1: Acesso Direto pelo Navegador (Recomendado)
Basta acessar o link publicado no Lovable para visualizar os slides e exemplos de código:
👉 **[https://pixel-perfect-replay-72801.lovable.app](https://pixel-perfect-replay-72801.lovable.app)**

* **Navegação:** Utilize as setas do teclado (`←` / `→`) ou os botões de controle na interface para avançar e retroceder entre os slides.

### Opção 2: Executando Localmente

Caso deseje rodar o projeto da apresentação na sua máquina, certifique-se de ter o **Node.js** instalado e siga os passos abaixo:

```bash
# 1. Clone o repositório da turma
git clone [https://github.com/renancavichi/seminarios-react-native-ads-2026-2.git](https://github.com/renancavichi/seminarios-react-native-ads-2026-2.git)

# 2. Acesse a pasta do projeto
cd seminarios-react-native-ads-2026-2/Ai-SDK-Expo

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev