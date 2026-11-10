import {
  ArrowDown,
  ArrowRight,
  Check,
  Globe,
  Monitor,
  Server,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
const flowSteps = [
  {
    title: "O clique começa na aplicação",
    text: "A pessoa escolhe “Continuar com Google”.",
    from: 0,
    to: 1,
    channel: "browser",
  },
  {
    title: "O navegador muda de destino",
    text: "O backend prepara a autorização e responde com um redirect.",
    from: 1,
    to: 2,
    channel: "browser",
  },
  {
    title: "O Google autentica a conta",
    text: "Senha, passkey ou uma sessão já existente no provedor.",
    from: 2,
    to: 2,
    channel: "browser",
  },
  {
    title: "Permissão, quando necessária",
    text: "A pessoa revisa e autoriza os scopes solicitados.",
    from: 2,
    to: 2,
    channel: "browser",
  },
  {
    title: "De volta ao callback",
    text: "O navegador entrega code e state à URI cadastrada.",
    from: 2,
    to: 1,
    channel: "browser",
  },
  {
    title: "O backend confere o retorno",
    text: "Verifica erros e a correlação com a tentativa iniciada.",
    from: 1,
    to: 1,
    channel: "server",
  },
  {
    title: "Código por tokens",
    text: "O backend faz a troca no token endpoint do provedor.",
    from: 1,
    to: 2,
    channel: "server",
  },
  {
    title: "Uma identidade verificada",
    text: "Valida OIDC ou consulta o perfil autenticado, conforme o adaptador.",
    from: 2,
    to: 1,
    channel: "server",
  },
  {
    title: "Uma conta na nossa aplicação",
    text: "Busca provider + ID externo. Cria ou vincula com política segura.",
    from: 1,
    to: 1,
    channel: "server",
  },
  {
    title: "Agora, uma sessão local",
    text: "O backend autentica o usuário e envia seu próprio cookie de sessão.",
    from: 1,
    to: 0,
    channel: "browser",
  },
];
export function LoginFlow({
  step,
  onNext,
}: {
  step: number;
  onNext: () => void;
}) {
  const current = flowSteps[step];
  const actors = [
    { icon: Monitor, title: "Navegador", sub: "Interface + redirecionamentos" },
    { icon: Server, title: "Seu backend", sub: "Configuração + sessão local" },
    { icon: Globe, title: "Google", sub: "Autenticação + APIs" },
  ];
  return (
    <div className="flow-layout">
      <div className="flow-diagram">
        <div className="actor-row">
          {actors.map((a, i) => (
            <div
              className={`actor ${current.from === i || current.to === i ? "active" : ""}`}
              key={a.title}
            >
              <a.icon />
              <h3>{a.title}</h3>
              <span>{a.sub}</span>
            </div>
          ))}
        </div>
        <div className="flow-lanes">
          <span />
          <span />
          <span />
          {flowSteps.slice(0, step + 1).map((s, i) => (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={`flow-message ${s.channel} ${i === step ? "current" : ""}`}
              style={{
                top: `${i * 34 + 8}px`,
                left:
                  s.from === s.to
                    ? `${s.from * 33.333 + 6}%`
                    : `${Math.min(s.from, s.to) * 33.333 + 16.666}%`,
                width:
                  s.from === s.to
                    ? "22%"
                    : `${Math.abs(s.to - s.from) * 33.333}%`,
              }}
            >
              <span className="message-label">
                <b>{String(i + 1).padStart(2, "0")}</b>
                {
                  [
                    "Clique",
                    "Redirect",
                    "Autenticação",
                    "Consentimento",
                    "Callback + code",
                    "Verificação",
                    "Troca de código",
                    "Identidade",
                    "Conta local",
                    "Cookie de sessão",
                  ][i]
                }
              </span>
              {s.from === s.to ? (
                <ArrowDown size={15} />
              ) : (
                <ArrowRight
                  size={15}
                  style={{
                    transform: s.from > s.to ? "rotate(180deg)" : undefined,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
        <div className="legend">
          <span>
            <i />
            Navegador
          </span>
          <span>
            <i />
            Backend / servidor-servidor
          </span>
        </div>
      </div>
      <div className="flow-explanation">
        <span className="eyebrow">
          ETAPA {String(step + 1).padStart(2, "0")} DE 10
        </span>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="big-step">{String(step + 1).padStart(2, "0")}</div>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
        </motion.div>
        <button className="primary-button" onClick={onNext}>
          {step === 9 ? <ShieldCheck size={20} /> : <ArrowRight size={20} />}{" "}
          {step === 9 ? "Continuar apresentação" : "Revelar próxima etapa"}
        </button>
        <span className="hint">Use → ou Espaço para avançar</span>
        <div className="step-dots">
          {flowSteps.map((_, i) => (
            <i key={i} className={i <= step ? "done" : ""}>
              {i < step && <Check size={9} />}
            </i>
          ))}
        </div>
      </div>
    </div>
  );
}
