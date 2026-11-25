export type Item = {
  k: 'rect' | 'rrect' | 'ellipse' | 'img';
  x: number; y: number; w: number; h: number;
  r?: number; fill?: string | null; line?: { c: string; w: number } | null; src?: string;
  id?: string; live?: boolean;
};
export type Run = { t: string; c: string; b: boolean; m: boolean; s: number };
export type TextLine = { k: 'text'; x: number; y: number; runs: Run[]; id?: string; live?: boolean };
export type LiveKind = 'ex01' | 'controls' | 'position' | 'events' | 'fit' | 'react' | 'pip';
export type Slide = { n: number; items: Item[]; texts: TextLine[]; live?: LiveKind };
