/**
 * Terminal simulado: reproduz uma execução do Maestro linha a linha.
 */
import { SUCCESSFUL_RUN, FAILED_RUN } from '../data/terminal-runs.js';

/** Intervalo entre o surgimento de cada linha. */
const LINE_DELAY_S = 0.28;

export function mountTerminal(root) {
  const screen = root.querySelector('#term');
  if (!screen) return;

  /** @param {import('../data/terminal-runs.js').TerminalLine[]} lines */
  const play = (lines) => {
    const fragment = document.createDocumentFragment();

    lines.forEach((line, index) => {
      const row = document.createElement('div');
      row.className = `term-line ${line.tone}`;
      row.style.animationDelay = `${index * LINE_DELAY_S}s`;
      // Um espaço evita que linhas vazias colapsem de altura.
      row.textContent = line.text || ' ';
      fragment.appendChild(row);
    });

    screen.replaceChildren(fragment);
  };

  root.querySelector('#runTest')?.addEventListener('click', () => play(SUCCESSFUL_RUN));
  root.querySelector('#runFail')?.addEventListener('click', () => play(FAILED_RUN));
}
