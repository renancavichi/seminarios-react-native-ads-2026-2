import { useEffect, useRef } from 'react';
import { FlaskConical, X } from 'lucide-react';
import type { SlideDef } from '../slides';

interface Props {
  slides: SlideDef[];
  current: number;
  onSelect: (index: number) => void;
  onPlayground: () => void;
  onClose: () => void;
}

/** Sumário: navegação rápida por seção. */
export function TableOfContents({ slides, current, onSelect, onPlayground, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.querySelector<HTMLButtonElement>('.toc__item.is-current')?.focus();
  }, []);

  const sections = slides.reduce<{ name: string; items: { slide: SlideDef; index: number }[] }[]>((acc, slide, index) => {
    const last = acc[acc.length - 1];
    if (last?.name === slide.section) last.items.push({ slide, index });
    else acc.push({ name: slide.section, items: [{ slide, index }] });
    return acc;
  }, []);
  const totalMinutes = slides.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Sumário" onClick={onClose}>
      <div className="toc" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <header className="toc__header">
          <div>
            <h2>Sumário</h2>
            <p>
              {slides.length} slides · ~{Math.round(totalMinutes)} min
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar sumário">
            <X size={18} />
          </button>
        </header>
        <div className="toc__sections">
          {sections.map((section) => (
            <section key={section.name}>
              <h3>{section.name}</h3>
              <ul>
                {section.items.map(({ slide, index }) => (
                  <li key={slide.id}>
                    <button
                      type="button"
                      className={`toc__item ${index === current ? 'is-current' : ''}`}
                      onClick={() => onSelect(index)}
                    >
                      <span className="toc__num">{String(index + 1).padStart(2, '0')}</span>
                      <span className="toc__title">{slide.title}</span>
                      <span className="toc__min">{slide.minutes} min</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <button type="button" className="toc__playground" onClick={onPlayground}>
          <FlaskConical size={16} aria-hidden /> Abrir o Playground
        </button>
      </div>
    </div>
  );
}
