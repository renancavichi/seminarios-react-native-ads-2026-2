import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Shapes } from "lucide-react";
import { CodeTabs } from "../components/Code";
import { LiveMap } from "../components/LiveMap";
import { Html, IconBox, Tag } from "../components/ui";
import { OFM, print } from "../data/demos";
import type { SlideDef } from "../deck/Deck";

/* ------------------------------------------------------------------ */
/* Os 7 tipos de geometry do GeoJSON (coordenadas sempre [lng, lat])   */
/* ------------------------------------------------------------------ */
type LngLat = [number, number];
const PRACA: LngLat = [-45.411, -23.6187];
const PRAIAS: LngLat[] = [[-45.4114, -23.627], [-45.3904, -23.6311], [-45.3834, -23.6285], [-45.4238, -23.6441]];
const ORLA: LngLat[] = [[-45.4238, -23.6441], [-45.4185, -23.6372], [-45.4114, -23.627], [-45.404, -23.6262], [-45.3904, -23.6311]];
const RUA: LngLat[] = [[-45.411, -23.6187], [-45.4112, -23.623], [-45.4114, -23.627]];
const QUADRA: LngLat[] = [[-45.416, -23.615], [-45.406, -23.615], [-45.406, -23.6225], [-45.416, -23.6225], [-45.416, -23.615]];
const BURACO: LngLat[] = [[-45.4125, -23.6172], [-45.4095, -23.6172], [-45.4095, -23.62], [-45.4125, -23.62], [-45.4125, -23.6172]];
const AREA_2: LngLat[] = [[-45.396, -23.625], [-45.388, -23.625], [-45.388, -23.63], [-45.396, -23.63], [-45.396, -23.625]];

type Geo = { type: string; coordinates?: unknown; geometries?: Geo[] };
type GeoType = { type: string; nome: string; layer: string; shape: string; geometry: Geo; text: string[] };

const TYPES: GeoType[] = [
  {
    type: "Point", nome: "praça", layer: "circle · symbol", shape: "[lng, lat]",
    geometry: { type: "Point", coordinates: PRACA },
    text: ["<b>Um</b> lugar: um único par <code class='i'>[lng, lat]</code>.", "Ex.: a praça, um ponto de ônibus, uma loja."],
  },
  {
    type: "MultiPoint", nome: "praias", layer: "circle · symbol", shape: "[[lng, lat], …]",
    geometry: { type: "MultiPoint", coordinates: PRAIAS },
    text: ["Vários pontos em <b>uma só feature</b>: todos com as mesmas <code class='i'>properties</code>.", "Precisa de um nome por ponto? Use várias features <code class='i'>Point</code>."],
  },
  {
    type: "LineString", nome: "orla", layer: "line", shape: "[[lng, lat], [lng, lat], …]",
    geometry: { type: "LineString", coordinates: ORLA },
    text: ["Uma linha ligando <b>2 ou mais</b> pontos, na ordem.", "Ex.: rota, trilha, linha de ônibus."],
  },
  {
    type: "MultiLineString", nome: "rotas", layer: "line", shape: "[[[lng, lat], …], [[lng, lat], …]]",
    geometry: { type: "MultiLineString", coordinates: [ORLA, RUA] },
    text: ["Várias linhas <b>separadas</b> numa só feature: um nível a mais de colchetes.", "Ex.: uma linha de ônibus com dois ramais."],
  },
  {
    type: "Polygon", nome: "quadra", layer: "fill · line", shape: "[[[lng, lat], …, primeiro]]",
    geometry: { type: "Polygon", coordinates: [QUADRA, BURACO] },
    text: ["Uma área feita de <b>anéis</b>: o 1º é o contorno, os demais são <b>buracos</b>.", "Cada anel é fechado: o último ponto <b>repete o primeiro</b>."],
  },
  {
    type: "MultiPolygon", nome: "áreas", layer: "fill · line", shape: "[[[[lng, lat], …]], [[[…]]]]",
    geometry: { type: "MultiPolygon", coordinates: [[QUADRA, BURACO], [AREA_2]] },
    text: ["Várias áreas numa só feature: cada item é um <code class='i'>Polygon</code> inteiro.", "Ex.: um município com ilhas, como Ilhabela."],
  },
  {
    type: "GeometryCollection", nome: "mistura", layer: "a de cada tipo", shape: "geometries: [ … ]",
    geometry: {
      type: "GeometryCollection",
      geometries: [
        { type: "Point", coordinates: PRACA },
        { type: "LineString", coordinates: RUA },
        { type: "Polygon", coordinates: [AREA_2] },
      ],
    },
    text: ["Mistura tipos numa só feature. Não tem <code class='i'>coordinates</code>: tem <code class='i'>geometries</code>.", "Pouco usado: várias features costumam ser mais simples."],
  },
];

