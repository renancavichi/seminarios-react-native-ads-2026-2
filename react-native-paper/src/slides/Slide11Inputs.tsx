import { DemoSlide } from '../components/DemoSlide';
import FormularioDemo from '../demos/paper/FormularioDemo';
import src from '../demos/paper/FormularioDemo.tsx?raw';

export default function Slide11Inputs() {
  return (
    <DemoSlide
      title="Entradas de dados"
      lead="Um formulário de inscrição real: digite, filtre, marque — o resumo e o botão reagem ao estado."
      files={[{ name: 'FormularioDemo.tsx', code: src, highlight: /<(TextInput|HelperText|Searchbar|Chip|RadioButton|Switch|Checkbox)/ }]}
      demo={<FormularioDemo />}
      demoLabel="Formulário"
      components={[
        { name: 'TextInput', props: ['mode', 'label', 'error', 'left/right'], desc: 'Campo com rótulo flutuante e ícones.' },
        { name: 'HelperText', props: ['type', 'visible'], desc: 'Mensagem de ajuda ou erro abaixo do campo.' },
        { name: 'Searchbar', props: ['value', 'onChangeText'], desc: 'Busca com ícone e botão de limpar.' },
        { name: 'Chip', props: ['selected', 'showSelectedOverlay'], desc: 'Seleção múltipla compacta.' },
        { name: 'RadioButton · Checkbox · Switch', props: ['value', 'status', 'onValueChange'], desc: 'Escolha única, aceite e liga/desliga.' },
      ]}
      useCase="Cadastro de aluno ou checkout: validação com HelperText, preferências com Switch e botão de envio liberado só quando o formulário é válido."
    />
  );
}
