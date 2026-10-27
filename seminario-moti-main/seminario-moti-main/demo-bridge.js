(() => {
  'use strict';
  const mode = new URLSearchParams(location.search).get('mode') || (location.pathname.startsWith('/game') ? 'basic' : 'moti');
  // Apenas o invólucro da apresentação muda a URL inicial. O bundle do jogo não é alterado.
  const lesson = new URLSearchParams(location.search).get('lesson') || 'api';
  history.replaceState(null, '', mode === 'lab' ? `/seminar-lab?lesson=${encodeURIComponent(lesson)}` : mode === 'basic' ? '/game' : '/moti');
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const visible = (element) => element && getComputedStyle(element).visibility !== 'hidden' && !element.closest('[aria-hidden="true"]');
  const label = (name) => [...document.querySelectorAll('[aria-label]')].find((el) => el.getAttribute('aria-label') === name && visible(el));
  const battle = () => [...document.querySelectorAll('[data-testid="battle-button"]')].find(visible);
  const send = (type, message) => { if (parent !== window) parent.postMessage({ type, message }, location.origin); };
  async function until(check) {
    for (let index = 0; index < 150; index++) { if (check()) return; await pause(100); }
    throw new Error('O aplicativo ainda está carregando ou a animação não terminou.');
  }
  async function click(name) {
    await until(() => label(name));
    label(name).click();
    await pause(120);
  }
  async function option(name, desired) {
    await click('Opções do jogo');
    const control = label(name);
    if (!control) { await click('Concluir opções'); throw new Error('Esta opção está disponível na versão Moti.'); }
    const checked = typeof control.checked === 'boolean' ? control.checked : control.getAttribute('aria-checked') === 'true';
    if (desired === undefined || checked !== desired) control.click();
    await pause(160);
    await click('Concluir opções');
  }
  let queue = Promise.resolve();
  window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'seminar-command') return;
    const { action, value } = event.data;
    queue = queue.then(async () => {
      await until(() => battle() && (action === 'reset' || battle().getAttribute('aria-disabled') !== 'true' || battle().textContent.includes('Escolha uma carta')));
      if (action === 'setup') { await option('Modo seminário, rival com sequência previsível', true); send('seminar-status', 'Modo seminário ativo: rival segue tesoura → papel → pedra.'); }
      else if (action === 'slow') { await option('Câmera lenta'); send('seminar-status', 'Câmera lenta alternada no próprio aplicativo.'); }
      else if (action === 'reduced') { await option('Reduzir movimento'); send('seminar-status', 'Redução de movimento alternada no próprio aplicativo.'); }
      else if (action === 'reset') { await click(mode === 'basic' ? 'Reiniciar jogo básico' : 'Reiniciar duelo Moti'); send('seminar-status', 'Jogo reiniciado. O placar foi zerado.'); }
      else if (action === 'choice') {
        if (battle().textContent.includes('Voltar à mão')) { battle().click(); await pause(180); }
        const titles = { rock: 'Pedra', paper: 'Papel', scissors: 'Tesoura' };
        if (!titles[value]) return;
        await click(`Escolher ${titles[value]}`);
        send('seminar-status', `${titles[value]} selecionada no aplicativo.`);
      } else if (action === 'play') {
        if (battle().textContent.includes('Escolha uma carta')) await click('Escolher Pedra');
        await until(() => battle()?.getAttribute('aria-disabled') !== 'true');
        const back = battle().textContent.includes('Voltar à mão');
        battle().click();
        send('seminar-status', back ? 'De volta à mão. Escolha outra carta ou batalhe novamente.' : 'Rodada iniciada no jogo original.');
      }
    }).catch((error) => send('seminar-status', error.message));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') send('seminar-key', 'Escape');
  });
  until(() => mode === 'lab' ? document.querySelector('[data-testid="moti-lab"]') : battle())
    .then(() => send('seminar-ready', mode)).catch((error) => send('seminar-status', error.message));
})();
