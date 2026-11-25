import type { ReactNode } from 'react';
import { Briefcase } from 'lucide-react';
import type { MD3Theme } from 'react-native-paper';
import { CodeBlock, type CodeFile } from './CodeBlock';
import { PhoneFrame } from './PhoneFrame';
import { SlideLayout } from './SlideLayout';

export interface ComponentNote {
  name: string;
  props: string[];
  desc: string;
}

interface DemoSlideProps {
  title: ReactNode;
  lead: ReactNode;
  files: CodeFile[];
  demo: ReactNode;
  components: ComponentNote[];
  useCase: ReactNode;
  theme?: MD3Theme;
  demoLabel?: string;
}

/**
 * Slide de componente: código (o mesmo arquivo que roda na moldura) à esquerda,
 * resultado ao vivo no centro e um resumo das props + uso real à direita.
 */
export function DemoSlide({ title, lead, files, demo, components, useCase, theme, demoLabel }: DemoSlideProps) {
  return (
    <SlideLayout title={title} lead={lead} className="slide--demo">
      <div className="demo-grid">
        <CodeBlock files={files} size="sm" className="demo-grid__code" />
        <PhoneFrame theme={theme} label={demoLabel}>
          {demo}
        </PhoneFrame>
        <aside className="demo-grid__aside">
          <ul className="prop-list">
            {components.map((c) => (
              <li key={c.name}>
                <code className="prop-list__name">{`<${c.name}>`}</code>
                <p>{c.desc}</p>
                <div className="prop-list__props">
                  {c.props.map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="use-case">
            <Briefcase size={16} aria-hidden />
            <div>
              <strong>Na prática</strong>
              <p>{useCase}</p>
            </div>
          </div>
        </aside>
      </div>
    </SlideLayout>
  );
}
