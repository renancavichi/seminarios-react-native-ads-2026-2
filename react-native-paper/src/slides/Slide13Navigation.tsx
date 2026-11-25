import { DemoSlide } from '../components/DemoSlide';
import NavegacaoDemo from '../demos/paper/NavegacaoDemo';
import src from '../demos/paper/NavegacaoDemo.tsx?raw';

export default function Slide13Navigation() {
  return (
    <DemoSlide
      title="Navegação"
      lead={
        <>
          O Paper fornece as <strong>peças visuais</strong>. Pilhas de telas e a gaveta deslizante normalmente vêm do{' '}
          <strong>React Navigation</strong>, que se integra ao tema do Paper.
        </>
      }
      files={[{ name: 'NavegacaoDemo.tsx', code: src, highlight: /<(Appbar|BottomNavigation|Menu|Drawer)/ }]}
      demo={<NavegacaoDemo />}
      demoLabel="Navegação"
      components={[
        { name: 'Appbar.Header', props: ['Appbar.Action', 'Appbar.Content', 'elevated'], desc: 'Barra superior com título e ações.' },
        { name: 'BottomNavigation', props: ['navigationState', 'onIndexChange', 'renderScene'], desc: 'Abas inferiores com troca de cena. Paper ✔' },
        { name: 'Menu', props: ['visible', 'anchor', 'onDismiss'], desc: 'Menu suspenso ancorado em um botão. Paper ✔' },
        { name: 'Drawer.Section / Item', props: ['label', 'icon', 'active'], desc: 'Itens da gaveta. A gaveta em si: React Navigation.' },
      ]}
      useCase="App de pedidos: abas Início/Pedidos/Perfil, Badge com pedidos pendentes e menu ⋮ com Configurações e Sair."
    />
  );
}
