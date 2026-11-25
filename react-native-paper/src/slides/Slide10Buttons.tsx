import { DemoSlide } from '../components/DemoSlide';
import BotoesDemo from '../demos/paper/BotoesDemo';
import src from '../demos/paper/BotoesDemo.tsx?raw';

export default function Slide10Buttons() {
  return (
    <DemoSlide
      title="Botões e ações"
      lead="A prop mode troca a variante visual; estados como loading e disabled já vêm prontos."
      files={[{ name: 'BotoesDemo.tsx', code: src, highlight: /mode=|loading=|disabled|icon=/ }]}
      demo={<BotoesDemo />}
      demoLabel="Botões"
      components={[
        { name: 'Button', props: ['mode', 'icon', 'loading', 'disabled', 'onPress'], desc: 'Ação principal ou secundária, em 5 variantes.' },
        { name: 'IconButton', props: ['icon', 'mode', 'iconColor', 'accessibilityLabel'], desc: 'Ação compacta só com ícone.' },
        { name: 'SegmentedButtons', props: ['value', 'onValueChange', 'buttons'], desc: 'Escolha única entre poucas opções.' },
        { name: 'FAB', props: ['icon', 'label', 'style'], desc: 'Ação mais importante da tela, flutuante.' },
      ]}
      useCase="App de delivery: FAB “novo pedido”, IconButton de favoritar, filtros Dia/Semana/Mês e um botão Salvar que mostra carregamento."
    />
  );
}
