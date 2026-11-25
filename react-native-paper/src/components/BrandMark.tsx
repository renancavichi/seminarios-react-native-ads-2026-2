/** Marca simples da apresentação (não é o logotipo oficial da biblioteca). */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="brand-mark">
      <defs>
        <linearGradient id="bm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#bm)" />
      <path d="M10 8h7.5a6 6 0 0 1 0 12H14v4h-4z" fill="#0b0d14" />
      <circle cx="17.5" cy="14" r="2.2" fill="#a78bfa" />
    </svg>
  );
}
