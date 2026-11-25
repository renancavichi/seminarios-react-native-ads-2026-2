import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';
import { PhoneFrame } from '../components/PhoneFrame';
import { SlideLayout } from '../components/SlideLayout';
import LoginBasico from '../demos/paper/LoginBasico';
import loginBasicoSrc from '../demos/paper/LoginBasico.tsx?raw';
import LoginPaper from '../demos/paper/LoginPaper';
import loginPaperSrc from '../demos/paper/LoginPaper.tsx?raw';
import { getTheme, type ThemeMode } from '../theme/paperThemes';

const countLines = (src: string) => src.trim().split('\n').length;

const takeaways = [
  { tone: 'good', title: 'Simplificado', text: 'Sumiram o StyleSheet de bordas/cores, o foco e o “pressionado”. (Nº de linhas varia caso a caso.)' },
  { tone: 'accent', title: 'Fornecido pela lib', text: 'Rótulo flutuante, borda de foco, ripple, cores e tipografia vindas do tema.' },
  { tone: 'warn', title: 'Ainda é com você', text: 'Layout da tela (padding, gap), validação, regras de negócio e textos.' },
  { tone: 'info', title: 'Manutenção', text: 'Mudou a cor da marca? Altera-se o tema uma vez, não cada tela.' },
];

export default function Slide03BeforeAfter() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const theme = getTheme(mode);

  return (
    <SlideLayout
      title="Antes e depois: a mesma tela de login"
      lead={
        <>
          Mesmos campos, mesmo comportamento. As linhas destacadas mostram onde cada versão gasta código.
        </>
      }
    >
      <div className="compare">
        <div className="compare__toolbar">
          <span>Teste as duas telas no tema escuro:</span>
          <div className="seg" role="group" aria-label="Tema das telas">
            <button type="button" className={mode === 'light' ? 'is-active' : ''} onClick={() => setMode('light')}>
              <Sun size={14} aria-hidden /> Claro
            </button>
            <button type="button" className={mode === 'dark' ? 'is-active' : ''} onClick={() => setMode('dark')}>
              <Moon size={14} aria-hidden /> Escuro
            </button>
          </div>
        </div>

        <div className="compare__cols">
          <div className="compare__col compare__col--before">
            <h2 className="compare__label">
              <span className="dot dot--bad" /> React Native puro
              <span className="compare__count">{countLines(loginBasicoSrc)} linhas</span>
            </h2>
            <div className="compare__pair">
              <CodeBlock
                size="sm"
                files={[{ name: 'LoginBasico.tsx', code: loginBasicoSrc, highlight: /style|[Ff]oco|pressed|#[0-9a-f]{6}/ }]}
              />
              <PhoneFrame
                size="sm"
                theme={theme}
                label="login básico"
                caption={<span className="live-badge live-badge--neutral">Ao vivo · só RN</span>}
              >
                <LoginBasico />
              </PhoneFrame>
            </div>
          </div>

          <div className="compare__col compare__col--after">
            <h2 className="compare__label">
              <span className="dot dot--good" /> React Native Paper
              <span className="compare__count">{countLines(loginPaperSrc)} linhas</span>
            </h2>
            <div className="compare__pair">
              <CodeBlock
                size="sm"
                files={[{ name: 'LoginPaper.tsx', code: loginPaperSrc, highlight: /mode=|variant=|useTheme|theme\.colors/ }]}
              />
              <PhoneFrame size="sm" theme={theme} label="login com Paper" caption={<span className="live-badge">Ao vivo · Paper</span>}>
                <LoginPaper />
              </PhoneFrame>
            </div>
          </div>
        </div>

        <ul className="takeaways">
          {takeaways.map((t) => (
            <li key={t.title} className={`card takeaway takeaway--${t.tone}`}>
              <strong>{t.title}</strong>
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </SlideLayout>
  );
}
