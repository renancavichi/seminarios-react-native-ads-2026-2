import { useState } from 'react';

import { BallGame } from '@/components/accelerometer/ball-game';
import { ChampagnePop } from '@/components/accelerometer/champagne-pop';
import { LiveReadout } from '@/components/accelerometer/live-readout';
import { PunchMeter } from '@/components/accelerometer/punch-meter';
import { SpeedMeter } from '@/components/accelerometer/speed-meter';
import { SensorMenu, SensorMenuCard } from '@/components/sensor-menu';

type Screen = 'menu' | 'ball' | 'speedometer' | 'champagne' | 'punch';

const CARDS: SensorMenuCard<Screen>[] = [
  {
    screen: 'ball',
    icon: { ios: 'circle.fill', android: 'circle', web: 'circle' },
    title: 'Equilibrar a bolinha',
    description: 'incline o celular para manter a bolinha na tábua',
  },
  {
    screen: 'speedometer',
    icon: { ios: 'speedometer', android: 'speed', web: 'speed' },
    title: 'Velocímetro',
    description: 'estima sua velocidade em km/h a partir do movimento',
  },
  {
    screen: 'champagne',
    icon: { ios: 'party.popper', android: 'celebration', web: 'celebration' },
    title: 'Estoura o Champanhe',
    description: 'sacode o celular pra cima e pra baixo pra estourar',
  },
  {
    screen: 'punch',
    icon: { ios: 'figure.boxing', android: 'sports_mma', web: 'sports_mma' },
    title: 'Soqueira',
    description: 'dá um soco no celular e mede a força do impacto',
  },
];

export default function AccelerometerScreen() {
  const [view, setView] = useState<Screen>('menu');

  if (view === 'ball') return <BallGame onBack={() => setView('menu')} />;
  if (view === 'speedometer') return <SpeedMeter onBack={() => setView('menu')} />;
  if (view === 'champagne') return <ChampagnePop onBack={() => setView('menu')} />;
  if (view === 'punch') return <PunchMeter onBack={() => setView('menu')} />;

  return (
    <SensorMenu
      title="Acelerômetro"
      subtitle="escolha um minigame que usa o sensor de movimento"
      cards={CARDS}
      onSelect={setView}
      footer={<LiveReadout />}
    />
  );
}
