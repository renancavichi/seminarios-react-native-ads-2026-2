import { useEffect, useRef, useState } from "react";
import type maplibregl from "maplibre-gl";
import {
  Box, Braces, CircleCheck, CircleX, Database, Eye, FileJson, Globe, Pencil, Smartphone, Layers, Paintbrush, PenTool, Type, Waves,
} from "lucide-react";
import { Highlight } from "../components/Code";
import { LiveMap } from "../components/LiveMap";
import { I, Kicker } from "../components/ui";
import { CARAGUA, PLAYGROUND_STYLE, print } from "../data/demos";
import type { SlideDef } from "../deck/Deck";

/* ---------- Playground do Style JSON ---------- */
type Json = Record<string, unknown>;
type Opt = { label: string; value: unknown };
type Control = { name: string; layer: string; group: "paint" | "layout"; prop: string; options: Opt[]; fallback?: unknown; state: string; ltype: string; ts?: string };

const CONTROLS: Control[] = [
  { name: "água", layer: "agua", group: "paint", prop: "fill-color", state: "corAgua", ltype: "fill", options: [
    { label: "azul", value: "#9ec7e8" }, { label: "rosa", value: "#ff00aa" },
    { label: "verde", value: "#2dd4bf" }, { label: "noite", value: "#1e3a5f" },
  ] },
  { name: "fundo", layer: "fundo", group: "paint", prop: "background-color", state: "corFundo", ltype: "background", options: [
    { label: "creme", value: "#ebe5da" }, { label: "branco", value: "#ffffff" }, { label: "escuro", value: "#111827" },
  ] },
  { name: "ruas", layer: "ruas", group: "paint", prop: "line-color", state: "corRuas", ltype: "line", options: [
    { label: "branco", value: "#ffffff" }, { label: "laranja", value: "#f97316" }, { label: "amarelo", value: "#facc15" },
  ] },
  { name: "largura", layer: "ruas", group: "paint", prop: "line-width", state: "largura", ltype: "line", ts: "Largura", options: [
    { label: "zoom fino", value: ["interpolate", ["linear"], ["zoom"], 10, 0.5, 18, 14] },
    { label: "zoom grosso", value: ["interpolate", ["linear"], ["zoom"], 10, 2, 18, 28] },
    { label: "fixa 3px", value: 3 },
  ] },
  { name: "prédios", layer: "predios", group: "layout", prop: "visibility", fallback: "visible", state: "visibilidade", ltype: "fill", ts: '"visible" | "none"', options: [
    { label: "visible", value: "visible" }, { label: "none", value: "none" },
  ] },
];

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** App: só carrega o style.json no mapa — sem os ajustes feitos ao vivo nos botões. */
const APP_CODE = `import { Map, Camera, type StyleSpecification } from "@maplibre/maplibre-react-native";
import estilo from "./style.json"; // o JSON da aba style.json

export default function App() {
  return (
    <Map
      style={{ flex: 1 }}
      mapStyle={estilo as StyleSpecification} // o objeto no lugar da URL
    >
      <Camera initialViewState={{ center: [${CARAGUA.join(", ")}], zoom: 14 }} />
    </Map>
  );
}`;

/** Web: usa o style.json e muda a propriedade do controle `c` para `value`. */
function componentCode(c: Control, value: unknown) {
  const v = print(value, 0, true);
  const label = c.options.find((o) => same(o.value, value))?.label ?? "novo valor";
  const web = `import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import estilo from "./style.json"; // o JSON da aba style.json

// O objeto vai direto na opção style (em vez de uma URL)
const map = new maplibregl.Map({
  container: "map",
  style: estilo,
  center: [${CARAGUA.join(", ")}],
  zoom: 14,
});

// O botão "${c.name}: ${label}" muda só uma propriedade,
// sem recriar o estilo inteiro:
map.set${c.group === "paint" ? "Paint" : "Layout"}Property("${c.layer}", "${c.prop}", ${v});

// Ou trocar o estilo todo de uma vez (ex.: depois de editar o JSON)
map.setStyle(estilo, { diff: true });`;
  return { app: APP_CODE, web };
}
const findLayer = (style: Json, id: string) => (style.layers as Json[] | undefined)?.find((l) => l.id === id);

