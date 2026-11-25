/**
 * Substitui "@react-native-vector-icons/material-design-icons" no navegador
 * (ver alias em vite.config.ts). Componentes internos do Paper, como Checkbox,
 * carregam esse pacote diretamente; aqui ele aponta para o ícone em SVG.
 */
import { MdiIcon } from './MdiIcon';

export default MdiIcon;
