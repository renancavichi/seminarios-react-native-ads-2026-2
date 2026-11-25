import { useEffect, useRef, useState } from 'react';
import { Check, Copy, TriangleAlert } from 'lucide-react';

type Status = 'idle' | 'copied' | 'error';

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback para contextos sem Clipboard API (ex.: acesso pelo IP da rede local).
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) throw new Error('execCommand("copy") falhou');
}

const LABELS: Record<Status, string> = { idle: 'Copiar', copied: 'Copiado!', error: 'Erro ao copiar' };
const ICONS = { idle: Copy, copied: Check, error: TriangleAlert };

export function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleClick() {
    try {
      await copyText(text);
      setStatus('copied');
    } catch (error) {
      console.error('Não foi possível copiar o código:', error);
      setStatus('error');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('idle'), 1800);
  }

  const Icon = ICONS[status];
  return (
    <button type="button" className={`copy-btn copy-btn--${status}`} onClick={handleClick} aria-live="polite">
      <Icon size={14} aria-hidden />
      <span>{LABELS[status]}</span>
    </button>
  );
}
