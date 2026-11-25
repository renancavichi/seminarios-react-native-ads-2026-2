import { Info } from 'lucide-react';
import { SlideLayout } from '../components/SlideLayout';
import { comparison } from '../data/content';
import { links } from '../data/links';

const sources = [
  { label: 'reactnativepaper.com', href: links.site },
  { label: 'reactnative.dev', href: links.reactNative },
  { label: 'reactnativeelements.com', href: links.rnElements },
  { label: 'nativewind.dev', href: links.nativewind },
];

export default function Slide07Comparison() {
  return (
    <SlideLayout title="Comparação com alternativas" lead="Não existe vencedor absoluto — cada abordagem resolve um problema diferente.">
      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col" aria-label="Critério" />
              {comparison.columns.map((c, i) => (
                <th key={c} scope="col" className={i === 0 ? 'is-focus' : ''}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.cells.map((cell, i) => (
                  <td key={i} className={i === 0 ? 'is-focus' : ''}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="compare-foot">
        <p className="note">
          <Info size={16} aria-hidden />
          <span>
            <strong>NativeWind não é uma biblioteca de componentes:</strong> é uma forma de <em>estilizar</em> (Tailwind no
            React Native). Pode ser combinado com componentes próprios ou de terceiros.
          </span>
        </p>
        <p className="sources">
          Fontes:{' '}
          {sources.map((s, i) => (
            <span key={s.href}>
              {i > 0 && ' · '}
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </SlideLayout>
  );
}
