/**
 * Traduz teclas em ações da apresentação.
 *
 * Os apresentadores de slide sem fio mais comuns emulam PageUp/PageDown ou
 * as setas, então ambos são aceitos — apertar o botão do controle remoto
 * funciona sem configuração.
 */

/**
 * @param {import('./presentation.js').Presentation} deck
 * @param {{toggleFullscreen: () => void, toggleOverview: () => void}} actions
 * @returns {() => void} remove os atalhos
 */
export function bindKeyboard(deck, actions) {
  /** @type {Record<string, () => void>} */
  const bindings = {
    ArrowRight: () => deck.next(),
    ArrowDown: () => deck.next(),
    PageDown: () => deck.next(),
    ' ': () => deck.next(),
    Enter: () => deck.next(),
    ArrowLeft: () => deck.prev(),
    ArrowUp: () => deck.prev(),
    PageUp: () => deck.prev(),
    Backspace: () => deck.prev(),
    Home: () => deck.first(),
    End: () => deck.last(),
    f: actions.toggleFullscreen,
    o: actions.toggleOverview,
    Escape: actions.toggleOverview,
  };

  const onKeyDown = (event) => {
    // Não sequestrar teclas de atalho do navegador (Ctrl+R, Cmd+F...).
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const action = bindings[event.key] ?? bindings[event.key.toLowerCase()];
    if (!action) return;

    event.preventDefault();
    action();
  };

  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
}
