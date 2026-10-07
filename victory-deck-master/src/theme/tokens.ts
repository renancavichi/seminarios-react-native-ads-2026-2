/**
 * Tokens de design do deck.
 *
 * Base cromática inspirada no site do Victory Native (Docusaurus dark).
 * ATENÇÃO: `accent` é a única cor que você deve conferir com conta-gotas
 * direto em nearform.com/open-source/victory-native/ e substituir aqui.
 * Todo o resto deriva dela.
 */

export const colors = {
  // superfícies, do fundo para a frente
  canvas: "#1B1B1D",
  surface: "#242526",
  surfaceRaised: "#2E2E31",

  border: "#3A3A3E",
  borderStrong: "#4A4A50",

  text: "#EDEDEF",
  textMuted: "#9B9BA2",
  textFaint: "#6E6E76",

  accent: "#FF6B4A", // ← trocar pelo hex exato do site
  accentSoft: "rgba(255, 107, 74, 0.14)",
  accentLine: "rgba(255, 107, 74, 0.45)",

  /**
   * Paleta de séries de dados. Não é decoração: é o que os gráficos
   * das telas 3 a 8 usam. Ordem fixa para que a mesma série tenha
   * sempre a mesma cor em todos os slides.
   */
  series: ["#FF6B4A", "#4CC2FF", "#FFC857", "#9B8CFA", "#3ECF8E"] as const,

  // usos específicos de gráfico
  grid: "rgba(255, 255, 255, 0.10)",
  axis: "rgba(255, 255, 255, 0.28)",
  axisLabel: "#9B9BA2",
} as const;

/**
 * Escala tipográfica calibrada para projetor, não para celular na mão.
 * A menor medida legível a 6 metros num telão 16:10 fica em torno de 15pt.
 */
export const type = {
  display: { fontSize: 46, lineHeight: 52, fontFamily: "Inter-SemiBold" },
  title: { fontSize: 30, lineHeight: 38, fontFamily: "Inter-SemiBold" },
  lead: { fontSize: 20, lineHeight: 30, fontFamily: "Inter-Regular" },
  body: { fontSize: 17, lineHeight: 26, fontFamily: "Inter-Regular" },
  label: { fontSize: 14, lineHeight: 18, fontFamily: "Inter-Medium" },
  code: { fontSize: 15, lineHeight: 24, fontFamily: "JetBrainsMono-Regular" },
  chartLabel: { fontSize: 13, fontFamily: "JetBrainsMono-Regular" },
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
} as const;

/**
 * Proporção das duas colunas em paisagem.
 * Coluna esquerda: fala e controles. Coluna direita: o gráfico.
 */
export const layout = {
  leftColumn: 0.38,
  rightColumn: 0.62,
  gutter: space.xl,
  pagePadding: space.xl,
  headerHeight: 56,
  footerHeight: 64,
} as const;

/**
 * Arquivos de fonte. O mesmo .ttf carregado aqui é reaproveitado
 * pelo `useFont` do Skia nos eixos dos gráficos — sem fonte, o
 * Victory Native não renderiza rótulo de eixo nenhum.
 */
export const fontAssets = {
  "Inter-Regular": require("../../assets/fonts/Inter-Regular.ttf"),
  "Inter-Medium": require("../../assets/fonts/Inter-Medium.ttf"),
  "Inter-SemiBold": require("../../assets/fonts/Inter-SemiBold.ttf"),
  "JetBrainsMono-Regular": require("../../assets/fonts/JetBrainsMono-Regular.ttf"),
};

export const chartFontFile = require("../../assets/fonts/JetBrainsMono-Regular.ttf");