function Playground() {
  const [text, setText] = useState(() => print(PLAYGROUND_STYLE, 0, true));
  const [error, setError] = useState<string | null>(null);
  const [changed, setChanged] = useState<string | null>(null);
  const [tab, setTab] = useState<"json" | "app" | "web">("json");
  const [preview, setPreview] = useState(false);
  const [lastCtl, setLastCtl] = useState<Control>(CONTROLS[0]);
  // Faixa de destaque: linha inicial, quantidade de linhas e uma chave para reiniciar a animação
  const [mark, setMark] = useState<{ line: number; count: number; key: number } | null>(null);
  const [scroll, setScroll] = useState(0);
  const [lineH, setLineH] = useState(20);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const obj = JSON.parse(text);
        mapRef.current?.setStyle(obj, { diff: true });
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [text]);

  // Estado atual lido do próprio JSON (assim, editar à mão também atualiza os botões)
  let parsed: Json | null = null;
  try { parsed = JSON.parse(text); } catch { /* JSON inválido: botões ficam sem seleção */ }
  const current = (c: Control) => {
    const layer = parsed && findLayer(parsed, c.layer);
    const group = layer?.[c.group] as Json | undefined;
    return group?.[c.prop] ?? c.fallback;
  };

  /** Mostra o mapa exatamente como o style.json + a câmera inicial do código — sem o painel de opções. */
  const togglePreview = () => {
    const m = mapRef.current;
    if (!preview && m && parsed) {
      m.setStyle(parsed as maplibregl.StyleSpecification); // estilo inteiro de novo, sem diff
      m.jumpTo({ center: CARAGUA, zoom: 14, pitch: 0, bearing: 0 });
    }
    setPreview(!preview);
  };

  const apply = (c: Control, value: unknown) => {
    if (!parsed) return;
    const style = structuredClone(parsed);
    const layer = findLayer(style, c.layer);
    if (!layer) return;
    layer[c.group] = { ...(layer[c.group] as Json | undefined), [c.prop]: value };
    const next = print(style, 0, true);
    setText(next);
    setChanged(`layers › ${c.layer} › ${c.group} › ${c.prop}`);
    setLastCtl(c);
    // Destaca e rola até a linha alterada (sem tirar o foco das setas do slide)
    const start = next.indexOf(`"id": "${c.layer}"`);
    const at = next.indexOf(`"${c.prop}"`, start);
    const line = next.slice(0, at).split("\n").length - 1;
    const count = print(value, 4, true).split("\n").length;
    setMark({ line, count, key: Date.now() });
    requestAnimationFrame(() => {
      const ed = editorRef.current;
      if (!ed) return;
      const lh = parseFloat(getComputedStyle(ed).lineHeight) || 20;
      setLineH(lh);
      ed.scrollTop = Math.max(0, (line - 4) * lh);
      setScroll(ed.scrollTop);
    });
  };

  return (
    <div className="demo-grid">
      <LiveMap
        badge={<><FileJson /> Style JSON escrito à mão · 5 camadas</>}
        options={{ style: PLAYGROUND_STYLE, center: CARAGUA, zoom: 14 }}
        setup={(m) => { mapRef.current = m; return () => { mapRef.current = null; }; }}
      >
        {!preview && <div className="cam-panel">
          {CONTROLS.map((c) => (
            <div key={c.name} className="cam-row">
              <code>{c.name}</code>
              {c.options.map((o) => (
                <button key={o.label} className={same(current(c), o.value) ? "on" : ""} onClick={() => apply(c, o.value)}>
                  {typeof o.value === "string" && o.value.startsWith("#") && <i className="swatch" style={{ background: o.value }} />}
                  {o.label}
                </button>
              ))}
            </div>
          ))}
        </div>}
        <div className="map-buttons">
          <button className={preview ? "on" : ""} onClick={togglePreview} disabled={!parsed}>
            {preview ? <><Pencil /> Voltar às opções</> : <><Eye /> Ver como no style.json</>}
          </button>
        </div>
      </LiveMap>
      <div className="demo-side">
        <p className="demo-purpose">
          Clique nas opções sobre o mapa ou edite o JSON à mão. As abas App e Web mostram como usar este estilo em um componente.
        </p>
        <div className="code">
          <div className="code-bar">
            <button className={`tab ${tab === "json" ? "on" : ""}`} onClick={() => setTab("json")}><Braces /> style.json</button>
            <button className={`tab ${tab === "app" ? "on" : ""}`} onClick={() => setTab("app")}><Smartphone /> App (Android/iOS)</button>
            <button className={`tab ${tab === "web" ? "on" : ""}`} onClick={() => setTab("web")}><Globe /> Web</button>
            <span className="file">{tab === "json" ? "editável" : tab === "app" ? "App.tsx" : "mapa.js"}</span>
          </div>
          {tab !== "json" && <Highlight code={componentCode(lastCtl, current(lastCtl))[tab]} lang="typescript" />}
          <div className="editor-wrap" style={tab === "json" ? undefined : { display: "none" }}>
            {mark && (
              <div
                key={mark.key}
                className="line-mark"
                style={{ top: `calc(1rem + ${mark.line * lineH - scroll}px)`, height: mark.count * lineH }}
              />
            )}
            <textarea
              ref={editorRef}
              className="editor"
              spellCheck={false}
              wrap="off"
              value={text}
              onScroll={(e) => setScroll(e.currentTarget.scrollTop)}
              onChange={(e) => { setText(e.target.value); setChanged(null); setMark(null); }}
              onKeyDown={(e) => {
                if (e.key === "Tab") { e.preventDefault(); document.execCommand("insertText", false, "  "); }
              }}
            />
          </div>
          {tab === "json" && <div className={`status ${error ? "err" : ""}`}>
            {error ? <><CircleX /> JSON inválido: {error}</>
              : changed ? <><CircleCheck /> Alterado: {changed}</>
              : <><CircleCheck /> Estilo válido — mapa atualizado</>}
          </div>}
        </div>
      </div>
    </div>
  );
}

