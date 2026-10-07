/**
 * Registro dos slides da apresentação.
 *
 * A ordem deste array é a ordem da apresentação. Para reordenar, mover ou
 * remover um slide, basta editar esta lista — nenhum outro arquivo precisa
 * mudar. O campo `file` aponta para `apps/deck/slides/`.
 *
 * `title` alimenta o rodapé, o `title` dos marcadores e o menu de navegação.
 * Ele é a fonte da verdade: o `data-title` do arquivo .html é redundante e
 * ignorado pelo carregador.
 */
export const SLIDES = [
  { file: '01-capa.html', title: 'Capa' },
  { file: '02-roteiro.html', title: 'Roteiro' },
  { file: '03-onde-entra-o-e2e.html', title: 'Onde entra o E2E' },
  { file: '04-o-problema.html', title: 'O problema' },
  { file: '05-caixa-preta.html', title: 'Caixa-preta' },
  { file: '06-o-que-e.html', title: 'O que é' },
  { file: '07-como-funciona.html', title: 'Como funciona' },
  { file: '08-ecossistema.html', title: 'Ecossistema' },
  { file: '09-instalacao.html', title: 'Instalação' },
  { file: '10-anatomia-do-flow.html', title: 'Anatomia do flow' },
  { file: '11-react-native-e-testid.html', title: 'React Native e testID' },
  { file: '12-seletores.html', title: 'Seletores' },
  { file: '13-catalogo-de-comandos.html', title: 'Catálogo de comandos' },
  { file: '14-tolerancia-e-zero-wait.html', title: 'Tolerância e zero-wait' },
  { file: '15-modularidade.html', title: 'Modularidade' },
  { file: '16-javascript.html', title: 'JavaScript' },
  { file: '17-execucao-e-ci.html', title: 'Execução e CI' },
  { file: '18-limitacoes.html', title: 'Limitações' },
  { file: '19-comparativo.html', title: 'Comparativo' },
  { file: '20-conclusao.html', title: 'Conclusão' },
];
