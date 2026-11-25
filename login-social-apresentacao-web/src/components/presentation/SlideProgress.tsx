export function SlideProgress({ index }: { index: number }) {
  return (
    <div
      className="slide-progress"
      role="progressbar"
      aria-label="Progresso da apresentação"
      aria-valuenow={index + 1}
      aria-valuemin={1}
      aria-valuemax={17}
    >
      <div style={{ width: `${((index + 1) / 17) * 100}%` }} />
    </div>
  );
}
