import { CodeBlock } from '../components/CodeBlock';
import { PhoneFrame } from '../components/PhoneFrame';
import { SlideLayout } from '../components/SlideLayout';
import AppComTema from '../demos/paper/AppComTema';
import appComTemaSrc from '../demos/paper/AppComTema.tsx?raw';

const steps = [
  { n: 1, title: 'Importe', text: 'Componentes e temas vêm de "react-native-paper".' },
  { n: 2, title: 'Crie o tema', text: 'Espalhe MD3LightTheme e troque só as cores necessárias.' },
  { n: 3, title: 'Envolva o app', text: 'PaperProvider na raiz entrega o tema e o Portal.' },
  { n: 4, title: 'Tema escuro', text: 'Troque o objeto: MD3DarkTheme. Os componentes se adaptam.' },
];

export default function Slide09Setup() {
  return (
    <SlideLayout title="Configuração inicial com PaperProvider" lead="O provider é o único ponto de configuração obrigatório.">
      <div className="setup">
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.n} className="card step">
              <span className="step__n">{s.n}</span>
              <div>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <CodeBlock
          size="sm"
          className="setup__code"
          files={[{ name: 'App.tsx', code: appComTemaSrc, highlight: /PaperProvider|MD3(Light|Dark)Theme|primary|roundness/ }]}
        />
        <PhoneFrame label="App com tema">
          <AppComTema />
        </PhoneFrame>
      </div>
    </SlideLayout>
  );
}
