import { ExternalLink } from 'lucide-react';
import { SlideLayout } from '../components/SlideLayout';
import { links } from '../data/links';
import { versions } from '../data/versions';

const layers = [
  { name: 'Seu aplicativo', detail: 'telas, regras de negócio, navegação', tone: 'app' },
  { name: 'React Native Paper', detail: 'componentes Material Design 3 + sistema de tema', tone: 'paper' },
  { name: 'React Native', detail: 'View, Text, TextInput, Pressable, Animated…', tone: 'rn' },
  { name: 'Plataforma', detail: 'Android · iOS · Web (via react-native-web)', tone: 'platform' },
];

const facts = [
  ['Mantida por', 'Callstack · código aberto (MIT)'],
  ['Design', 'Material Design 3 por padrão (v5+)'],
  ['Versão usada aqui', `v${versions.paper} (a v6 está em alpha)`],
  ['Plataformas', 'Android, iOS e Web'],
];

const useCases = ['Apps corporativos e internos', 'Formulários e CRUDs', 'Dashboards e painéis', 'MVPs e protótipos rápidos', 'Apps que seguem Material'];

export default function Slide04WhatIs() {
  return (
    <SlideLayout title="O que é React Native Paper?">
      <div className="split split--what">
        <div className="what__left">
          <blockquote className="definition">
            Uma <strong>biblioteca de componentes de interface</strong> para React Native que implementa as diretrizes do{' '}
            <strong>Material Design</strong>, com um sistema de temas para manter o app consistente.
          </blockquote>
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k} className="card">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="what__uses">
            <h3>Bom encaixe para</h3>
            <div className="tag-row">
              {useCases.map((u) => (
                <span key={u} className="tag">
                  {u}
                </span>
              ))}
            </div>
          </div>
          <a className="link-card" href={links.site} target="_blank" rel="noreferrer">
            <ExternalLink size={16} aria-hidden /> reactnativepaper.com
          </a>
        </div>

        <div className="layers" aria-label="Camadas de um app com React Native Paper">
          {layers.map((l, i) => (
            <div key={l.name} className={`layer layer--${l.tone}`} style={{ animationDelay: `${i * 80}ms` }}>
              <strong>{l.name}</strong>
              <span>{l.detail}</span>
            </div>
          ))}
          <p className="layers__note">
            O Paper <strong>não substitui</strong> o React Native: é uma camada por cima das primitivas, que continuam
            disponíveis.
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
