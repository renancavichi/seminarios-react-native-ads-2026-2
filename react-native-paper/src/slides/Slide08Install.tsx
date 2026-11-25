import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { CodeBlock, type CodeFile } from '../components/CodeBlock';
import { SlideLayout } from '../components/SlideLayout';
import { links } from '../data/links';
import viteConfigSrc from '../../vite.config.ts?raw';

type Target = 'expo' | 'cli' | 'web';

const tabs: { id: Target; label: string; notes: string[]; files: CodeFile[] }[] = [
  {
    id: 'expo',
    label: 'Expo',
    notes: [
      'Ícones já incluídos (@expo/vector-icons) — nada extra a instalar.',
      'O “expo install” escolhe versões compatíveis com o SDK do projeto.',
      'Se houver babel.config.js, ele deve usar babel-preset-expo.',
    ],
    files: [
      { name: 'terminal', language: 'bash', code: 'npx expo install react-native-paper react-native-safe-area-context' },
    ],
  },
  {
    id: 'cli',
    label: 'React Native CLI',
    notes: [
      'Instale o pacote de ícones Material Design Icons (usado internamente, ex.: Checkbox).',
      'No iOS, faça o link das partes nativas com pod-install.',
      'Siga o guia de setup de fontes do react-native-vector-icons.',
    ],
    files: [
      {
        name: 'terminal',
        language: 'bash',
        code: `npm install react-native-paper react-native-safe-area-context
npm install @react-native-vector-icons/material-design-icons

# somente iOS
npx pod-install`,
      },
    ],
  },
  {
    id: 'web',
    label: 'Web (este projeto)',
    notes: [
      'react-native-web traduz View/Text… para elementos HTML.',
      'O bundler (Vite) troca “react-native” por “react-native-web”.',
      'Ícones de fonte foram substituídos por SVG (@mdi/js).',
    ],
    files: [
      {
        name: 'terminal',
        language: 'bash',
        code: `npm install react-native-paper react-native-safe-area-context \\
  react-native-web react-dom @mdi/js`,
      },
      { name: 'vite.config.ts', language: 'ts', code: viteConfigSrc, highlight: /react-native-web|alias|\.web\.|__DEV__/ },
    ],
  },
];

const expoVsCli = [
  ['Comando', 'npx expo install', 'npm install'],
  ['Ícones', 'já incluídos', 'instalar + configurar fontes'],
  ['Parte nativa (iOS)', 'gerenciada pelo Expo', 'npx pod-install'],
];

const babelPlugin =`// babel.config.js (opcional) — reduz o bundle em produção
module.exports = {
  presets: ['babel-preset-expo'],
  env: { production: { plugins: ['react-native-paper/babel'] } },
};`;

export default function Slide08Install() {
  const [target, setTarget] = useState<Target>('expo');
  const tab = tabs.find((t) => t.id === target)!;

  return (
    <SlideLayout title="Instalação" lead="Duas dependências obrigatórias na v5: o próprio Paper e o react-native-safe-area-context.">
      <div className="split split--install">
        <div className="install__left">
          <div className="card prereq">
            <h3>Pré-requisitos</h3>
            <ul>
              <li>Node.js LTS e um projeto React Native (Expo ou CLI)</li>
              <li>
                Envolver o app com <code>PaperProvider</code> (próximo slide)
              </li>
              <li>Uma biblioteca de ícones Material Design</li>
            </ul>
          </div>
          <div className="card">
            <h3>Opcional: plugin Babel</h3>
            <CodeBlock size="sm" showLineNumbers={false} files={[{ name: 'babel.config.js', language: 'js', code: babelPlugin }]} />
          </div>
          <a className="link-card" href={links.gettingStarted} target="_blank" rel="noreferrer">
            <ExternalLink size={16} aria-hidden /> Guia oficial: Getting Started
          </a>
        </div>

        <div className="install__right">
          <div className="seg seg--lg" role="tablist" aria-label="Tipo de projeto">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === target}
                className={t.id === target ? 'is-active' : ''}
                onClick={() => setTarget(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <CodeBlock key={tab.id} files={tab.files} size="lg" className="install__code" />
          <ul className="check-list">
            {tab.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <table className="mini-table">
            <thead>
              <tr>
                <th />
                <th>Expo</th>
                <th>React Native CLI</th>
              </tr>
            </thead>
            <tbody>
              {expoVsCli.map(([label, expo, cli]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{expo}</td>
                  <td>{cli}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SlideLayout>
  );
}
