/**
 * Motor da apresentação: mantém o slide atual e avisa quem se inscrever.
 *
 * Não conhece teclado nem botões — quem traduz gestos em chamadas
 * de `go/next/prev` são os controles, e quem reage a mudanças são os
 * observadores. Isso mantém a navegação testável e permite acrescentar novos
 * controles (controle remoto, toque, menu) sem tocar nesta classe.
 */
export class Presentation {
  #slides;
  #index = 0;
  #listeners = new Set();

  /** @param {HTMLElement[]} slides seções já inseridas no palco, em ordem */
  constructor(slides) {
    if (!slides.length) throw new Error('A apresentação precisa de ao menos um slide.');
    this.#slides = slides;
  }

  get total() {
    return this.#slides.length;
  }

  get index() {
    return this.#index;
  }

  get current() {
    return this.#slides[this.#index];
  }

  /** Título do slide atual, vindo do registro. */
  get title() {
    return this.current.dataset.title ?? '';
  }

  /** Posição relativa, de 0 (primeiro slide) a 1 (último). */
  get progress() {
    return this.total > 1 ? this.#index / (this.total - 1) : 1;
  }

  /**
   * Inscreve um observador, chamado a cada troca de slide.
   * @param {(state: Presentation) => void} listener
   * @returns {() => void} função que cancela a inscrição
   */
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  /**
   * Vai para um slide. Índices fora da faixa são ignorados, de modo que
   * avançar no último slide simplesmente não faz nada.
   * @param {number} index
   */
  go(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.total) return;
    if (index === this.#index && this.#slides[index].classList.contains('on')) return;

    this.#slides[this.#index].classList.remove('on');
    this.#index = index;
    this.#slides[index].classList.add('on');

    this.#notify();
  }

  /**
   * Exibe o slide inicial e notifica os observadores.
   *
   * Existe porque `go` ignora a navegação para o slide já ativo: no boot
   * ninguém está visível ainda, e os observadores precisam de um primeiro
   * disparo para nascerem coerentes.
   * @param {number} index
   */
  startAt(index = 0) {
    const target = Number.isInteger(index) && index >= 0 && index < this.total ? index : 0;
    this.#index = target;
    this.#slides.forEach((slide, i) => slide.classList.toggle('on', i === target));
    this.#notify();
  }

  #notify() {
    this.#listeners.forEach((listener) => listener(this));
  }

  next() {
    this.go(this.#index + 1);
  }

  prev() {
    this.go(this.#index - 1);
  }

  first() {
    this.go(0);
  }

  last() {
    this.go(this.total - 1);
  }
}
