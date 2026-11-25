import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { slides } from "@/components/deck/slides";
import { ScaledSlide } from "@/components/deck/ScaledSlide";

export const Route = createFileRoute("/apresentador")({
  validateSearch: (s: Record<string, unknown>): { slide?: number } => {
    const n = Number(s["slide"]);
    return Number.isFinite(n) && n >= 1 ? { slide: Math.floor(n) } : {};
  },
  head: () => ({
    meta: [
      { title: "Modo apresentador — AI SDK com Expo" },
      { name: "description", content: "Notas de fala, próximo slide e cronômetro da apresentação AI SDK com Expo." },
      { property: "og:title", content: "Modo apresentador — AI SDK com Expo" },
      { property: "og:description", content: "Notas de fala e cronômetro sincronizados com os slides." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Presenter,
});

function Presenter() {
  const { slide } = Route.useSearch();
  const [index, setIndex] = useState(Math.min((slide ?? 1) - 1, slides.length - 1));
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  const chan = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const c = new BroadcastChannel("deck-sync");
    chan.current = c;
    c.onmessage = (e) => typeof e.data?.index === "number" && setIndex(e.data.index);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { c.close(); clearInterval(t); };
  }, []);

  const goto = (i: number) => {
    const n = Math.max(0, Math.min(slides.length - 1, i));
    setIndex(n);
    chan.current?.postMessage({ goto: n });
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goto(index + 1);
      if (e.key === "ArrowLeft") goto(index - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const s = slides[index] ?? slides[0]!;
  const next = slides[index + 1];
  const sec = Math.floor((now - start) / 1000);
  const elapsed = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  const planned = slides.slice(0, index + 1).reduce((a, x) => a + x.minutes, 0);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 bg-background p-4 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
      <div className="flex flex-col gap-4">
        <ScaledSlide className="aspect-video w-full rounded-lg border border-border">{s.render()}</ScaledSlide>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan">
            Slide {index + 1}/{slides.length} · {s.title} · ~{s.minutes} min
          </div>
          <p className="text-lg leading-relaxed">{s.notes}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="font-mono text-5xl">{elapsed}</div>
          <div className="mt-1 text-sm text-muted-foreground">Planejado até o fim deste slide: ~{planned.toFixed(1)} min</div>
          <div className="mt-4 flex gap-2">
            <button className="rounded-md bg-muted px-4 py-2" onClick={() => goto(index - 1)}>← Anterior</button>
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground" onClick={() => goto(index + 1)}>Próximo →</button>
          </div>
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Próximo slide</div>
        {next ? (
          <ScaledSlide className="aspect-video w-full rounded-lg border border-border opacity-80">{next.render()}</ScaledSlide>
        ) : (
          <div className="text-muted-foreground">Fim da apresentação.</div>
        )}
      </div>
    </div>
  );
}
