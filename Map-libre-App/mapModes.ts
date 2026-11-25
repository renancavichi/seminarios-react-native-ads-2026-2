import type { StyleSpecification } from "@maplibre/maplibre-react-native";

export type MapMode = {
  id: string;
  label: string;
  icon: string;
  description: string;
  mapStyle: string | StyleSpecification;
  /** Inclinação/zoom aplicados ao selecionar (ex.: visão 3D) */
  pitch?: number;
  zoom?: number;
  dark?: boolean;
  /** Alternativa usada só na versão web (ex.: servidor de tiles sem CORS) */
  web?: { mapStyle: string | StyleSpecification; description: string };
};

const GLYPHS = "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";

/** Monta um estilo MapLibre a partir de uma ou mais camadas raster (tiles PNG/JPG). */
export function rasterStyle(
  layers: { id: string; tiles: string[]; attribution: string; maxzoom?: number; tileSize?: number }[],
): StyleSpecification {
  const sources: StyleSpecification["sources"] = {};
  for (const l of layers) {
    sources[l.id] = {
      type: "raster",
      tiles: l.tiles,
      tileSize: l.tileSize ?? 256,
      maxzoom: l.maxzoom ?? 19,
      attribution: l.attribution,
    };
  }
  return {
    version: 8,
    glyphs: GLYPHS,
    sources,
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#e8e8e8" } },
      ...layers.map((l) => ({ id: l.id, type: "raster" as const, source: l.id })),
    ],
  };
}

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const ESRI_ATTR = "© Esri, Maxar, Earthstar Geographics";
const OSM_ATTR = "© OpenStreetMap contributors";

