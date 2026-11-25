import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Home, List, Maximize, MessageSquareText, MonitorPlay, X } from "lucide-react";
import { slides, totalMinutes } from "./slides";
import { ScaledSlide } from "./ScaledSlide";
import { cn } from "@/lib/utils";

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
};

export function Deck({ index }: { index: number }) {
  const navigate = useNavigate();
  const total = slides.length;
  const [toc, setToc] = useState(false);
  const [notes, setNotes] = useState(false);
  const chan = useRef<BroadcastChannel | null>(null);

  const go = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(total - 1, i));
      navigate({ to: "/", search: { slide: n + 1 }, replace: true });
    },
    [navigate, total],
  );

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel("deck-sync");
    chan.current = c;
    c.onmessage = (e) => {
      if (typeof e.data?.goto === "number") go(e.data.goto);
    };
    return () => c.close();
  }, [go]);

  useEffect(() => {
    chan.current?.postMessage({ index });
    document.title = `${index + 1}/${total} — ${slides[index]?.title ?? ""}`;
  }, [index, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(index + 1); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(index - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
      else if (e.key.toLowerCase() === "i") setToc((v) => !v);
      else if (e.key.toLowerCase() === "n") setNotes((v) => !v);
      else if (e.key.toLowerCase() === "f") toggleFs();
      else if (e.key === "Escape") setToc(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, total]);

  // swipe
  const touch = useRef<number | null>(null);

  const slide = slides[index] ?? slides[0]!;
  const sections = Array.from(new Set(slides.map((s) => s.section)));

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <div className="h-1 w-full bg-muted">
        <div className="h-full bg-gradient-brand transition-all duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <div
        className="relative flex-1 min-h-0"
        onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touch.current) - touch.current;
          if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        <ScaledSlide className="absolute inset-0">
          <div key={slide.id} className="absolute inset-0 animate-slide-in">
            {slide.render()}
          </div>
          <div className="absolute bottom-9 left-[110px] right-[110px] flex justify-between slide-chrome text-muted-foreground">
            <span>AI SDK com Expo · {slide.section}</span>
            <span className="font-mono">
              {String(index + 1).padStart(2, "0")} / {total}
            </span>
          </div>
        </ScaledSlide>
      </div>

      {notes && (
        <div className="max-h-[32vh] overflow-y-auto border-t border-border bg-card px-6 py-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan">Roteiro de fala · ~{slide.minutes} min</div>
          <p className="text-base leading-relaxed text-foreground/90 max-w-5xl">{slide.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-border bg-card/60 px-3 py-2 text-sm">
        <div className="flex items-center gap-1">
          <Btn label="Início" onClick={() => go(0)}><Home className="size-4" /></Btn>
          <Btn label="Índice (I)" onClick={() => setToc(true)}><List className="size-4" /></Btn>
          <Btn label="Notas (N)" active={notes} onClick={() => setNotes((v) => !v)}><MessageSquareText className="size-4" /></Btn>
          <Btn label="Modo apresentador" onClick={() => window.open(`/apresentador?slide=${index + 1}`, "apresentador", "width=1200,height=800")}>
            <MonitorPlay className="size-4" />
          </Btn>
          <Btn label="Tela cheia (F)" onClick={toggleFs}><Maximize className="size-4" /></Btn>
        </div>
        <div className="hidden truncate text-muted-foreground md:block">{slide.title}</div>
        <div className="flex items-center gap-2">
          <Btn label="Anterior" onClick={() => go(index - 1)} disabled={index === 0}><ChevronLeft className="size-5" /></Btn>
          <span className="w-16 text-center font-mono text-muted-foreground">{index + 1}/{total}</span>
          <Btn label="Próximo" onClick={() => go(index + 1)} disabled={index === total - 1}><ChevronRight className="size-5" /></Btn>
        </div>
      </div>

      {toc && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-label="Índice de slides">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setToc(false)} />
          <nav className="relative ml-auto h-full w-full max-w-md overflow-y-auto border-l border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Índice</div>
                <div className="text-xs text-muted-foreground">{total} slides · duração estimada ~{Math.round(totalMinutes)} min</div>
              </div>
              <Btn label="Fechar" onClick={() => setToc(false)}><X className="size-5" /></Btn>
            </div>
            {sections.map((sec) => (
              <div key={sec} className="mb-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan">{sec}</div>
                {slides.map((s, i) =>
                  s.section !== sec ? null : (
                    <button
                      key={s.id}
                      onClick={() => { go(i); setToc(false); }}
                      className={cn(
                        "flex w-full items-baseline gap-3 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted",
                        i === index && "bg-muted text-cyan",
                      )}
                    >
                      <span className="w-6 font-mono text-xs text-muted-foreground">{i + 1}</span>
                      <span className="flex-1">{s.title}</span>
                      <span className="text-xs text-muted-foreground">{s.minutes}′</span>
                    </button>
                  ),
                )}
              </div>
            ))}
            <div className="mt-6 text-xs text-muted-foreground">
              Atalhos: ← → navegar · Home início · I índice · N notas · F tela cheia
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

function toggleFs() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
}

function Btn({
  children,
  label,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30",
        active && "bg-muted text-cyan",
      )}
    >
      {children}
    </button>
  );
}
