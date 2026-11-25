/** Converte segundos (o expo-audio trabalha em SEGUNDOS) em "m:ss". */
export function formatTime(seconds: number | undefined | null): string {
  if (!seconds || !Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
