import { DemoSlide } from '../components/DemoSlide';
import ListasDemo from '../demos/paper/ListasDemo';
import src from '../demos/paper/ListasDemo.tsx?raw';

export default function Slide12Lists() {
  return (
    <DemoSlide
      title="Cards e listas"
      lead="Painel de tarefas da equipe: toque nas tarefas para concluir, abra o resumo e ordene a tabela."
      files={[{ name: 'ListasDemo.tsx', code: src, highlight: /<(Card|List|Avatar|Badge|Divider|DataTable)/ }]}
      demo={<ListasDemo />}
      demoLabel="Listas"
      components={[
        { name: 'Card', props: ['mode', 'Card.Title', 'Card.Content', 'Card.Actions'], desc: 'Agrupa informações e ações de um item.' },
        { name: 'List.Item', props: ['title', 'description', 'left', 'right', 'onPress'], desc: 'Linha de lista com ícones e toque.' },
        { name: 'List.Accordion', props: ['title', 'expanded'], desc: 'Seção que expande e recolhe.' },
        { name: 'Avatar · Badge · Divider', props: ['label', 'icon', 'size'], desc: 'Identidade, contadores e separadores.' },
        { name: 'DataTable', props: ['sortDirection', 'numeric'], desc: 'Tabelas simples com ordenação.' },
      ]}
      useCase="Telas de funcionários, pedidos ou atividades: cada item vira um List.Item; o resumo do topo é um Card com Badge de pendências."
    />
  );
}
