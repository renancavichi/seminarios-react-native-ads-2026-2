import { useState } from 'react';

import { ReflexGame } from '@/components/gyroscope/reflex-game';
import { SteeringWheelGame } from '@/components/gyroscope/steering-wheel-game';
import { SensorMenu, SensorMenuCard } from '@/components/sensor-menu';

type Screen = 'menu' | 'wheel' | 'reflex';

const CARDS: SensorMenuCard<Screen>[] = [
  {
    screen: 'wheel',
    icon: { ios: 'steeringwheel', android: 'sports_motorsports', web: 'sports_motorsports' },
    title: 'Volante',
    description: 'gire o celular como um volante pra desviar dos cones',
  },
  {
    screen: 'reflex',
    icon: { ios: 'arrow.up.arrow.down', android: 'swap_vert', web: 'swap_vert' },
    title: 'Vire Rápido',
    description: 'vire o celular na direção certa antes que a seta mude',
  },
];

export default function GyroscopeScreen() {
  const [view, setView] = useState<Screen>('menu');

  if (view === 'wheel') return <SteeringWheelGame onBack={() => setView('menu')} />;
  if (view === 'reflex') return <ReflexGame onBack={() => setView('menu')} />;

  return (
    <SensorMenu
      title="Giroscópio"
      subtitle="escolha um minigame que usa o sensor de rotação"
      cards={CARDS}
      onSelect={setView}
    />
  );
}