const feature = (t: GeoType) => ({ type: "Feature", properties: { nome: t.nome }, geometry: t.geometry });

/** Todas as coordenadas de uma geometria, em qualquer profundidade de colchetes. */
function coordsOf(g: Geo): LngLat[] {
  if (g.geometries) return g.geometries.flatMap(coordsOf);
  const out: LngLat[] = [];
  const walk = (a: unknown) => {
    if (Array.isArray(a) && typeof a[0] === "number") out.push(a as LngLat);
    else if (Array.isArray(a)) a.forEach(walk);
  };
  walk(g.coordinates);
  return out;
}
const vertices = (g: Geo): GeoJSON.FeatureCollection => ({
  type: "FeatureCollection",
  features: coordsOf(g).map((c) => ({ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: c } })),
});

/* ------------------------------------------------------------------ */
/* Código exibido: o JSON + como desenhar no app e na web              */
/* ------------------------------------------------------------------ */
const kinds = (t: GeoType) => {
  const all = t.type === "GeometryCollection";
  return { point: all || t.type.endsWith("Point"), line: all || t.type.includes("Line") || t.type.includes("Polygon"), poly: all || t.type.includes("Polygon") };
};

function appCode(t: GeoType) {
  const k = kinds(t);
  const L = [
    `import { GeoJSONSource, Layer } from "@maplibre/maplibre-react-native";`,
    `import dados from "./dados.json"; // a aba ao lado`,
    ``,
    `// dentro do <Map>:`,
    `<GeoJSONSource id="geo" data={dados as GeoJSON.Feature}>`,
  ];
  if (k.poly) L.push(`  <Layer id="area" type="fill"`, `    paint={{ "fill-color": "#16a34a", "fill-opacity": 0.35 }} />`);
  if (k.line) L.push(`  <Layer id="linha" type="line"`, `    paint={{ "line-color": "#2563eb", "line-width": 4 }} />`);
  if (k.point) L.push(`  <Layer id="ponto" type="circle"`, `    paint={{ "circle-color": "#e11d48", "circle-radius": 8 }} />`);
  L.push(`</GeoJSONSource>`);
  return L.join("\n");
}

function webCode(t: GeoType) {
  const k = kinds(t);
  const L = [
    `import dados from "./dados.json"; // a aba ao lado`,
    ``,
    `map.addSource("geo", { type: "geojson", data: dados });`,
    ``,
  ];
  if (k.poly) L.push(`map.addLayer({ id: "area", type: "fill", source: "geo",`, `  paint: { "fill-color": "#16a34a", "fill-opacity": 0.35 } });`);
  if (k.line) L.push(`map.addLayer({ id: "linha", type: "line", source: "geo",`, `  paint: { "line-color": "#2563eb", "line-width": 4 } });`);
  if (k.point) L.push(`map.addLayer({ id: "ponto", type: "circle", source: "geo",`, `  paint: { "circle-color": "#e11d48", "circle-radius": 8 } });`);
  L.push(``, `// Trocar os dados depois:`, `map.getSource("geo").setData(outroGeoJSON);`);
  return L.join("\n");
}

/* ------------------------------------------------------------------ */
/* Mapa ao vivo                                                        */
/* ------------------------------------------------------------------ */
const isType = (types: string[]) => ["in", ["geometry-type"], ["literal", types]] as maplibregl.FilterSpecification;

