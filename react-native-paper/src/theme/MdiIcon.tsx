import * as mdi from '@mdi/js';

const paths = mdi as unknown as Record<string, string>;
const FALLBACK = paths.mdiHelpCircleOutline;

/** "account-circle" -> "mdiAccountCircle" (mesmos nomes do MaterialCommunityIcons). */
function toExportName(name: string): string {
  return 'mdi' + name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

export interface MdiIconProps {
  name: string;
  color?: string;
  size?: number;
  direction?: 'rtl' | 'ltr' | 'auto';
  testID?: string;
}

/**
 * Ícones no navegador: no app mobile o Paper usa @expo/vector-icons ou
 * react-native-vector-icons (fonte). Aqui desenhamos o mesmo conjunto
 * (Material Design Icons) como SVG, registrado via `settings.icon` do PaperProvider.
 */
export function MdiIcon({ name, color = 'currentColor', size = 24, direction, testID }: MdiIconProps) {
  const d = paths[toExportName(name)] ?? FALLBACK;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      data-testid={testID}
      style={{ display: 'block', transform: direction === 'rtl' ? 'scaleX(-1)' : undefined, pointerEvents: 'none' }}
    >
      <path d={d} fill={color} />
    </svg>
  );
}
