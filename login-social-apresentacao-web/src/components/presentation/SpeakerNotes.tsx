import { useEffect, useRef } from "react";
import { Clock3, X } from "lucide-react";
import { formatTime, slides, totalSeconds } from "../../data/slides";
export function PresentationOverlay({
  kind,
  index,
  onClose,
  onGo,
}: {
  kind: "notes" | "index" | "help";
  index: number;
  onClose: () => void;
  onGo: (i: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);
  const slide = slides[index];
  return (
    <dialog
      ref={ref}
      className={`presentation-dialog ${kind}-dialog`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-content">
        <div className="dialog-header">
          <span className="eyebrow">
            {kind === "notes"
              ? "MODO APRESENTADOR"
              : kind === "index"
                ? "VISÃO GERAL"
                : "CONTROLES"}
          </span>
          <button onClick={onClose} aria-label="Fechar painel">
            <X />
          </button>
        </div>
        <h2 id="dialog-title">
          {kind === "notes"
            ? slide.title
            : kind === "index"
              ? "Escolha um slide."
              : "No seu ritmo."}
        </h2>
        {kind === "notes" ? (
          <>
            <div className="notes-meta">
              <span>
                <Clock3 size={16} />
                {formatTime(slide.time)} neste slide
              </span>
              <span>Slide {index + 1} / 17</span>
              <span>Total: {formatTime(totalSeconds)}</span>
            </div>
            <h3>O que falar</h3>
            {slide.notes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
            <div className="notes-question">
              <h3>Possível pergunta do professor</h3>
              <strong>{slide.question}</strong>
              <p>{slide.answer}</p>
            </div>
            <div className="notes-hint">
              ← → navegam pelas etapas e pelos slides · N ou Esc fecha as notas
            </div>
          </>
        ) : kind === "index" ? (
          <div className="slide-index">
            {slides.map((s, i) => (
              <button
                key={s.title}
                className={i === index ? "selected" : ""}
                onClick={() => {
                  onGo(i);
                  onClose();
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{s.title}</strong>
                <small>
                  {s.section} · {formatTime(s.time)}
                </small>
              </button>
            ))}
          </div>
        ) : (
          <div className="shortcut-list">
            {[
              ["→ / Espaço / PageDown", "Próxima etapa ou slide"],
              ["← / PageUp", "Etapa ou slide anterior"],
              ["Home / End", "Primeiro / último slide"],
              ["F", "Entrar ou sair da tela cheia"],
              ["N", "Notas do apresentador"],
              ["G", "Índice de slides"],
              ["? / H", "Esta lista de atalhos"],
              ["Esc", "Fechar painel / sair da tela cheia"],
              ["Deslizar para os lados", "Navegar pelo toque"],
            ].map(([key, text]) => (
              <div key={key}>
                <kbd>{key}</kbd>
                <span>{text}</span>
              </div>
            ))}
            <p>
              Os slides de fluxo e demonstração têm etapas internas. Ao voltar a
              um slide, a explicação começa novamente.
            </p>
          </div>
        )}
      </div>
    </dialog>
  );
}
