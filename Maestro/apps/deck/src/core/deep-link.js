/**
 * Sincroniza o slide atual com o hash da URL (#/7).
 *
 * Serve a dois propósitos no dia da apresentação: recarregar a página sem
 * perder o lugar (se o navegador travar no meio da aula, F5 volta ao mesmo
 * slide) e mandar para a turma um link que abre direto no slide citado.
 */

const parseHash = (hash) => {
  const match = /^#\/(\d+)$/.exec(hash);
  if (!match) return null;
  // A URL é 1-based para quem lê; o índice interno é 0-based.
  return Number(match[1]) - 1;
};

/**
 * Liga o hash da URL ao deck, nas duas direções, e devolve o slide inicial.
 * @param {import('./presentation.js').Presentation} deck
 * @returns {number} índice pedido pela URL, ou 0
 */
export function bindDeepLink(deck) {
  // Escrever no hash dispara `hashchange`; esta trava evita o eco de volta.
  let writingHash = false;

  deck.subscribe((state) => {
    writingHash = true;
    history.replaceState(null, '', `#/${state.index + 1}`);
    writingHash = false;
  });

  window.addEventListener('hashchange', () => {
    if (writingHash) return;
    const index = parseHash(location.hash);
    if (index !== null) deck.go(index);
  });

  const initial = parseHash(location.hash);
  return initial !== null && initial < deck.total ? initial : 0;
}
