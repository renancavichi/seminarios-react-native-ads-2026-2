# Background Tasks

Aplicativo de demonstração com Expo SDK 54 para estudar o `expo-background-task` e o `expo-task-manager`. Como exemplo de trabalho, uma tarefa em segundo plano solicita uma notificação local com a mensagem configurada. A tela permite registrar e cancelar a tarefa, escolher o intervalo mínimo e experimentar o disparo do worker em uma development build.

## Que problema o Expo Background Task resolve?

Ao sair da tela, o sistema pode suspender o aplicativo. O `expo-background-task` permite solicitar ao Android ou ao iOS uma oportunidade futura para executar **trabalho adiável**, sem exigir que a interface esteja aberta. Exemplos incluem sincronizar dados pendentes, buscar conteúdo antecipadamente e executar manutenção local. É adequado quando o trabalho é útil, mas não precisa começar imediatamente nem em um horário exato.

O Expo usa o [WorkManager no Android](https://developer.android.com/develop/background-work/background-tasks/persistent) e o [BGTaskScheduler no iOS](https://developer.apple.com/documentation/backgroundtasks/bgtaskscheduler). Essas APIs nativas decidem quando executar o trabalho considerando as condições e políticas de cada sistema. O `expo-task-manager` fornece a infraestrutura para definir e executar o código JavaScript da tarefa. Consulte a [documentação do BackgroundTask](https://docs.expo.dev/versions/latest/sdk/background-task/) e a [do TaskManager](https://docs.expo.dev/versions/latest/sdk/task-manager/).

## Como funciona e quais são os recursos?

1. **Definir:** `TaskManager.defineTask(nome, executor)` associa um nome a uma função. A definição deve ficar no escopo global de um módulo carregado na inicialização, pois a tarefa pode executar sem componentes React montados.
2. **Registrar:** `BackgroundTask.registerTaskAsync(nome, { minimumInterval: 15 })` solicita o agendamento usando o mesmo nome. O intervalo é em minutos e representa um mínimo, não um horário garantido. O registro é persistido entre inicializações.
3. **Executar:** quando o sistema concede uma oportunidade, o TaskManager chama o executor. Ele realiza o trabalho e retorna `BackgroundTaskResult.Success` ou `BackgroundTaskResult.Failed`.
4. **Consultar e cancelar:** `BackgroundTask.getStatusAsync()` informa a disponibilidade; `TaskManager.isTaskRegisteredAsync(nome)` verifica o registro; `BackgroundTask.unregisterTaskAsync(nome)` cancela o agendamento. Em desenvolvimento, `triggerTaskWorkerForTestingAsync()` solicita um disparo de teste.

Neste projeto, [`task.ts`](src/background/task.ts) define a tarefa, carregada por [`_layout.tsx`](src/app/_layout.tsx). A função lê as configurações salvas e solicita uma notificação local; essa notificação é apenas uma forma de observar o exemplo, não uma exigência do Background Task. [`background-tasks.ts`](src/background/background-tasks.ts) verifica disponibilidade, registra, cancela e aciona o teste. A permissão de notificação é exigida por este aplicativo para seu exemplo, não pela biblioteca para qualquer tarefa.

## Limitações

- **Horário e frequência:** no Android o intervalo periódico mínimo é de 15 minutos. Mesmo após esse prazo, o sistema pode adiar a execução; no iOS, hábitos de uso, bateria e outras condições influenciam o agendamento. Não use essa API como alarme exato ou para resposta imediata.
- **Condições do sistema:** segundo a documentação do Expo, bateria e disponibilidade de rede afetam o agendamento. Este aplicativo não faz uma verificação própria de internet, mas isso não elimina as condições impostas pelo sistema ou pelo agendador.
- **Encerramento:** após encerramento forçado pelo usuário, a tarefa fica interrompida até o aplicativo ser aberto novamente. O comportamento ao removê-lo dos aplicativos recentes varia por plataforma e fabricante. Quando o sistema encerra o processo ou o dispositivo reinicia, o sistema pode retomá-la conforme suas regras.
- **Worker compartilhado:** tarefas registradas com BackgroundTask compartilham um worker; a última tarefa registrada determina seu intervalo mínimo, portanto não há intervalos independentes garantidos. Este exemplo registra apenas uma tarefa.
- **Ambiente:** neste projeto com SDK 54, use uma development build; o serviço não funciona na web e, no iOS, requer aparelho físico. O disparo de teste é exclusivo de desenvolvimento e não comprova entrega imediata da notificação.

## Comparação com recursos similares

| Recurso | Uso e diferença principal |
| --- | --- |
| **Expo TaskManager** | Complementa o BackgroundTask: define e gerencia executores usados também por outras APIs Expo; não substitui, sozinho, o registro periódico do BackgroundTask. |
| **Expo Background Fetch** | Biblioteca anterior do Expo para busca periódica; está [descontinuada em favor do BackgroundTask](https://docs.expo.dev/versions/latest/sdk/background-fetch/). Não confundir com a biblioteca React Native de nome parecido abaixo. |
| **[React Native Background Fetch](https://github.com/transistorsoft/react-native-background-fetch)** | Alternativa para tarefas periódicas e agendadas, com mais opções específicas do Android, como tipo de rede e carregamento. Também depende do sistema; no iOS há restrições próprias e não há garantia de horário. É necessário chamar `finish` ao concluir. |
| **[React Native Background Actions](https://github.com/Rapsssito/react-native-background-actions)** | Voltada a manter uma operação em andamento. No Android usa serviço em primeiro plano com notificação; no iOS o tempo adicional é limitado pelo sistema. Não equivale a um agendador periódico. |
| **APIs nativas** | WorkManager e BGTaskScheduler dão acesso a recursos próprios de cada plataforma, com mais configuração e código nativo. O Expo oferece uma interface JavaScript comum com um conjunto mais restrito de opções. |

Para tarefas adiáveis em um projeto Expo, BackgroundTask oferece uma integração direta. Para condições específicas ou outro modelo de execução, avalie a alternativa e as regras de cada plataforma. A [apresentação](../apresentation/README.md) explora essas comparações em slides.

## Instalação e execução

Requisitos: Node.js 20.19 ou superior, npm, Android Studio com Android SDK para Android ou macOS com Xcode para iOS. Para executar os testes automatizados em TypeScript com o Node, use Node.js 22.18 ou superior. A execução em segundo plano no iOS requer aparelho físico.

Na pasta `app`:

```sh
npm ci
npx expo run:android
# ou, no macOS com Xcode e dispositivo iOS configurado:
npx expo run:ios --device
```

Esses comandos geram e instalam uma development build. Depois, use `npm start` para iniciar o Metro e abra a build instalada. `npm run android` e `npm run ios` abrem uma build já instalada. Se adicionar ou alterar um módulo nativo ou configuração nativa, gere a build novamente. A tarefa em segundo plano do SDK 54 não está disponível no Expo Go; a versão web não executa o serviço.

No Windows, o Gradle pode falhar se o caminho do projeto contiver caracteres não ASCII, como `°` e `Ç`. Se isso ocorrer, abra uma cópia do projeto em um caminho simples, por exemplo `C:\projetos\background-tasks`, e execute novamente os comandos de instalação e build.

## Como usar

1. Abra a development build e permita notificações quando solicitado.
2. Informe uma mensagem e o intervalo mínimo em minutos. Uma mensagem vazia usa “Sua tarefa foi executada”; o intervalo deve ser inteiro e de pelo menos 15 minutos. O padrão é 15 minutos.
3. Escolha **Agendamento real** e toque em **Agendar tarefa**. Coloque o app em segundo plano e aguarde o sistema. A tarefa é periódica até ser cancelada; o intervalo é um mínimo, não uma promessa de horário.
4. Para experimentar a API, escolha **Disparo experimental** e toque em **Disparar teste**. A ação salva as configurações, registra a tarefa quando necessário e chama `triggerTaskWorkerForTestingAsync`. Confira as notificações e os logs do Metro. O botão de cancelamento remove o registro para futuras execuções.

O disparo experimental é exclusivo de builds de desenvolvimento e **não garante uma notificação imediata**. Em particular, o código nativo do Expo SDK 54 para Android ignora a execução do worker enquanto o app está em primeiro plano e pode reagendá-lo. No iOS, o método aciona o agendador de teste do sistema. A confirmação de disparo indica somente que a chamada terminou, não que a notificação foi entregue. [Código Android do SDK 54](https://github.com/expo/expo/blob/sdk-54/packages/expo-background-task/android/src/main/java/expo/modules/backgroundtask/BackgroundTaskScheduler.kt), [documentação Expo](https://docs.expo.dev/versions/latest/sdk/background-task/).


## Organização do código

- [`src/app/index.tsx`](src/app/index.tsx): formulário, escolha de modo, estado, ações e mensagens de erro.
- [`src/app/_layout.tsx`](src/app/_layout.tsx): importa a definição da tarefa durante a inicialização, mesmo quando nenhuma tela é montada.
- [`src/background/notifications.ts`](src/background/notifications.ts): permissão, canal Android, apresentação em primeiro plano e notificação local.
- [`src/background/settings-validation.ts`](src/background/settings-validation.ts) e [`settings.ts`](src/background/settings.ts): valores padrão, validação e persistência com AsyncStorage, para que a tarefa leia os dados fora da interface.
- [`src/background/task.ts`](src/background/task.ts) e [`task-execution.ts`](src/background/task-execution.ts): definição global com `TaskManager.defineTask`, verificação adicional de rede, envio da notificação e resultado de sucesso ou falha.
- [`src/background/background-tasks.ts`](src/background/background-tasks.ts): disponibilidade, registro, cancelamento e disparo experimental. Ao alterar o intervalo de uma tarefa registrada, cancela e registra novamente, pois o SDK 54 ignora uma nova chamada de registro para uma tarefa já registrada.

## Verificação

```sh
npm run typecheck
npm run lint
npm test
npx expo install --check
```

Os testes automatizados verificam mensagem padrão, intervalo, envio, condição de rede e propagação de erros; não substituem testes nativos. No dispositivo, experimente permissão negada, mensagem personalizada, cancelamento, alteração do intervalo e reinício do aplicativo. Para o agendamento real, anote o horário, deixe o app em segundo plano e considere que o sistema pode atrasar a execução. Não force o encerramento do aplicativo durante esse teste.

No Android, é possível inspecionar o agendamento pelo ADB:

```sh
adb shell dumpsys jobscheduler
```

Procure por `com.example.backgroundtasksdemo` e `SystemJobService`. Consulte também [a documentação de inspeção e testes do Expo](https://docs.expo.dev/versions/latest/sdk/background-task/#testing-background-tasks). A disponibilidade e o comportamento variam conforme o aparelho, a versão do sistema e a configuração de bateria.

Na validação deste projeto, uma development build foi executada em um emulador Android: o registro foi observado no JobScheduler e, ao forçar o job com `adb shell cmd jobscheduler run -f com.example.backgroundtasksdemo <JOB_ID>`, notificações com a mensagem padrão e com uma mensagem alterada foram observadas. A mudança de intervalo também gerou um novo job. O botão experimental acionou o método, mas o log do SDK registrou que o app estava em primeiro plano e não executou a tarefa naquele momento. O disparo natural após o intervalo e o funcionamento no iOS não foram verificados nessa sessão.
