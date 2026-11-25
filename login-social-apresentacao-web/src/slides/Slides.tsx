import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  ChevronRight,
  CircleCheck,
  Code2,
  Database,
  Fingerprint,
  Globe,
  KeyRound,
  Link2,
  LockKeyhole,
  Mail,
  Monitor,
  MousePointer2,
  RotateCcw,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { Provider } from "../components/Provider";
import type { ProviderName } from "../components/Provider";
import { CodeWindow } from "../components/presentation/CodeWindow";
import { LoginFlow } from "../components/diagrams/LoginFlow";

const providerNames: ProviderName[] = [
  "Google",
  "GitHub",
  "Apple",
  "LinkedIn",
  "Facebook",
];
export function SlideContent({
  index,
  step,
  next,
  restart,
}: {
  index: number;
  step: number;
  next: () => void;
  restart: () => void;
}) {
  switch (index) {
    case 0:
      return <Cover />;
    case 1:
      return <Agenda />;
    case 2:
      return <Experience />;
    case 3:
      return <Identity />;
    case 4:
      return <Protocols />;
    case 5:
      return <Actors />;
    case 6:
      return <LoginFlow step={step} onNext={next} />;
    case 7:
      return <Configuration />;
    case 8:
      return <Tokens />;
    case 9:
      return <GoogleSetup />;
    case 10:
      return <Installation />;
    case 11:
      return <Redirect />;
    case 12:
      return <Callback />;
    case 13:
      return <Demo step={step} next={next} restart={restart} />;
    case 14:
      return <Providers />;
    case 15:
      return <Security />;
    default:
      return <Conclusion />;
  }
}
export function Callout({
  children,
  icon = true,
}: {
  children: ReactNode;
  icon?: boolean;
}) {
  return (
    <div className="callout">
      {icon && <ShieldCheck size={22} />}
      <span>{children}</span>
    </div>
  );
}
function Cover() {
  return (
    <div className="cover">
      <div className="cover-copy">
        <div className="pill">
          <span className="live-dot" /> UMA CONTA. NOVAS POSSIBILIDADES.
        </div>
        <h1>
          Login
          <br />
          <span>
            Social<span className="title-dot">.</span>
          </span>
        </h1>
        <p className="cover-subtitle">
          Como funciona entrar com Google,
          <br />
          GitHub, Apple, LinkedIn e Facebook?
        </p>
        <div className="presenter">
          <div className="avatar">HF</div>
          <div>
            <strong>Hyan Ferreira</strong>
            <span>Programação para Dispositivos Móveis</span>
          </div>
        </div>
        <div className="cover-meta">
          <span>
            <Code2 size={17} /> CONCEITO → CÓDIGO
          </span>
          <span>25 MIN</span>
        </div>
      </div>
      <div
        className="identity-art"
        aria-label="Cinco provedores conectados à identidade da sua aplicação"
      >
        <div className="orbit orbit-outer" />
        <div className="orbit orbit-inner" />
        <div className="orbit-cross horizontal" />
        <div className="orbit-cross vertical" />
        <div className="identity-core">
          <Fingerprint />
          <span>SUA IDENTIDADE</span>
          <div>
            <i /> Conexão verificada
          </div>
        </div>
        {providerNames.map((name, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            key={name}
            className={`orbit-provider position-${i}`}
          >
            <Provider name={name} />
            <span>{name}</span>
          </motion.div>
        ))}
        <div className="art-caption">
          <LockKeyhole size={15} />
          <span>Sua senha fica com o provedor.</span>
        </div>
        <span className="art-coordinate">AUTH / 01</span>
      </div>
    </div>
  );
}
const agenda = [
  ["01", "O problema e a solução", "Por que esse botão existe?", "02:45"],
  ["02", "Os fundamentos", "Autenticação, OAuth e OIDC", "03:00"],
  ["03", "Por trás do botão", "Participantes, código e tokens", "07:30"],
  ["04", "Do conceito ao código", "Laravel Socialite + demonstração", "08:00"],
  ["05", "Cinco provedores", "Sem assumir que são iguais", "01:15"],
  ["06", "Segurança e conclusão", "Os limites da confiança", "02:30"],
];
function Agenda() {
  return (
    <div className="agenda-layout">
      <div className="agenda-intro">
        <span className="large-outline">
          25<span>min</span>
        </span>
        <p>
          Do primeiro clique
          <br />à sessão da sua aplicação.
        </p>
        <div className="tag">
          <Smartphone size={18} /> WEB & MOBILE
        </div>
      </div>
      <div className="agenda-list">
        {agenda.map(([n, title, sub, time]) => (
          <div className="agenda-item" key={n}>
            <span>{n}</span>
            <div>
              <h3>{title}</h3>
              <p>{sub}</p>
            </div>
            <span className="agenda-time">{time}</span>
            <ChevronRight size={20} />
          </div>
        ))}
      </div>
    </div>
  );
}
function Experience() {
  return (
    <>
      <div className="comparison">
        <div className="login-mock traditional">
          <div className="mock-top">
            <span className="mini-brand">
              <Fingerprint size={22} /> orbit
            </span>
            <span>CADASTRO TRADICIONAL</span>
          </div>
          <h3>Mais uma senha?</h3>
          <p>Crie sua conta para continuar.</p>
          <div className="fake-input">
            <UserRound /> Seu nome
          </div>
          <div className="fake-input">
            <Mail /> Seu e-mail
          </div>
          <div className="fake-input">
            <LockKeyhole /> ••••••••••••
          </div>
          <div className="fake-button">
            Criar conta <ArrowRight size={18} />
          </div>
          <span className="mock-foot">
            Confirmar e-mail. Lembrar da senha. Recuperar acesso.
          </span>
        </div>
        <div className="versus">OU</div>
        <div className="login-mock social">
          <div className="mock-top">
            <span className="mini-brand">
              <Fingerprint size={22} /> orbit
            </span>
            <span>LOGIN SOCIAL</span>
          </div>
          <h3>Você já tem uma conta.</h3>
          <p>Use uma identidade que já conhece.</p>
          <div className="social-login-button">
            <Provider name="Google" />
            Continuar com Google
            <ArrowRight size={18} />
          </div>
          <div className="provider-options">
            {providerNames.slice(1).map((n) => (
              <Provider key={n} name={n} />
            ))}
          </div>
          <div className="mini-checks">
            <span>
              <Check /> Escolher um provedor
            </span>
            <span>
              <Check /> Autenticar e permitir acesso
            </span>
            <span>
              <Check /> Entrar na aplicação
            </span>
          </div>
        </div>
      </div>
      <Callout>
        A experiência fica mais simples. Proteger a aplicação continua sendo
        nossa responsabilidade.
      </Callout>
    </>
  );
}
function Identity() {
  return (
    <>
      <div className="two-columns concept-columns">
        <div className="concept">
          <div className="concept-icon">
            <Fingerprint />
          </div>
          <span className="eyebrow">AUTENTICAÇÃO</span>
          <h3>Quem é você?</h3>
          <p>
            Reconhecer a identidade
            <br />
            da pessoa que entrou.
          </p>
          <div className="identity-chip">
            <span className="avatar small">AF</span>Ana está autenticada.
            <CircleCheck />
          </div>
        </div>
        <div className="concept">
          <div className="concept-icon purple">
            <Shield />
          </div>
          <span className="eyebrow purple-text">AUTORIZAÇÃO</span>
          <h3>O que pode fazer?</h3>
          <p>
            Verificar permissões
            <br />
            para acessar um recurso.
          </p>
          <div className="identity-chip">
            <LockKeyhole />
            <code>/admin</code>
            <span className="danger-text">Acesso restrito</span>
          </div>
        </div>
      </div>
      <div className="identity-bottom">
        <CodeWindow id="auth" />
        <p>
          Entrar no sistema
          <br />
          <strong>não dá acesso a tudo.</strong>
          <span>A permissão é verificada no backend.</span>
        </p>
      </div>
    </>
  );
}
function Protocols() {
  return (
    <>
      <div className="protocol-grid">
        <div className="protocol-card">
          <span className="protocol-number">01</span>
          <KeyRound />
          <span className="eyebrow">AUTORIZAÇÃO DELEGADA</span>
          <h3>OAuth 2.0</h3>
          <p>
            “Este aplicativo pode
            <br />
            <strong>acessar minha agenda?</strong>”
          </p>
          <div className="protocol-example">
            <Globe /> Aplicativo <ArrowRight />
            <span>Google Calendar</span>
          </div>
        </div>
        <div className="protocol-card oidc">
          <span className="protocol-number">02</span>
          <Fingerprint />
          <span className="eyebrow purple-text">
            IDENTIDADE SOBRE OAUTH 2.0
          </span>
          <h3>OpenID Connect</h3>
          <p>
            “Este aplicativo pode saber
            <br />
            <strong>quem fez login?</strong>”
          </p>
          <div className="protocol-example">
            <UserRound /> Identidade <ArrowRight />
            <code>ID Token</code>
          </div>
        </div>
      </div>
      <div className="statement">
        OAuth define <em>o acesso.</em> OIDC acrescenta <em>a identidade.</em>
      </div>
      <p className="footnote">
        OAuth isolado não padroniza autenticação. Nem todo login social usa
        OIDC.
      </p>
    </>
  );
}
function Actors() {
  const actors = [
    {
      icon: UserRound,
      name: "Usuário",
      sub: "Escolhe e autoriza",
      detail: "A pessoa no controle.",
    },
    {
      icon: Monitor,
      name: "Navegador",
      sub: "Mostra e navega",
      detail: "Frontend + redirects.",
    },
    {
      icon: Server,
      name: "Aplicação",
      sub: "Verifica e associa",
      detail: "Backend + conta local.",
    },
    {
      icon: Globe,
      name: "Provedor",
      sub: "Autentica a conta",
      detail: "Google, GitHub, Apple…",
    },
  ];
  return (
    <>
      <div className="actors">
        {actors.map((a, i) => (
          <div className="actor-container" key={a.name}>
            <div className="participant">
              <span className="participant-number">0{i + 1}</span>
              <a.icon />
              <h3>{a.name}</h3>
              <strong>{a.sub}</strong>
              <p>{a.detail}</p>
            </div>
            {i < 3 && <ArrowRight className="participant-arrow" />}
          </div>
        ))}
      </div>
      <div className="boundary">
        <Monitor />
        <span>Navegador</span>
        <div className="boundary-line">fronteira de confiança</div>
        <Server />
        <span>Backend</span>
      </div>
      <Callout>
        O navegador transporta o retorno. É o backend que valida, troca o código
        e cria a sessão.
      </Callout>
    </>
  );
}
function Configuration() {
  const items = [
    {
      icon: Fingerprint,
      name: "Client ID",
      desc: "A identificação pública da aplicação.",
      value: "meu-app.apps.googleusercontent.com",
      color: "cyan",
    },
    {
      icon: KeyRound,
      name: "Client Secret",
      desc: "Credencial do cliente confidencial.",
      value: "Somente no backend",
      color: "purple",
    },
    {
      icon: Link2,
      name: "Redirect URI",
      desc: "O endereço de retorno autorizado.",
      value: "/auth/google/callback",
      color: "blue",
    },
    {
      icon: ShieldCheck,
      name: "Scopes",
      desc: "O acesso e as informações solicitadas.",
      value: "openid · profile · email",
      color: "green",
    },
  ];
  return (
    <>
      <div className="config-cards">
        {items.map((i) => (
          <div className={`config-card ${i.color}`} key={i.name}>
            <i.icon />
            <h3>{i.name}</h3>
            <p>{i.desc}</p>
            <code>{i.value}</code>
          </div>
        ))}
      </div>
      <div className="url-window">
        <div className="url-label">
          <Globe size={18} /> REQUISIÇÃO DE AUTORIZAÇÃO · RECORTE DIDÁTICO
        </div>
        <div className="url-code">
          <span>https://accounts.google.com/o/oauth2/v2/auth</span>
          <br />
          <span className="cyan-text">?client_id=meu-app</span>
          <br />
          <span className="blue-text">
            &redirect_uri=https%3A%2F%2Fapp.exemplo%2Fauth%2Fgoogle%2Fcallback
          </span>
          <br />
          <span className="green-text">&scope=openid%20profile%20email</span>
          <br />
          <span>&response_type=code</span>
        </div>
        <span className="secret-note">
          <LockKeyhole size={15} /> Sem Client Secret na URL
        </span>
      </div>
      <p className="footnote">
        Na requisição real também entram proteções como state e, com PKCE,
        code_challenge.
      </p>
    </>
  );
}
function Tokens() {
  const tokens = [
    [
      "01",
      "Authorization Code",
      "Troca temporária",
      "Curto e de uso único. O backend troca por tokens.",
    ],
    [
      "02",
      "Access Token",
      "Acesso a APIs",
      "Autoriza chamadas conforme os scopes concedidos.",
    ],
    [
      "03",
      "ID Token",
      "Identidade OIDC",
      "JWT assinado. Exige validação de claims e assinatura.",
    ],
    [
      "04",
      "Refresh Token",
      "Renovação",
      "Obtém novos tokens, quando emitido pelo provedor.",
    ],
  ];
  return (
    <>
      <div className="token-grid">
        {tokens.map(([n, title, label, text]) => (
          <div className="token-card" key={n}>
            <span>{n}</span>
            <h3>{title}</h3>
            <strong>{label}</strong>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <div className="token-separation">
        <div>
          <Globe />
          <span>TOKENS DO PROVEDOR</span>
          <code>APIs + identidade validada</code>
        </div>
        <div className="separation-label">
          <X />
          <span>não são a mesma coisa</span>
        </div>
        <div>
          <Server />
          <span>SESSÃO DA APLICAÇÃO</span>
          <code>Seu cookie · suas regras</code>
        </div>
      </div>
      <div className="protection-row">
        <span>
          <ShieldCheck />
          <strong>state</strong> Correlaciona pedido e retorno.
        </span>
        <span>
          <KeyRound />
          <strong>PKCE</strong> Vincula a troca à tentativa original.
        </span>
      </div>
    </>
  );
}
function GoogleSetup() {
  return (
    <div className="setup-layout">
      <div className="setup-steps">
        {[
          ["Projeto", "Crie ou selecione um projeto no Google Cloud."],
          ["Consentimento", "Configure branding, público e acesso a dados."],
          ["Cliente OAuth", "Escolha o tipo “Aplicativo da Web”."],
          ["URI e credenciais", "Cadastre o callback e obtenha ID e segredo."],
        ].map(([t, d], i) => (
          <div key={t}>
            <span>0{i + 1}</span>
            <section>
              <h3>{t}</h3>
              <p>{d}</p>
            </section>
          </div>
        ))}
        <a
          className="text-link"
          href="https://developers.google.com/identity/openid-connect/openid-connect"
          target="_blank"
          rel="noreferrer"
        >
          Documentação oficial do Google <ArrowRight size={18} />
        </a>
      </div>
      <div className="console-mock">
        <div className="console-title">
          <Provider name="Google" label />
          <span>Configuração conceitual</span>
        </div>
        <div className="console-sidebar">PROJETO / LOGIN SOCIAL</div>
        <h3>Cliente OAuth</h3>
        <label>Tipo de aplicação</label>
        <div>
          Aplicativo da Web <Check size={18} />
        </div>
        <label>Nome</label>
        <div>Minha aplicação · Desenvolvimento</div>
        <label>URIs de redirecionamento autorizados</label>
        <div className="callback-uri">
          http://localhost:8000/auth/google/callback
        </div>
        <p>
          <ShieldCheck size={17} /> HTTPS em produção. URI deve corresponder ao
          cadastro.
        </p>
      </div>
    </div>
  );
}
function Installation() {
  return (
    <>
      <div className="install-grid">
        <div>
          <div className="step-label">
            <span>01</span>Instale o pacote
          </div>
          <CodeWindow id="install" numbers={false} />
          <div className="step-label">
            <span>02</span>Configure o ambiente
          </div>
          <CodeWindow id="env" />
        </div>
        <div>
          <div className="step-label">
            <span>03</span>Conecte ao driver
          </div>
          <CodeWindow id="config" />
          <div className="backend-note">
            <Server />
            <div>
              <h3>O segredo mora no servidor.</h3>
              <p>
                Sem prefixo VITE_. Sem credenciais no Git.
                <br />
                Valores acima são fictícios.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Callout>
        Exemplo com sessão web Laravel e frontend na mesma origem. A
        apresentação não precisa de backend.
      </Callout>
    </>
  );
}
function Redirect() {
  return (
    <>
      <div className="route-flow">
        <span>
          <MousePointer2 /> Clique no frontend
        </span>
        <ArrowRight />
        <code>GET /auth/google/redirect</code>
        <ArrowRight />
        <span>
          <Provider name="Google" /> Google
        </span>
      </div>
      <div className="redirect-code">
        <CodeWindow id="frontend" />
        <CodeWindow id="redirect" highlight={[4]} />
      </div>
      <div className="three-points">
        <span>
          <b>01</b>Lê a configuração.
        </span>
        <span>
          <b>02</b>Prepara a autorização.
        </span>
        <span>
          <b>03</b>Redireciona o navegador.
        </span>
      </div>
      <p className="footnote">
        Use routes/web.php e preserve a sessão: o fluxo padrão do Socialite
        verifica state.
      </p>
    </>
  );
}
function Callback() {
  return (
    <>
      <div className="callback-grid">
        <div>
          <span className="step-label">
            <span>01</span>Receba a identidade externa
          </span>
          <CodeWindow id="identity" highlight={[1]} />
          <div className="account-table">
            <div>
              <Database size={18} />
              <strong>social_accounts</strong>
            </div>
            <span>provider</span>
            <span>provider_user_id</span>
            <span>user_id</span>
            <code>google</code>
            <code>103…862</code>
            <code>42</code>
          </div>
        </div>
        <div>
          <span className="step-label">
            <span>02</span>Encontre a conta e crie a sessão
          </span>
          <CodeWindow id="session" highlight={[8, 9]} />
          <a
            className="text-link"
            href="/reference/README.md"
            target="_blank"
            rel="noreferrer"
          >
            Ver implementação completa <ArrowRight size={17} />
          </a>
        </div>
      </div>
      <Callout>
        Trecho para uma conta já vinculada. Nunca associe automaticamente só
        porque o e-mail coincide.
      </Callout>
    </>
  );
}
const demoStates = [
  {
    title: "Bem-vindo de volta.",
    desc: "Entre com a conta que você já usa.",
    action: "Continuar com Google",
    actor: "Navegador",
    explain: "O botão abre a rota de login no backend.",
  },
  {
    title: "A caminho do provedor.",
    desc: "A aplicação prepara a autorização.",
    action: "Ver seleção da conta",
    actor: "Navegador → Google",
    explain: "O navegador segue o redirect. Segredo nenhum é enviado no botão.",
  },
  {
    title: "Escolha uma conta.",
    desc: "Interface ilustrativa do provedor.",
    action: "Selecionar Ana",
    actor: "Google",
    explain: "A pessoa se autentica e consente quando necessário.",
  },
  {
    title: "Callback recebido.",
    desc: "/auth/google/callback?code=…&state=…",
    action: "Verificar retorno",
    actor: "Navegador → Backend",
    explain: "O código chega à URI cadastrada. O backend valida a tentativa.",
  },
  {
    title: "Identidade reconhecida.",
    desc: "google · ID externo 103…862",
    action: "Criar sessão local",
    actor: "Backend ↔ Provedor",
    explain:
      "Código trocado e identidade verificada. Conta local encontrada pelo ID externo.",
  },
  {
    title: "Sua sessão, criada.",
    desc: "Conta local #42 · sessão regenerada",
    action: "Abrir dashboard",
    actor: "Backend → Navegador",
    explain:
      "A aplicação cria sua sessão. Os tokens do provedor são outro assunto.",
  },
  {
    title: "Olá, Ana.",
    desc: "Você entrou na sua aplicação.",
    action: "Recomeçar demonstração",
    actor: "Aplicação",
    explain:
      "O dashboard usa a sessão local, com as permissões definidas pela nossa aplicação.",
  },
];
function Demo({
  step,
  next,
  restart,
}: {
  step: number;
  next: () => void;
  restart: () => void;
}) {
  const s = demoStates[step];
  return (
    <>
      <div className="demo-banner">
        <span className="live-dot" />
        <strong>SIMULAÇÃO DIDÁTICA</strong>
        <span>100% local · sem autenticação real · sem envio de dados</span>
      </div>
      <div className="demo-layout">
        <div className="demo-browser">
          <div className="browser-chrome">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>
              <LockKeyhole size={13} />
              {step === 2 ? "provedor.exemplo" : "app.exemplo"}
              {step >= 3 && step < 6
                ? "/auth/google/callback"
                : step === 6
                  ? "/dashboard"
                  : "/login"}
            </span>
          </div>
          <motion.div
            key={step}
            className="demo-screen"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`demo-status-icon ${step >= 4 ? "success" : ""}`}>
              {step === 2 ? (
                <Provider name="Google" />
              ) : step === 6 ? (
                <CheckCheck />
              ) : step >= 4 ? (
                <ShieldCheck />
              ) : step === 3 ? (
                <Code2 />
              ) : step === 1 ? (
                <Globe />
              ) : (
                <Fingerprint />
              )}
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            {step === 2 && (
              <div className="selected-account">
                <span className="avatar">AF</span>
                <div>
                  <strong>Ana Ferreira</strong>
                  <span>ana@example.com · conta fictícia</span>
                </div>
                <Check size={19} />
              </div>
            )}
            {step === 6 && (
              <div className="dashboard-cards">
                <span>
                  <Users />
                  Conta #42
                </span>
                <span>
                  <Shield />
                  Perfil: estudante
                </span>
              </div>
            )}
            <button
              className="demo-action"
              onClick={step === 6 ? restart : next}
            >
              {step === 0 ? (
                <Provider name="Google" />
              ) : step === 6 ? (
                <RotateCcw size={19} />
              ) : null}
              {s.action}
              <ArrowRight size={18} />
            </button>
            <span className="demo-disclaimer">
              Demonstração ilustrativa. Nenhuma conta é acessada.
            </span>
          </motion.div>
        </div>
        <div className="demo-track">
          <span className="eyebrow">ACOMPANHE O CAMINHO</span>
          {[
            "Clique no botão",
            "Redirecionamento",
            "Conta selecionada",
            "Callback recebido",
            "Identidade verificada",
            "Sessão local criada",
            "Dashboard aberto",
          ].map((t, i) => (
            <div
              className={`${i === step ? "current" : ""} ${i < step ? "complete" : ""}`}
              key={t}
            >
              <span>{i < step ? <Check size={15} /> : i + 1}</span>
              <p>{t}</p>
            </div>
          ))}
          <div className="demo-explanation">
            <strong>{s.actor}</strong>
            <p>{s.explain}</p>
          </div>
        </div>
      </div>
    </>
  );
}
function Providers() {
  const data = [
    {
      n: "Google" as const,
      protocol: "OpenID Connect",
      profile: "ID, nome, foto e e-mail¹",
      setup: "Cliente OAuth + consentimento",
      care: "Scopes e público podem exigir verificação.",
    },
    {
      n: "GitHub" as const,
      protocol: "OAuth 2.0 + API",
      profile: "ID, login, nome e avatar",
      setup: "OAuth App + callback",
      care: "E-mail privado: user:email + API. Não é OIDC de usuários.",
    },
    {
      n: "Apple" as const,
      protocol: "Código + ID Token",
      profile: "ID, nome² e e-mail / relay",
      setup: "Services ID + chave; segredo JWT",
      care: "Nome só na primeira autorização. Sem avatar padrão.",
    },
    {
      n: "LinkedIn" as const,
      protocol: "OpenID Connect",
      profile: "ID, nome, foto e e-mail¹",
      setup: "Habilitar produto Sign In OIDC",
      care: "openid, profile e email precisam estar provisionados.",
    },
    {
      n: "Facebook" as const,
      protocol: "OAuth + Graph API³",
      profile: "ID, perfil público e e-mail¹",
      setup: "App Meta + permissões",
      care: "Acesso varia com modalidade, consentimento e revisão.",
    },
  ];
  return (
    <>
      <div className="provider-table">
        <table>
          <thead>
            <tr>
              <th>Provedor</th>
              <th>Integração</th>
              <th>Dados de perfil</th>
              <th>Configuração</th>
              <th>Atenção no desenvolvimento</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.n}>
                <th>
                  <Provider name={row.n} label />
                </th>
                <td>{row.protocol}</td>
                <td>{row.profile}</td>
                <td>{row.setup}</td>
                <td>{row.care}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-notes">
        <p>
          ¹ Conforme scopes, consentimento e disponibilidade. E-mail pode
          faltar.
        </p>
        <p>
          ² Apple retorna o objeto de usuário na primeira autorização; preserve
          o nome recebido.
        </p>
        <p>
          ³ Limited Login no iOS usa OIDC; o token de autenticação não é um
          token Graph.
        </p>
      </div>
      <div className="provider-source-row">
        <span>
          Fonte: documentação oficial de cada provedor · detalhes e limites na
          referência
        </span>
        <a
          className="text-link"
          href="/reference/SOURCES.md"
          target="_blank"
          rel="noreferrer"
        >
          Consultar fontes <ArrowRight size={17} />
        </a>
      </div>
    </>
  );
}
function Security() {
  const cards = [
    {
      icon: KeyRound,
      title: "Segredos no backend",
      text: "Nunca no bundle, na URL ou no repositório.",
    },
    {
      icon: ShieldCheck,
      title: "Retorno validado",
      text: "state, PKCE e validações OIDC adequadas ao fluxo.",
    },
    {
      icon: Link2,
      title: "Redirects controlados",
      text: "URIs cadastradas. Nada de destinos arbitrários.",
    },
    {
      icon: Fingerprint,
      title: "Vínculo com prova",
      text: "ID externo estável; reautenticação para unir contas.",
    },
    {
      icon: LockKeyhole,
      title: "Tokens protegidos",
      text: "Scopes mínimos, armazenamento seguro e revogação.",
    },
    {
      icon: Server,
      title: "Sessão bem cuidada",
      text: "HTTPS, cookies seguros e ID regenerado no login.",
    },
  ];
  return (
    <>
      <div className="security-grid">
        {cards.map((c) => (
          <div className="security-card" key={c.title}>
            <c.icon />
            <div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="security-bottom">
        <CodeWindow id="unsafe" highlight={[2]} numbers={false} />
        <div>
          <span className="danger-label">
            <X size={17} /> ERRO CLÁSSICO
          </span>
          <p>
            Decodificar um JWT
            <br />
            <strong>não valida sua identidade.</strong>
          </p>
        </div>
      </div>
      <Callout>
        Sair da aplicação encerra a sessão local. Isso não encerra
        automaticamente a sessão do Google.
      </Callout>
    </>
  );
}
function Conclusion() {
  return (
    <div className="conclusion">
      <div className="conclusion-statement">
        <span className="eyebrow">LEVE ESTA IDEIA COM VOCÊ</span>
        <p>
          O provedor autentica a identidade externa.
          <br />
          Minha aplicação associa essa identidade
          <br />a uma conta local e <em>cria sua própria sessão.</em>
        </p>
      </div>
      <div className="closing-flow">
        <span>
          <Globe />
          Provedor
        </span>
        <ArrowRight />
        <span>
          <Database />
          Conta local
        </span>
        <ArrowRight />
        <span>
          <ShieldCheck />
          Sua sessão
        </span>
      </div>
      <div className="thanks">
        <h3>
          Obrigado<span>!</span>
        </h3>
        <p>Dúvidas?</p>
        <span>Hyan Ferreira</span>
      </div>
      <div className="references">
        <a
          href="https://www.rfc-editor.org/rfc/rfc6749"
          target="_blank"
          rel="noreferrer"
        >
          OAuth 2.0 ↗
        </a>
        <a
          href="https://www.rfc-editor.org/rfc/rfc9700"
          target="_blank"
          rel="noreferrer"
        >
          Security BCP ↗
        </a>
        <a
          href="https://openid.net/specs/openid-connect-core-1_0.html"
          target="_blank"
          rel="noreferrer"
        >
          OpenID Connect ↗
        </a>
        <a
          href="https://developers.google.com/identity/openid-connect/openid-connect"
          target="_blank"
          rel="noreferrer"
        >
          Google Identity ↗
        </a>
        <a
          href="https://laravel.com/docs/12.x/socialite"
          target="_blank"
          rel="noreferrer"
        >
          Laravel Socialite ↗
        </a>
      </div>
    </div>
  );
}
// Shared icons remain local to each composition; no remote assets are required.
