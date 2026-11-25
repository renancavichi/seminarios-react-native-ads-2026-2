import { CodeBlock } from '../components/CodeBlock';
import { PhoneFrame } from '../components/PhoneFrame';
import { SlideLayout } from '../components/SlideLayout';
import TemaDemo from '../demos/paper/TemaDemo';
import temaDemoSrc from '../demos/paper/TemaDemo.tsx?raw';
import temasSrc from '../demos/paper/temas.ts?raw';

const points = [
  { title: 'Definição', text: 'Um objeto: { ...MD3LightTheme, colors, roundness, fonts }.' },
  { title: 'Personalizar cores', text: 'Sobrescreva tokens (primary, primaryContainer…). Gere a paleta no Material Theme Builder.' },
  { title: 'Consistência', text: 'Componentes leem o tema; telas próprias usam useTheme().colors.' },
  { title: 'Sem cor fixa', text: 'Nada de #6750A4 espalhado: trocar a marca = trocar um arquivo.' },
];

export default function Slide15Theme() {
  return (
    <SlideLayout title="Tema claro e escuro" lead="Alterne o tema e a paleta no celular: todos os componentes mudam juntos.">
      <div className="setup setup--theme">
        <ul className="theme-points">
          {points.map((p) => (
            <li key={p.title} className="card">
              <strong>{p.title}</strong>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
        <CodeBlock
          size="sm"
          className="setup__code"
          files={[
            { name: 'TemaDemo.tsx', code: temaDemoSrc, highlight: /PaperProvider|criarTema|tema\.colors/ },
            { name: 'temas.ts', language: 'ts', code: temasSrc, highlight: /MD3(Dark|Light)Theme|\.\.\.base/ },
          ]}
        />
        <PhoneFrame label="Tema">
          <TemaDemo />
        </PhoneFrame>
      </div>
    </SlideLayout>
  );
}
