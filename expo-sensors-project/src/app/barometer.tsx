import { useState } from 'react';

import { BalloonGame } from '@/components/barometer/balloon-game';
import { PopBalloonGame } from '@/components/barometer/pop-balloon-game';
import { SensorMenu, SensorMenuCard } from '@/components/sensor-menu';

type Screen = 'menu' | 'balloon' | 'pop';

const CARDS: SensorMenuCard<Screen>[] = [
  {
    screen: 'balloon',
    icon: { ios: 'wind', android: 'air', web: 'air' },
    title: 'Balão nas Alturas',
    description: 'sopre perto do microfone pra fazer o balão subir',
  },
  {
    screen: 'pop',
    icon: { ios: 'circle.fill', android: 'circle', web: 'circle' },
    title: 'Estoura o Balão',
    description: 'sopre sem parar até a pressão estourar o balão',
  },
];

export default function BarometerScreen() {
  const [view, setView] = useState<Screen>('menu');

  if (view === 'balloon') return <BalloonGame onBack={() => setView('menu')} />;
  if (view === 'pop') return <PopBalloonGame onBack={() => setView('menu')} />;

  return (
    <SensorMenu
      title="Barômetro"
      subtitle="escolha um minigame que usa o sensor de pressão"
      cards={CARDS}
      onSelect={setView}
    />
  );
}
