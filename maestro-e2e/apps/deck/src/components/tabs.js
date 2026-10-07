/**
 * Abas de conteúdo dentro de um slide (Android/iOS, npm/yarn, etc.).
 *
 *   <div class="tabs" data-tabs="inst">
 *     <button class="tab" data-tab="mac">macOS</button>
 *   </div>
 *   <div class="pane" data-tabs="inst" data-tab="mac">…</div>
 */
export function mountTabs(root) {
  root.querySelectorAll('.tabs[data-tabs]').forEach((bar) => {
    const name = bar.dataset.tabs;
    const tabs = Array.from(bar.querySelectorAll('.tab'));
    const panes = Array.from(root.querySelectorAll(`.pane[data-tabs="${name}"]`));

    const select = (value) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.tab === value;
        tab.classList.toggle('on', active);
        tab.setAttribute('aria-selected', String(active));
      });
      panes.forEach((pane) => {
        pane.classList.toggle('on', pane.dataset.tab === value);
      });
    };

    tabs.forEach((tab) => {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', () => select(tab.dataset.tab));
    });
    bar.setAttribute('role', 'tablist');

    const initial = tabs.find((t) => t.classList.contains('on')) ?? tabs[0];
    if (initial) select(initial.dataset.tab);
  });
}
