/**
 * Modo panorama (tecla O ou Esc): lista todos os slides em grade para saltar
 * direto ao assunto — pensado para a rodada de perguntas, quando alguém pede
 * "volta naquele slide dos seletores".
 */
export class Overview {
  #root;
  #deck;
  #buttons = [];

  /**
   * @param {HTMLElement} root
   * @param {import('../core/presentation.js').Presentation} deck
   * @param {ReadonlyArray<{title: string}>} registry
   */
  constructor(root, deck, registry) {
    this.#root = root;
    this.#deck = deck;

    this.#buttons = registry.map((entry, index) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'ov-item';
      item.innerHTML =
        `<span class="ov-num">${String(index + 1).padStart(2, '0')}</span>` +
        `<span class="ov-title"></span>`;
      // textContent para o título não interpretar markup vindo do registro.
      item.querySelector('.ov-title').textContent = entry.title;
      item.addEventListener('click', () => {
        deck.go(index);
        this.close();
      });
      root.appendChild(item);
      return item;
    });

    deck.subscribe((state) => this.#highlight(state.index));
  }

  get isOpen() {
    return this.#root.classList.contains('on');
  }

  #highlight(activeIndex) {
    this.#buttons.forEach((button, index) => {
      button.classList.toggle('on', index === activeIndex);
    });
  }

  open() {
    this.#root.classList.add('on');
    this.#root.setAttribute('aria-hidden', 'false');
    this.#buttons[this.#deck.index]?.focus();
  }

  close() {
    this.#root.classList.remove('on');
    this.#root.setAttribute('aria-hidden', 'true');
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }
}
