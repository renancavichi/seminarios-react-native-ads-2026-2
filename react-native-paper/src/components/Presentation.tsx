import { useState } from 'react';
import { ChevronLeft, ChevronRight, FlaskConical, ListTree, Maximize, Minimize } from 'lucide-react';
import { useFullscreen } from '../hooks/useFullscreen';
import { useKeyboard } from '../hooks/useKeyboard';
import type { SlideDef } from '../slides';
import { BrandMark } from './BrandMark';
import { ErrorBoundary } from './ErrorBoundary';
import { SlideContext } from './SlideLayout';
import { TableOfContents } from './TableOfContents';

interface Props {
  slides: SlideDef[];
  index: number;
  onNavigate: (index: number) => void;
  onPlayground: () => void;
}

export function Presentation({ slides, index, onNavigate, onPlayground }: Props) {
  const [tocOpen, setTocOpen] = useState(false);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
  const total = slides.length;
  const slide = slides[index];

  const go = (next: number) => onNavigate(Math.min(Math.max(next, 0), total - 1));
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  useKeyboard(
    tocOpen
      ? { Escape: () => setTocOpen(false), t: () => setTocOpen(false) }
      : {
          ArrowRight: next,
          ArrowLeft: prev,
          PageDown: next,
          PageUp: prev,
          Home: () => go(0),
          End: () => go(total - 1),
          f: toggleFullscreen,
          t: () => setTocOpen(true),
          p: onPlayground,
        },
  );

  const progress = ((index + 1) / total) * 100;

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <BrandMark />
          <span className="brand__name">React Native Paper</span>
          <span className="brand__section">{slide.section}</span>
        </div>
        <nav className="topbar__actions" aria-label="Ações da apresentação">
          <button type="button" className="tb-btn" onClick={() => setTocOpen(true)} title="Sumário (T)">
            <ListTree size={16} aria-hidden /> <span>Sumário</span>
          </button>
          <button type="button" className="tb-btn tb-btn--accent" onClick={onPlayground} title="Playground (P)">
            <FlaskConical size={16} aria-hidden /> <span>Playground</span>
          </button>
          <button
            type="button"
            className="tb-btn"
            onClick={toggleFullscreen}
            title="Tela cheia (F)"
            aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? <Minimize size={16} aria-hidden /> : <Maximize size={16} aria-hidden />}
          </button>
        </nav>
      </header>

      <main className="stage-wrap">
        <div className="stage" aria-roledescription="slide" aria-label={`Slide ${index + 1} de ${total}: ${slide.title}`}>
          <SlideContext.Provider value={{ index, total, section: slide.section }}>
            <ErrorBoundary key={slide.id} label={`o slide “${slide.title}”`}>
              <div className="stage__inner" key={slide.id}>
                <slide.Component />
              </div>
            </ErrorBoundary>
          </SlideContext.Provider>
        </div>
      </main>

      <footer className="bottombar">
        <div className="pager">
          <button type="button" className="nav-btn" onClick={prev} disabled={index === 0} aria-label="Slide anterior">
            <ChevronLeft size={20} />
          </button>
          <span className="pager__count" aria-live="polite">
            <strong>{String(index + 1).padStart(2, '0')}</strong> / {String(total).padStart(2, '0')}
          </span>
          <button type="button" className="nav-btn" onClick={next} disabled={index === total - 1} aria-label="Próximo slide">
            <ChevronRight size={20} />
          </button>
        </div>
        <span className="bottombar__title">{slide.title}</span>
        <div className="shortcuts" aria-label="Atalhos de teclado">
          <span>
            <kbd className="kbd">←</kbd>
            <kbd className="kbd">→</kbd> navegar
          </span>
          <span>
            <kbd className="kbd">T</kbd> sumário
          </span>
          <span>
            <kbd className="kbd">P</kbd> playground
          </span>
          <span>
            <kbd className="kbd">F</kbd> tela cheia
          </span>
        </div>
        <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </footer>

      {tocOpen && (
        <TableOfContents
          slides={slides}
          current={index}
          onSelect={(i) => {
            setTocOpen(false);
            go(i);
          }}
          onPlayground={onPlayground}
          onClose={() => setTocOpen(false)}
        />
      )}
    </div>
  );
}
