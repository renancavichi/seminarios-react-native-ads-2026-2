/**
 * Slide "como funciona": acende os estágios do pipeline em sequência,
 * do YAML até o toque na tela.
 */

const STEP_INTERVAL_MS = 620;
const ARROW_DELAY_MS = 260;

export function mountPipeline(root) {
  const trigger = root.querySelector('#runPipe');
  if (!trigger) return;

  const steps = Array.from(root.querySelectorAll('[data-step]'));
  const arrows = Array.from(root.querySelectorAll('[data-arrow]'));

  // Guardar os timers permite cancelar uma animação em curso: sem isso, dois
  // cliques seguidos deixam duas sequências correndo em cima da outra.
  let timers = [];

  const clear = () => {
    timers.forEach(clearTimeout);
    timers = [];
    [...steps, ...arrows].forEach((node) => node.classList.remove('live'));
  };

  trigger.addEventListener('click', () => {
    clear();
    steps.forEach((step, index) => {
      timers.push(setTimeout(() => step.classList.add('live'), index * STEP_INTERVAL_MS));
      if (arrows[index]) {
        timers.push(setTimeout(
          () => arrows[index].classList.add('live'),
          index * STEP_INTERVAL_MS + ARROW_DELAY_MS,
        ));
      }
    });
  });
}
