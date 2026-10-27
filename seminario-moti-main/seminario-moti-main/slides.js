(() => {
  'use strict';
  const data = window.SEMINAR_DATA;
  const rules = window.PROJECT_RULES;
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const names = { dependencies: 'Dependências', rules: 'Regra original', basic: 'Pressable', aura: 'Aura', travel: 'Destino', measurement: 'Medição', transforms: 'Perspectiva', flip: 'Revelação', phases: 'Temporizadores', camera: 'Enquadramento', summon: 'Invocação', orbit: 'Loop', particles: 'Fragmentos', sequence: 'Sequência', presence: 'AnimatePresence', sceneExit: 'exit', arrival: 'Chegada', reduced: 'Preferências', instant: 'Rodada imediata', labImports: 'Imports', labMount: 'Entrada', labState: 'Estado React', labTiming: 'timing / spring', labPresence: 'Entrada e saída', rays: 'delay', motiText: 'MotiText', bootstrap: 'Inicialização' };
  let current = 0;
  let notesVisible = false;
  let demoMode = null;
  let demoReady = false;
  let toastTimer;
  let countdown;
  let remaining = 0;
  const clock = value => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;

  function syntax(line) {
    const pattern = /(\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|function|return|if|else|true|false|null|import|from|export|default|new)\b|\b\d+(?:\.\d+)?\b)/g;
    let html = '', last = 0;
    for (const match of line.matchAll(pattern)) {
      html += esc(line.slice(last, match.index));
      const token = match[0];
      const klass = token.startsWith('//') ? 'syntax-comment' : /^["'`]/.test(token) ? 'syntax-string' : /^\d/.test(token) ? 'syntax-number' : 'syntax-keyword';
      html += `<span class="${klass}">${esc(token)}</span>`;
      last = match.index + token.length;
    }
    return html + esc(line.slice(last));
  }

  function codeContent(snippet) {
    const lines = snippet.raw.split('\n');
    const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length));
    return lines.map((line, index) => `<div class="code-line" data-code-line="${esc(line)}"><span class="line-num">${snippet.start + index}</span><span class="line-text">${syntax(line.slice(indent)) || ' '}</span></div>`).join('');
  }

  function codePanel(id) {
    const snippet = data.snippets[id];
    const label = snippet.file.includes('/seminar/') ? 'Laboratório didático · arquivo do projeto' : 'Exemplo do jogo · arquivo do projeto';
    return `<div class="code-panel" data-active-snippet="${id}"><div class="code-origin">${label}</div><div class="code-top"><button class="file" data-source="${esc(snippet.file)}" title="Abrir o arquivo completo">${esc(snippet.file)} : ${snippet.start}–${snippet.end}</button><button data-copy="${id}" aria-label="Copiar trecho original">Copiar</button></div><div class="code-content">${codeContent(snippet)}</div></div>`;
  }

  function codeArea(slide) {
    return `<div class="code-area">${slide.snippets.length > 1 ? `<div class="code-tabs">${slide.snippets.map((id, index) => `<button data-snippet="${id}" class="${index ? '' : 'active'}">${names[id]}</button>`).join('')}</div>` : ''}${codePanel(slide.snippets[0])}${slide.highlights ? `<div class="highlights">${slide.highlights.map((word) => `<button data-highlight="${word}">${esc(word)}</button>`).join('')}</div>` : ''}<p class="code-foot">Trecho literal do projeto · clique no arquivo para conferir a fonte completa</p>${slide.callout ? `<div class="callout">${esc(slide.callout)}</div>` : ''}${slide.reference ? `<p class="code-foot"><a href="${slide.reference}" target="_blank" rel="noopener">Documentação oficial ↗</a></p>` : ''}</div>`;
  }

  function image(name, className = 'phone-shot') {
    return `<img class="${className}" src="images/${name}" alt="Captura real do aplicativo Tríade" loading="lazy">`;
  }

  function cards(slide) {
    return `<div class="concept-cards">${(slide.cards || []).map((card, index) => `<article><span class="number">${String(index + 1).padStart(2, '0')}</span><h3>${esc(card.title)}</h3><p>${esc(card.text)}</p></article>`).join('')}</div>`;
  }

  function activity(slide) {
    return `<div class="audience-card" data-activity="${slide.id}"><span class="eyebrow">${esc(slide.activityLabel || 'PARTICIPAÇÃO DA TURMA')}</span><h3>${esc(slide.question || slide.prompt || 'Converse com a pessoa ao lado.')}</h3><p class="activity-instruction">${esc(slide.instruction || 'Discuta em dupla e vote levantando a mão: A, B ou C. Peça a uma pessoa que justifique a escolha.')}</p>${slide.options ? `<div class="audience-options">${slide.options.map((option, index) => `<button data-vote="${index}"><span>${String.fromCharCode(65 + index)}</span>${esc(option)}</button>`).join('')}</div>` : ''}<div class="activity-actions"><button data-reveal>Revelar e discutir →</button>${slide.activitySeconds ? `<div class="timer"><span data-timer aria-live="off">${clock(slide.activitySeconds)}</span><button data-timer-toggle aria-label="Iniciar ou pausar tempo da discussão">Iniciar</button><button data-timer-reset aria-label="Reiniciar tempo da discussão">↺</button></div>` : ''}</div><div class="activity-answer" hidden><strong>${slide.answerIndex !== undefined ? `Resposta ${String.fromCharCode(65 + slide.answerIndex)}. ` : ''}</strong>${esc(slide.explanation || slide.resolution || '')}</div><p class="activity-note">Votação feita em sala. Os botões ajudam o apresentador a destacar uma alternativa.</p></div>`;
  }

  function laboratory(slide) {
    return `<div class="lab-layout">${codeArea(slide)}<div class="lab-side"><div class="lab-frame"><iframe data-lab="${slide.labMode || 'api'}" title="Laboratório Moti real: ${esc(slide.title)}"></iframe></div><p class="lab-caption">React Native + Moti em execução · use os controles no quadro</p></div></div>`;
  }

  const labLabels = { api: ['Entrada', 'Aparecer, subir e crescer'], state: ['Estado React', 'Selecionar e mudar de destino'], timing: ['timing × spring', 'Comparar tempo e elasticidade'], presence: ['Entrada e saída', 'Observar exit com AnimatePresence'] };
  function showcase(slide) {
    const modes = slide.labModes || ['api', 'state', 'timing', 'presence'];
    return `<div class="showcase-layout"><div class="showcase-menu"><span class="eyebrow">ESCOLHA COM A TURMA</span><div class="showcase-options">${modes.map((mode, index) => `<button data-showcase="${mode}" class="${index ? '' : 'active'}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${labLabels[mode][0]}</strong><small>${labLabels[mode][1]}</small></button>`).join('')}</div><p>${esc(slide.prompt || 'Escolha um movimento. Peça uma previsão antes de executá-lo.')}</p><button data-demo="moti">Ver as cartas em ação ↗</button></div><div class="lab-side"><div class="lab-frame"><iframe data-lab="${modes[0]}" title="Demonstrações reais da biblioteca Moti"></iframe></div><p class="lab-caption">Moti em execução · escolha uma demonstração e use seus controles</p></div></div>`;
  }

  function renderHistory(slide) {
    return `<div class="history-layout"><div class="history-track">${slide.milestones.map((item, index) => `<article><span class="history-step">${String(index + 1).padStart(2, '0')}</span><div><span class="eyebrow">${esc(item.label)}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p>${item.url ? `<a href="${item.url}" target="_blank" rel="noopener">Fonte original ↗</a>` : ''}</div></article>`).join('')}</div><aside class="history-message"><span class="eyebrow">A IDEIA QUE CONECTA TUDO</span><h3>Descrever movimento<br>com propriedades.</h3><p>Uma API de componentes para compartilhar animações entre interfaces nativas e web.</p>${slide.prompt ? `<div class="concept-prompt"><p>${esc(slide.prompt)}</p></div>` : ''}</aside></div>`;
  }

  function tradeoffs(slide) {
    return `<div class="tradeoffs-layout">${[['pros','Prós'],['cons','Contras e limites']].map(([key, title]) => `<article class="tradeoff-column ${key}"><h3>${title}</h3>${slide[key].map(item => `<div><strong>${esc(item.title)}</strong><p>${esc(item.text)}</p></div>`).join('')}</article>`).join('')}<p class="tradeoffs-question">${esc(slide.prompt || 'Que benefício pesa mais para o seu projeto? Que limite você precisa considerar?')}</p></div>`;
  }

  function alternatives(slide) {
    return `<div class="alternatives-layout"><div class="comparison-table-wrap"><table class="library-table"><thead><tr><th>Biblioteca / API</th><th>Como se expressa</th><th>Quando considerar</th><th>Ponto de atenção</th></tr></thead><tbody>${slide.rows.map(row => `<tr><th><a href="${row.url}" target="_blank" rel="noopener">${esc(row.name)} ↗</a></th><td>${esc(row.approach)}</td><td>${esc(row.fit)}</td><td>${esc(row.tradeoff)}</td></tr>`).join('')}</tbody></table></div><div class="scenario-activity"><span class="eyebrow">A TURMA ESCOLHE A FERRAMENTA</span><div>${slide.scenarios.map((scenario, index) => `<button data-scenario="${index}">${esc(scenario.title)}</button>`).join('')}</div><p class="scenario-answer" hidden role="status"></p><small>Justifique a escolha antes de clicar. Os cenários admitem outras soluções.</small></div></div>`;
  }

  function thanks(slide) {
    return `<div class="thanks-only"><h1>${esc(slide.title)}</h1></div>`;
  }

  function body(slide) {
    switch (slide.type) {
      case 'cover': return `<div class="cover-layout"><div><span class="cover-tag">BIBLIOTECA DE ANIMAÇÃO / REACT NATIVE</span><h1>Moti<span class="accent">.</span></h1><p class="cover-subtitle">Você descreve o destino.<br><span class="accent">A interface se move.</span></p><p class="lead">${esc(slide.lead)}</p><div class="cover-actions"><button class="primary" data-next>Continuar →</button><button data-go="2">O que vamos aprender</button></div></div><div class="cover-visual api-visual"><div class="api-tile">M<span>DECLARAR → ANIMAR</span></div><div class="api-chip chip-from"><code>from</code><span>de onde começa</span></div><div class="api-chip chip-animate"><code>animate</code><span>para onde vai</span></div><div class="api-chip chip-transition"><code>transition</code><span>como chega</span></div></div></div>`;
      case 'concepts': return `<div class="concept-layout">${cards(slide)}${slide.prompt ? `<div class="concept-prompt"><span class="eyebrow">${esc(slide.promptLabel || 'CONVERSE COM A TURMA')}</span><p>${esc(slide.prompt)}</p>${slide.resolution ? `<button data-concept-reveal>Revelar ideia central</button><div class="concept-answer" hidden>${esc(slide.resolution)}</div>` : ''}</div>` : ''}${slide.reference ? `<p class="code-foot"><a href="${slide.reference}" target="_blank" rel="noopener">Documentação oficial ↗</a></p>` : ''}</div>`;
      case 'installation': return `<div class="installation-layout"><div class="terminal-list">${slide.commands.map((item, index) => `<article><div><span class="number">${index + 1}.</span><strong>${esc(item.label)}</strong></div><pre><code>${esc(item.command)}</code></pre><p>${esc(item.detail)}</p><button data-copy-command="${esc(item.command)}">Copiar comando</button></article>`).join('')}</div><div class="installation-context">${cards(slide)}<p class="installation-note">${esc(slide.callout || '')}</p>${slide.reference ? `<a href="${slide.reference}" target="_blank" rel="noopener">Guia do Expo SDK 54 ↗</a>` : ''}</div></div>`;
      case 'poll': return activity(slide);
      case 'challenge': return slide.snippets?.length ? `<div class="challenge-layout">${codeArea(slide)}${activity(slide)}</div>` : activity(slide);
      case 'lab': return laboratory(slide);
      case 'history': return renderHistory(slide);
      case 'showcase': return showcase(slide);
      case 'tradeoffs': return tradeoffs(slide);
      case 'alternatives': return alternatives(slide);
      case 'thanks': return thanks(slide);
      case 'comparison': return `<div class="comparison-grid"><article class="compare-card">${image('basic.png')}<div class="compare-copy"><span class="number">01 / REACT NATIVE</span><h3>Escolher.<br>Jogar. Resultado.</h3><p>Figuras locais, destaque estático e uma resposta imediata à jogada.</p><button data-demo="basic">Testar versão básica ↗</button></div></article><article class="compare-card">${image('victory.png')}<div class="compare-copy"><span class="number">02 / MOTI</span><h3>Invocar.<br>Revelar. Colidir.</h3><p>A carta viaja até o campo, cresce e ganha uma sequência cinematográfica.</p><button data-demo="moti">Testar versão Moti ↗</button></div></article></div>`;
      case 'stack': return `<div class="stack-grid"><div class="stack-diagram"><div class="stack-item"><strong>React</strong><span>Estado e estrutura da interface</span></div><div class="stack-arrow">↓ estilos de destino</div><div class="stack-item"><strong class="accent">Moti</strong><span>from · animate · transition</span></div><div class="stack-arrow">↓ execução das animações</div><div class="stack-item"><strong style="color:var(--violet)">Reanimated</strong><span>Base de animação usada pelo Moti</span></div><p class="stack-ref">Uma biblioteca de animação para React Native, com suporte a interfaces nativas e web. <a href="https://moti.fyi/" target="_blank" rel="noopener">Conheça a biblioteca ↗</a></p></div>${codeArea(slide)}</div>`;
      case 'rules': return `<div class="rule-grid"><div class="rules-controls"><label>SUA ESCOLHA</label><div class="rule-options" data-rule-group="player">${rules.CHOICES.map((choice) => `<button data-rule-choice="${choice.id}" class="${choice.id === 'rock' ? 'active' : ''}">${choice.title}</button>`).join('')}</div><label>ESCOLHA DO RIVAL</label><div class="rule-options" data-rule-group="opponent">${rules.CHOICES.map((choice) => `<button data-rule-choice="${choice.id}" class="${choice.id === 'scissors' ? 'active' : ''}">${choice.title}</button>`).join('')}</div><div class="rule-result"><strong id="ruleOutcome"></strong><p id="ruleDescription"></p></div><p class="hint">Esta interação usa getOutcome e describeRound empacotadas diretamente de src/game/rules.js.</p></div>${codeArea(slide)}</div>`;
      case 'timeline': return `<div class="timeline-layout"><div class="timeline-main"><div class="phase-buttons">${[['summon','Invocação','0 ms'],['reveal','Revelação','1.100 ms'],['clash','Colisão','2.350 ms'],['result','Resultado','3.550 ms']].map(([id,title,time],index) => `<button data-phase="${id}" class="${index ? '' : 'active'}"><strong>${title}</strong><small>${time}</small></button>`).join('')}</div><p class="phase-description" id="phaseDescription">A carta avança para o centro, cresce e desperta a aura.</p>${codeArea(slide)}</div><div class="visual" style="flex-direction:column"><img id="phaseImage" class="phone-shot timeline-image" src="images/invocation.png" alt="Captura real da invocação"><span class="phase-label">CAPTURAS REAIS / LINHA DO TEMPO ILUSTRATIVA</span></div></div>`;
      case 'demo': return `<div class="demo-stage"><div class="demo-copy"><span class="eyebrow">UMA PESSOA JOGA. A TURMA EXPLICA.</span><div class="demo-step"><span>01</span><div>Convide um voluntário a escolher a carta.<br><strong>O restante da turma prevê o movimento.</strong></div></div><div class="demo-step"><span>02</span><div>Execute uma rodada em câmera lenta.<br><strong>Identifiquem scale, rotações e loop.</strong></div></div><div class="demo-step"><span>03</span><div>Peça a outra pessoa para explicar a saída.<br><strong>Onde entram exit e AnimatePresence?</strong></div></div><button class="primary" data-demo="moti">Aplicar o que aprendemos ↗</button><button data-demo="basic">Comparar resposta imediata</button></div><div class="demo-photos">${image('basic.png')}${image('victory.png')}</div></div>`;
      case 'quiz': return `<div class="quiz-layout"><div class="quiz-card"><span class="quiz-count" id="quizCount"></span><h3 id="quizQuestion"></h3><div class="quiz-options" id="quizOptions"></div><div class="quiz-feedback" id="quizFeedback" aria-live="polite"></div><button id="revealQuiz">Revelar resposta →</button><button id="nextQuestion">Próxima pergunta →</button></div><div class="recap"><h3>from → animate.<br>transition descreve o caminho.</h3><p>Explique Moti em uma frase à pessoa ao lado. Que animação você faria em um aplicativo seu?</p><div class="references"><span class="eyebrow">PARA CONTINUAR PRATICANDO</span>${data.references.map((ref) => `<a href="${ref.url}" target="_blank" rel="noopener">${esc(ref.title)} ↗</a>`).join('')}<a href="provenance.json" target="_blank" rel="noopener">Arquivos e trechos usados nos exemplos ↗</a></div></div></div>`;
      default: return `<div class="two-col">${codeArea(slide)}<div class="visual">${image(slide.image)}${slide.demo ? `<button class="demo-link" data-demo="${slide.demo}">Executar no jogo real ↗</button>` : ''}</div></div>`;
    }
  }

  $('#slides').innerHTML = data.slides.map((slide, index) => `<section class="slide ${slide.type}" id="slide-${index + 1}" data-id="${slide.id}" aria-label="Slide ${index + 1}: ${esc(slide.title)}">${slide.type !== 'cover' ? `<div class="slide-head"><span class="eyebrow">${String(index + 1).padStart(2, '0')} / ${esc(slide.chapter)} <span class="slide-duration">${slide.duration} · com participação</span></span><h2>${esc(slide.title)}${slide.accent ? `<br><span class="accent">${esc(slide.accent)}</span>` : ''}</h2><p class="lead">${esc(slide.lead)}</p></div>` : ''}<div class="slide-body">${body(slide)}</div></section>`).join('');
  $('#overviewGrid').innerHTML = data.slides.map((slide, index) => `<button data-go="${index}"><small>${String(index + 1).padStart(2, '0')} / ${esc(slide.chapter)}</small><strong>${esc(slide.title)} ${esc(slide.accent || '')}</strong></button>`).join('');
  $('#referencesList').innerHTML = data.references.map(ref => `<a href="${ref.url}" target="_blank" rel="noopener">${esc(ref.title)} ↗</a>`).join('');

  function navigate(index, updateHash = true) {
    clearInterval(countdown); countdown = null;
    current = Math.max(0, Math.min(data.slides.length - 1, index));
    document.querySelectorAll('.slide').forEach((el, position) => { el.classList.toggle('current', position === current); el.setAttribute('aria-hidden', String(position !== current)); });
    const slide = data.slides[current];
    $('#chapterLabel').textContent = slide.chapter.toUpperCase();
    $('#counter').textContent = `${String(current + 1).padStart(2, '0')} / ${data.slides.length}`;
    $('#progressFill').style.width = `${(current + 1) / data.slides.length * 100}%`;
    $('#prevButton').disabled = current === 0;
    $('#nextButton').disabled = current === data.slides.length - 1;
    $('#noteText').textContent = slide.notes;
    const elapsed = data.slides.slice(0, current).reduce((sum, item) => sum + item.durationSeconds, 0);
    $('#noteTime').textContent = `${clock(elapsed)}–${clock(elapsed + slide.durationSeconds)} / 30:00`;
    const timer = $('.slide.current [data-timer]');
    remaining = slide.activitySeconds || 0;
    if (timer) { timer.textContent = clock(remaining); $('.slide.current [data-timer-toggle]').textContent = 'Iniciar'; }
    document.querySelectorAll('[data-lab]').forEach(frame => {
      if (frame.closest('.slide.current') && location.protocol !== 'file:') {
        if (!frame.dataset.loaded) { frame.src = `app.html?mode=lab&lesson=${frame.dataset.lab}`; frame.dataset.loaded = 'true'; }
      } else if (frame.dataset.loaded) { frame.src = 'about:blank'; delete frame.dataset.loaded; }
    });
    document.title = `${current + 1}. ${slide.title} — Seminário Moti`;
    if (updateHash) history.replaceState(null, '', `#slide-${current + 1}`);
    window.scrollTo(0, 0);
  }
  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2400);
  }
  function toggleNotes() {
    notesVisible = !notesVisible;
    $('#notes').hidden = !notesVisible;
    $('#notesButton').setAttribute('aria-pressed', String(notesVisible));
  }
  function showOverview() { $('#overview').showModal(); }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { toast('Use o modo de tela cheia do navegador.'); }
  }
  function source(file) {
    const snapshot = data.sources[file];
    $('#sourceTitle').textContent = file;
    $('#sourceInfo').textContent = `Snapshot do arquivo do projeto · SHA-256 ${snapshot.sha256.slice(0, 16)}…`;
    $('#fullSource').textContent = snapshot.text.split('\n').map((line, index) => `${String(index + 1).padStart(3, ' ')}  ${line}`).join('\n');
    $('#sourceDialog').showModal();
  }
  async function copy(id) {
    await copyText(data.snippets[id].raw);
  }
  async function copyText(raw) {
    try { await navigator.clipboard.writeText(raw); toast('Trecho original copiado.'); }
    catch { const el = document.createElement('textarea'); el.value = raw; document.body.append(el); el.select(); document.execCommand('copy'); el.remove(); toast('Trecho original copiado.'); }
  }

  let player = 'rock', opponent = 'scissors';
  function renderRule() {
    const outcome = rules.getOutcome(player, opponent);
    $('#ruleOutcome').textContent = rules.OUTCOMES[outcome].title;
    $('#ruleOutcome').style.color = rules.OUTCOMES[outcome].color;
    $('#ruleDescription').textContent = rules.describeRound(rules.getChoice(player), rules.getChoice(opponent), outcome);
  }
  const phases = {
    summon: { image: 'invocation.png', description: 'A carta avança para o centro, cresce e desperta a aura.', highlight: "setPhase('summon')" },
    reveal: { image: 'reveal.png', description: 'O rival revela sua face e as duas cartas assumem os lados da arena.', highlight: "setPhase('reveal')" },
    clash: { image: 'clash.png', description: 'As cartas colidem. Arrays de transformações e fragmentos constroem o impacto.', highlight: "setPhase('clash')" },
    result: { image: 'victory.png', description: 'finish atualiza o placar e o resultado destaca o vencedor. A rodada dura 3,55 s na velocidade normal.', highlight: 'setTimeout(finish' },
  };

  const quiz = [
    { question: 'Qual propriedade descreve o destino visual?', options: ['from', 'animate', 'transition'], correct: 1, explanation: 'from é o início ao montar; animate é o destino; transition configura o movimento entre os valores.' },
    { question: 'Quer controlar duração em milissegundos. Qual escolha é mais direta?', options: ['loop: true', "type: 'timing' e duration", 'AnimatePresence'], correct: 1, explanation: 'timing configura o movimento por tempo. spring usa uma simulação de mola, com parâmetros como damping e stiffness.' },
    { question: 'Como animar antes de remover um componente?', options: ['Colocar exit em uma View comum.', 'Usar apenas from e apagar o componente.', 'Usar exit em um componente Moti dentro de AnimatePresence.'], correct: 2, explanation: 'AnimatePresence mantém o componente durante a animação de saída. Os filhos diretos devem ter keys que identifiquem os elementos.' },
  ];
  let question = 0, answered = false;
  function renderQuiz() {
    const item = quiz[question];
    answered = false;
    $('#quizCount').textContent = `PERGUNTA ${question + 1} / ${quiz.length}`;
    $('#quizQuestion').textContent = item.question;
    $('#quizOptions').innerHTML = item.options.map((option, index) => `<button data-answer="${index}">${String.fromCharCode(65 + index)}. ${esc(option)}</button>`).join('');
    $('#quizFeedback').textContent = 'Vote com a turma. Depois, revele a resposta.';
    $('#nextQuestion').textContent = question === quiz.length - 1 ? 'Recomeçar perguntas ↺' : 'Próxima pergunta →';
  }

  function setDemoMode(mode) {
    demoMode = mode;
    demoReady = false;
    $('#demoStatus').textContent = 'Carregando a compilação real do aplicativo…';
    $('#liveApp').src = `app.html?mode=${mode}`;
    document.querySelectorAll('[data-mode]').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
  }
  function openDemo(mode) {
    if (location.protocol === 'file:') { toast('Para a demonstração real, execute npm run seminario e abra localhost:4173.'); return; }
    $('#demoDialog').showModal();
    if (demoMode !== mode || !$('#liveApp').src) setDemoMode(mode);
  }
  function demoAction(action, value) {
    if (!demoReady) { toast('Aguarde o aplicativo carregar.'); return; }
    $('#demoStatus').textContent = 'Executando no aplicativo…';
    $('#liveApp').contentWindow.postMessage({ type: 'seminar-command', action, value }, location.origin);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-next')) navigate(current + 1);
    if (button.dataset.go !== undefined) { navigate(Number(button.dataset.go)); $('#overview').close(); }
    if (button.dataset.close) $(`#${button.dataset.close}`).close();
    if (button.dataset.source) source(button.dataset.source);
    if (button.dataset.copy) copy(button.dataset.copy);
    if (button.dataset.copyCommand) copyText(button.dataset.copyCommand);
    if (button.dataset.openDialog) $(`#${button.dataset.openDialog}`).showModal();
    if (button.dataset.showcase) {
      const slide = button.closest('.slide');
      const frame = slide.querySelector('[data-lab]');
      frame.dataset.lab = button.dataset.showcase;
      frame.src = `app.html?mode=lab&lesson=${button.dataset.showcase}`;
      frame.dataset.loaded = 'true';
      slide.querySelectorAll('[data-showcase]').forEach(el => el.classList.toggle('active', el === button));
    }
    if (button.dataset.scenario !== undefined) {
      const section = button.closest('.slide');
      const slide = data.slides.find(item => item.id === section.dataset.id);
      const answer = section.querySelector('.scenario-answer');
      answer.textContent = slide.scenarios[Number(button.dataset.scenario)].answer;
      answer.hidden = false;
      section.querySelectorAll('[data-scenario]').forEach(el => el.classList.toggle('active', el === button));
    }
    if (button.hasAttribute('data-concept-reveal')) button.parentElement.querySelector('.concept-answer').hidden = false;
    if (button.dataset.vote !== undefined) {
      button.closest('.audience-card').querySelectorAll('[data-vote]').forEach(el => el.classList.toggle('active', el === button));
    }
    if (button.hasAttribute('data-reveal')) {
      const card = button.closest('.audience-card');
      const slide = data.slides.find(item => item.id === card.dataset.activity);
      card.querySelector('.activity-answer').hidden = false;
      if (slide.answerIndex !== undefined) card.querySelectorAll('[data-vote]').forEach((el, index) => el.classList.toggle('correct', index === slide.answerIndex));
    }
    if (button.hasAttribute('data-timer-toggle')) {
      if (countdown) { clearInterval(countdown); countdown = null; button.textContent = 'Continuar'; }
      else {
        if (!remaining) remaining = data.slides[current].activitySeconds;
        button.textContent = 'Pausar';
        countdown = setInterval(() => { remaining = Math.max(0, remaining - 1); $('.slide.current [data-timer]').textContent = clock(remaining); if (!remaining) { clearInterval(countdown); countdown = null; button.textContent = 'Repetir'; } }, 1000);
      }
    }
    if (button.hasAttribute('data-timer-reset')) { clearInterval(countdown); countdown = null; remaining = data.slides[current].activitySeconds; $('.slide.current [data-timer]').textContent = clock(remaining); $('.slide.current [data-timer-toggle]').textContent = 'Iniciar'; }
    if (button.dataset.snippet) {
      const area = button.closest('.code-area');
      area.querySelector('.code-panel').outerHTML = codePanel(button.dataset.snippet);
      area.querySelectorAll('[data-snippet]').forEach((el) => el.classList.toggle('active', el === button));
      area.querySelectorAll('[data-highlight]').forEach((el) => el.classList.remove('active'));
    }
    if (button.dataset.highlight) {
      const area = button.closest('.code-area');
      const active = !button.classList.contains('active');
      area.querySelectorAll('[data-highlight]').forEach((el) => el.classList.toggle('active', el === button && active));
      area.querySelectorAll('.code-line').forEach((line) => line.classList.toggle('marked', active && line.dataset.codeLine.includes(button.dataset.highlight)));
    }
    if (button.dataset.ruleChoice) {
      const group = button.closest('[data-rule-group]');
      if (group.dataset.ruleGroup === 'player') player = button.dataset.ruleChoice; else opponent = button.dataset.ruleChoice;
      group.querySelectorAll('button').forEach((el) => el.classList.toggle('active', el === button));
      renderRule();
    }
    if (button.dataset.phase) {
      const phase = phases[button.dataset.phase];
      $('#phaseImage').src = `images/${phase.image}`;
      $('#phaseDescription').textContent = phase.description;
      button.parentElement.querySelectorAll('button').forEach((el) => el.classList.toggle('active', el === button));
      button.closest('.slide').querySelectorAll('.code-line').forEach((line) => line.classList.toggle('marked', line.dataset.codeLine.includes(phase.highlight)));
    }
    if (button.dataset.answer !== undefined && !answered) {
      $('#quizOptions').querySelectorAll('button').forEach(el => el.classList.toggle('active', el === button));
      $('#quizFeedback').textContent = 'Alternativa destacada. Peça uma justificativa antes de revelar.';
    }
    if (button.dataset.demo) openDemo(button.dataset.demo);
    if (button.dataset.mode) setDemoMode(button.dataset.mode);
    if (button.dataset.demoAction) demoAction(button.dataset.demoAction);
    if (button.dataset.demoChoice) demoAction('choice', button.dataset.demoChoice);
  });
  $('#prevButton').addEventListener('click', () => navigate(current - 1));
  $('#nextButton').addEventListener('click', () => navigate(current + 1));
  $('#counter').addEventListener('click', showOverview);
  $('#overviewButton').addEventListener('click', showOverview);
  $('#notesButton').addEventListener('click', toggleNotes);
  $('#fullscreenButton').addEventListener('click', fullscreen);
  $('#printButton').addEventListener('click', () => window.print());
  $('#nextQuestion').addEventListener('click', () => { question = (question + 1) % quiz.length; renderQuiz(); });
  $('#revealQuiz').addEventListener('click', () => { answered = true; const item = quiz[question]; $('#quizOptions').querySelectorAll('button').forEach((el, index) => el.classList.toggle('correct', index === item.correct)); $('#quizFeedback').textContent = `Resposta ${String.fromCharCode(65 + item.correct)}. ${item.explanation}`; });
  $('#demoPlay').addEventListener('click', () => demoAction('play'));
  $('#demoReset').addEventListener('click', () => demoAction('reset'));

  function keyboard(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target?.closest?.('input,textarea,select')) return;
    const key = event.key.toLowerCase();
    if (key === 'escape') { document.querySelector('.blackout')?.remove(); return; }
    if (document.querySelector('dialog[open]')) return;
    if (['arrowright','pagedown'].includes(key) || key === ' ' && !event.target?.closest?.('button,a')) { event.preventDefault(); navigate(current + 1); }
    else if (['arrowleft','pageup'].includes(key)) { event.preventDefault(); navigate(current - 1); }
    else if (key === 'home') navigate(0);
    else if (key === 'end') navigate(data.slides.length - 1);
    else if (key === 'n') toggleNotes();
    else if (key === 'g') showOverview();
    else if (key === 'f') fullscreen();
    else if (key === 'b') { const existing = $('.blackout'); if (existing) existing.remove(); else { const el = document.createElement('div'); el.className = 'blackout'; el.addEventListener('click', () => el.remove()); document.body.append(el); } }
  }
  document.addEventListener('keydown', keyboard);
  window.addEventListener('hashchange', () => { const match = location.hash.match(/^#slide-(\d+)$/); if (match) navigate(Number(match[1]) - 1, false); });
  window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || event.source !== $('#liveApp').contentWindow) return;
    if (event.data?.type === 'seminar-ready') { demoReady = true; $('#demoStatus').textContent = 'Aplicativo pronto. Ative o modo seminário ou toque no jogo.'; }
    if (event.data?.type === 'seminar-status') $('#demoStatus').textContent = event.data.message;
    if (event.data?.type === 'seminar-key' && event.data.message === 'Escape') $('#demoDialog').close();
  });
  if ($('#ruleOutcome')) renderRule();
  renderQuiz();
  const match = location.hash.match(/^#slide-(\d+)$/);
  navigate(match ? Number(match[1]) - 1 : 0);
})();
