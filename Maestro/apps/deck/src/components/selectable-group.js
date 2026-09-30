/**
 * Grupos "escolha um, mostra o painel correspondente" — o padrão de interação
 * mais usado no deck (dores do E2E, seletores, comandos, limitações...).
 *
 * Tudo é declarado no HTML do slide, sem nenhuma lista de valores no
 * JavaScript:
 *
 *   <button class="pick" data-group="pain" data-value="flake"
 *           data-label="o-teste-instavel.js">…</button>
 *   <pre data-panel="pain" data-value="flake">…</pre>
 *   <span data-label-for="pain"></span>   <!-- recebe o data-label do escolhido -->
 *
 * Acrescentar uma opção nova é acrescentar um botão e um painel; este arquivo
 * não muda.
 */

const SELECTED_CLASS = 'on';

/**
 * Ativa todos os grupos existentes dentro de um elemento.
 * @param {ParentNode} root
 */
export function mountSelectableGroups(root) {
  const triggers = Array.from(root.querySelectorAll('[data-group][data-value]'));

  // Agrupa os gatilhos pelo nome do grupo.
  const groups = new Map();
  triggers.forEach((trigger) => {
    const name = trigger.dataset.group;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(trigger);
  });

  groups.forEach((buttons, name) => {
    const panels = Array.from(root.querySelectorAll(`[data-panel="${name}"]`));
    const labels = Array.from(root.querySelectorAll(`[data-label-for="${name}"]`));
    // Linhas de código que devem acender junto com a opção escolhida.
    const highlightables = Array.from(root.querySelectorAll(`[data-highlight="${name}"]`));

    const select = (value) => {
      buttons.forEach((button) => {
        button.classList.toggle(SELECTED_CLASS, button.dataset.value === value);
        button.setAttribute('aria-pressed', String(button.dataset.value === value));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.value !== value;
      });

      highlightables.forEach((line) => {
        line.classList.toggle('hl', line.dataset.value === value);
      });

      const chosen = buttons.find((button) => button.dataset.value === value);
      if (chosen?.dataset.label) {
        labels.forEach((label) => {
          label.textContent = chosen.dataset.label;
        });
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => select(button.dataset.value));
    });

    // O estado inicial é o botão marcado com "on" no HTML, ou o primeiro.
    const initial = buttons.find((b) => b.classList.contains(SELECTED_CLASS)) ?? buttons[0];
    select(initial.dataset.value);
  });
}
