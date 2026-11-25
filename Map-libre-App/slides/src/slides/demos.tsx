import { Image, Info, LayoutGrid, Mountain, PenTool } from "lucide-react";
import { CodeTabs } from "../components/Code";
import { LiveMap } from "../components/LiveMap";
import { Callout, Html, I, IconBox, Kicker, Tag, type Tone } from "../components/ui";
import {
  DEMOS, appCode, pascal, toRuntimeStyle, webCode, type Demo, type Kind,
} from "../data/demos";
import type { SlideDef } from "../deck/Deck";

const KIND: Record<Kind, { tone: Tone; tag?: "teal" | "amber"; Icon: typeof PenTool; label: string; color: string }> = {
  "vetorial": { tone: "accent", Icon: PenTool, label: "Vetorial", color: "var(--accent)" },
  "raster": { tone: "teal", tag: "teal", Icon: Image, label: "Raster", color: "var(--teal)" },
  "raster-dem": { tone: "amber", tag: "amber", Icon: Mountain, label: "Raster-DEM", color: "var(--amber)" },
};

/* ---------- Slide de uma demonstração ---------- */
function DemoSlide({ d, i }: { d: Demo; i: number }) {
  const k = KIND[d.kind];
  return (
    <div className="demo-grid">
      <LiveMap
        badge={<><k.Icon /> {k.label} · {d.source}</>}
        options={{ style: toRuntimeStyle(d.style), ...d.view }}
      />
      <div className="demo-side">
        <div className="demo-head">
          <IconBox Icon={d.Icon} tone={k.tone} size="lg" />
          <div>
            <Tag tone={k.tag} Icon={k.Icon}>{d.kind}</Tag>
            <Tag tone="gray">Demo {i + 1} de {DEMOS.length}</Tag>
            <h2>{d.label}</h2>
          </div>
        </div>
        <p className="demo-purpose">{d.purpose}</p>
        <ul className="clean demo-bullets">
          {d.bullets.map((b, j) => <Html key={j} as="li" html={b} />)}
        </ul>
        <CodeTabs
          app={{ file: `Mapa${pascal(d.id)}.tsx`, code: appCode(d) }}
          web={{ file: `mapa-${d.id}.js`, code: webCode(d) }}
          note={"raster" in d.style ? "rasterStyle() está em mapModes.ts" : undefined}
        />
      </div>
    </div>
  );
}

/* ---------- Lista de slides ---------- */
export const demoSlides: SlideDef[] = [
  {
    section: "Tipos de mapas",
    variant: "section",
    notes: "O código de todas estas demos é o dos passos 1 a 3 (Map + Camera + UserLocation). O que muda é só o mapStyle — é aqui que mostramos a diferença entre vetorial, raster e elevação.",
    Body: () => (
      <>
        <div className="num">05</div>
        <h2>Estilização: tipos de mapas</h2>
        <p>Mesmo código do passo a passo, receitas diferentes: {DEMOS.length} mapas com finalidades diferentes — vetoriais, de elevação e raster.</p>
      </>
    ),
  },
  {
    section: "Tipos de mapas",
    notes: "Visão geral antes das demos individuais. Na ordem em que aparecem: azul = vetorial (desenhado no aparelho), laranja = elevação, verde = raster (imagem pronta).",
    Body: () => (
      <>
        <Kicker Icon={LayoutGrid}>Catálogo</Kicker>
        <h2>{DEMOS.length} mapas, {DEMOS.length} finalidades</h2>
        <div className="modes">
          {DEMOS.map((d) => (
            <div key={d.id} className="mode" style={{ borderTop: `.3rem solid ${KIND[d.kind].color}` }}>
              <IconBox Icon={d.Icon} tone={KIND[d.kind].tone} size="sm" />
              <b>{d.label}</b>
              <span className="src">{d.source}</span>
            </div>
          ))}
          <div className="mode legend" style={{ background: "transparent", borderStyle: "dashed" }}>
            <div><i style={{ background: "var(--accent)" }} />vetorial</div>
            <div><i style={{ background: "var(--amber)" }} />elevação</div>
            <div><i style={{ background: "var(--teal)" }} />raster</div>
          </div>
        </div>
        <Callout Icon={Info} className="mt">
          Todos vêm de <I>mapModes.ts</I> — uma lista compartilhada por <I>App.tsx</I> (Android/iOS) e <I>App.web.tsx</I> (navegador).
        </Callout>
      </>
    ),
  },
  ...DEMOS.map((d, i): SlideDef => ({ section: "Tipos de mapas", notes: d.notes, Body: () => <DemoSlide d={d} i={i} /> })),
];
