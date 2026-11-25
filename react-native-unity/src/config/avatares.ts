// 🧑‍🚀 LISTA DE AVATARES
// Cada avatar pode ser um EMOJI (mais simples) ou uma IMAGEM sua.
//
// Para usar uma imagem:
//   1. coloque o arquivo em  assets/avatares/  (ex.: assets/avatares/gato.png)
//   2. adicione aqui:  { id: 'gato', nome: 'Gato', imagem: require('../../assets/avatares/gato.png'), cor: '#FFB547' }
//
// Para remover um avatar, apague a linha. A ordem aqui é a ordem na tela.
import type { ImageSourcePropType } from 'react-native';

export type Avatar = {
  id: string; // identificador enviado para a Unity (RNBridge.SetAvatar)
  nome: string;
  cor: string; // cor do círculo atrás do avatar
  emoji?: string;
  imagem?: ImageSourcePropType;
};

export const avatares: Avatar[] = [
  { id: 'astronauta', nome: 'Astronauta', emoji: '🧑‍🚀', cor: '#7C5CFF' },
  { id: 'alien', nome: 'Alien', emoji: '👽', cor: '#3DDC97' },
  { id: 'robo', nome: 'Robô', emoji: '🤖', cor: '#22D3EE' },
  { id: 'raposa', nome: 'Raposa', emoji: '🦊', cor: '#FFB547' },
  { id: 'gato', nome: 'Gato', emoji: '🐱', cor: '#FF7AB6' },
  { id: 'ninja', nome: 'Ninja', emoji: '🥷', cor: '#5B6CFF' },
];
