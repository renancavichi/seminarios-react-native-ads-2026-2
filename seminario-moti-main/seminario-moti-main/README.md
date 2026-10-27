# Seminário participativo sobre Moti

Apresentação de **17 slides e 30 minutos** para ensinar a biblioteca: finalidade, história, instalação no Expo SDK 54, componentes, propriedades, transições, estados e ciclo de vida. O jogo aparece como exemplo de aplicação dos conceitos.

Os tempos planejados dos slides somam 30 minutos e já incluem a participação da turma. O tempo real depende do ritmo da fala e das discussões.

## Sequência dos slides

1. Comparação das versões do jogo.
2. Capa.
3. O que é Moti.
4. História e origem, com fontes do autor.
5. Demonstrações interativas.
6. Instalação no Expo SDK 54.
7. Componentes e `from`, `animate`, `transition`.
8. Animação por estado React.
9. `timing` e `spring`.
10. `delay`, `loop` e `repeatReverse`.
11. Sequências de valores.
12. `exit` e `AnimatePresence`.
13. Transformações e profundidade percebida.
14. `onDidAnimate` e redução de movimento.
15. Prós e contras.
16. Comparação com Reanimated, Animated do React Native e Lottie.
17. Obrigado.

## Apresentar

Na raiz do projeto:

```sh
npm run seminario
```

Abra a URL impressa no terminal, normalmente **http://localhost:4173**. Se a porta estiver ocupada, o servidor tenta a próxima. Os slides, laboratórios e jogo funcionam sem internet; as referências externas precisam de conexão.

## Participação da turma

- Quatro laboratórios com **Moti real**: entrada, mudança de estado React, comparação `timing`/`spring` com duração e atraso, e saída com `AnimatePresence`.
- Um voluntário joga enquanto o restante da turma identifica as propriedades de animação aprendidas.

As votações acontecem em sala. Os slides não coletam respostas nos celulares nem simulam contagens de participantes.

## Preparar a fala

Leia [roteiro.md](roteiro.md): cada slide tem uma fala sugerida, o que demonstrar, os arquivos de código disponíveis e uma transição para o próximo assunto. As falas ficam em `presenter.cjs` e o build atualiza o roteiro. Durante a apresentação, **N** exibe as falas na mesma tela; deixe-as fechadas ao projetar para a turma.

O guia de instalação está direcionado a um projeto **Expo SDK 54 já criado**. Usa a configuração versionada do Expo para Reanimated e Worklets. As dependências mostradas são as deste projeto; não representam uma promessa de compatibilidade com qualquer combinação de versões.

## Controles

- **← / →**, **Page Up / Page Down**: navegar.
- **Home / End**: primeiro / último slide.
- **N**: notas e intervalo planejado do slide.
- **G**: índice.
- **F**: tela cheia.
- **B**: tela preta para pausar a projeção; clique nela ou pressione B/Esc para voltar.
- **PDF**: imprimir os slides ou salvar em PDF. Os laboratórios ao vivo ficam disponíveis na versão em navegador.
- Na demonstração do jogo, use os controles do quadro ou toque diretamente no aplicativo. **Esc** fecha a demonstração mesmo quando o jogo está em foco.

Também é possível abrir `dist/index.html` diretamente para consultar os slides, trechos e imagens. Os laboratórios e o jogo precisam do servidor HTTP, pois a compilação Expo Web usa roteamento e URLs de assets.

## Código verificável

`build.cjs` extrai os trechos dos arquivos do projeto. Cada bloco mostra arquivo e linhas; clicar no nome abre o snapshot completo. **Copiar** copia o texto original. Os recortes não necessariamente formam componentes completos para colar isoladamente.

Há dois tipos de exemplo, identificados nos blocos:

- **Jogo**: trechos da implementação de cartas existente, ilustrando o conceito ensinado.
- **Laboratório didático**: componentes adicionados em `src/seminar/MotiLab.js` para isolar conceitos da biblioteca. Eles usam React Native e Moti e executam a mesma compilação Expo do projeto.

`dist/provenance.json` registra trechos, arquivos e hashes SHA-256. `check.cjs` compara os exemplos com as linhas originais e verifica que o roteiro soma 1.800 segundos. As demonstrações executam o bundle Expo Web; as animações não são reproduções em CSS. As imagens do jogo são capturas reais.

## Atualizar

```sh
npm run seminario:build
npm run seminario:check
```

O build recompila o aplicativo, extrai os exemplos e gera o roteiro. As capturas existentes são reaproveitadas; atualize `reference-images/` se mudar o visual do jogo.

O Site inclui snapshots de código e o export web em `game-export/` para preservar a versão apresentada. `demo-bridge.js` inicia a rota desejada e aciona os controles da interface do jogo.


Repositório do Jogo: https://github.com/KauanLeonel/Rock-Paper-Scissors.git