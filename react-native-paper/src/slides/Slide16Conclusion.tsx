import { BookOpen, Blocks, Download, ExternalLink, Globe, MessageCircleQuestion } from 'lucide-react';
import { SlideLayout } from '../components/SlideLayout';
import { links } from '../data/links';

const answers = [
  { q: 'Que problema resolve?', a: 'Evita reconstruir e estilizar à mão os mesmos componentes, garantindo consistência visual.' },
  { q: 'Vantagens', a: 'Componentes prontos com estados, Material Design 3, tema claro/escuro centralizado e acessibilidade.' },
  { q: 'Limitações', a: 'Opinião forte de design, mais dependências e um sistema de tema que precisa ser aprendido.' },
  { q: 'Quando usar?', a: 'Quando o app pode seguir Material e o time quer produtividade e consistência — CRUDs, apps internos, MVPs.' },
];

const refs = [
  { label: 'Site oficial', href: links.site, icon: Globe },
  { label: 'Documentação', href: links.docs, icon: BookOpen },
  { label: 'Guia de instalação', href: links.gettingStarted, icon: Download },
  { label: 'Catálogo de componentes', href: links.components, icon: Blocks },
];

export default function Slide16Conclusion() {
  return (
    <SlideLayout title="Conclusão">
      <div className="conclusion">
        <div className="answers">
          {answers.map((x) => (
            <article key={x.q} className="card answer">
              <h3>{x.q}</h3>
              <p>{x.a}</p>
            </article>
          ))}
        </div>
        <div className="conclusion__side">
          <p className="closing">
            Biblioteca não substitui design — <span>ela acelera um design que já tem regras.</span>
          </p>
          <div className="card question">
            <MessageCircleQuestion size={22} aria-hidden />
            <p>
              No projeto de vocês, faria sentido seguir o Material Design — ou o app precisa de uma identidade visual
              própria?
            </p>
          </div>
          <ul className="refs">
            {refs.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noreferrer">
                  <Icon size={16} aria-hidden />
                  <span>{label}</span>
                  <ExternalLink size={13} aria-hidden className="refs__ext" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}
