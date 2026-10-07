/**
 * Datasets do deck.
 *
 * Regra: nada de Math.random() em tempo de apresentação. Você quer
 * exatamente o mesmo gráfico que ensaiou. Onde há "atualizar dados", a
 * variação vem de listas pré-calculadas.
 */

export type PontoMensal = { mes: string; vendas: number; meta: number };

export const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export const VENDAS_2026: PontoMensal[] = [
  { mes: "Jan", vendas: 42, meta: 40 },
  { mes: "Fev", vendas: 38, meta: 40 },
  { mes: "Mar", vendas: 55, meta: 45 },
  { mes: "Abr", vendas: 61, meta: 50 },
  { mes: "Mai", vendas: 48, meta: 50 },
  { mes: "Jun", vendas: 72, meta: 55 },
  { mes: "Jul", vendas: 85, meta: 60 },
  { mes: "Ago", vendas: 78, meta: 65 },
  { mes: "Set", vendas: 91, meta: 70 },
  { mes: "Out", vendas: 87, meta: 75 },
  { mes: "Nov", vendas: 104, meta: 80 },
  { mes: "Dez", vendas: 96, meta: 85 },
];

/** Série longa: sustenta o argumento de escala do slide 14. */
export const SERIE_GRANDE = Array.from({ length: 2000 }, (_, i) => ({
  x: i,
  y: 50 + 28 * Math.sin(i / 55) + 12 * Math.sin(i / 9) + 6 * Math.cos(i / 3),
}));

/** Série curta para sparkline, na faixa inferior da vitrine. */
export const SPARK = Array.from({ length: 160 }, (_, i) => ({
  x: i,
  y: 50 + 22 * Math.sin(i / 11) + 9 * Math.cos(i / 4),
}));

/**
 * Variações de 12 pontos. Todas com o mesmo tamanho — requisito do Skia
 * para interpolar caminhos, que é exatamente o assunto do slide 15.
 */
export const VARIACOES: number[][] = [
  [42, 38, 55, 61, 48, 72, 85, 78, 91, 87, 104, 96],
  [60, 72, 45, 50, 88, 64, 40, 95, 58, 70, 62, 110],
  [90, 84, 96, 70, 55, 48, 66, 74, 82, 100, 45, 52],
  [30, 45, 62, 80, 95, 88, 70, 52, 44, 58, 76, 92],
];

/** Séries de 14 pontos que se alternam ao fundo da capa. */
export const CAPA_SERIES: number[][] = [
  [30, 42, 38, 55, 61, 48, 72, 85, 78, 91, 87, 104, 96, 110],
  [70, 58, 66, 80, 74, 92, 85, 60, 72, 88, 96, 82, 105, 94],
  [50, 62, 74, 68, 55, 70, 88, 96, 84, 72, 90, 100, 88, 102],
];

export const capaData = (indice: number) =>
  CAPA_SERIES[indice % CAPA_SERIES.length].map((y, i) => ({ x: i, y }));

/** Trimestres para o gráfico de barras da vitrine. */
export const TRIMESTRES: { periodo: string; receita: number }[][] = [
  [
    { periodo: "T1", receita: 128 },
    { periodo: "T2", receita: 164 },
    { periodo: "T3", receita: 142 },
    { periodo: "T4", receita: 198 },
  ],
  [
    { periodo: "T1", receita: 175 },
    { periodo: "T2", receita: 132 },
    { periodo: "T3", receita: 188 },
    { periodo: "T4", receita: 150 },
  ],
  [
    { periodo: "T1", receita: 96 },
    { periodo: "T2", receita: 148 },
    { periodo: "T3", receita: 172 },
    { periodo: "T4", receita: 210 },
  ],
];

/** Composição para a rosca. As cores entram no slide, não aqui. */
export const CANAIS: { rotulo: string; valor: number }[][] = [
  [
    { rotulo: "Orgânico", valor: 38 },
    { rotulo: "Pago", valor: 26 },
    { rotulo: "Direto", valor: 19 },
    { rotulo: "Social", valor: 11 },
    { rotulo: "Outros", valor: 6 },
  ],
  [
    { rotulo: "Orgânico", valor: 29 },
    { rotulo: "Pago", valor: 33 },
    { rotulo: "Direto", valor: 15 },
    { rotulo: "Social", valor: 16 },
    { rotulo: "Outros", valor: 7 },
  ],
  [
    { rotulo: "Orgânico", valor: 44 },
    { rotulo: "Pago", valor: 18 },
    { rotulo: "Direto", valor: 22 },
    { rotulo: "Social", valor: 9 },
    { rotulo: "Outros", valor: 7 },
  ],
];

/** Deslocamento aplicado à linha principal da vitrine a cada atualização. */
export const vitrineLinha = (indice: number) =>
  VARIACOES[indice % VARIACOES.length].map((vendas, i) => ({
    mes: MESES[i],
    vendas,
  }));

export const vitrineSpark = (indice: number) =>
  SPARK.map(({ x, y }) => ({
    x,
    y: y + 14 * Math.sin((x + indice * 37) / 13),
  }));
