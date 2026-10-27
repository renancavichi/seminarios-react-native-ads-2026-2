// Regras puras: as duas telas usam exatamente o mesmo jogo.
const CHOICES = [
  { id: 'rock', title: 'Pedra', icon: 'hand-rock-o', beats: 'scissors', color: '#62dec0', element: 'TERRA', name: 'Guardião de pedra', lore: 'A força que quebra qualquer lâmina.' },
  { id: 'paper', title: 'Papel', icon: 'hand-paper-o', beats: 'rock', color: '#b5a1ff', element: 'ARCANO', name: 'Oráculo de papel', lore: 'A sabedoria que envolve a força.' },
  { id: 'scissors', title: 'Tesoura', icon: 'hand-scissors-o', beats: 'paper', color: '#ffb477', element: 'FOGO', name: 'Lâminas gêmeas', lore: 'O corte que desfaz qualquer feitiço.' },
];

const DEMO_OPPONENTS = ['scissors', 'paper', 'rock'];
const OUTCOMES = {
  win: { title: 'Você venceu!', short: 'Vitória', color: '#62dec0' },
  lose: { title: 'O rival venceu!', short: 'Derrota', color: '#ff9b9b' },
  draw: { title: 'Empate!', short: 'Empate', color: '#d6bc80' },
};

function getChoice(id) {
  const choice = CHOICES.find((item) => item.id === id);
  if (!choice) throw new Error(`Escolha inválida: ${id}`);
  return choice;
}

function getOutcome(playerId, opponentId) {
  const player = getChoice(playerId);
  getChoice(opponentId);
  if (playerId === opponentId) return 'draw';
  return player.beats === opponentId ? 'win' : 'lose';
}

function getOpponent(roundIndex, demo = false, random = Math.random) {
  if (demo) return getChoice(DEMO_OPPONENTS[roundIndex % DEMO_OPPONENTS.length]);
  return CHOICES[Math.min(CHOICES.length - 1, Math.max(0, Math.floor(random() * CHOICES.length)))];
}

function describeRound(player, opponent, outcome) {
  if (outcome === 'draw') return `${player.title} contra ${opponent.title}. Ninguém pontua.`;
  const winner = outcome === 'win' ? player : opponent;
  const loser = outcome === 'win' ? opponent : player;
  return `${winner.title} vence ${loser.title.toLowerCase()}.`;
}

module.exports = { CHOICES, DEMO_OPPONENTS, OUTCOMES, getChoice, getOutcome, getOpponent, describeRound };
