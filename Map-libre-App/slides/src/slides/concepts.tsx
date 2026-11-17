import { Database, Grid3x3, Image, Info, Mountain, PenTool, Shapes, TriangleAlert } from "lucide-react";
import { Highlight } from "../components/Code";
import { LiveMap } from "../components/LiveMap";
import { Callout, I, Kicker, No, Tag, WithIcon, Yes } from "../components/ui";
import { CARAGUA, OFM } from "../data/demos";
import type { SlideDef } from "../deck/Deck";

/* ---------- Pirâmide de tiles ---------- */
function Grid({ n, size, hit }: { n: number; size: number; hit: number }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, ${size}rem)` }}>
      {Array.from({ length: n * n }, (_, i) => (
        <span key={i} className={i === hit ? "hit" : ""} style={{ height: `${size}rem` }} />
      ))}
    </div>
  );
}

const TILE_URL = "https://tile.opentopomap.org/14/6058/9295.png";
function tileAnnotation() {
  const z = TILE_URL.indexOf("14"), x = TILE_URL.indexOf("6058"), y = TILE_URL.indexOf("9295");
  const row = (marks: [number, string][]) => {
    const line = Array(60).fill(" ");
    for (const [col, txt] of marks) [...txt].forEach((ch, i) => (line[col + i] = ch));
    return line.join("").trimEnd();
  };
  return [
    TILE_URL,
    row([[z, "│"], [x, "│"], [y, "└─ linha (y)"]]),
    row([[z, "│"], [x, "└─ coluna (x)"]]),
    row([[z, "└─ zoom (z)"]]),
  ].join("\n");
}

export const conceptSlides: SlideDef[] = [
  {
    section: "Como funciona",
    variant: "section",
    notes: "Parte conceitual — sem isso as demos parecem mágica.",
    Body: () => (
      <>
        <div className="num">02</div>
        <h2>Como um mapa digital funciona</h2>
        <p>Tiles, raster × vetorial e as fontes de dados — os conceitos que explicam tudo o que vem depois.</p>
      </>
    ),
  },
  {
    section: "Como funciona",
    notes: "4^18 ≈ 68,7 bilhões de tiles: ninguém baixa tudo, só a janela visível. No mapa à direita, as linhas vermelhas são os limites reais dos tiles — dê zoom e veja cada quadrado se dividir em 4.",
    Body: () => (
      <>
        <Kicker Icon={Grid3x3}>Conceito 1</Kicker>
        <h2>O mundo é dividido em tiles (ladrilhos)</h2>
        <div className="cols-2 grow">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", minHeight: 0 }}>
            <div className="pyramid">
              <div className="pyr"><Grid n={1} size={3.4} hit={0} />z = 0<br /><b>1</b> tile</div>
              <div className="pyr"><Grid n={2} size={2.4} hit={2} />z = 1<br /><b>4</b> tiles</div>
              <div className="pyr"><Grid n={4} size={1.3} hit={9} />z = 2<br /><b>16</b> tiles</div>
              <div className="pyr" style={{ fontSize: "2rem", color: "var(--accent)", alignSelf: "center" }}>…</div>
              <div className="pyr"><div style={{ fontSize: "2.6rem", fontWeight: 800, color: "var(--ink)" }}>4<sup>z</sup></div>z = 18<br /><b>68 bilhões</b></div>
            </div>
            <ul className="clean">
              <li>A cada nível de <b>zoom</b>, cada tile se divide em 4.</li>
              <li>O app só baixa os tiles <b>visíveis na tela</b> — por isso o mapa carrega rápido.</li>
              <li>Endereço padrão: <I>{"…/{z}/{x}/{y}.png"}</I></li>
            </ul>
            <div className="code"><Highlight code={tileAnnotation()} lang="plaintext" /></div>
          </div>
          <LiveMap
            badge={<><Grid3x3 /> Ao vivo: map.showTileBoundaries = true · dê zoom</>}
            options={{ style: `${OFM}/positron`, center: CARAGUA, zoom: 11 }}
            setup={(m) => { m.showTileBoundaries = true; }}
          />
        </div>
      </>
    ),
  },
  {
    section: "Como funciona",
    notes: "Vetorial é o grande diferencial dos motores modernos. Raster continua útil para imagens (satélite) e para mapas temáticos prontos de projetos da comunidade.",
    Body: () => (
      <>
        <Kicker Icon={Shapes}>Conceito 2</Kicker>
        <h2>Raster × Vetorial</h2>
        <div className="explain">
          <p>
            <b className="h"><Image /> Mapa raster</b>
            O mapa chega como uma <b>imagem pronta</b>, uma grade de pixels — como uma foto. O servidor já desenhou tudo:
            cores, nomes e ícones ficam "queimados" na imagem e não dá para mudar nada no aparelho.
          </p>
          <p>
            <b className="h"><PenTool /> Mapa vetorial</b>
            O mapa chega como <b>dados geométricos</b> — pontos, linhas e polígonos com atributos (nome, tipo de via…).
            Quem desenha é o próprio aparelho, seguindo um estilo: dá para mudar cores, girar, inclinar e consultar cada objeto.
          </p>
        </div>
        <table className="t">
          <thead>
            <tr><th></th><th><WithIcon Icon={Image}>Raster</WithIcon></th><th><WithIcon Icon={PenTool}>Vetorial</WithIcon></th></tr>
          </thead>
          <tbody>
            <tr><td>O que chega</td><td>Imagem pronta (PNG / JPG)</td><td>Geometrias + atributos (formato MVT / PBF)</td></tr>
            <tr><td>Quem desenha</td><td>O servidor</td><td>O <b>seu aparelho</b> (GPU), em tempo real</td></tr>
            <tr><td>Mudar cores</td><td><No>Impossível</No></td><td><Yes>Basta trocar o estilo</Yes></td></tr>
            <tr><td>Girar / inclinar</td><td>Texto gira junto e fica ilegível</td><td>Rótulos sempre de pé, prédios em 3D</td></tr>
            <tr><td>Clicar e consultar</td><td><No>Só pixels</No></td><td><Yes>Cada objeto traz atributos: nome, tipo…</Yes></td></tr>
            <tr><td>Exemplos hoje</td><td>Satélite, Topográfico, Ciclismo, Ferrovias</td><td>Ruas e Lojas, Prédios 3D</td></tr>
          </tbody>
        </table>
        <Callout Icon={Info} tone="amber" className="mt">
          O MapLibre é especialista em <b>vetorial</b>, mas também exibe raster — é assim que conseguimos usar fontes como satélite e mapas temáticos.
        </Callout>
      </>
    ),
  },
  {
    section: "Como funciona",
    notes: "Todas as fontes desta tabela aparecem nas demonstrações. Sempre exiba a atribuição — o MapLibre faz isso automaticamente a partir do campo attribution de cada source.",
    Body: () => (
      <>
        <Kicker Icon={Database}>De onde vêm os dados</Kicker>
        <h2>Fontes gratuitas e sem API key</h2>
        <table className="t">
          <thead><tr><th>Fonte</th><th>Tipo</th><th>O que oferece</th><th>Regras de uso</th></tr></thead>
          <tbody>
            <tr><td>OpenFreeMap</td><td><Tag Icon={PenTool}>vetorial</Tag></td><td>Estilos Liberty, Bright, Positron, Dark, Fiord</td><td>Gratuito, sem chave, mantido por doações</td></tr>
            <tr><td>Esri (ArcGIS Online)</td><td><Tag tone="teal" Icon={Image}>raster</Tag></td><td>Satélite, oceanos, National Geographic, cinza</td><td>Atribuição obrigatória; uso leve / não comercial</td></tr>
            <tr><td>OpenTopoMap · CyclOSM · HOT</td><td><Tag tone="teal" Icon={Image}>raster</Tag></td><td>Topográfico, ciclismo, humanitário</td><td>Servidores comunitários — uso moderado</td></tr>
            <tr><td>OpenRailwayMap · OpenSeaMap</td><td><Tag tone="teal" Icon={Image}>raster</Tag></td><td>Overlays de ferrovias e sinalização náutica</td><td>Servidores comunitários — uso moderado</td></tr>
            <tr><td>AWS Terrain Tiles</td><td><Tag tone="amber" Icon={Mountain}>raster-dem</Tag></td><td>Elevação do planeta (formato Terrarium)</td><td>Open Data na AWS</td></tr>
          </tbody>
        </table>
        <Callout Icon={TriangleAlert} tone="rose" className="mt">
          Servidores comunitários são ótimos para estudo e protótipos. Para um app publicado com muitos usuários, hospede seus tiles (ex.: <b>PMTiles</b> + Martin) ou contrate um provedor.
        </Callout>
      </>
    ),
  },
];
