import { ArrowLeftRight, Ban, Download, FileCode2, Globe, MapPinned, Scale, Smartphone, Terminal, TriangleAlert } from "lucide-react";
import { CodePanel } from "../components/Code";
import { LiveMap } from "../components/LiveMap";
import { Callout, I, Kicker, WithIcon } from "../components/ui";
import type { SlideDef } from "../deck/Deck";
import { CARAGUA, OFM } from "../data/demos";

export const platformSlides: SlideDef[] = [
  {
    section: "Web × App",
    variant: "section",
    notes: "Agora a parte prática.",
    Body: () => (
      <>
        <div className="num">03</div>
        <h2>Web × App e instalação</h2>
        <p>Mesmo motor de estilos, duas formas de usar: imperativa no navegador e declarativa no React Native.</p>
      </>
    ),
  },
  {
    section: "Web × App",
    notes: "O ponto que mais pega na prática: o Expo Go não serve, precisa de dev build.",
    Body: () => (
      <>
        <Kicker Icon={Scale}>Comparativo</Kicker>
        <h2>Web × App: o que muda?</h2>
        <table className="t">
          <thead>
            <tr><th></th><th><WithIcon Icon={Globe}>Web — MapLibre GL JS</WithIcon></th><th><WithIcon Icon={Smartphone}>App — MapLibre React Native</WithIcon></th></tr>
          </thead>
          <tbody>
            <tr><td>Pacote</td><td><code>maplibre-gl</code></td><td><code>@maplibre/maplibre-react-native</code> → MapLibre Native (C++)</td></tr>
            <tr><td>Renderização</td><td>WebGL 2 no navegador</td><td>OpenGL ES ou Vulkan (Android) · Metal (iOS)</td></tr>
            <tr><td>Estilo de API</td><td>Imperativa: <code>new Map()</code>, <code>map.addLayer()</code>, <code>map.on()</code></td><td>Declarativa: <code>{"<Map>"}</code>, <code>{"<Camera>"}</code>, <code>{"<Layer>"}</code></td></tr>
            <tr><td>Instalação</td><td><code>npm</code> ou uma tag <code>{"<script>"}</code> da CDN</td><td>Código nativo → precisa de <b>development build</b>; não roda no Expo Go</td></tr>
            <tr><td>Localização</td><td><code>navigator.geolocation</code> + <code>GeolocateControl</code> (exige HTTPS)</td><td>GPS nativo: <code>expo-location</code> + <code>{"<UserLocation>"}</code></td></tr>
            <tr><td>Distribuição</td><td>Uma URL — atualiza na hora</td><td>APK / AAB / IPA via EAS e lojas</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    section: "Web × App",
    notes: "Mesmos parâmetros, filosofias diferentes. No app, o estado do React controla o mapa; na web, você manda comandos para um objeto.",
    Body: () => (
      <>
        <Kicker Icon={ArrowLeftRight}>Lado a lado</Kicker>
        <h2>O mesmo mapa nas duas APIs</h2>
        <div className="cols-2" style={{ flex: 1.4, minHeight: 0 }}>
          <CodePanel title="App — declarativo" icon={<Smartphone />} file="App.tsx" blocks={[{ lang: "typescript", code: `import { Map, Camera } from "@maplibre/maplibre-react-native";

export default function App() {
  return (
    <Map
      style={{ flex: 1 }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      compass                     // bússola
    >
      <Camera initialViewState={{
        center: [-45.411, -23.622],  // [lng, lat] — Caraguatatuba
        zoom: 14,
      }} />
    </Map>
  );
}` }]} />
          <CodePanel title="Web — imperativo" icon={<Globe />} file="App.web.tsx" blocks={[{ lang: "typescript", code: `import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const map = new maplibregl.Map({
  container: "map",            // <div id="map">
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [-45.411, -23.622],  // [lng, lat] — Caraguatatuba
  zoom: 14,
});

map.addControl(new maplibregl.NavigationControl()); // zoom + bússola` }]} />
        </div>
        <LiveMap
          badge={<><MapPinned /> Resultado ao vivo: o mesmo mapa nas duas APIs</>}
          options={{ style: `${OFM}/liberty`, center: CARAGUA, zoom: 14 }}
          style={{ flex: 1, marginTop: "1rem" }}
        />
        <Callout Icon={TriangleAlert} tone="teal" className="mt-s">
          Nos dois casos as coordenadas são <b>[longitude, latitude]</b> — a ordem do GeoJSON. Inverter é o erro nº 1 (o mapa vai parar no oceano).
        </Callout>
      </>
    ),
  },
  {
    section: "Web × App",
    notes: "A opção B é a forma mais rápida de testar. Estes slides usam a opção A (npm + Vite + React). No nosso projeto Expo, a web também usa a opção A dentro de App.web.tsx.",
    Body: () => (
      <>
        <Kicker Icon={Download}>Instalação · Web</Kicker>
        <h2>Na web: npm ou uma tag &lt;script&gt;</h2>
        <div className="cols-2" style={{ flex: 1.4, minHeight: 0 }}>
          <CodePanel title="Opção A — npm (com bundler)" icon={<Terminal />} blocks={[
            { lang: "bash", code: "npm install maplibre-gl" },
            { lang: "typescript", code: `import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/positron",
  center: [-45.411, -23.622], // Caraguatatuba
  zoom: 12,
});` },
          ]} />
          <CodePanel title="Opção B — CDN (HTML puro)" icon={<FileCode2 />} blocks={[{ lang: "xml", code: `<link rel="stylesheet"
  href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css">
<script
  src="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js">
</script>

<div id="map" style="height: 100vh"></div>

<script>
  new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [-45.411, -23.622], // Caraguatatuba
    zoom: 12,
  });
</script>` }]} />
        </div>
        <LiveMap
          badge={<><MapPinned /> Resultado ao vivo: o código acima rodando</>}
          options={{ style: `${OFM}/positron`, center: CARAGUA, zoom: 12 }}
          style={{ flex: 1, marginTop: "1rem" }}
        />
        <Callout Icon={TriangleAlert} tone="amber" className="mt-s">
          A <I>div</I> precisa ter altura definida, senão o mapa fica invisível.
        </Callout>
      </>
    ),
  },
  {
    section: "Web × App",
    notes: "O config plugin injeta a configuração nativa (Gradle, Podfile) durante o build — você nunca edita as pastas android/ios à mão. O npx expo install resolve versões compatíveis com o SDK.",
    Body: () => (
      <>
        <Kicker Icon={Smartphone}>Instalação · App (Expo)</Kicker>
        <h2>No app: Expo + config plugin</h2>
        <div className="cols-2 grow">
          <CodePanel title="Terminal" icon={<Terminal />} blocks={[{ lang: "bash", code: `# 1. Criar o projeto (TypeScript)
npx create-expo-app@latest meu-mapa \\
  --template blank-typescript
cd meu-mapa

# 2. Instalar com versões compatíveis com o SDK
npx expo install @maplibre/maplibre-react-native \\
  expo-location expo-dev-client

# 3. Gerar e instalar o app de desenvolvimento
npx eas-cli@latest build -p android \\
  --profile development

# 4. Rodar o servidor e abrir no celular
npx expo start` }]} />
          <CodePanel title="app.json" icon={<FileCode2 />} blocks={[{ lang: "json", code: `{
  "expo": {
    "android": {
      "package": "com.duda.maplibreapp",
      "permissions": [
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
    },
    "plugins": [
      "@maplibre/maplibre-react-native",
      ["expo-location", {
        "locationWhenInUsePermission":
          "Usamos sua localização para centralizar o mapa."
      }]
    ]
  }
}` }]} />
        </div>
        <Callout Icon={Ban} tone="rose" className="mt-s">
          <b>Expo Go não funciona</b>: o MapLibre traz código nativo. Use o <i>development build</i> (passo 3) ou gere o APK. A v11 exige a <b>Nova Arquitetura</b> do React Native (padrão no Expo SDK 52+).
        </Callout>
      </>
    ),
  },
];
