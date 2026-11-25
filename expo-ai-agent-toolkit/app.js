/* ==========================================================
   Expo AI Agent Toolkit — Interactive Presentation Engine
   ========================================================== */

(function () {
  "use strict";

  const SLIDE_META = [
    {
      title: "1. Capa: Expo AI Agent Toolkit",
      duration: "Abertura",
      objective: "Apresentar o tema do seminário, o contexto da disciplina e o fio condutor da apresentação."
    },
    {
      title: "2. O desafio: criar um aplicativo de reservas",
      duration: "1 min",
      objective: "Apresentar o cenário e criar uma motivação que o público reconheça."
    },
    {
      title: "3. O que precisamos construir?",
      duration: "2 min",
      objective: "Definir os requisitos do projeto e estabelecer critérios para comparar as duas abordagens."
    },
    {
      title: "4. Primeira abordagem: somente o agente de IA",
      duration: "2 min",
      objective: "Demonstrar como um agente pode criar uma primeira versão do aplicativo a partir de instruções."
    },
    {
      title: "5. Gerar código não é o mesmo que verificar o aplicativo",
      duration: "2 min",
      objective: "Demonstrar o bug clássico do teclado cobrindo o campo Telefone enquanto o usuário digita e explicar por que passa despercebido."
    },
    {
      title: "6. Conhecendo o Expo AI Agent Toolkit",
      duration: "2 min",
      objective: "Explicar o toolkit, sua relação com agentes, MCP e as ferramentas citadas."
    },
    {
      title: "7. Como usar na prática: onde o app roda?",
      duration: "1,5 min",
      objective: "Mostrar visualmente os 3 ambientes práticos de execução (emulador local, EAS Simulators na nuvem e celular físico)."
    },
    {
      title: "7-2. Na prática: instalando o agent-device",
      duration: "1,5 min",
      objective: "Mostrar o passo a passo de instalação da CLI, da skill e do primeiro teste no emulador."
    },
    {
      title: "8. Segunda abordagem: agente + toolkit",
      duration: "2 min",
      objective: "Mostrar o agente conectado ao agent-device e observando a interface do aplicativo."
    },
    {
      title: "9. Testando o fluxo de reservas",
      duration: "2,5 min",
      objective: "Mostrar o agente preenchendo o fluxo no emulador e detectando que o teclado cobriu o campo Telefone."
    },
    {
      title: "10. Encontrando e corrigindo problemas",
      duration: "2 min",
      objective: "Demonstrar o ciclo de detecção, investigação, correção (KeyboardAvoidingView + ScrollView) e reteste."
    },
    {
      title: "11. Outras alternativas: conhecendo o Argent",
      duration: "1,5 min",
      objective: "Apresentar brevemente o Argent (Software Mansion) como alternativa ao agent-device."
    },
    {
      title: "12. Quando usar o Argent?",
      duration: "2 min",
      objective: "Apresentar os cenários ideais para escolher o Argent em comparação ao agent-device."
    },
    {
      title: "13. Conclusão: o que realmente mudou?",
      duration: "1 min",
      objective: "Fechar o seminário reforçando a mensagem central."
    }
  ];

  // ==========================================================
  // Deck State & Navigation
  // ==========================================================
  const slides = Array.from(document.querySelectorAll(".slide"));
  const totalSlides = slides.length;
  let currentIndex = 0;

  const progressBar = document.getElementById("progressBar");
  const slideCounter = document.getElementById("slideCounter");
  const slideTimePill = document.getElementById("slideTimePill");
  const dotsNav = document.getElementById("dotsNav");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Overview elements
  const overviewModal = document.getElementById("overviewModal");
  const overviewGrid = document.getElementById("overviewGrid");
  const overviewBtn = document.getElementById("overviewBtn");
  const closeOverviewBtn = document.getElementById("closeOverviewBtn");

  // Theme & Fullscreen
  const themeBtn = document.getElementById("themeBtn");
  const fsBtn = document.getElementById("fsBtn");

  // Build dots navigation
  slides.forEach((_, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dot-btn";
    btn.setAttribute("aria-label", `Ir para o slide ${idx + 1}`);
    btn.title = SLIDE_META[idx].title;
    btn.addEventListener("click", () => goToSlide(idx));
    dotsNav.appendChild(btn);
  });

  // Build overview cards
  function renderOverviewCards() {
    overviewGrid.innerHTML = "";
    SLIDE_META.forEach((meta, idx) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `ov-card${idx === currentIndex ? " current" : ""}`;
      card.innerHTML = `
        <div class="ov-card-top">
          <span>Slide ${String(idx + 1).padStart(2, "0")}</span>
          <span>${meta.duration}</span>
        </div>
        <strong>${meta.title.replace(/^\d+\.\s*/, "")}</strong>
        <span class="ov-obj">${meta.objective}</span>
      `;
      card.addEventListener("click", () => {
        goToSlide(idx);
        toggleOverview(false);
      });
      overviewGrid.appendChild(card);
    });
  }

  function goToSlide(index) {
    const clamped = Math.max(0, Math.min(totalSlides - 1, index));
    currentIndex = clamped;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    const dots = dotsNav.querySelectorAll(".dot-btn");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));

    const slideNum = currentIndex + 1;
    const pct = (slideNum / totalSlides) * 100;
    progressBar.style.width = `${pct}%`;
    slideCounter.textContent = `${String(slideNum).padStart(2, "0")} / ${totalSlides}`;

    slideTimePill.textContent = `Slide ${slideNum}`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    renderOverviewCards();

    try {
      history.replaceState(null, "", `#slide-${slideNum}`);
    } catch (_) {
      // ignore if restricted
    }

    if (currentIndex === 3) {
      runSlide3Simulation(false);
    }
  }

  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  function toggleOverview(force) {
    const shouldOpen = typeof force === "boolean" ? force : !overviewModal.classList.contains("open");
    overviewModal.classList.toggle("open", shouldOpen);
    overviewModal.setAttribute("aria-hidden", String(!shouldOpen));
    overviewBtn.classList.toggle("active", shouldOpen);
    if (shouldOpen) renderOverviewCards();
  }

  function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "2010" : "dark";
    html.setAttribute("data-theme", next);
    themeBtn.textContent = next === "dark" ? "Tema: Escuro (T)" : "Tema: 2010 (T)";
    try {
      localStorage.setItem("expo_deck_theme_v2", next);
    } catch (_) {}
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  overviewBtn.addEventListener("click", () => toggleOverview());
  closeOverviewBtn.addEventListener("click", () => toggleOverview(false));
  themeBtn.addEventListener("click", toggleTheme);
  fsBtn.addEventListener("click", toggleFullscreen);

  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "Escape") {
      if (overviewModal.classList.contains("open")) toggleOverview(false);
      return;
    }

    if (overviewModal.classList.contains("open")) return;

    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
      case " ":
        e.preventDefault();
        goToSlide(currentIndex + 1);
        break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        goToSlide(currentIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        goToSlide(0);
        break;
      case "End":
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case "o":
      case "O":
      case "g":
      case "G":
        toggleOverview();
        break;
      case "t":
      case "T":
        toggleTheme();
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
    }
  });

  // Restore saved theme & initial slide from hash
  try {
    const savedTheme = localStorage.getItem("expo_deck_theme_v2");
    if (savedTheme === "2010" || savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", savedTheme);
      themeBtn.textContent = savedTheme === "dark" ? "Tema: Escuro (T)" : "Tema: 2010 (T)";
    } else {
      themeBtn.textContent = "Tema: 2010 (T)";
    }
  } catch (_) {}

  // ==========================================================
  // Seminar 20:00 Timer
  // ==========================================================
  const timerDisplay = document.getElementById("timerDisplay");
  const timerToggleBtn = document.getElementById("timerToggleBtn");
  const timerResetBtn = document.getElementById("timerResetBtn");
  let timerSeconds = 0;
  let timerInterval = null;

  function renderTimer() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    timerDisplay.classList.toggle("warning", timerSeconds >= 17 * 60 && timerSeconds < 20 * 60);
    timerDisplay.classList.toggle("overtime", timerSeconds >= 20 * 60);
  }

  timerToggleBtn.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerToggleBtn.textContent = "▶";
    } else {
      timerInterval = setInterval(() => {
        timerSeconds += 1;
        renderTimer();
      }, 1000);
      timerToggleBtn.textContent = "⏸";
    }
  });

  timerResetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 0;
    timerToggleBtn.textContent = "▶";
    renderTimer();
  });

  // ==========================================================
  // Slide 2 — Interactive Wireframe Switcher
  // ==========================================================
  const slide2Screen = document.getElementById("slide2Screen");
  const reqItems = Array.from(document.querySelectorAll("#slide2ReqList .req-item"));

  const WIREFRAMES = [
    `
      <div class="wf-block wf-focus">
        <div class="wf-title">1. Tela Inicial</div>
        <strong>Restaurante Caraguá</strong>
        <p style="margin:4px 0 0;font-size:11px;color:#475569">Rua das Oliveiras, 240 · Ter–Dom, 18h–23h</p>
      </div>
      <div class="wf-block">
        <div class="wf-title">2–3. Data &amp; Horário</div>
        <div class="wf-box-row">
          <div class="wf-chip">Sex 27</div>
          <div class="wf-chip">19:30</div>
          <div class="wf-chip">20:00</div>
        </div>
      </div>
      <div class="wf-block">
        <div class="wf-title">4. Dados do Cliente</div>
        <div class="fake-input">Nome</div>
        <div class="fake-input">Telefone</div>
      </div>
      <div class="preview-btn" style="background:#4630eb">Iniciar reserva</div>
    `,
    `
      <div class="wf-block">
        <div class="wf-title">1. Restaurante</div>
        <span style="font-size:11px;color:#475569">Restaurante Caraguá · Mesa para 2</span>
      </div>
      <div class="wf-block wf-focus">
        <div class="wf-title">2. Escolha da Data</div>
        <div class="wf-box-row">
          <div class="wf-chip sel">Sex 27</div>
          <div class="wf-chip">Sáb 28</div>
          <div class="wf-chip">Dom 29</div>
        </div>
        <p style="margin:6px 0 0;font-size:10.5px;color:#4630eb">3 dias com mesas disponíveis</p>
      </div>
      <div class="wf-block">
        <div class="wf-title">3. Horário</div>
        <span style="font-size:11px;color:#64748b">Selecione após escolher a data</span>
      </div>
      <div class="preview-btn" style="background:#94a3b8">Continuar</div>
    `,
    `
      <div class="wf-block">
        <div class="wf-title">2. Data selecionada</div>
        <span style="font-size:11.5px;font-weight:700">Sexta, 27 de Novembro</span>
      </div>
      <div class="wf-block wf-focus">
        <div class="wf-title">3. Horários Disponíveis</div>
        <div class="wf-box-row">
          <div class="wf-chip">18:30</div>
          <div class="wf-chip sel">20:00</div>
          <div class="wf-chip">21:30</div>
        </div>
        <p style="margin:6px 0 0;font-size:10.5px;color:#4630eb">Horário 20:00 reservado no fluxo</p>
      </div>
      <div class="wf-block">
        <div class="wf-title">4. Formulário</div>
        <span style="font-size:11px;color:#64748b">Nome + Telefone do cliente</span>
      </div>
      <div class="preview-btn">Ir para dados</div>
    `,
    `
      <div class="wf-block">
        <div class="wf-title">Resumo parcial</div>
        <span style="font-size:11px">Sex, 27 Nov · 20:00</span>
      </div>
      <div class="wf-block wf-focus">
        <div class="wf-title">4. Formulário do Cliente</div>
        <label class="field-label">Nome completo *</label>
        <div class="fake-input" style="border-color:#4630eb">Marina Silva</div>
        <label class="field-label">Telefone *</label>
        <div class="fake-input" style="border-color:#4630eb">(12) 99123-4567</div>
      </div>
      <div class="preview-btn">Confirmar reserva</div>
    `,
    `
      <div class="wf-block wf-focus" style="text-align:center;padding:18px 12px">
        <div class="wf-title">5. Confirmação da Reserva</div>
        <div class="bug-icon" style="background:#059669">✓</div>
        <strong>Reserva Confirmada!</strong>
        <p style="margin:6px 0 0;font-size:11px;color:#334155">Restaurante Caraguá · Sex 27 Nov, 20:00<br>Cliente: Marina Silva</p>
      </div>
      <div class="wf-block">
        <div class="wf-title">Critério de comparação</div>
        <span style="font-size:11px;color:#475569">Todos os 5 requisitos atendidos com dados válidos.</span>
      </div>
    `
  ];

  function selectWireframe(stepIdx) {
    reqItems.forEach((btn, i) => btn.classList.toggle("active", i === stepIdx));
    slide2Screen.innerHTML = WIREFRAMES[stepIdx] || WIREFRAMES[0];
  }

  reqItems.forEach((btn) => {
    btn.addEventListener("click", () => selectWireframe(Number(btn.dataset.step)));
  });
  selectWireframe(0);

  // ==========================================================
  // Slide 3 — Simulated Terminal Stream
  // ==========================================================
  const s3RunBtn = document.getElementById("s3RunBtn");
  const s3Steps = Array.from(document.querySelectorAll("#s3Terminal [data-s3-step]"));
  let s3Timers = [];

  function runSlide3Simulation(replay) {
    s3Timers.forEach((t) => clearTimeout(t));
    s3Timers = [];

    if (!replay && s3Steps.every((el) => el.classList.contains("revealed"))) {
      return;
    }

    s3Steps.forEach((el) => {
      el.classList.add("dim");
      el.classList.remove("revealed");
    });

    s3Steps.forEach((el, idx) => {
      const t = setTimeout(() => {
        el.classList.remove("dim");
        el.classList.add("revealed");
      }, 280 * (idx + 1));
      s3Timers.push(t);
    });
  }

  s3RunBtn.addEventListener("click", () => runSlide3Simulation(true));

  // ==========================================================
  // Slide 4 — Interactive Virtual Keyboard Covering Button
  // ==========================================================
  const s4Name = document.getElementById("s4Name");
  const s4PhoneInput = document.getElementById("s4PhoneInput");
  const s4SubmitBtn = document.getElementById("s4SubmitBtn");
  const s4ResetBtn = document.getElementById("s4ResetBtn");
  const s4FormView = document.getElementById("s4FormView");
  const s4ConfirmView = document.getElementById("s4ConfirmView");
  const s4Status = document.getElementById("s4Status");
  const s4Keyboard = document.getElementById("s4Keyboard");
  const s4ToggleKbdBtn = document.getElementById("s4ToggleKbdBtn");
  const s4CloseKbdBtn = document.getElementById("s4CloseKbdBtn");

  function setS4Keyboard(open) {
    s4Keyboard.classList.toggle("open", open);
    s4Keyboard.setAttribute("aria-hidden", String(!open));
    s4ToggleKbdBtn.textContent = open
      ? "⌄ Ocultar teclado (revela o campo)"
      : "⌨️ Abrir teclado no campo Telefone";
    s4Status.textContent = open ? "Campo coberto!" : "Em execução · v1";
    s4Status.className = open ? "status-tag err" : "status-tag";
  }

  s4Name.addEventListener("focus", () => setS4Keyboard(true));
  s4PhoneInput.addEventListener("focus", () => setS4Keyboard(true));
  s4CloseKbdBtn.addEventListener("click", () => setS4Keyboard(false));
  s4ToggleKbdBtn.addEventListener("click", () => {
    setS4Keyboard(!s4Keyboard.classList.contains("open"));
  });

  s4Keyboard.querySelectorAll(".kbd-grid span").forEach((keyEl) => {
    keyEl.style.cursor = "pointer";
    keyEl.addEventListener("click", () => {
      const ch = keyEl.textContent.trim();
      if (ch === "⌫") {
        s4PhoneInput.value = s4PhoneInput.value.slice(0, -1);
      } else {
        s4PhoneInput.value += ch;
      }
    });
  });

  s4SubmitBtn.addEventListener("click", () => {
    const spans = s4ConfirmView.querySelectorAll(".s4-res-val");
    spans[0].textContent = s4Name.value.trim() || "—";
    spans[1].textContent = s4PhoneInput.value.trim() || "—";
    setS4Keyboard(false);
    s4FormView.classList.add("hidden");
    s4ConfirmView.classList.remove("hidden");
  });

  s4ResetBtn.addEventListener("click", () => {
    s4FormView.classList.remove("hidden");
    s4ConfirmView.classList.add("hidden");
    setS4Keyboard(false);
  });

  // ==========================================================
  // Slide 6 — UI Inspection Overlay Toggle
  // ==========================================================
  const s6InspectBtn = document.getElementById("s6InspectBtn");
  const s6Phone = document.getElementById("s6Phone");
  const s6InspectBadge = document.getElementById("s6InspectBadge");

  s6InspectBtn.addEventListener("click", () => {
    const isOn = s6Phone.classList.toggle("inspect-active");
    s6InspectBadge.textContent = isOn ? "Inspeção @refs ON" : "Visual normal";
    s6InspectBadge.className = isOn ? "status-tag cyan" : "status-tag";
  });

  // ==========================================================
  // Slide 7 — Playable E2E Runner (Happy Path + Negative Test)
  // ==========================================================
  const s7Terminal = document.getElementById("s7Terminal");
  const s7Screen = document.getElementById("s7Screen");
  const s7PhoneTag = document.getElementById("s7PhoneTag");
  const s7HappyBtn = document.getElementById("s7HappyBtn");
  const s7NegativeBtn = document.getElementById("s7NegativeBtn");
  const s7ResetBtn = document.getElementById("s7ResetBtn");
  const s7Checklist = document.getElementById("s7Checklist");

  let s7Timers = [];

  function setChk(name, state) {
    const item = s7Checklist.querySelector(`[data-chk="${name}"]`);
    if (!item) return;
    item.classList.remove("pass", "fail");
    const box = item.querySelector(".chk-box");
    if (state === "pass") {
      item.classList.add("pass");
      box.textContent = "✓";
    } else if (state === "fail") {
      item.classList.add("fail");
      box.textContent = "✕";
    } else {
      box.textContent = "○";
    }
  }

  function resetSlide7() {
    s7Timers.forEach((t) => clearTimeout(t));
    s7Timers = [];
    ["open", "date", "time", "fill", "confirm", "empty"].forEach((k) => setChk(k, ""));
    s7PhoneTag.textContent = "Aguardando teste";
    s7PhoneTag.className = "status-tag";
    s7Terminal.innerHTML = `<div class="term-line muted">Clique em <strong>“1. Preencher dados”</strong> e depois em <strong>“2. Verificar campo Telefone”</strong> para ver o toolkit detectar o campo escondido pelo teclado.</div>`;
    s7Screen.innerHTML = `
      <div class="app-header-card">
        <span class="app-kicker">Restaurante Caraguá</span>
        <h4>Pronto para inspeção</h4>
        <p>Use os botões acima para simular os comandos do agent-device.</p>
      </div>
      <div class="app-card-section">
        <div class="section-mini-title">Tela inicial</div>
        <p style="margin:0;font-size:11px;color:#475569">App compilado e aberto no emulador.</p>
      </div>
      <div class="app-primary-btn">Fazer reserva</div>
    `;
  }

  function appendTerm(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    s7Terminal.appendChild(div.firstElementChild);
    s7Terminal.scrollTop = s7Terminal.scrollHeight;
  }

  function runS7Happy() {
    resetSlide7();
    s7Terminal.innerHTML = "";
    s7PhoneTag.textContent = "Passo 1 · Preenchendo";
    s7PhoneTag.className = "status-tag cyan";

    const steps = [
      {
        delay: 150,
        term: `<div class="term-line cmd">$ agent-device open com.restaurantecaragua.app</div>`,
        chk: "open",
        chkState: "pass",
        screen: `
          <div class="app-header-card"><span class="app-kicker">Restaurante Caraguá</span><h4>Bem-vindo!</h4><p>Massas e reservas</p></div>
          <div class="app-primary-btn" style="position:relative">Reservar mesa <span class="tap-indicator" style="left:65%;top:50%"></span></div>
        `
      },
      {
        delay: 750,
        term: `<div class="term-line cmd">$ agent-device press @e2 "Sex, 27" --settle</div>`,
        chk: "date",
        chkState: "pass",
        screen: `
          <div class="app-mini-nav"><span>←</span><strong>Escolha a data</strong></div>
          <div class="pill-row"><span class="ui-pill active" style="position:relative">Sex, 27<span class="tap-indicator" style="left:50%;top:50%"></span></span><span class="ui-pill">Sáb, 28</span><span class="ui-pill">Dom, 29</span></div>
        `
      },
      {
        delay: 1400,
        term: `<div class="term-line cmd">$ agent-device press @e4 "20:00" --settle</div>`,
        chk: "time",
        chkState: "pass",
        screen: `
          <div class="summary-chip">Data: Sex, 27 Nov</div>
          <div class="section-mini-title">Horário disponível</div>
          <div class="pill-row"><span class="ui-pill">19:00</span><span class="ui-pill active" style="position:relative">20:00<span class="tap-indicator" style="left:50%;top:50%"></span></span><span class="ui-pill">21:30</span></div>
        `
      },
      {
        delay: 2050,
        term: `<div class="term-line cmd">$ agent-device fill @e3 "Marina Silva" &amp;&amp; press @e4 "Telefone"</div>`,
        chk: "fill",
        chkState: "pass",
        tag: "Teclado cobriu o campo!",
        tagClass: "status-tag err",
        screen: `
          <div class="summary-chip">Sex, 27 Nov · 20:00</div>
          <label class="field-label">Nome</label>
          <div class="sim-input">Marina Silva</div>
          <label class="field-label">E-mail</label>
          <div class="sim-input">marina@email.com</div>
          <label class="field-label">Telefone</label>
          <div class="sim-input" style="border-color:#4630eb">(12) 99123-|</div>
          <div class="app-primary-btn">Confirmar reserva</div>
          <div class="virtual-kbd open">
            <div class="kbd-toolbar"><span>Teclado aberto (tampando Telefone!)</span></div>
            <div class="kbd-grid"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>
          </div>
        `
      }
    ];

    steps.forEach((st) => {
      s7Timers.push(setTimeout(() => {
        appendTerm(st.term);
        if (st.chk) setChk(st.chk, st.chkState);
        if (st.tag) {
          s7PhoneTag.textContent = st.tag;
          s7PhoneTag.className = st.tagClass;
        }
        s7Screen.innerHTML = st.screen;
      }, st.delay));
    });
  }

  function runS7Negative() {
    resetSlide7();
    s7Terminal.innerHTML = "";
    ["open", "date", "time", "fill"].forEach((k) => setChk(k, "pass"));
    s7PhoneTag.textContent = "Passo 2 · Verificando campo";
    s7PhoneTag.className = "status-tag err";

    const kbdView = `
      <div class="summary-chip">Sex, 27 Nov · 20:00</div>
      <label class="field-label">Nome</label>
      <div class="sim-input">Marina Silva</div>
      <label class="field-label">E-mail</label>
      <div class="sim-input">marina@email.com</div>
      <label class="field-label">Telefone</label>
      <div class="sim-input" style="border-color:#e11d48">(12) 99123-|</div>
      <div class="app-primary-btn">Confirmar reserva</div>
      <div class="virtual-kbd open">
        <div class="kbd-toolbar"><span>@e4 (Telefone) escondido atrás!</span></div>
        <div class="kbd-grid"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>
      </div>
    `;

    const steps = [
      {
        delay: 150,
        term: `<div class="term-line cmd">$ agent-device snapshot -i &amp;&amp; screenshot ./tela.png</div>`,
        screen: kbdView
      },
      {
        delay: 900,
        term: `<div class="term-line err">✕ @e4 "Telefone" obstruído pelo teclado virtual durante a digitação!</div>`,
        chk: "confirm",
        chkState: "fail",
        screen: kbdView
      },
      {
        delay: 1650,
        term: `<div class="term-line err">✕ FALHA DETECTADA: usuário digita às cegas sem KeyboardAvoidingView / ScrollView.</div>`,
        chk: "empty",
        chkState: "fail",
        screen: `
          <div class="summary-chip">Sex, 27 Nov · 20:00</div>
          <div class="bug-alert-banner"><strong>agent-device detectou:</strong> campo “Telefone” tampado pelo teclado enquanto o cliente digita!</div>
          <div class="virtual-kbd kbd-static compact-kbd">
            <div class="kbd-toolbar"><span>Teclado do sistema</span></div>
            <div class="kbd-grid"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span></div>
          </div>
        `
      }
    ];

    steps.forEach((st) => {
      s7Timers.push(setTimeout(() => {
        appendTerm(st.term);
        if (st.chk) setChk(st.chk, st.chkState);
        s7Screen.innerHTML = st.screen;
      }, st.delay));
    });
  }

  s7HappyBtn.addEventListener("click", runS7Happy);
  s7NegativeBtn.addEventListener("click", runS7Negative);
  s7ResetBtn.addEventListener("click", resetSlide7);
  resetSlide7();

  // ==========================================================
  // Slide 8 — Debug/Fix Cycle & Before/After Toggle
  // ==========================================================
  const s8CycleSteps = Array.from(document.querySelectorAll("#s8CycleBar .cycle-step"));
  const s8PanelTitle = document.getElementById("s8PanelTitle");
  const s8PanelBadge = document.getElementById("s8PanelBadge");
  const s8CodeContent = document.getElementById("s8CodeContent");
  const s8BeforeBtn = document.getElementById("s8BeforeBtn");
  const s8AfterBtn = document.getElementById("s8AfterBtn");
  const s8PhoneStatus = document.getElementById("s8PhoneStatus");
  const s8Screen = document.getElementById("s8Screen");

  const S8_PHASES = [
    {
      title: "1. Detectar · Evidência do agent-device",
      badge: "Campo encoberto",
      badgeClass: "code-badge err",
      code: `$ agent-device press @e4 "Telefone"
$ agent-device snapshot -i
<span class="tok-del">→ @e4 "Telefone" fora da área visível (coberto pelo teclado aberto)</span>
$ agent-device screenshot ./bug-teclado.png`,
      mode: "before"
    },
    {
      title: "2. Investigar · Leitura de app/reserva.tsx",
      badge: "Causa raiz",
      badgeClass: "code-badge warn",
      code: `<span class="tok-cmt">// View fixa não empurra nem rola o formulário quando o teclado abre</span>
<span class="tok-del">&lt;View style={styles.container}&gt;</span>
  &lt;TextInput placeholder="Nome" /&gt;
  &lt;TextInput placeholder="E-mail" /&gt;
  &lt;TextInput placeholder="Telefone" /&gt;
<span class="tok-del">&lt;/View&gt;</span>`,
      mode: "before"
    },
    {
      title: "3. Corrigir · KeyboardAvoidingView + ScrollView",
      badge: "Patch aplicado",
      badgeClass: "code-badge ok",
      code: `<span class="tok-add">+ &lt;KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}&gt;</span>
<span class="tok-add">+   &lt;ScrollView keyboardShouldPersistTaps="handled"&gt;</span>
      &lt;TextInput placeholder="Nome" /&gt;
      &lt;TextInput placeholder="E-mail" /&gt;
      &lt;TextInput placeholder="Telefone" /&gt;
<span class="tok-add">+   &lt;/ScrollView&gt;</span>
<span class="tok-add">+ &lt;/KeyboardAvoidingView&gt;</span>`,
      mode: "after"
    },
    {
      title: "4. Retestar · Repetindo com teclado aberto",
      badge: "Executando",
      badgeClass: "code-badge warn",
      code: `$ agent-device open com.restaurantecaragua.app
$ agent-device fill @e4 "(12) 99123-4567"
<span class="tok-add">✓ Campo Telefone rolou para cima e está 100% visível durante a digitação!</span>
$ agent-device press @e5 "Confirmar reserva" --settle`,
      mode: "after"
    },
    {
      title: "5. Validar · Fluxo completo aprovado",
      badge: "Aprovado",
      badgeClass: "code-badge ok",
      code: `$ agent-device snapshot -i
<span class="tok-add">  [Screen] ConfirmacaoScreen — "Reserva Confirmada!"</span>
$ agent-device screenshot ./evidencia-ok.png
<span class="tok-add">✓ PASS: Usuário vê o que digita e conclui a reserva.</span>`,
      mode: "after"
    }
  ];

  function renderS8Phone(mode) {
    s8BeforeBtn.classList.toggle("active", mode === "before");
    s8AfterBtn.classList.toggle("active", mode === "after");

    if (mode === "before") {
      s8PhoneStatus.textContent = "Antes: teclado tampa campo";
      s8PhoneStatus.className = "status-tag err";
      s8Screen.innerHTML = `
        <div class="s4-form-wrap">
          <div class="app-mini-nav">
            <span>← Voltar</span>
            <strong>Finalizar Reserva</strong>
          </div>
          <div class="summary-chip">Sex, 27 Nov · 20:00 · 2 pessoas</div>
          <label class="field-label">Nome do cliente</label>
          <input type="text" class="sim-input" value="Marina Silva" readonly>
          <label class="field-label">E-mail (comprovante)</label>
          <input type="text" class="sim-input" value="marina@email.com" readonly>
          <label class="field-label">Telefone</label>
          <input type="text" class="sim-input" value="(12) 99123-" readonly>
          <div class="s4-btn-zone">
            <button type="button" class="app-primary-btn">Confirmar reserva</button>
          </div>
        </div>
        <div class="virtual-kbd open" aria-hidden="true">
          <div class="kbd-toolbar">
            <span>Teclado do sistema (Android/iOS)</span>
            <span class="kbd-close-btn">Telefone tampado</span>
          </div>
          <div class="kbd-grid">
            <span>1</span><span>2</span><span>3</span>
            <span>4</span><span>5</span><span>6</span>
            <span>7</span><span>8</span><span>9</span>
            <span>*</span><span>0</span><span>⌫</span>
          </div>
        </div>
      `;
    } else {
      s8PhoneStatus.textContent = "Depois: campo visível!";
      s8PhoneStatus.className = "status-tag ok";
      s8Screen.innerHTML = `
        <div class="s4-form-wrap">
          <div class="summary-chip" style="opacity:.75">↑ Formulário rolou para cima</div>
          <label class="field-label">Telefone (visível ao digitar ✓)</label>
          <input type="text" class="sim-input" style="border-color:#059669" value="(12) 99123-4567" readonly>
          <div class="s4-btn-zone">
            <button type="button" class="app-primary-btn interactive-btn" id="s8ConfirmLiveBtn">Confirmar reserva</button>
          </div>
        </div>
        <div class="virtual-kbd open" aria-hidden="true">
          <div class="kbd-toolbar">
            <span>KeyboardAvoidingView + ScrollView ✓</span>
          </div>
          <div class="kbd-grid">
            <span>1</span><span>2</span><span>3</span>
            <span>4</span><span>5</span><span>6</span>
            <span>7</span><span>8</span><span>9</span>
            <span>*</span><span>0</span><span>⌫</span>
          </div>
        </div>
      `;
      const liveBtn = document.getElementById("s8ConfirmLiveBtn");
      if (liveBtn) {
        liveBtn.addEventListener("click", () => {
          s8Screen.innerHTML = `
            <div class="bug-confirm-card">
              <div class="bug-icon">✓</div>
              <h4>Reserva Confirmada!</h4>
              <p><strong>Cliente:</strong> Marina Silva</p>
              <p><strong>Telefone:</strong> (12) 99123-4567</p>
            </div>
            <div class="summary-chip" style="background:#dcfce7;color:#047857;text-align:center">
              Confirmado mesmo com teclado aberto!
            </div>
          `;
        });
      }
    }
  }

  function selectS8Phase(idx) {
    s8CycleSteps.forEach((btn, i) => btn.classList.toggle("active", i === idx));
    const phase = S8_PHASES[idx] || S8_PHASES[0];
    s8PanelTitle.textContent = phase.title;
    s8PanelBadge.textContent = phase.badge;
    s8PanelBadge.className = phase.badgeClass;
    s8CodeContent.innerHTML = phase.code;
    renderS8Phone(phase.mode);
  }

  s8CycleSteps.forEach((btn) => {
    btn.addEventListener("click", () => selectS8Phase(Number(btn.dataset.phase)));
  });
  s8BeforeBtn.addEventListener("click", () => renderS8Phone("before"));
  s8AfterBtn.addEventListener("click", () => renderS8Phone("after"));
  selectS8Phase(2);

  // ==========================================================
  // Slide 9 — Fully Interactive Final App Emulator
  // ==========================================================
  const s9Screen = document.getElementById("s9Screen");
  const s9State = {
    step: 0, // 0: home, 1: date/time, 2: form, 3: confirmed
    date: "Sex, 27 Nov",
    time: "20:00",
    name: "",
    phone: "",
    errName: false,
    errPhone: false
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderS9App() {
    if (!s9Screen) return;
    if (s9State.step === 0) {
      s9Screen.innerHTML = `
        <div class="app-header-card">
          <span class="app-kicker">Restaurante Caraguá · Centro</span>
          <h4>Cozinha italiana artesanal</h4>
          <p>Ter–Dom · 18h às 23h30 · Mesa para 2 a 8 pessoas</p>
        </div>
        <div class="app-card-section">
          <div class="section-mini-title">Destaques de hoje</div>
          <p style="margin:0;font-size:11px;color:#475569">• Ravioli de burrata<br>• Pizza napolitana no forno a lenha</p>
        </div>
        <button type="button" class="app-primary-btn interactive-btn" id="s9StartBtn">Fazer uma reserva</button>
      `;
      document.getElementById("s9StartBtn").addEventListener("click", () => {
        s9State.step = 1;
        renderS9App();
      });
    } else if (s9State.step === 1) {
      const dates = ["Sex, 27 Nov", "Sáb, 28 Nov", "Dom, 29 Nov"];
      const times = ["19:00", "20:00", "21:30"];
      s9Screen.innerHTML = `
        <div class="app-mini-nav">
          <span style="cursor:pointer" id="s9Back0">← Início</span>
          <strong>Data e Horário</strong>
        </div>
        <div class="app-card-section">
          <div class="section-mini-title">Selecione a data</div>
          <div class="pill-row">
            ${dates.map((d) => `<button type="button" class="ui-pill interactive-btn ${s9State.date === d ? "active" : ""}" data-s9-date="${d}">${d.split(",")[0]} ${d.split(" ")[1]}</button>`).join("")}
          </div>
        </div>
        <div class="app-card-section">
          <div class="section-mini-title">Horário disponível</div>
          <div class="pill-row">
            ${times.map((t) => `<button type="button" class="ui-pill interactive-btn ${s9State.time === t ? "active" : ""}" data-s9-time="${t}">${t}</button>`).join("")}
          </div>
        </div>
        <button type="button" class="app-primary-btn interactive-btn" id="s9ToFormBtn">Continuar →</button>
      `;
      document.getElementById("s9Back0").addEventListener("click", () => { s9State.step = 0; renderS9App(); });
      s9Screen.querySelectorAll("[data-s9-date]").forEach((b) => {
        b.addEventListener("click", () => { s9State.date = b.dataset.s9Date; renderS9App(); });
      });
      s9Screen.querySelectorAll("[data-s9-time]").forEach((b) => {
        b.addEventListener("click", () => { s9State.time = b.dataset.s9Time; renderS9App(); });
      });
      document.getElementById("s9ToFormBtn").addEventListener("click", () => { s9State.step = 2; renderS9App(); });
    } else if (s9State.step === 2) {
      s9Screen.innerHTML = `
        <div class="app-mini-nav">
          <span style="cursor:pointer" id="s9Back1">← Data</span>
          <strong>Seus Dados</strong>
        </div>
        <div class="summary-chip">${s9State.date} · ${s9State.time}</div>
        <label class="field-label">Nome completo *</label>
        <input type="text" id="s9NameInput" class="sim-input ${s9State.errName ? "input-error" : ""}" value="${escapeHtml(s9State.name)}" placeholder="Ex.: Marina Silva">
        ${s9State.errName ? `<span class="field-error-msg">Informe seu nome completo</span>` : ""}
        <label class="field-label">Telefone *</label>
        <input type="text" id="s9PhoneInput" class="sim-input ${s9State.errPhone ? "input-error" : ""}" value="${escapeHtml(s9State.phone)}" placeholder="Ex.: (12) 99123-4567">
        ${s9State.errPhone ? `<span class="field-error-msg">Informe seu telefone</span>` : ""}
        <button type="button" class="app-primary-btn interactive-btn" id="s9ConfirmBtn">Confirmar reserva</button>
      `;
      const nIn = document.getElementById("s9NameInput");
      const pIn = document.getElementById("s9PhoneInput");
      nIn.addEventListener("input", (e) => { s9State.name = e.target.value; });
      pIn.addEventListener("input", (e) => { s9State.phone = e.target.value; });
      document.getElementById("s9Back1").addEventListener("click", () => {
        s9State.errName = false;
        s9State.errPhone = false;
        s9State.step = 1;
        renderS9App();
      });
      document.getElementById("s9ConfirmBtn").addEventListener("click", () => {
        s9State.errName = !s9State.name.trim();
        s9State.errPhone = !s9State.phone.trim();
        if (s9State.errName || s9State.errPhone) {
          renderS9App();
          return;
        }
        s9State.step = 3;
        renderS9App();
      });
    } else {
      s9Screen.innerHTML = `
        <div class="bug-confirm-card">
          <div class="bug-icon">✓</div>
          <h4>Reserva Confirmada!</h4>
          <p><strong>Restaurante:</strong> Restaurante Caraguá</p>
          <p><strong>Data:</strong> ${s9State.date} às ${s9State.time}</p>
          <p><strong>Cliente:</strong> ${escapeHtml(s9State.name)}</p>
          <p><strong>Telefone:</strong> ${escapeHtml(s9State.phone)}</p>
        </div>
        <button type="button" class="app-secondary-btn" id="s9RestartBtn">↺ Nova simulação</button>
      `;
      document.getElementById("s9RestartBtn").addEventListener("click", () => {
        s9State.step = 0;
        s9State.name = "";
        s9State.phone = "";
        s9State.errName = false;
        s9State.errPhone = false;
        renderS9App();
      });
    }
  }
  renderS9App();

  // Initial slide from hash
  const hashMatch = window.location.hash.match(/^#slide-(\d+)$/);
  const initialIdx = hashMatch ? Number(hashMatch[1]) - 1 : 0;
  goToSlide(initialIdx);
})();
