import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, CircleHelp, Maximize, NotebookPen } from "lucide-react";
import { CodeModeContext, type CodeMode } from "../components/Code";

export type SlideDef = {
  section: string;
  notes?: ReactNode;
  variant?: "cover" | "section";
  Body: () => ReactNode;
};

const fromHash = (total: number) => {
  const n = parseInt(location.hash.slice(1), 10);
  return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), total - 1) : 0;
};

export function Deck({ slides }: { slides: SlideDef[] }) {
  const [index, setIndex] = useState(() => fromHash(slides.length));
  const [mode, setMode] = useState<CodeMode>("app");
  const [showNotes, setShowNotes] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const go = useCallback(
    (i: number) => setIndex(Math.min(Math.max(i, 0), slides.length - 1)),
    [slides.length],
  );

  // URL guarda o slide atual (#27)
  useEffect(() => {
    history.replaceState(null, "", `#${index + 1}`);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
      const k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); go(index + 1); }
      else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); go(index - 1); }
      else if (k === "Home") go(0);
      else if (k === "End") go(slides.length - 1);
      else if (k === "n" || k === "N") setShowNotes((v) => !v);
      else if (k === "f" || k === "F") toggleFullscreen();
      else if (k === "a" || k === "A") setMode("app");
      else if (k === "w" || k === "W") setMode("web");
      else if (k === "?") setShowHelp((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, slides.length]);

  const slide = slides[index];

  return (
    <CodeModeContext.Provider value={{ mode, setMode }}>
      <div className="deck">
        <section key={index} className={`slide ${slide.variant ?? ""}`}>
          <slide.Body />
        </section>

        {showNotes && (
          <div className="notes-panel">
            <b><NotebookPen /> Notas · slide {index + 1}</b>
            {slide.notes ?? "—"}
          </div>
        )}

        {showHelp && (
          <div className="help">
            <div><kbd>←</kbd> <kbd>→</kbd> / <kbd>Espaço</kbd> navegar</div>
            <div><kbd>N</kbd> notas do apresentador</div>
            <div><kbd>F</kbd> tela cheia</div>
            <div><kbd>A</kbd> / <kbd>W</kbd> código App / Web</div>
            <div><kbd>Home</kbd> / <kbd>End</kbd> início / fim</div>
          </div>
        )}

        <div className="footer">
          <span className="sec">{slide.section}</span>
          <button onClick={() => go(index - 1)} title="Anterior"><ChevronLeft /></button>
          <div className="bar"><i style={{ width: `${((index + 1) / slides.length) * 100}%` }} /></div>
          <button onClick={() => go(index + 1)} title="Próximo"><ChevronRight /></button>
          <span>{index + 1} / {slides.length}</span>
          <button className={showNotes ? "on" : ""} onClick={() => setShowNotes((v) => !v)} title="Notas (N)"><NotebookPen /></button>
          <button onClick={toggleFullscreen} title="Tela cheia (F)"><Maximize /></button>
          <button className={showHelp ? "on" : ""} onClick={() => setShowHelp((v) => !v)} title="Atalhos (?)"><CircleHelp /></button>
        </div>
      </div>
    </CodeModeContext.Provider>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen();
}