function show(m: maplibregl.Map, t: GeoType, animate = true) {
  const geo = m.getSource<maplibregl.GeoJSONSource>("geo");
  if (!geo) return;
  geo.setData(feature(t) as GeoJSON.Feature);
  m.getSource<maplibregl.GeoJSONSource>("vertices")?.setData(vertices(t.geometry));
  const pts = coordsOf(t.geometry);
  const b = pts.reduce((bb, c) => bb.extend(c), new maplibregl.LngLatBounds(pts[0], pts[0]));
  m.fitBounds(b, { padding: { top: 70, bottom: 110, left: 60, right: 60 }, maxZoom: 15.5, duration: animate ? 800 : 0 });
}

function GeometrySlide() {
  const [i, setI] = useState(0);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const t = TYPES[i];

  useEffect(() => {
    if (mapRef.current) show(mapRef.current, t);
  }, [t]);

  return (
    <div className="demo-grid">
      <LiveMap
        badge={<><Shapes /> Pontinhos brancos = cada coordenada</>}
        options={{ style: `${OFM}/positron`, center: PRACA, zoom: 14 }}
        setup={(m) => {
          mapRef.current = m;
          m.on("load", () => {
            m.addSource("geo", { type: "geojson", data: feature(TYPES[0]) as GeoJSON.Feature });
            m.addSource("vertices", { type: "geojson", data: vertices(TYPES[0].geometry) });
            const polys = isType(["Polygon", "MultiPolygon"]);
            m.addLayer({ id: "area", type: "fill", source: "geo", filter: polys, paint: { "fill-color": "#16a34a", "fill-opacity": 0.35 } });
            m.addLayer({ id: "borda", type: "line", source: "geo", filter: polys, paint: { "line-color": "#16a34a", "line-width": 2 } });
            m.addLayer({
              id: "linha", type: "line", source: "geo", filter: isType(["LineString", "MultiLineString"]),
              layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#2563eb", "line-width": 5 },
            });
            m.addLayer({
              id: "ponto", type: "circle", source: "geo", filter: isType(["Point", "MultiPoint"]),
              paint: { "circle-color": "#e11d48", "circle-radius": 9, "circle-stroke-color": "#fff", "circle-stroke-width": 2.5 },
            });
            m.addLayer({
              id: "vertice", type: "circle", source: "vertices",
              paint: { "circle-color": "#fff", "circle-radius": 3.5, "circle-stroke-color": "#0f172a", "circle-stroke-width": 1.5 },
            });
            show(m, TYPES[0], false);
          });
          return () => { mapRef.current = null; };
        }}
      >
        <div className="map-buttons">
          {TYPES.map((x, j) => (
            <button key={x.type} className={j === i ? "on" : ""} onClick={() => setI(j)}>{x.type}</button>
          ))}
        </div>
      </LiveMap>
      <div className="demo-side">
        <div className="demo-head">
          <IconBox Icon={Shapes} size="lg" />
          <div>
            <Tag>layer: {t.layer}</Tag>
            <h2>Tipos de geometry</h2>
          </div>
        </div>
        <p className="demo-purpose">
          O que muda entre os tipos é a <b>profundidade dos colchetes</b> em <code className="i">coordinates</code>:{" "}
          <code className="i">{t.type}</code> → <code className="i">{t.shape}</code>
        </p>
        <ul className="clean demo-bullets">
          {t.text.map((x, j) => <Html key={j} as="li" html={x} />)}
        </ul>
        <CodeTabs
          key={t.type}
          extraFirst
          extra={{ file: "dados.json", code: print(feature(t), 0, true), note: "Uma Feature: properties + geometry. Para vários itens, use uma FeatureCollection." }}
          app={{ file: "App.tsx", code: appCode(t) }}
          web={{ file: "mapa.js", code: webCode(t) }}
        />
      </div>
    </div>
  );
}

export const geometrySlide: SlideDef = {
  section: "Passo a passo",
  notes: "Complemento do passo 4: o GeoJSONSource aceita 7 tipos de geometry. Clique em cada botão do mapa e mostre a aba dados.json mudando — a diferença é a quantidade de colchetes. Polygon: o anel fecha repetindo o primeiro ponto, e o segundo anel é um buraco. Cada tipo é desenhado por uma layer diferente: circle (pontos), line (linhas e contornos), fill (áreas).",
  Body: GeometrySlide,
};
