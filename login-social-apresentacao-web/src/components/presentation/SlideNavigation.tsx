import {
  ArrowLeft,
  ArrowRight,
  Expand,
  Grid2X2,
  HelpCircle,
  NotebookPen,
} from "lucide-react";
export function SlideNavigation({
  index,
  step,
  maxStep,
  next,
  previous,
  notes,
  overview,
  help,
  fullscreen,
}: {
  index: number;
  step: number;
  maxStep: number;
  next: () => void;
  previous: () => void;
  notes: () => void;
  overview: () => void;
  help: () => void;
  fullscreen: () => void;
}) {
  return (
    <footer className="navigation">
      <div className="nav-brand">
        <FingerprintMark /> <span>LOGIN SOCIAL</span>
        <i />
        <span>HYAN FERREIRA</span>
      </div>
      <div className="nav-tools">
        <button
          aria-label="Índice de slides (G)"
          title="Índice de slides · G"
          onClick={overview}
        >
          <Grid2X2 />
        </button>
        <button
          aria-label="Notas do apresentador (N)"
          title="Notas · N"
          onClick={notes}
        >
          <NotebookPen />
        </button>
        <button
          aria-label="Atalhos de teclado (?)"
          title="Atalhos · ?"
          onClick={help}
        >
          <HelpCircle />
        </button>
        <button
          aria-label="Alternar tela cheia (F)"
          title="Tela cheia · F"
          onClick={fullscreen}
        >
          <Expand />
        </button>
      </div>
      <div className="nav-controls">
        <span className="internal-count">
          {maxStep > 0 ? `${step + 1} de ${maxStep + 1} etapas` : ""}
        </span>
        <button
          onClick={previous}
          disabled={index === 0 && step === 0}
          aria-label="Anterior"
        >
          <ArrowLeft />
        </button>
        <span className="slide-count">
          <strong>{String(index + 1).padStart(2, "0")}</strong>
          <span>/</span>17
        </span>
        <button onClick={next} disabled={index === 16} aria-label="Próximo">
          <ArrowRight />
        </button>
      </div>
    </footer>
  );
}
function FingerprintMark() {
  return <span className="nav-monogram">&lt;/&gt;</span>;
}
