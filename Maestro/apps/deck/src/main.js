/**
 * Ponto de entrada da apresentação.
 *
 * Responsabilidade única: carregar os slides e ligar os módulos entre si.
 * Nenhuma regra de apresentação vive aqui — cada comportamento está no seu
 * próprio módulo em core/ (mecânica) ou components/ (interface).
 */
import { SLIDES } from './core/slide-registry.js';
import { loadSlides } from './core/slide-loader.js';
import { Presentation } from './core/presentation.js';
import { autoScale } from './core/stage-scaler.js';
import { bindKeyboard } from './core/keyboard.js';
import { bindDeepLink } from './core/deep-link.js';

import { mountChrome } from './components/chrome.js';
import { Overview } from './components/overview.js';
import { mountSelectableGroups } from './components/selectable-group.js';
import { mountTabs } from './components/tabs.js';
import { mountPhoneDemo } from './components/phone-demo.js';
import { mountPipeline } from './components/pipeline.js';
import { mountTerminal } from './components/terminal.js';
import { mountJumpLinks } from './components/jump-links.js';

const SLIDES_BASE_URL = './slides/';

const $ = (id) => document.getElementById(id);

/** Mostra o erro na tela: um palco em branco não diz o que aconteceu. */
function showFatalError(error) {
  const stage = $('stage');
  const panel = document.createElement('div');
  panel.className = 'fatal';
  panel.innerHTML =
    '<h2>Não foi possível carregar a apresentação</h2>' +
    '<p class="fatal-msg"></p>' +
    '<p class="fatal-hint">Esta apresentação precisa ser servida por HTTP. ' +
    'Na raiz do projeto, rode <code>npm start</code> e abra o endereço indicado.</p>';
  panel.querySelector('.fatal-msg').textContent = error.message;
  stage.appendChild(panel);
  console.error(error);
}

async function boot() {
  const stage = $('stage');
  autoScale(stage);

  const sections = await loadSlides(stage, SLIDES, SLIDES_BASE_URL);
  const deck = new Presentation(sections);

  mountChrome(deck, SLIDES, {
    dots: $('dots'),
    progress: $('prog'),
    label: $('label'),
    counter: $('count'),
    prevButton: $('bPrev'),
    nextButton: $('bNext'),
  });

  const overview = new Overview($('overview'), deck, SLIDES);

  // As interações são ligadas uma vez, no documento inteiro, porque todos os
  // slides já estão no DOM desde o carregamento.
  mountSelectableGroups(stage);
  mountTabs(stage);
  mountPhoneDemo(stage);
  mountPipeline(stage);
  mountTerminal(stage);
  mountJumpLinks(stage, deck);

  bindKeyboard(deck, {
    toggleOverview: () => overview.toggle(),
    toggleFullscreen: () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    },
  });

  const initialSlide = bindDeepLink(deck);

  deck.startAt(initialSlide);
}

boot().catch(showFatalError);
