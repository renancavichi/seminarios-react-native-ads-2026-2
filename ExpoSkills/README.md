Autor: Felipe Pastore Cursino

# Expo Skills: padronização e inteligência de código no React Native

Expo Skills (`expo/skills`) é um repositório de instruções e diretrizes para assistentes de Inteligência Artificial (Cursor, Claude Code, GitHub Copilot) que orienta a geração de código React Native. Sua estrutura declarativa em Markdown (`SKILL.md`) permite descrever os padrões arquiteturais, regras de navegação e limites nativos; as regras cuidam de manter a IA no caminho certo. Assim, o desenvolvedor continua responsável pelo fluxo da aplicação, enquanto o Expo Skills garante que a IA não gere código obsoleto.

Criado e mantido pela equipe oficial da **Expo**, o projeto foi inspirado pela necessidade de combater as alucinações de LLMs. Como muitos modelos foram treinados com dados antigos de React Native (Bare Workflow), eles tendem a sugerir configurações incorretas para projetos modernos.

## Instalação no Expo SDK 52/53

Os exemplos deste material usam a CLI universal de skills em um projeto Expo já criado. No diretório do seu aplicativo, instale as regras de contexto:

```
npx skills@latest add expo/skills --skill '*'

```

O `npx skills` baixa e configura as diretrizes na pasta correspondente ao seu editor (como `.cursor/rules/`). A opção `--skill '*'` garante que todos os módulos (navegação, builds, upgrades) sejam adicionados. Em ferramentas de linha de comando como o Claude Code, a instalação ocorre via sistema de plugins (`claude plugin install expo`). Consulte a documentação da ferramenta de IA escolhida antes de adaptar a instalação.

## Primeira interação com a IA

Os módulos de regras, como o `expo-router`, atuam silenciosamente no momento em que você envia um prompt para a IA, injetando restrições junto à sua requisição:

```
// Exemplo do resultado gerado pela IA ao pedir "uma tela de perfil":
// ✅ app/user/[id].tsx (Forçado pelo expo-router/SKILL.md)
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <View style={{ flex: 1, backgroundColor: '#1E293B' }}>
      <Text>Perfil do Usuário: {id}</Text>
    </View>
  );
}

```

* **Estrutura baseada em arquivos** define que o código deve ir para a pasta `app/` em vez de `src/screens/`.

* **Rotas tipadas** forçam a utilização de hooks modernos, como `useLocalSearchParams`, ignorando o antigo `route.params` do React Navigation.

* **Isolamento nativo** impede que a IA sugira modificar arquivos `App.js` com wrappers manuais, o que quebraria as convenções do SDK atual.

O contexto é recarregado a cada nova requisição. No laboratório de testes, atualizar o SDK exige a atualização dessas regras para garantir que a IA acompanhe a evolução do framework.

## Lidando com configurações nativas (EAS)

O destino do código gerado também depende do ecossistema de compilação. Quando o foco muda para permissões ou builds, o módulo `eas-build` transita a IA para novos padrões:

```
// app.json forçado pela IA em vez de editar o AndroidManifest.xml
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access camera."
        }
      ]
    ]
  }
}

```

Esse padrão protege as pastas `/ios` e `/android`. Para experimentar, peça à sua IA: *"Adicione permissões de câmera ao meu aplicativo"* e observe ela utilizar **Config Plugins** em vez de sugerir edições nativas destrutivas (que seriam apagadas no fluxo gerenciado do Expo).

## Estrutura interna: Globs, Triggers e Regras

Cada `SKILL.md` define exatamente quando e onde a IA deve intervir:

* **globs** usa padrões de caminhos de arquivos para ativar o contexto. Por exemplo, `globs: ["app.json", "eas.json"]` faz as regras do EAS "acordarem" apenas quando você estiver trabalhando com esses arquivos.

* **triggers** usa palavras-chave. Uma lista como `['upgrade', 'sdk version', 'doctor']` chama a atenção do modelo para aplicar o protocolo de segurança durante atualizações.

* **instruções** enumeram o que não fazer. O comportamento da IA obedece estritamente a diretivas como *"nunca use npm install direto, use npx expo install --fix"*.

As *instruções* descrevem a regra de negócios; os *triggers* descrevem quando ela deve ser lida antes de começar a codificar.

## Limitações e dependência do MCP

O Expo Skills atua como a "Mente" (conhecimento), mas não como as "Mãos". Ele fornece regras intermediárias para a IA interpretar, mas **não** executa os comandos no seu terminal de forma autônoma.

Para a execução de comandos automatizados, a ferramenta depende de conectores **MCP (Model Context Protocol)**. Além disso, existe o *Version Drift* (defasagem de versão): a key de identificação das regras expira conforme a Expo lança novos SDKs, exigindo que você rode o comando de atualização esporadicamente para renovar a "mente" do seu assistente.

## Diagnósticos de Erros e conclusão

Deslocamento de versões de módulos, cache quebrado e erros de Babel podem ser mitigados com o módulo `expo-troubleshooting`. No processo de depuração de código gerado, a IA aprende regras cruciais (como garantir que o plugin do `react-native-reanimated` seja estritamente o último no arquivo `babel.config.js`).

Testes com IAs desprovidas de contexto perdem horas em falsos diagnósticos. O *skill* de suporte permite reagir à conclusão imediata do erro, como disparar `npx expo start --clear` antes de sugerir reescrever metade da aplicação.

## Quando usar Expo Skills

A ferramenta mantém o início, as diretrizes e a transição do conhecimento muito próximos do seu editor de código, facilitando upgrades seguros e blindagem nativa. Em contrapartida, ela acrescenta arquivos de configuração ao projeto (`.cursorrules`) e exige atenção a cada troca de SDK.

| Ferramenta | Abordagem e exemplo de uso | 
| ----- | ----- | 
| **Expo Skills** | Regras declarativas mantidas oficialmente; útil para ditar a arquitetura e garantir compatibilidade. | 
| **MCP Protocol** | Servidores que fornecem ferramentas e ações diretas; útil para leitura de logs e execução de CLI. | 
| **Prompts Manuais** | Regras copiadas e coladas por conta própria; atende a necessidades muito específicas e temporárias da equipe. | 
| **IA Genérica (Padrão)** | Reprodução de conhecimento da web em massa, propensa a alucinações sobre versões antigas (pré-SDK 49). | 

## Exemplos deste material

A apresentação original reúne exemplos de entrada de dados, falhas comuns sem contexto, matriz comparativa de arquitetura (Mente vs. Mãos) e impacto nas métricas de compilação. Os comparativos "Antes vs. Depois" das alucinações estão disponíveis no slide deck interativo.

Para consultar os slides gerados nesta apresentação, abra o arquivo `expo_skills_presentation.html` ou analise a estrutura lógica do sandbox no componente `expo_skills_sandbox.jsx`.

## Referências

* Documentação Oficial da Expo

* Repositório GitHub: `expo/skills`

* Model Context Protocol (MCP) Core API

* React Native New Architecture Guides