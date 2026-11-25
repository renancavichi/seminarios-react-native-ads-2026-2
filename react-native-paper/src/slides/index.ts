import type { ComponentType } from 'react';
import Slide01Cover from './Slide01Cover';
import Slide02Problem from './Slide02Problem';
import Slide03BeforeAfter from './Slide03BeforeAfter';
import Slide04WhatIs from './Slide04WhatIs';
import Slide05Features from './Slide05Features';
import Slide06Limitations from './Slide06Limitations';
import Slide07Comparison from './Slide07Comparison';
import Slide08Install from './Slide08Install';
import Slide09Setup from './Slide09Setup';
import Slide10Buttons from './Slide10Buttons';
import Slide11Inputs from './Slide11Inputs';
import Slide12Lists from './Slide12Lists';
import Slide13Navigation from './Slide13Navigation';
import Slide14Feedback from './Slide14Feedback';
import Slide15Theme from './Slide15Theme';
import Slide16Conclusion from './Slide16Conclusion';

export interface SlideDef {
  id: string;
  title: string;
  section: string;
  /** Tempo sugerido de fala, em minutos (total ≈ 20). */
  minutes: number;
  Component: ComponentType;
}

export const slides: SlideDef[] = [
  { id: 'capa', title: 'React Native Paper', section: 'Introdução', minutes: 0.5, Component: Slide01Cover },
  { id: 'problema', title: 'O problema', section: 'Introdução', minutes: 1, Component: Slide02Problem },
  { id: 'antes-depois', title: 'Antes e depois', section: 'Introdução', minutes: 2.5, Component: Slide03BeforeAfter },
  { id: 'o-que-e', title: 'O que é React Native Paper?', section: 'Conceitos', minutes: 1, Component: Slide04WhatIs },
  { id: 'recursos', title: 'Principais recursos', section: 'Conceitos', minutes: 1.5, Component: Slide05Features },
  { id: 'limitacoes', title: 'Limitações', section: 'Conceitos', minutes: 1, Component: Slide06Limitations },
  { id: 'comparacao', title: 'Comparação com alternativas', section: 'Conceitos', minutes: 1.5, Component: Slide07Comparison },
  { id: 'instalacao', title: 'Instalação', section: 'Primeiros passos', minutes: 1, Component: Slide08Install },
  { id: 'configuracao', title: 'Configuração inicial', section: 'Primeiros passos', minutes: 1.5, Component: Slide09Setup },
  { id: 'botoes', title: 'Botões e ações', section: 'Componentes', minutes: 1.5, Component: Slide10Buttons },
  { id: 'entradas', title: 'Entradas de dados', section: 'Componentes', minutes: 1.5, Component: Slide11Inputs },
  { id: 'listas', title: 'Cards e listas', section: 'Componentes', minutes: 1, Component: Slide12Lists },
  { id: 'navegacao', title: 'Navegação', section: 'Componentes', minutes: 1, Component: Slide13Navigation },
  { id: 'feedback', title: 'Diálogos e feedback', section: 'Componentes', minutes: 1.5, Component: Slide14Feedback },
  { id: 'tema', title: 'Tema claro e escuro', section: 'Tema e conclusão', minutes: 1, Component: Slide15Theme },
  { id: 'conclusao', title: 'Conclusão e referências', section: 'Tema e conclusão', minutes: 1, Component: Slide16Conclusion },
];
