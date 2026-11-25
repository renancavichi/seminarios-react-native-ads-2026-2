import { Accessibility, Copy, MousePointerClick, Palette, Shuffle } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { SlideLayout } from '../components/SlideLayout';
import { problems } from '../data/content';
import LoginBasico from '../demos/paper/LoginBasico';

const ICONS = { palette: Palette, copy: Copy, shuffle: Shuffle, pointer: MousePointerClick, accessibility: Accessibility };

const decisions = ['cor da borda', 'raio', 'padding', 'cor do foco', 'feedback de toque', 'fonte e peso', 'contraste', 'modo escuro'];

export default function Slide02Problem() {
  return (
    <SlideLayout
      title="O problema: só com os componentes básicos"
      lead={
        <>
          O React Native entrega <em>primitivas</em> (<code>View</code>, <code>Text</code>, <code>TextInput</code>,{' '}
          <code>Pressable</code>). Toda a aparência e o comportamento visual ficam com você.
        </>
      }
    >
      <div className="split split--problem">
        <ul className="problem-list">
          {problems.map((p) => {
            const Icon = ICONS[p.icon];
            return (
              <li key={p.title} className="card problem-list__item">
                <span className="icon-tile">
                  <Icon size={20} aria-hidden />
                </span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="problem-demo">
          <PhoneFrame label="login básico" caption={<span className="live-badge live-badge--neutral">Ao vivo · só React Native</span>}>
            <LoginBasico />
          </PhoneFrame>
          <div className="card decisions">
            <h3>Decisões manuais nesta tela simples</h3>
            <div className="decisions__tags">
              {decisions.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <p className="decisions__punch">Agora multiplique por 30 telas — e mantenha todas iguais.</p>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
