/**
 * Botões que saltam para outro slide (o roteiro do slide 2, por exemplo).
 *
 *   <button class="jump" data-go="2">Ato 01</button>
 *
 * O valor de `data-go` é o índice 0-based no registro de slides.
 */
export function mountJumpLinks(root, deck) {
  root.querySelectorAll('[data-go]').forEach((button) => {
    const target = Number.parseInt(button.dataset.go, 10);
    if (Number.isNaN(target)) return;
    button.addEventListener('click', () => deck.go(target));
  });
}
