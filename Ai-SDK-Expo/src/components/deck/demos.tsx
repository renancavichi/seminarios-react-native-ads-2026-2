import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ANSWER =
  "Streaming é a técnica de enviar a resposta em partes, à medida que ela é gerada. Assim, a pessoa começa a ler antes de o modelo terminar.";

/** Simulação visual: comparação entre resposta bloqueante e resposta em streaming. */
export function StreamingDemo() {
  const words = ANSWER.split(" ");
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const [blockDone, setBlockDone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShown(0);
    setBlockDone(false);
    if (run === 0) return;
    const per = 140;
    words.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setShown(i + 1), 300 + i * per));
    });
    timers.current.push(window.setTimeout(() => setBlockDone(true), 300 + words.length * per));
    return () => timers.current.forEach(clearTimeout);
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps

  const running = run > 0 && !blockDone;
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-8">
        <Panel title="Sem streaming" sub="espera a resposta completa">
          {run === 0 ? (
            <span className="text-muted-foreground">Clique em reproduzir…</span>
          ) : blockDone ? (
            <span>{ANSWER}</span>
          ) : (
            <span className="flex items-center gap-3 text-muted-foreground">
              <Dot /> <Dot d={150} /> <Dot d={300} /> aguardando o modelo terminar
            </span>
          )}
        </Panel>
        <Panel title="Com streaming" sub="exibe os pedaços conforme chegam" accent>
          {run === 0 ? (
            <span className="text-muted-foreground">Clique em reproduzir…</span>
          ) : (
            <span className={cn(running && "caret")}>{words.slice(0, shown).join(" ")}</span>
          )}
        </Panel>
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={() => setRun((r) => r + 1)}
          className="slide-caption flex items-center gap-3 rounded-xl bg-gradient-brand px-7 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          {run === 0 ? <Play className="size-6" /> : <RotateCcw className="size-6" />}
          {run === 0 ? "Reproduzir" : "Reproduzir de novo"}
        </button>
        <span className="slide-chrome text-violet">
          Animação ilustrativa no navegador — nenhum modelo real está conectado.
        </span>
      </div>
    </div>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return <span className="size-3 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: `${d}ms` }} />;
}

function Panel({
  title,
  sub,
  accent,
  children,
}: {
  title: string;
  sub: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border-2 bg-card/70 p-8 min-h-[290px]", accent ? "border-cyan/60" : "border-border")}>
      <div className="slide-body-lg font-semibold">{title}</div>
      <div className="slide-chrome text-muted-foreground mb-6">{sub}</div>
      <div className="slide-body">{children}</div>
    </div>
  );
}

const STAGES = [
  { who: "Usuário", tone: "border-blue", text: "“Como está o clima em São Paulo?”", detail: "A mensagem sai do app via sendMessage e chega à API Route." },
  { who: "Modelo · etapa 1", tone: "border-violet", text: "Decide chamar a ferramenta weather", detail: "Gera uma tool call com a entrada { location: 'São Paulo' }." },
  { who: "Servidor", tone: "border-amber", text: "Executa execute({ location })", detail: "O AI SDK roda a função definida pela aplicação, no servidor." },
  { who: "Resultado da tool", tone: "border-green", text: "{ location: 'São Paulo', temperature: 72 }", detail: "Valor SIMULADO (número aleatório, como no tutorial). Não é clima real." },
  { who: "Modelo · etapa 2", tone: "border-violet", text: "Lê o resultado e continua", detail: "Possível porque stopWhen: isStepCount(5) permite novas etapas." },
  { who: "Resposta final", tone: "border-cyan", text: "Texto gerado a partir do resultado da ferramenta", detail: "O texto chega por streaming como uma parte 'text' da mensagem." },
];

/** Simulação passo a passo de uma chamada multi-step. */
export function MultiStepDemo() {
  const [i, setI] = useState(0);
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-6 gap-4">
        {STAGES.map((s, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={cn(
              "rounded-2xl border-2 bg-card/70 p-5 text-left transition-all duration-500",
              k <= i ? cn(s.tone, "opacity-100") : "border-border opacity-35",
              k === i && "-translate-y-2 shadow-glow",
            )}
          >
            <div className="slide-chrome text-muted-foreground mb-2">
              {k + 1}. {s.who}
            </div>
            <div className="slide-caption font-medium">{s.text}</div>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-code-bg px-8 py-6 min-h-[120px]">
        <div className="slide-chrome text-cyan mb-2">Etapa {i + 1} de 6 — {STAGES[i]!.who}</div>
        <div className="slide-body">{STAGES[i]!.detail}</div>
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={() => setI((v) => (v + 1) % STAGES.length)}
          className="slide-caption flex items-center gap-3 rounded-xl bg-gradient-brand px-7 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          {i === STAGES.length - 1 ? <RotateCcw className="size-6" /> : <ChevronRight className="size-6" />}
          {i === STAGES.length - 1 ? "Recomeçar" : "Próxima etapa"}
        </button>
        <span className="slide-chrome text-violet">Simulação — nenhuma API real está conectada a esta página.</span>
      </div>
    </div>
  );
}
