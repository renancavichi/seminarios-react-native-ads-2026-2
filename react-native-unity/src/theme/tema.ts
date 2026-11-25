// 🎨 CORES, FONTES E TAMANHOS DO APP
// Funciona como as "variáveis CSS" de um site: mude aqui e todas as telas acompanham.

export const cores = {
  fundo: '#0B0F1A',
  painel: 'rgba(14, 18, 32, 0.72)', // vidro escuro por cima do slideshow
  borda: 'rgba(255, 255, 255, 0.14)',
  texto: '#FFFFFF',
  textoSuave: '#B8C0D8',
  destaque: '#7C5CFF', // cor principal (botão Jogar, avatar selecionado)
  destaque2: '#22D3EE',
  sucesso: '#3DDC97',
  erro: '#FF5C7A',
};

// As fontes são carregadas em src/app/_layout.tsx (useFonts)
export const fontes = {
  titulo: 'Fredoka_700Bold',
  forte: 'Fredoka_600SemiBold',
  normal: 'Fredoka_400Regular',
};

export const tamanhos = {
  logo: 46,
  titulo: 22,
  texto: 15,
  pequeno: 13,
  raio: 18, // arredondamento dos cantos
  espaco: 16, // espaçamento padrão
};
