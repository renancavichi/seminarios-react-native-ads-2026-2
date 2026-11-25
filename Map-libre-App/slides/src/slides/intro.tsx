import {
  ArrowRight, Atom, Blocks, CircleHelp, FileJson, GitFork, Globe, Layers, Package, Rocket, Scale, Server,
  Smartphone, Sparkles, ThumbsDown, ThumbsUp, Users,
} from "lucide-react";
import logo from "../assets/maplibre-logo.svg";
import type maplibregl from "maplibre-gl";
import { LiveMap } from "../components/LiveMap";
import { Callout, Card, I, IconBox, Kicker, WithIcon } from "../components/ui";
import { CARAGUA, OFM } from "../data/demos";
import type { SlideDef } from "../deck/Deck";

function spin(map: maplibregl.Map) {
  const rotate = () => map.rotateTo(map.getBearing() + 90, { duration: 24000, easing: (t) => t });
  map.on("load", rotate);
  map.on("moveend", rotate);
}

export const introSlides: SlideDef[] = [
  {
    section: "Abertura",
    variant: "cover",
    notes: "Boas-vindas. O mapa ao fundo já é MapLibre rodando no navegador, sobre o centro de Caraguatatuba. Hoje: o que é, como funciona, como instalar, a biblioteca construída passo a passo, tipos de mapas e o Style JSON. Use ← → para navegar e N para notas.",
    Body: () => (
      <>
        <LiveMap
          controls={false}
          options={{ style: `${OFM}/liberty`, center: CARAGUA, zoom: 15.2, pitch: 62, bearing: -20, interactive: false }}
          setup={spin}
        />
        <div className="veil" />
        <div className="content">
          <Kicker>Tutorial · Mapas open source</Kicker>
          <h1>MapLibre<br />na Prática</h1>
          <p>Do zero a um app de mapas para <b>Android, iOS e Web</b> — sem API key e sem pagar por mapa carregado.</p>
          <div className="meta">
            <span><Blocks /> Expo SDK 58</span>
            <span><Atom /> React Native 0.88</span>
            <span><Smartphone /> MapLibre React Native 11</span>
            <span><Globe /> MapLibre GL JS</span>
          </div>
        </div>
      </>
    ),
  },
  {
    section: "O que é",
    variant: "section",
    notes: "Transição para a parte conceitual.",
    Body: () => (
      <>
        <div className="num">01</div>
        <img className="section-logo" src={logo} alt="MapLibre" />
        <h2>O que é o MapLibre?</h2>
        <p>Uma família de bibliotecas open source para desenhar mapas interativos — no navegador e em apps nativos.</p>
      </>
    ),
  },
  {
    section: "O que é",
    notes: "Por ser um fork, quem conhece Mapbox reconhece quase toda a API. O mesmo JSON de estilo em todas as plataformas é o que permite nosso app compartilhar a lista de mapas entre web e celular.",
    Body: () => (
      <>
        <Kicker Icon={GitFork}>História</Kicker>
        <h2>Nasceu de um fork em 2020</h2>
        <div className="flow center" style={{ marginBottom: "2rem" }}>
          <div className="step"><IconBox Icon={Package} size="sm" /><b>Mapbox GL JS v1</b>Biblioteca open source (BSD), muito popular na web</div>
          <div className="arrow"><ArrowRight /></div>
          <div className="step"><IconBox Icon={Scale} size="sm" tone="amber" /><b>Dez/2020</b>A v2 passa a ter licença proprietária e exige conta Mapbox</div>
          <div className="arrow"><ArrowRight /></div>
          <div className="step"><IconBox Icon={GitFork} size="sm" tone="teal" /><b>Fork da v1.13</b>A comunidade cria o <b>MapLibre</b> para manter o código livre</div>
          <div className="arrow"><ArrowRight /></div>
          <div className="step"><IconBox Icon={Rocket} size="sm" tone="violet" /><b>Hoje</b>Projeto independente, com governança aberta e patrocínio de várias empresas</div>
        </div>
        <div className="cols-2">
          <ul className="clean">
            <li>O mesmo aconteceu com o <b>Mapbox GL Native</b> → <b>MapLibre Native</b> (Android, iOS, desktop).</li>
            <li>Desde então evoluiu muito: globo 3D, terreno, renderizadores Metal e Vulkan.</li>
          </ul>
          <ul className="clean">
            <li>Licença <b>BSD-3</b>: uso comercial liberado, sem royalties.</li>
            <li>Usa a <b>MapLibre Style Spec</b>: o mesmo JSON de estilo funciona em todas as plataformas.</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    section: "O que é",
    notes: "Não é que as outras sejam ruins — cada uma tem seu lugar. Google tem os melhores dados; react-native-maps é o caminho mais simples no RN, mas fica preso aos mapas da Apple/Google. O MapLibre junta motor vetorial moderno, licença livre e suporte a web + celular, com o custo de você escolher (ou hospedar) os dados.",
    Body: () => (
      <>
        <Kicker Icon={CircleHelp}>Motivação</Kicker>
        <h2>Por que MapLibre? Comparando as opções</h2>
        <table className="t compare">
          <thead>
            <tr><th>Biblioteca</th><th><WithIcon Icon={ThumbsUp}>Pontos fortes</WithIcon></th><th><WithIcon Icon={ThumbsDown}>Pontos fracos</WithIcon></th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Maps</td>
              <td>Dados e POIs mais completos, Street View, Places e rotas integrados</td>
              <td>Cobra por uso após a cota grátis, exige API key + cartão, estilização limitada, código fechado</td>
            </tr>
            <tr>
              <td>Mapbox GL</td>
              <td>Vetorial de alta qualidade, 3D e globo, editor de estilos (Studio), SDKs web e mobile</td>
              <td>Licença proprietária desde a v2, cobra por carregamento, exige token — aprisionamento ao fornecedor</td>
            </tr>
            <tr>
              <td>react-native-maps</td>
              <td>Fácil de usar no React Native / Expo, usa os mapas nativos do sistema</td>
              <td>Preso ao Google / Apple Maps (API key no Android), pouca customização</td>
            </tr>
            <tr className="hl">
              <td>MapLibre</td>
              <td>Open source (BSD), sem API key, vetorial na GPU, 3D/globo/terreno, mesmo estilo na web e no celular, dados de qualquer fonte</td>
              <td>Não traz dados próprios (tiles, busca, rotas): você escolhe ou hospeda; não roda no Expo Go</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    section: "O que é",
    notes: "Destaque os três que usamos: GL JS (web), Native (embaixo do RN) e o wrapper React Native. Martin é mencionado para quem quiser servir seus próprios dados.",
    Body: () => (
      <>
        <Kicker Icon={Layers}>Ecossistema</Kicker>
        <h2>Uma família de projetos</h2>
        <div className="cols-3">
          <Card Icon={Globe} title="MapLibre GL JS">Biblioteca TypeScript para navegadores. Renderiza com WebGL. Pacote <I>maplibre-gl</I>.</Card>
          <Card Icon={Smartphone} tone="teal" title="MapLibre Native">Motor em C++ para Android, iOS, Linux, Windows e macOS. OpenGL, Vulkan e Metal.</Card>
          <Card Icon={Atom} tone="violet" title="MapLibre React Native">Componentes React sobre o Native. Pacote <I>@maplibre/maplibre-react-native</I>.</Card>
          <Card Icon={FileJson} tone="amber" title="Style Spec">Especificação do JSON de estilo: fontes, camadas, expressões. Compartilhada por todos.</Card>
          <Card Icon={Server} tone="ink" title="Martin">Servidor de tiles vetoriais (Rust) a partir de PostGIS, MBTiles e PMTiles.</Card>
          <Card Icon={Users} tone="rose" title="Comunidade">Plugins, wrappers para Flutter, Compose, SwiftUI e integrações com ferramentas GIS.</Card>
        </div>
        <Callout Icon={Sparkles} className="mt">
          Neste projeto usamos <b>React Native (Expo)</b> no celular e <b>GL JS</b> no navegador — duas portas de entrada para o mesmo motor de estilos.
        </Callout>
      </>
    ),
  },
];