export const styleSlides: SlideDef[] = [
  {
    section: "Style JSON",
    variant: "section",
    notes: "Agora que vimos os mapas funcionando, abrimos o capô: o JSON que descreve cada um deles.",
    Body: () => (
      <>
        <div className="num">06</div>
        <h2>Style JSON: a receita do mapa</h2>
        <p>Fontes e camadas — o arquivo que define a aparência de todos os mapas que vimos.</p>
      </>
    ),
  },
  {
    section: "Style JSON",
    notes: "A pilha de camadas é como camadas do Photoshop. Próximo slide: vamos montar um estilo do zero e editá-lo ao vivo.",
    Body: () => (
      <>
        <Kicker Icon={FileJson}>Style JSON · 1 de 2</Kicker>
        <h2>O Style JSON: a receita do mapa</h2>
        <div className="cols-2 grow" style={{ alignContent: "start" }}>
          <div>
            <div className="flow col">
              <div className="step"><b><Database /> sources</b>De onde vêm os dados: <I>vector</I>, <I>raster</I>, <I>raster-dem</I>, <I>geojson</I>, <I>image</I></div>
              <div className="step"><b><Layers /> layers</b>Como desenhar, em ordem (a primeira fica embaixo): <I>fill</I>, <I>line</I>, <I>symbol</I>, <I>circle</I>, <I>fill-extrusion</I>, <I>raster</I>, <I>hillshade</I>, <I>heatmap</I>, <I>background</I></div>
              <div className="step"><b><Type /> glyphs · sprite</b>Fontes para os textos e a folha de ícones (lojas, ônibus, hospitais…)</div>
            </div>
            <p className="small muted mt-s">Um estilo como o <b>Liberty</b> tem 111 camadas. Trocar o estilo = trocar a aparência inteira, sem mudar uma linha da lógica do app.</p>
          </div>
          <div className="layer-stack">
            <div style={{ background: "#334155" }}><Type /> symbol — nomes de ruas e ícones de lojas</div>
            <div style={{ background: "#1e3a8a" }}><Box /> fill-extrusion — prédios 3D</div>
            <div style={{ background: "#2563eb" }}><PenTool /> line — ruas e avenidas</div>
            <div style={{ background: "#0d9488" }}><Waves /> fill — água e parques</div>
            <div style={{ background: "#94a3b8" }}><Paintbrush /> background — cor de fundo</div>
            <p className="tiny muted" style={{ margin: ".4rem 0 0", textAlign: "center" }}>↑ desenhado por último · ↓ desenhado primeiro</p>
          </div>
        </div>
      </>
    ),
  },
  {
    section: "Style JSON",
    notes: "Demonstração ao vivo: clique em água → rosa e veja o JSON rolar até fill-color; depois largura → zoom grosso e prédios → none (layout.visibility). Também dá para editar o texto à mão. O botão Ver como no style.json esconde as opções e mostra o mapa exatamente como o JSON + a câmera inicial do código. Depois abra a aba App: basta importar o style.json e passar em mapStyle — os botões são só para explorar o estilo. Na aba Web, setPaintProperty mostra como mudar uma propriedade sem recriar o estilo. Os dados (vector tiles da OpenFreeMap) são os mesmos; só o estilo muda. Este mesmo objeto poderia ir em mapStyle={...} no app.",
    Body: () => (
      <>
        <Kicker Icon={PenTool}>Style JSON · 2 de 2 · ao vivo</Kicker>
        <h2 style={{ marginBottom: "1rem" }}>Seu primeiro estilo, do zero</h2>
        <Playground />
      </>
    ),
  },
];
