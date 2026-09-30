/**
 * Slide "do JSX ao YAML": tocar num elemento do celular desenhado acende a
 * linha correspondente no JSX e no YAML, mostrando que o `testID` é a ponte
 * entre os dois mundos.
 */

/** Largura de referência do celular em CSS, usada para converter coordenadas. */
const PHONE_CSS_WIDTH = 228;

export function mountPhoneDemo(root) {
  const phone = root.querySelector('#phone');
  if (!phone) return;

  const elements = Array.from(root.querySelectorAll('.el'));
  const ripple = root.querySelector('#tapFx');
  const codeLines = Array.from(root.querySelectorAll('[data-el-line]'));

  const select = (id) => {
    elements.forEach((element) => {
      const isPrimaryButton = element.classList.contains('btn-fake');
      const active = element.dataset.el === id;
      // O botão principal inverte o preenchimento em vez de ganhar contorno.
      if (isPrimaryButton) element.classList.toggle('off', !active);
      else element.classList.toggle('on', active);
    });

    codeLines.forEach((line) => {
      line.classList.toggle('hl', line.dataset.elLine === id);
    });
  };

  const playRipple = (element) => {
    if (!ripple) return;
    const target = element.getBoundingClientRect();
    const frame = phone.getBoundingClientRect();
    // O palco inteiro é escalado; dividimos pela escala para voltar a px de CSS.
    const scale = frame.width / PHONE_CSS_WIDTH;

    ripple.style.left = `${(target.left - frame.left) / scale + target.width / scale / 2}px`;
    ripple.style.top = `${(target.top - frame.top) / scale + target.height / scale / 2}px`;

    // Reinicia a animação mesmo em cliques repetidos no mesmo elemento.
    ripple.style.animation = 'none';
    void ripple.offsetWidth;
    ripple.style.animation = 'ping .6s ease-out';
  };

  elements.forEach((element) => {
    element.addEventListener('click', () => {
      select(element.dataset.el);
      playRipple(element);
    });
  });

  const initial = elements.find((e) => e.dataset.elDefault !== undefined) ?? elements[0];
  if (initial) select(initial.dataset.el);
}
