/**
 * Transcrições do terminal exibidas no slide de execução.
 *
 * Ficam aqui, e não no HTML, porque são dados sequenciais com timing —
 * editar o roteiro de uma execução não deve exigir mexer em marcação.
 *
 * `tone` escolhe a cor da linha: cmd (comando digitado), ok, warn, bad, mut.
 */

/** @typedef {{tone: 'cmd'|'ok'|'warn'|'bad'|'mut', text: string}} TerminalLine */

/** Execução bem-sucedida: todos os passos passam. @type {TerminalLine[]} */
export const SUCCESSFUL_RUN = [
  { tone: 'cmd', text: '$ maestro test .maestro/flows/checkout.yaml' },
  { tone: 'mut', text: '' },
  { tone: 'mut', text: 'Running on emulator-5554 (Android 14)' },
  { tone: 'mut', text: '' },
  { tone: 'ok', text: ' ✔  Launch app "com.exemplo.maestro"' },
  { tone: 'ok', text: ' ✔  Tap on "Plano Anual"' },
  { tone: 'ok', text: ' ✔  Assert visible "Resumo do pedido"' },
  { tone: 'warn', text: ' ›  Tap on "Aplicar cupom" (optional — não encontrado, seguindo)' },
  { tone: 'ok', text: ' ✔  Confirmar o pagamento' },
  { tone: 'ok', text: ' ✔  Assert visible "Compra aprovada"' },
  { tone: 'mut', text: '' },
  { tone: 'ok', text: ' Flow passou em 11,4s  ·  1/1 flows  ·  0 falhas' },
  { tone: 'mut', text: ' Vídeo e prints em ~/.maestro/tests/2026-09-14_193204/' },
];

/** Execução com falha: mostra o diagnóstico e o exit code que trava o CI. @type {TerminalLine[]} */
export const FAILED_RUN = [
  { tone: 'cmd', text: '$ maestro test .maestro/flows/checkout.yaml' },
  { tone: 'mut', text: '' },
  { tone: 'ok', text: ' ✔  Launch app "com.exemplo.maestro"' },
  { tone: 'ok', text: ' ✔  Tap on "Plano Anual"' },
  { tone: 'ok', text: ' ✔  Assert visible "Resumo do pedido"' },
  { tone: 'ok', text: ' ✔  Confirmar o pagamento' },
  { tone: 'bad', text: ' ✖  Assert visible "Compra aprovada"' },
  { tone: 'mut', text: '' },
  { tone: 'bad', text: ' Element not found: "Compra aprovada"' },
  { tone: 'mut', text: ' Tela no momento da falha: "Erro ao processar cartão"' },
  { tone: 'mut', text: ' Screenshot: ~/.maestro/tests/.../checkout-failure.png' },
  { tone: 'mut', text: '' },
  { tone: 'bad', text: ' 1 flow falhou  ·  exit code 1  →  o CI bloqueia o merge' },
];