export const MAP_MODES: MapMode[] = [
  {
    id: "streets",
    label: "Ruas e Lojas",
    icon: "🏪",
    description: "Mapa vetorial detalhado: ruas, números, lojas, restaurantes e POIs.",
    mapStyle: "https://tiles.openfreemap.org/styles/liberty",
  },
  {
    id: "satellite",
    label: "Satélite",
    icon: "🛰️",
    description: "Imagens de satélite com nomes de ruas e lugares por cima.",
    dark: true,
    mapStyle: rasterStyle([
      { id: "imagery", tiles: [`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`], attribution: ESRI_ATTR },
      { id: "roads", tiles: [`${ESRI}/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}`], attribution: ESRI_ATTR },
      { id: "labels", tiles: [`${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`], attribution: ESRI_ATTR },
    ]),
  },
  {
    id: "buildings3d",
    label: "Prédios 3D",
    icon: "🏙️",
    description: "Edifícios em 3D com a câmera inclinada. Arraste com 2 dedos para girar.",
    mapStyle: "https://tiles.openfreemap.org/styles/liberty",
    pitch: 60,
    zoom: 17,
  },
  {
    id: "minimal",
    label: "Minimalista",
    icon: "🤍",
    description: "Mapa limpo e claro, com poucos elementos — bom para se orientar rápido.",
    mapStyle: "https://tiles.openfreemap.org/styles/positron",
  },
  {
    id: "topo",
    label: "Topográfico",
    icon: "⛰️",
    description: "Curvas de nível, relevo e trilhas — ideal para natureza e trilhas.",
    mapStyle: rasterStyle([
      {
        id: "opentopo",
        tiles: ["a", "b", "c"].map((s) => `https://${s}.tile.opentopomap.org/{z}/{x}/{y}.png`),
        attribution: `${OSM_ATTR}, SRTM | © OpenTopoMap (CC-BY-SA)`,
        maxzoom: 17,
      },
    ]),
  },
  {
    id: "relief",
    label: "Relevo",
    icon: "🗻",
    description: "Sombreamento de relevo calculado a partir de dados de elevação.",
    mapStyle: {
      version: 8,
      glyphs: GLYPHS,
      sources: {
        dem: {
          type: "raster-dem",
          tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
          encoding: "terrarium",
          tileSize: 256,
          maxzoom: 15,
          attribution: "Elevação: Mapzen / AWS Terrain Tiles",
        },
        labels: {
          type: "raster",
          tiles: [`${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`],
          tileSize: 256,
          attribution: ESRI_ATTR,
        },
      },
      layers: [
        { id: "bg", type: "background", paint: { "background-color": "#f4f1ea" } },
        {
          id: "hillshade",
          type: "hillshade",
          source: "dem",
          paint: {
            "hillshade-exaggeration": 0.8,
            "hillshade-shadow-color": "#473B24",
            "hillshade-highlight-color": "#ffffff",
          },
        },
        { id: "labels", type: "raster", source: "labels" },
      ],
    },
  },
  {
    id: "explorer",
    label: "Explorador",
    icon: "🧭",
    description: "Estilo National Geographic: parques, reservas, relevo e nomes geográficos.",
    mapStyle: rasterStyle([
      {
        id: "natgeo",
        tiles: [`${ESRI}/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}`],
        attribution: "© Esri, National Geographic, Garmin, HERE",
        maxzoom: 16,
      },
    ]),
  },
  {
    id: "cycling",
    label: "Ciclismo",
    icon: "🚲",
    description: "Ciclovias, ciclofaixas, bicicletários e oficinas (CyclOSM).",
    mapStyle: rasterStyle([
      {
        id: "cyclosm",
        tiles: ["a", "b", "c"].map((s) => `https://${s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png`),
        attribution: `${OSM_ATTR} | CyclOSM`,
        maxzoom: 20,
      },
    ]),
  },
  {
    id: "transit",
    label: "Transporte",
    icon: "🚌",
    description: "Linhas de ônibus, metrô, trem e paradas (ÖPNVKarte).",
    // O servidor ÖPNVKarte não envia cabeçalho CORS, então o navegador bloqueia os tiles.
    web: {
      mapStyle: "https://tiles.openfreemap.org/styles/liberty",
      description: "Na web: estações, paradas e linhas de trem/metrô (o mapa ÖPNVKarte só funciona no app).",
    },
    mapStyle: rasterStyle([
      {
        id: "opnv",
        tiles: ["https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"],
        attribution: `${OSM_ATTR} | © MeMoMaps`,
        maxzoom: 18,
      },
    ]),
  },
  {
    id: "railway",
    label: "Ferrovias",
    icon: "🚆",
    description: "Trilhos de trem e metrô, estações e linhas ferroviárias (OpenRailwayMap).",
    mapStyle: rasterStyle([
      {
        id: "gray",
        tiles: [`${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`],
        attribution: "© Esri, HERE, Garmin",
        maxzoom: 16,
      },
      {
        id: "orm",
        tiles: ["a", "b", "c"].map((s) => `https://${s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png`),
        attribution: `${OSM_ATTR} | © OpenRailwayMap (CC-BY-SA)`,
        maxzoom: 19,
      },
    ]),
  },
  {
    id: "nautical",
    label: "Náutico",
    icon: "⚓",
    description: "Profundidade do oceano, boias, faróis e sinalização marítima (OpenSeaMap).",
    mapStyle: rasterStyle([
      { id: "ocean", tiles: [`${ESRI}/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}`], attribution: "© Esri, GEBCO, NOAA", maxzoom: 16 },
      { id: "oceanref", tiles: [`${ESRI}/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}`], attribution: "© Esri", maxzoom: 16 },
      { id: "seamarks", tiles: ["https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"], attribution: "© OpenSeaMap", maxzoom: 18 },
    ]),
  },
  {
    id: "humanitarian",
    label: "Serviços",
    icon: "🏥",
    description: "Estilo humanitário: destaca hospitais, escolas, água e serviços essenciais.",
    mapStyle: rasterStyle([
      {
        id: "hot",
        tiles: ["a", "b"].map((s) => `https://${s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png`),
        attribution: `${OSM_ATTR} | HOT / OSM France`,
        maxzoom: 20,
      },
    ]),
  },
  {
    id: "night",
    label: "Noturno",
    icon: "🌙",
    description: "Mapa escuro para uso à noite (menos brilho na tela).",
    mapStyle: "https://tiles.openfreemap.org/styles/dark",
    dark: true,
  },
];
