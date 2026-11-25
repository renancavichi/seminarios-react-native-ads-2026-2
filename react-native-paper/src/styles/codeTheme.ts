import type { CSSProperties } from 'react';

/** Tema de sintaxe escuro, alinhado às cores da apresentação. */
export const codeTheme: Record<string, CSSProperties> = {
  'code[class*="language-"]': { color: '#d6d9f0', fontFamily: 'var(--mono)', lineHeight: 1.6, tabSize: 2 },
  'pre[class*="language-"]': { color: '#d6d9f0', fontFamily: 'var(--mono)', lineHeight: 1.6, overflow: 'visible' },
  comment: { color: '#6b7294', fontStyle: 'italic' },
  prolog: { color: '#6b7294' },
  punctuation: { color: '#8b93b8' },
  keyword: { color: '#c4a7ff' },
  'class-name': { color: '#7dd3fc' },
  function: { color: '#67e8f9' },
  tag: { color: '#f0abfc' },
  'attr-name': { color: '#93c5fd' },
  'attr-value': { color: '#86efac' },
  string: { color: '#86efac' },
  'template-string': { color: '#86efac' },
  number: { color: '#fcd34d' },
  boolean: { color: '#fcd34d' },
  constant: { color: '#fcd34d' },
  operator: { color: '#a5b4fc' },
  property: { color: '#bfdbfe' },
  builtin: { color: '#7dd3fc' },
  'maybe-class-name': { color: '#7dd3fc' },
  parameter: { color: '#e2e8f0' },
};
