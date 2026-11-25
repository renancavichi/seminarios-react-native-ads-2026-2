/**
 * Catálogo de músicas do app.  [Slide 23]
 *
 * Músicas do Djavan, tocadas por streaming. Os áudios são as prévias oficiais
 * de 30 segundos do iTunes (formato .m4a/AAC) e as capas são as dos álbuns,
 * obtidas pela iTunes Search API (https://itunes.apple.com/search?term=djavan).
 *
 * O expo-audio aceita como fonte:
 *   require('./arquivo.mp3')   asset local empacotado no app
 *   'https://...'              URL remota
 *   { uri, headers, name }     URL com headers (ex.: token de autenticação)
 */
export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  uri: string;
  color: string;
};

const preview = (path: string) => `https://audio-ssl.itunes.apple.com/itunes-assets/${path}.plus.aac.p.m4a`;
const cover = (path: string) => `https://is1-ssl.mzstatic.com/image/thumb/${path}/600x600bb.jpg`;

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Oceano',
    artist: 'Djavan',
    album: 'Djavan (1989)',
    artwork: cover('Music6/v4/56/8e/30/568e3096-1a3d-2822-2a47-ebaa47d59752/884977966497.jpg'),
    uri: preview('AudioPreview221/v4/f7/30/99/f7309933-75c3-1f95-6e3f-85b04f979173/mzaf_16236526319111833269'),
    color: '#2E4A5C',
  },
  {
    id: '2',
    title: 'Samurai',
    artist: 'Djavan e Stevie Wonder',
    album: 'Luz (1982)',
    artwork: cover('Music124/v4/a1/7e/31/a17e31a0-1969-6d81-4e6c-6eb4e9492d73/5099747630224.jpg'),
    uri: preview('AudioPreview221/v4/f5/05/54/f50554cc-1b30-49da-eb7d-d56dcd48e9d6/mzaf_17088741197575862034'),
    color: '#5C3A2E',
  },
  {
    id: '3',
    title: 'Sina',
    artist: 'Djavan',
    album: 'Luz (1982)',
    artwork: cover('Music124/v4/a1/7e/31/a17e31a0-1969-6d81-4e6c-6eb4e9492d73/5099747630224.jpg'),
    uri: preview('AudioPreview221/v4/56/8d/ed/568dedd5-971f-0e1e-19df-896f7d687a71/mzaf_15851003353728022592'),
    color: '#5A4A2E',
  },
  {
    id: '4',
    title: 'Se...',
    artist: 'Djavan',
    album: 'Coisa de Acender (1992)',
    artwork: cover('Music114/v4/3d/7c/53/3d7c53c9-ae35-7209-52a5-fe524cc533f8/884977966381.jpg'),
    uri: preview('AudioPreview221/v4/35/e8/9a/35e89a37-33c9-7aa3-029b-5175d15eb4c8/mzaf_15573749807333912196'),
    color: '#5E3B3B',
  },
  {
    id: '5',
    title: 'Um Amor Puro',
    artist: 'Djavan',
    album: 'Djavan Ao Vivo (1999)',
    artwork: cover('Music7/v4/83/00/80/830080b3-a01e-d3c7-9f97-2b224e26a5c1/5099749247727.jpg'),
    uri: preview('AudioPreview211/v4/e6/65/87/e665870d-0ef2-0795-044d-6a39fe9badfd/mzaf_192020161050182517'),
    color: '#4A3F5C',
  },
  {
    id: '6',
    title: 'Meu Bem Querer',
    artist: 'Djavan',
    album: 'Alumbramento (1980)',
    artwork: cover('Music4/v4/c6/5b/3c/c65b3c5a-d15c-5a5d-269c-72c2fc18ab76/00077779686551.jpg'),
    uri: preview('AudioPreview125/v4/27/35/3c/27353c99-abc4-45ff-c079-d45e019859b5/mzaf_1117400775192475802'),
    color: '#45503A',
  },
  {
    id: '7',
    title: 'Eu Te Devoro',
    artist: 'Djavan',
    album: 'Bicho Solto (1998)',
    artwork: cover('Music4/v4/39/18/77/391877e4-1904-5694-e3f7-9f6fca2ac215/5099749214620.jpg'),
    uri: preview('AudioPreview221/v4/48/7d/b1/487db1ef-4744-67b1-98bc-956e62424240/mzaf_11686349378624533983'),
    color: '#2F4F4A',
  },
  {
    id: '8',
    title: 'Pétala',
    artist: 'Djavan',
    album: 'Luz (1982)',
    artwork: cover('Music124/v4/a1/7e/31/a17e31a0-1969-6d81-4e6c-6eb4e9492d73/5099747630224.jpg'),
    uri: preview('AudioPreview211/v4/58/a7/7d/58a77dd9-53a4-48cc-c2cf-337e68073de7/mzaf_17489976163842794119'),
    color: '#2E3E57',
  },
];
