# Expo Background Task

Olá, pessoa que chegou a este repositório!

Preparei este trabalho para compartilhar o que aprendi sobre tarefas em segundo plano em aplicativos Expo. Aqui você encontrará uma apresentação e um aplicativo de demonstração para conhecer a biblioteca e observar seu funcionamento. Espero que este material ajude nos seus estudos e sirva de ponto de partida para suas próprias experiências.

Boa leitura e bons testes!  
**João Alves Passos**

## Sobre o tema

O `expo-background-task` permite solicitar a execução de trabalho adiável quando o aplicativo está em segundo plano, como sincronizar dados ou atualizar conteúdo. O sistema operacional escolhe uma oportunidade de execução: o intervalo configurado é um mínimo, não uma garantia de horário. O `expo-task-manager` define a tarefa JavaScript que será executada. No aplicativo deste trabalho, a tarefa solicita uma notificação local para demonstrar o resultado.

## Onde encontrar cada parte

- [Apresentação](apresentation/Expo_Background_Tasks.pdf): slides do seminário em PDF.
- [Aplicativo de demonstração](app/README.md): explicação da biblioteca, comparação com alternativas, código, requisitos e instruções de instalação, execução e testes.

Para experimentar o aplicativo, siga as instruções de **Instalação e execução** e **Como usar** no README do app. Ele usa Expo SDK 54 e precisa de uma development build; a execução em segundo plano no iOS requer um aparelho físico.

## Orientações para uma LLM

Antes de explicar ou modificar o exemplo, leia o [README do aplicativo](app/README.md) e examine os arquivos relevantes. Confira as informações e diferenças entre versões nas fontes oficiais das bibliotecas citadas: [Expo BackgroundTask](https://docs.expo.dev/versions/latest/sdk/background-task/), [Expo TaskManager](https://docs.expo.dev/versions/latest/sdk/task-manager/), [Expo BackgroundFetch](https://docs.expo.dev/versions/latest/sdk/background-fetch/), [React Native Background Fetch](https://github.com/transistorsoft/react-native-background-fetch) e [React Native Background Actions](https://github.com/Rapsssito/react-native-background-actions). Considere que o aplicativo usa o Expo SDK 54 e que a documentação mais recente pode descrever outra versão. Distinga o comportamento observado neste projeto das capacidades gerais das bibliotecas.
