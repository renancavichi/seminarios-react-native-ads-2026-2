import { DemoSlide } from '../components/DemoSlide';
import FeedbackDemo from '../demos/paper/FeedbackDemo';
import src from '../demos/paper/FeedbackDemo.tsx?raw';

export default function Slide14Feedback() {
  return (
    <DemoSlide
      title="Diálogos e feedback"
      lead="Salve, faça upload e tente excluir a conta. Todo feedback segue o mesmo padrão visual do tema."
      files={[{ name: 'FeedbackDemo.tsx', code: src, highlight: /<(Banner|Dialog|Portal|ProgressBar|Snackbar)/ }]}
      demo={<FeedbackDemo />}
      demoLabel="Feedback"
      components={[
        { name: 'Dialog', props: ['visible', 'onDismiss', 'Dialog.Actions'], desc: 'Confirmação de ações importantes.' },
        { name: 'Portal', props: ['children'], desc: 'Desenha o diálogo acima de toda a interface.' },
        { name: 'Snackbar', props: ['visible', 'duration', 'action'], desc: 'Mensagem breve após uma ação.' },
        { name: 'Banner', props: ['visible', 'actions', 'icon'], desc: 'Aviso persistente no topo da tela.' },
        { name: 'ProgressBar', props: ['progress', 'indeterminate'], desc: 'Progresso definido ou carregamento.' },
      ]}
      useCase="Tela de perfil: barra de carregamento ao salvar, Snackbar “Perfil salvo”, Banner de modo offline e Dialog antes de excluir a conta."
    />
  );
}
