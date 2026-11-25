# Expo AI Agent Toolkit — Seminário React Native & Expo

**Autor:** Tiago Venâncio  
**Disciplina:** Desenvolvimento para Dispositivos Móveis — ADS (IFSP Caraguatatuba)  
**Professor:** Renan Cavichi

Apresentação interativa em **HTML, CSS e JavaScript puro** sobre o **Expo AI Agent Toolkit**, estruturada para um seminário de **~20 minutos** (**13 slides principais** — com o Slide 7 dividido em duas etapas, totalizando 14 telas — organizados em 3 blocos: *O problema*, *A solução e a tecnologia* e *Alternativas e conclusão*), utilizando o estudo de caso contínuo de um aplicativo de reservas de restaurante (**Restaurante Caraguá**).

---

## Resumo Técnico (Tópicos do Seminário)

### 1. Que problema ela resolve?
Agentes de IA conseguem gerar telas e lógica em React Native rapidamente, mas **gerar código não é o mesmo que verificar o aplicativo em execução**. Sem enxergar ou interagir com a interface rodando, a IA não percebe falhas visuais ou de usabilidade que só aparecem no dispositivo — como, por exemplo, o teclado virtual cobrindo um campo de formulário durante a digitação. O **Expo AI Agent Toolkit** resolve essa lacuna conectando o agente de IA ao aplicativo em execução para **observar, interagir, testar e corrigir** problemas reais.

### 2. Quais os principais recursos?
- **Inspeção de UI (`agent-device snapshot -i`):** extrai uma árvore enxuta de elementos interativos (`@e1`, `@e2`, ...) para o agente entender a tela sem depender apenas de imagens pesadas.
- **Automação de interações:** permite abrir o app, tocar em botões, digitar textos, rolar telas e validar fluxos ponta a ponta (E2E) diretamente pelo agente.
- **Múltiplos ambientes de execução:** funciona em **emuladores/simuladores locais** (Android Emulator / iOS Simulator), **na nuvem via EAS Simulators** (`eas simulator:exec`) e em **dispositivos físicos** via USB (além de suporte a web/TV no `agent-device`).
- **Integração com MCP e Expo Skills:** conecta-se a agentes como Claude Code, Cursor e Codex via **Model Context Protocol (MCP)** e complementa o **Expo Skills** (regras de geração de código) com verificação prática em tempo de execução.
- **Diagnóstico avançado com Argent:** alternativa mantida pela Software Mansion que, além de interação via MCP, oferece inspeção da árvore de componentes React, leitura de logs e *profiling* de performance.

### 3. Tem alguma limitação?
- **Não controla o Expo Go:** ferramentas como `agent-device` e `Argent` exigem **builds nativos de desenvolvimento** ou simuladores em execução; o Expo Go serve apenas para visualização manual do desenvolvedor.
- **Dependência de ambiente:** rodar iOS Simulator localmente exige macOS (no Windows ou em CI/CD, é necessário recorrer ao **EAS Simulators** na nuvem).
- **Custo de contexto/tokens:** fluxos E2E muito longos ou baseados em capturas de tela completas consomem mais tokens do modelo (daí a vantagem de snapshots enxutos como `snapshot -i`).

### 4. Quais as principais diferenças entre recursos similares?

| Ferramenta | Papel principal | Alvos / Ambientes | Diferencial |
| :--- | :--- | :--- | :--- |
| **`agent-device`** (Callstack) | Controle e automação E2E por agentes via CLI | Android, iOS, dispositivos físicos, web e TV + EAS Simulators | `snapshot -i` leve e econômico em tokens; ótimo para scripts e aparelhos reais |
| **`Argent`** (Software Mansion) | Inspeção e automação de apps via servidor MCP | Android Emulator e iOS Simulator (locais ou EAS Simulators) | Inspeção da árvore de componentes React, logs e *profiling* de performance |
| **`Expo Skills`** (`expo/skills`) | Diretrizes em Markdown (`SKILL.md`) para geração de código | Editor de código / LLM (antes da execução) | Garante boas práticas ao escrever código, mas não executa nem testa o app |
| **`Maestro`** | Framework declarativo de testes E2E em YAML | Emuladores e dispositivos móveis | Excelente para suítes E2E determinísticas em CI, enquanto o toolkit permite ao agente investigar e corrigir de forma autônoma |

> **Observação:** `agent-device` e `Argent` são **opções alternativas e independentes**, não etapas obrigatórias de um mesmo fluxo.

---

## Como executar a apresentação

O projeto não requer instalação de dependências (`npm install`) nem etapa de build:

1. Abra o arquivo [index.html](index.html) diretamente no navegador (Chrome, Edge ou Firefox), **ou**
2. Sirva a pasta com qualquer servidor HTTP local, por exemplo:
   ```bash
   npx serve .
   ```

---

## Controles e Recursos da Apresentação

| Comando / Controle | Ação |
| :--- | :--- |
| `→`, `Espaço`, `PageDown` | Avançar para o próximo slide |
| `←`, `PageUp` | Voltar para o slide anterior |
| `Home` / `End` | Ir para o primeiro / último slide |
| `O` ou `G` | Abrir/fechar o **Panorama** (grade com visão geral dos slides) |
| `T` | Alternar entre o **Tema Claro (2010)** e o **Tema Escuro** |
| `F` | Ativar/desativar **Tela Cheia** |
| `Esc` | Fechar o modal de Panorama |
| **Cronômetro** (rodapé) | Iniciar/pausar (`▶`) e zerar (`↺`) o tempo com meta de `20:00` |

### Demonstrações interativas incluídas
- **Slide 3:** Wireframe interativo ligado aos 5 requisitos do aplicativo *Restaurante Caraguá*.
- **Slide 4:** Terminal simulado gerando a primeira versão do aplicativo.
- **Slide 5:** Emulador interativo mostrando o teclado virtual subindo ao tocar em “Telefone” e tampando o próprio campo.
- **Slide 7 e 7-2:** Guia visual dos 3 ambientes de execução (Emulador Local, EAS Simulators e Celular Físico) e passo a passo de instalação do `agent-device`.
- **Slide 8:** Inspeção visual de referências da árvore de UI (`@e1`..`@e5`) com `agent-device snapshot -i`.
- **Slide 9:** Execução do fluxo de reservas (caminho feliz e detecção da falha de obstrução pelo teclado).
- **Slide 10:** Ciclo completo de depuração (*Detectar → Investigar → Corrigir → Retestar → Validar*) aplicando `KeyboardAvoidingView` + `ScrollView` com comparador Antes/Depois.
- **Slides 11 e 12:** Visão geral do **Argent** (Software Mansion), comparativo direto com `agent-device` e critérios práticos de escolha.

---

## Estrutura dos Arquivos

- [index.html](index.html) — Estrutura dos slides, demonstrações interativas e barra de controles.
- [styles.css](styles.css) — Estilização, layout responsivo dos slides e temas (Claro 2010 / Escuro).
- [app.js](app.js) — Navegação, atalhos de teclado, cronômetro, modal de panorama e interações dos slides.

---

## Referências Oficiais

- [Expo AI Agents](https://docs.expo.dev/agents/)
- [agent-device (Callstack)](https://docs.expo.dev/agents/agent-device/)
- [Argent (Software Mansion)](https://docs.expo.dev/agents/argent/)
