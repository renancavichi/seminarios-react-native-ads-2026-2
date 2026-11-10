import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { slides } from "./data/slides";
import { SlideContent } from "./slides/Slides";
import { usePresentation } from "./hooks/usePresentation";
import { SlideNavigation } from "./components/presentation/SlideNavigation";
import { SlideProgress } from "./components/presentation/SlideProgress";
import { PresentationOverlay } from "./components/presentation/SpeakerNotes";
function getViewport() {
  const width = window.innerWidth,
    height = window.innerHeight;
  const portrait = width / height < 0.85;
  const baseWidth = portrait ? 800 : 1600,
    baseHeight = portrait
      ? Math.max(1600, Math.round((height / width) * 800))
      : 900;
  return {
    portrait,
    width: baseWidth,
    height: baseHeight,
    scale: Math.min(width / baseWidth, height / baseHeight),
  };
}
export default function App() {
  const p = usePresentation();
  const [viewport, setViewport] = useState(getViewport);
  const touch = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const resize = () => setViewport(getViewport());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const s = slides[p.index];
  return (
    <MotionConfig reducedMotion="user">
      <div className="presentation-app">
        <div
          className={`presentation-stage ${viewport.portrait ? "portrait" : ""}`}
          style={{
            width: viewport.width,
            height: viewport.height,
            transform: `translate(-50%, -50%) scale(${viewport.scale})`,
          }}
        >
          <header className="presentation-header">
            <a
              className="header-brand"
              href="#slide-01"
              aria-label="Ir para a abertura"
            >
              <span className="brand-symbol">↗</span> login<span>social</span>
              <span className="header-divider" />
              <small>UMA INTRODUÇÃO À AUTENTICAÇÃO</small>
            </a>
            <div className="header-right">
              <span className="live-dot" />
              {p.index === 0
                ? "PROGRAMAÇÃO PARA DISPOSITIVOS MÓVEIS"
                : s.section.toUpperCase()}
            </div>
          </header>
          <main
            className={`slide slide-${p.index + 1}`}
            aria-label={`Slide ${p.index + 1}: ${s.title}`}
            onTouchStart={(e) => {
              if ((e.target as HTMLElement).closest("button,a,pre")) return;
              touch.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
              };
            }}
            onTouchEnd={(e) => {
              if (!touch.current) return;
              const dx = e.changedTouches[0].clientX - touch.current.x,
                dy = e.changedTouches[0].clientY - touch.current.y;
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
                if (dx < 0) p.next();
                else p.previous();
              }
              touch.current = null;
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.section
                key={p.index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
                className="slide-content"
              >
                {p.index !== 0 && p.index !== 16 && (
                  <div className="slide-heading">
                    <div className="eyebrow">
                      <span>{String(p.index + 1).padStart(2, "0")}</span> /{" "}
                      {s.section.toUpperCase()}
                    </div>
                    <h2>{s.title}</h2>
                  </div>
                )}
                <div className="slide-body">
                  <SlideContent
                    index={p.index}
                    step={p.step}
                    next={p.next}
                    restart={p.restart}
                  />
                </div>
              </motion.section>
            </AnimatePresence>
          </main>
          <SlideNavigation
            index={p.index}
            step={p.step}
            maxStep={p.maxStep}
            next={p.next}
            previous={p.previous}
            notes={() => p.setOverlay("notes")}
            overview={() => p.setOverlay("index")}
            help={() => p.setOverlay("help")}
            fullscreen={() => void p.fullscreen()}
          />
        </div>
        <SlideProgress index={p.index} />
        {p.overlay && (
          <PresentationOverlay
            kind={p.overlay}
            index={p.index}
            onClose={() => p.setOverlay(null)}
            onGo={p.go}
          />
        )}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Slide {p.index + 1} de 17: {s.title}
          {p.maxStep > 0 ? `. Etapa ${p.step + 1} de ${p.maxStep + 1}` : ""}
        </div>
        {p.message && (
          <div role="status" className="toast">
            {p.message}
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
