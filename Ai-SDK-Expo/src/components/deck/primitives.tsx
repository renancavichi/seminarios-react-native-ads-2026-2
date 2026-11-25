import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useState, type ReactNode } from "react";
import { Check, Copy, AlertTriangle, Info, FlaskConical, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const theme: PrismTheme = {
  plain: { color: "var(--foreground)", backgroundColor: "transparent" },
  styles: [
    { types: ["comment"], style: { color: "var(--code-comment)", fontStyle: "italic" } },
    { types: ["keyword", "operator", "builtin"], style: { color: "var(--code-keyword)" } },
    { types: ["string", "attr-value", "template-string"], style: { color: "var(--code-string)" } },
    { types: ["function", "class-name", "tag"], style: { color: "var(--code-fn)" } },
    { types: ["number", "boolean"], style: { color: "var(--code-number)" } },
    { types: ["punctuation"], style: { color: "var(--code-punct)" } },
    { types: ["attr-name", "property"], style: { color: "var(--blue)" } },
  ],
};

/** Inline code */
export const C = ({ children }: { children: ReactNode }) => <code className="ic">{children}</code>;

export function SlideShell({
  kicker,
  title,
  children,
  className,
}: {
  kicker?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("absolute inset-0 flex flex-col px-[110px] pt-[78px] pb-[96px]", className)}>
      {kicker && <div className="slide-kicker text-cyan mb-5">{kicker}</div>}
      {title && <h2 className="slide-title mb-10 max-w-[1600px]">{title}</h2>}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

export const P = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("slide-body text-foreground/85 mb-5", className)}>{children}</p>
);

export function Card({
  title,
  children,
  tone = "cyan",
  className,
}: {
  title?: ReactNode;
  children: ReactNode;
  tone?: "cyan" | "violet" | "blue" | "amber" | "green";
  className?: string;
}) {
  const bar = {
    cyan: "bg-cyan",
    violet: "bg-violet",
    blue: "bg-blue",
    amber: "bg-amber",
    green: "bg-green",
  }[tone];
  return (
    <div className={cn("relative rounded-2xl border border-border bg-card/70 p-8 overflow-hidden", className)}>
      <div className={cn("absolute left-0 top-0 h-full w-[5px]", bar)} />
      {title && <div className="slide-body-lg font-semibold mb-3">{title}</div>}
      <div className="slide-caption text-foreground/80 [&_p]:mb-3">{children}</div>
    </div>
  );
}

export function Callout({
  kind = "info",
  children,
  className,
}: {
  kind?: "info" | "warn" | "sim" | "security";
  children: ReactNode;
  className?: string;
}) {
  const map = {
    info: { Icon: Info, c: "border-blue/50 bg-blue/10 text-blue", label: "Importante" },
    warn: { Icon: AlertTriangle, c: "border-amber/50 bg-amber/10 text-amber", label: "Atenção" },
    sim: { Icon: FlaskConical, c: "border-violet/50 bg-violet/10 text-violet", label: "Simulação" },
    security: { Icon: ShieldAlert, c: "border-destructive/50 bg-destructive/10 text-destructive", label: "Segurança" },
  }[kind];
  return (
    <div className={cn("flex gap-5 rounded-2xl border px-7 py-5", map.c, className)}>
      <map.Icon className="mt-1 size-8 shrink-0" />
      <div className="slide-caption text-foreground/90">
        <span className="font-semibold uppercase tracking-wider mr-2 text-[0.85em]" style={{ color: "inherit" }}>
          {map.label}:
        </span>
        {children}
      </div>
    </div>
  );
}

export function CodeBlock({
  code,
  file,
  lang = "tsx",
  highlight = [],
  small,
  tag,
  className,
}: {
  code: string;
  file?: string;
  lang?: string;
  highlight?: number[];
  small?: boolean;
  tag?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const text = code.trim();
  return (
    <div className={cn("self-start rounded-2xl border border-border bg-code-bg overflow-hidden shadow-glow flex flex-col", className)}>
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <span className="size-3.5 rounded-full bg-destructive/70" />
            <span className="size-3.5 rounded-full bg-amber/70" />
            <span className="size-3.5 rounded-full bg-green/70" />
          </div>
          {file && <span className="slide-chrome font-mono text-muted-foreground">{file}</span>}
          {tag && (
            <span className="slide-chrome rounded-full border border-violet/50 bg-violet/10 px-4 py-1 text-violet">
              {tag}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="slide-chrome flex items-center gap-2 rounded-lg border border-border px-4 py-1.5 text-muted-foreground transition hover:border-cyan hover:text-cyan"
          aria-label="Copiar código"
        >
          {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <Highlight code={text} language={lang} theme={theme}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className={cn("overflow-hidden py-4", small ? "slide-code-sm" : "slide-code")}>
            {tokens.map((line, i) => {
              const hl = highlight.includes(i + 1);
              const { key: _k, ...lp } = getLineProps({ line }) as Record<string, unknown> & { key?: unknown };
              return (
                <div
                  key={i}
                  {...lp}
                  className={cn("px-6 flex", hl && "bg-code-line border-l-4 border-cyan pl-5")}
                >
                  <span className="w-9 shrink-0 select-none text-right pr-4 text-muted-foreground/40">{i + 1}</span>
                  <span>
                    {line.map((token, k) => {
                      const { key: _t, ...tp } = getTokenProps({ token }) as Record<string, unknown> & { key?: unknown };
                      return <span key={k} {...tp} />;
                    })}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export function Flow({
  steps,
  className,
}: {
  steps: { label: string; sub?: string; tone?: "cyan" | "violet" | "blue" | "amber" | "green" }[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-stretch", className)}>
      {steps.map((s, i) => {
        const border = {
          cyan: "border-cyan/60",
          violet: "border-violet/60",
          blue: "border-blue/60",
          amber: "border-amber/60",
          green: "border-green/60",
        }[s.tone ?? "cyan"];
        return (
          <div key={i} className="flex items-center flex-1 min-w-0">
            <div
              className={cn("flex-1 rounded-2xl border-2 bg-card/80 px-5 py-6 text-center animate-slide-in", border)}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="slide-caption font-semibold text-foreground">{s.label}</div>
              {s.sub && <div className="slide-chrome !whitespace-normal mt-2 text-muted-foreground">{s.sub}</div>}
            </div>
            {i < steps.length - 1 && (
              <svg width="56" height="24" className="shrink-0" viewBox="0 0 56 24">
                <line x1="4" y1="12" x2="44" y2="12" stroke="var(--cyan)" strokeWidth="3" className="flow-dash" />
                <path d="M42 4 L54 12 L42 20" fill="none" stroke="var(--cyan)" strokeWidth="3" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Steps({ items, className }: { items: { t: ReactNode; d: ReactNode }[]; className?: string }) {
  return (
    <ol className={cn("space-y-5", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-6 animate-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-brand slide-caption font-bold text-primary-foreground">
            {i + 1}
          </span>
          <div>
            <div className="slide-body font-semibold">{it.t}</div>
            <div className="slide-caption text-foreground/75 mt-1">{it.d}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Bullets({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((it, i) => (
        <li key={i} className="slide-body flex gap-5 text-foreground/85">
          <span className="mt-[0.55em] size-3 shrink-0 rounded-full bg-cyan" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
