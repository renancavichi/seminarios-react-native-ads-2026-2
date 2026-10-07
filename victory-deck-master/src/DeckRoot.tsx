import React from "react";
import { Deck, Slide } from "./components/Deck";
import { S01Capa } from "./slides/S01Capa";
import { S02Roteiro } from "./slides/S02Roteiro";
import { S03Dados } from "./slides/S03Dados";
import { S04PorQueDificil } from "./slides/S04PorQueDificil";
import { S05Custo } from "./slides/S05Custo";
import { S06Solucao } from "./slides/S06Solucao";
import { S07Vitrine } from "./slides/S07Vitrine";
import { S08Pilha } from "./slides/S08Pilha";
import { S09Anatomia } from "./slides/S09Anatomia";
import { S10MinimoViavel } from "./slides/S10MinimoViavel";
import { S11Tipos } from "./slides/S11Tipos";
import { S12Eixos } from "./slides/S12Eixos";
import { S13Interacao } from "./slides/S13Interacao";
import { S14Escala } from "./slides/S14Escala";
import { S15Animacao } from "./slides/S15Animacao";
import { S16QuandoUsar } from "./slides/S16QuandoUsar";
import { S17Conclusao } from "./slides/S17Conclusao";

const P1 = "01 · O problema";
const P2 = "02 · A solução";
const P3 = "03 · Como funciona";
const P4 = "04 · Na prática";

const SLIDES: Slide[] = [
  { id: "s01", tag: "Capa", render: () => <S01Capa /> },
  { id: "s02", tag: "Roteiro", render: () => <S02Roteiro /> },

  { id: "s03", section: P1, tag: "Dados em todo lugar", render: () => <S03Dados /> },
  { id: "s04", section: P1, tag: "Por que é difícil", render: () => <S04PorQueDificil /> },
  { id: "s05", section: P1, tag: "O que isso custa", render: () => <S05Custo /> },

  { id: "s06", section: P2, tag: "Victory Native", render: () => <S06Solucao /> },
  {
    id: "s07",
    section: P2,
    tag: "O que dá para fazer",
    render: () => <S07Vitrine />,
    locksGestures: true,
  },

  { id: "s08", section: P3, tag: "A pilha", render: () => <S08Pilha /> },
  { id: "s09", section: P3, tag: "Anatomia", render: () => <S09Anatomia /> },
  { id: "s10", section: P3, tag: "O mínimo viável", render: () => <S10MinimoViavel /> },
  { id: "s11", section: P3, tag: "Tipos de gráfico", render: () => <S11Tipos /> },
  { id: "s12", section: P3, tag: "Eixos", render: () => <S12Eixos /> },

  {
    id: "s13",
    section: P4,
    tag: "Interação",
    render: () => <S13Interacao />,
    locksGestures: true,
  },
  {
    id: "s14",
    section: P4,
    tag: "Escala",
    render: () => <S14Escala />,
    locksGestures: true,
  },
  { id: "s15", section: P4, tag: "Animação", render: () => <S15Animacao /> },

  { id: "s16", tag: "Quando usar", render: () => <S16QuandoUsar /> },
  { id: "s17", tag: "Conclusão", render: () => <S17Conclusao /> },
];

/**
 * Sem props de propósito: no navegador o WithSkiaWeb carrega este módulo
 * de forma preguiçosa e renderiza o default export sem passar nada.
 */
export default function DeckRoot() {
  return <Deck slides={SLIDES} />;
}
