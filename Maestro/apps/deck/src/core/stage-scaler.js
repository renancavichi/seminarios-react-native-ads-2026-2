/**
 * Mantém o palco de 1280x720 centralizado e escalado para caber na janela,
 * seja um monitor 4K ou o projetor 1024x768 da sala.
 *
 * O palco tem tamanho fixo em CSS; aqui só aplicamos um `scale`. Assim todo o
 * layout dos slides pode usar medidas absolutas sem virar um quebra-cabeça
 * responsivo — a proporção 16:9 é garantida em qualquer tela.
 */

export const STAGE_WIDTH = 1280;
export const STAGE_HEIGHT = 720;

/** Margem de respiro para o palco não encostar nas bordas da janela. */
const FILL_RATIO = 0.97;

/**
 * Passa a escalar o palco e devolve a função que interrompe isso.
 * @param {HTMLElement} stage
 * @returns {() => void}
 */
export function autoScale(stage) {
  let frame = 0;

  const apply = () => {
    const scale = Math.min(
      window.innerWidth / STAGE_WIDTH,
      window.innerHeight / STAGE_HEIGHT,
    ) * FILL_RATIO;
    stage.style.transform = `scale(${scale})`;
  };

  // O resize dispara em rajada ao arrastar a janela; agrupamos por quadro.
  const onResize = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(apply);
  };

  apply();
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', onResize);
  };
}
