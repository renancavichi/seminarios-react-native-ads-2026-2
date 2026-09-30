import { useState } from 'react';

import { StepCounter } from '@/components/pedometer/step-counter';
import { StepHistory } from '@/components/pedometer/step-history';
import { SensorMenu, SensorMenuCard } from '@/components/sensor-menu';

type Screen = 'menu' | 'counter' | 'history';

const CARDS: SensorMenuCard<Screen>[] = [
  {
    screen: 'counter',
    icon: { ios: 'figure.walk', android: 'directions_walk', web: 'directions_walk' },
    title: 'Contador de Passos',
    description: 'ande e veja o número de passos subir em tempo real',
  },
  {
    screen: 'history',
    icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
    title: 'Histórico de Passos',
    description: 'veja quantos passos você deu em cada um dos últimos 7 dias',
  },
];

export default function PedometerScreen() {
  const [view, setView] = useState<Screen>('menu');

  if (view === 'counter') return <StepCounter onBack={() => setView('menu')} />;
  if (view === 'history') return <StepHistory onBack={() => setView('menu')} />;

  return (
    <SensorMenu
      title="Pedômetro"
      subtitle="escolha um minigame que usa o contador de passos"
      cards={CARDS}
      onSelect={setView}
    />
  );
}
