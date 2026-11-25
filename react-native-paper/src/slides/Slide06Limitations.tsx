import { Boxes, Library } from 'lucide-react';
import { SlideLayout } from '../components/SlideLayout';
import { environmentLimits, libraryLimits } from '../data/content';

export default function Slide06Limitations() {
  return (
    <SlideLayout
      title="Limitações e pontos de atenção"
      lead="Nem tudo é culpa da biblioteca: separe o que é dela do que depende do projeto e do ambiente."
    >
      <div className="limits">
        <div className="limits__col">
          <h2 className="limits__heading">
            <Library size={18} aria-hidden /> Da biblioteca
          </h2>
          {libraryLimits.map((l) => (
            <article key={l.title} className="card limit limit--lib">
              <h3>{l.title}</h3>
              <p>{l.text}</p>
            </article>
          ))}
        </div>
        <div className="limits__col">
          <h2 className="limits__heading">
            <Boxes size={18} aria-hidden /> Do ambiente / arquitetura
          </h2>
          {environmentLimits.map((l) => (
            <article key={l.title} className="card limit limit--env">
              <h3>{l.title}</h3>
              <p>{l.text}</p>
            </article>
          ))}
          <p className="limits__verdict">
            Resumo: o custo maior aparece quando o design <strong>não</strong> é Material — aí cada ajuste vira uma
            sobrescrita.
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
