import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useGameSettings } from './GameSettings';
import { getChoice, getOpponent, getOutcome, describeRound } from './rules';

const emptyScore = () => ({ win: 0, lose: 0, draw: 0 });

export function useDuel({ animated = false } = {}) {
  const { demo, timeScale, motionReduced } = useGameSettings();
  const focused = useIsFocused();
  const [selected, setSelected] = useState('rock');
  const [phase, setPhase] = useState('idle');
  const [round, setRound] = useState(null);
  const [score, setScore] = useState(emptyScore);
  const [rounds, setRounds] = useState(0);
  const timers = useRef([]);
  const locked = useRef(false);
  const roundIndex = useRef(0);
  const serial = useRef(0);

  const cancel = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    locked.current = false;
  }, []);

  const reset = useCallback(() => {
    cancel();
    roundIndex.current = 0;
    setPhase('idle');
    setRound(null);
    setScore(emptyScore());
    setRounds(0);
    setSelected('rock');
  }, [cancel]);

  useEffect(() => { reset(); }, [demo, reset]);
  useEffect(() => () => cancel(), [cancel]);
  useEffect(() => {
    // Uma rodada interrompida pela troca de aba não pontua nem avança a demo.
    if (!focused && locked.current) {
      cancel();
      setPhase('idle');
      setRound(null);
    }
  }, [focused, cancel]);

  function play() {
    if (locked.current || !focused) return;
    locked.current = true;
    const player = getChoice(selected);
    const opponent = getOpponent(roundIndex.current, demo);
    const outcome = getOutcome(player.id, opponent.id);
    const nextRound = { id: ++serial.current, number: roundIndex.current + 1, player,
      opponent, outcome, description: describeRound(player, opponent, outcome) };
    setRound(nextRound);

    const finish = () => {
      roundIndex.current += 1;
      setScore((previous) => ({ ...previous, [outcome]: previous[outcome] + 1 }));
      setRounds(roundIndex.current);
      setPhase('result');
      locked.current = false;
      timers.current = [];
    };

    if (!animated || motionReduced) { finish(); return; }
    setPhase('summon');
    timers.current = [
      setTimeout(() => setPhase('reveal'), 1100 * timeScale),
      setTimeout(() => setPhase('clash'), 2350 * timeScale),
      setTimeout(finish, 3550 * timeScale),
    ];
  }

  const busy = !['idle', 'result'].includes(phase);
  function prepare() {
    if (locked.current) return;
    setRound(null);
    setPhase('idle');
  }
  function select(id) {
    if (locked.current) return;
    getChoice(id);
    setSelected(id);
    // Preparar outra escolha não altera os pontos das batalhas concluídas.
    prepare();
  }

  return { selected, select,
    phase, round, score, busy, play, reset, prepare, rounds };
}
