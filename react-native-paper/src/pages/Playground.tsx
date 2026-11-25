import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { ArrowLeft, Bell, Compass, FormInput, LayoutList, MousePointerClick, Palette, SlidersHorizontal, Moon, Sun } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { CodeBlock, type CodeFile } from '../components/CodeBlock';
import { PhoneFrame } from '../components/PhoneFrame';
import { useKeyboard } from '../hooks/useKeyboard';
import BotoesDemo from '../demos/paper/BotoesDemo';
import botoesSrc from '../demos/paper/BotoesDemo.tsx?raw';
import FeedbackDemo from '../demos/paper/FeedbackDemo';
import feedbackSrc from '../demos/paper/FeedbackDemo.tsx?raw';
import FormularioDemo from '../demos/paper/FormularioDemo';
import formularioSrc from '../demos/paper/FormularioDemo.tsx?raw';
import ListasDemo from '../demos/paper/ListasDemo';
import listasSrc from '../demos/paper/ListasDemo.tsx?raw';
import NavegacaoDemo from '../demos/paper/NavegacaoDemo';
import navegacaoSrc from '../demos/paper/NavegacaoDemo.tsx?raw';
import TemaDemo from '../demos/paper/TemaDemo';
import temaDemoSrc from '../demos/paper/TemaDemo.tsx?raw';
import temasSrc from '../demos/paper/temas.ts?raw';
import { getTheme, type ThemeMode } from '../theme/paperThemes';
import { ButtonBuilder } from './ButtonBuilder';

interface DemoTab {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  Demo?: ComponentType;
  files?: CodeFile[];
  ownTheme?: boolean;
}

const TABS: DemoTab[] = [
  { id: 'builder', label: 'Construtor de Button', icon: SlidersHorizontal, description: 'Mude as props e veja o componente e o código mudarem juntos.' },
  { id: 'botoes', label: 'Botões', icon: MousePointerClick, description: 'Variantes de Button, IconButton, SegmentedButtons e FAB.', Demo: BotoesDemo, files: [{ name: 'BotoesDemo.tsx', code: botoesSrc }] },
  { id: 'formulario', label: 'Formulário', icon: FormInput, description: 'TextInput, HelperText, Searchbar, Chip, RadioButton, Switch e Checkbox.', Demo: FormularioDemo, files: [{ name: 'FormularioDemo.tsx', code: formularioSrc }] },
  { id: 'listas', label: 'Cards e listas', icon: LayoutList, description: 'Card, List, Avatar, Badge, Divider e DataTable.', Demo: ListasDemo, files: [{ name: 'ListasDemo.tsx', code: listasSrc }] },
  { id: 'navegacao', label: 'Navegação', icon: Compass, description: 'Appbar, Menu, BottomNavigation e itens de Drawer.', Demo: NavegacaoDemo, files: [{ name: 'NavegacaoDemo.tsx', code: navegacaoSrc }] },
  { id: 'feedback', label: 'Feedback', icon: Bell, description: 'Dialog (com Portal), Snackbar, Banner e ProgressBar.', Demo: FeedbackDemo, files: [{ name: 'FeedbackDemo.tsx', code: feedbackSrc }] },
  {
    id: 'tema',
    label: 'Tema',
    icon: Palette,
    description: 'Este exemplo tem o próprio PaperProvider: use o Switch e as paletas dentro do celular.',
    Demo: TemaDemo,
    ownTheme: true,
    files: [
      { name: 'TemaDemo.tsx', code: temaDemoSrc },
      { name: 'temas.ts', language: 'ts', code: temasSrc },
    ],
  },
];

interface Props {
  tab?: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
}

export function Playground({ tab, onTabChange, onBack }: Props) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];
  const theme = getTheme(mode);

  useKeyboard({ Escape: onBack, b: onBack });

  return (
    <div className="shell shell--playground">
      <header className="topbar">
        <div className="brand">
          <BrandMark />
          <span className="brand__name">Playground</span>
          <span className="brand__section">React Native Paper ao vivo</span>
        </div>
        <nav className="topbar__actions">
          <div className="seg" role="group" aria-label="Tema dos exemplos">
            <button type="button" className={mode === 'light' ? 'is-active' : ''} onClick={() => setMode('light')}>
              <Sun size={14} aria-hidden /> Claro
            </button>
            <button type="button" className={mode === 'dark' ? 'is-active' : ''} onClick={() => setMode('dark')}>
              <Moon size={14} aria-hidden /> Escuro
            </button>
          </div>
          <button type="button" className="tb-btn tb-btn--accent" onClick={onBack} title="Voltar aos slides (Esc)">
            <ArrowLeft size={16} aria-hidden /> <span>Voltar aos slides</span>
          </button>
        </nav>
      </header>

      <div className="pg">
        <nav className="pg-nav" aria-label="Exemplos">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`pg-nav__item ${t.id === current.id ? 'is-active' : ''}`}
              onClick={() => onTabChange(t.id)}
              aria-current={t.id === current.id ? 'page' : undefined}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        <main className="pg-main" key={current.id}>
          <header className="pg-main__header">
            <h1>{current.label}</h1>
            <p>
              {current.description}
              {current.ownTheme && mode === 'dark' && <em> (o seletor Claro/Escuro do topo não afeta este exemplo)</em>}
            </p>
          </header>
          {current.id === 'builder' ? (
            <ButtonBuilder theme={theme} />
          ) : (
            current.Demo &&
            current.files && (
              <div className="pg-demo">
                <PhoneFrame theme={theme} label={current.label}>
                  <current.Demo />
                </PhoneFrame>
                <CodeBlock files={current.files} className="pg-code" />
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
