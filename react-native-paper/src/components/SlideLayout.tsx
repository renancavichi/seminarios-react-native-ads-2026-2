import { createContext, useContext, type ReactNode } from 'react';

export interface SlideMeta {
  index: number;
  total: number;
  section: string;
}

export const SlideContext = createContext<SlideMeta>({ index: 0, total: 0, section: '' });

interface SlideLayoutProps {
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Substitui o rótulo automático "NN · Seção". */
  kicker?: string;
}

/** Estrutura comum dos slides: rótulo, título, frase de apoio e corpo. */
export function SlideLayout({ title, lead, children, className = '', kicker }: SlideLayoutProps) {
  const meta = useContext(SlideContext);
  const label = kicker ?? `${String(meta.index + 1).padStart(2, '0')} · ${meta.section}`;
  return (
    <section className={`slide ${className}`}>
      <header className="slide__header">
        <p className="slide__kicker">{label}</p>
        <h1 className="slide__title">{title}</h1>
        {lead && <p className="slide__lead">{lead}</p>}
      </header>
      <div className="slide__body">{children}</div>
    </section>
  );
}
