// 🖼️🎵 IMAGENS DO FUNDO E MÚSICA DA TELA DE ENTRADA
//
// FUNDO (slideshow): coloque imagens em assets/menu/fundos/ e liste aqui, na ordem.
//   Dica: prints do seu jogo na horizontal (1920x1080) ficam ótimos.
//
// MÚSICA: coloque um .mp3 em assets/menu/ e troque `null` por require(...), por exemplo:
//   export const musicaDoMenu = require('../../assets/menu/musica.mp3');
//   Deixe `null` para o menu ficar sem música.
import type { ImageSourcePropType } from 'react-native';

export const fundosDoMenu: ImageSourcePropType[] = [
  require('../../assets/menu/fundos/fundo-1.jpg'),
  require('../../assets/menu/fundos/fundo-2.jpg'),
  require('../../assets/menu/fundos/fundo-3.jpg'),
];

// Quanto tempo cada imagem fica na tela (milissegundos)
export const tempoPorFundo = 6000;

export const musicaDoMenu: number | null = null;
export const volumeDaMusica = 0.5;
