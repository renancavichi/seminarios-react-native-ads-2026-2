/**
 * Moldura da apresentação: marcadores no topo, barra de progresso, rótulo do
 * slide e contador no rodapé. Tudo o que fica fora da área de conteúdo.
 */

/**
 * Cria os marcadores clicáveis e os mantém em sincronia com o slide atual.
 * @param {HTMLElement} container
 * @param {import('../core/presentation.js').Presentation} deck
 * @param {ReadonlyArray<{title: string}>} registry
 */
function buildDots(container, deck, registry) {
  const dots = registry.map((entry, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.title = `${index + 1}. ${entry.title}`;
    dot.setAttribute('aria-label', dot.title);
    dot.addEventListener('click', () => deck.go(index));
    container.appendChild(dot);
    return dot;
  });

  deck.subscribe((state) => {
    dots.forEach((dot, index) => {
      dot.classList.toggle('on', index === state.index);
      // "act" marca os slides já apresentados.
      dot.classList.toggle('act', index < state.index);
      dot.setAttribute('aria-current', index === state.index ? 'true' : 'false');
    });
  });
}

/**
 * Liga toda a moldura ao deck.
 * @param {import('../core/presentation.js').Presentation} deck
 * @param {ReadonlyArray<{title: string}>} registry
 * @param {Record<string, HTMLElement>} refs
 */
export function mountChrome(deck, registry, refs) {
  buildDots(refs.dots, deck, registry);

  refs.prevButton.addEventListener('click', () => deck.prev());
  refs.nextButton.addEventListener('click', () => deck.next());

  deck.subscribe((state) => {
    refs.progress.style.width = `${state.progress * 100}%`;
    refs.label.textContent = state.title;
    refs.counter.textContent = `${state.index + 1} / ${state.total}`;

    // Desabilitar nas pontas evita o clique que não faz nada.
    refs.prevButton.disabled = state.index === 0;
    refs.nextButton.disabled = state.index === state.total - 1;
  });
}
