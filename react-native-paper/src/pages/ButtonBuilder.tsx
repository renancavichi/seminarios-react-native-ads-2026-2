import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { CodeBlock } from '../components/CodeBlock';
import { PhoneFrame } from '../components/PhoneFrame';

const MODES = ['contained', 'contained-tonal', 'outlined', 'elevated', 'text'] as const;
const ICONS = ['', 'send', 'heart', 'download', 'plus', 'check'] as const;

type Mode = (typeof MODES)[number];

interface Config {
  mode: Mode;
  label: string;
  icon: string;
  disabled: boolean;
  loading: boolean;
  compact: boolean;
}

/** Gera exatamente as props que estão sendo passadas ao <Button> renderizado. */
function toCode(c: Config): string {
  const props = [
    `mode="${c.mode}"`,
    c.icon && `icon="${c.icon}"`,
    c.loading && 'loading',
    c.disabled && 'disabled',
    c.compact && 'compact',
    `onPress={() => setCliques(cliques + 1)}`,
  ].filter(Boolean);
  return `<Button\n  ${props.join('\n  ')}\n>\n  ${c.label || ' '}\n</Button>`;
}

export function ButtonBuilder({ theme }: { theme: MD3Theme }) {
  const [config, setConfig] = useState<Config>({
    mode: 'contained',
    label: 'Enviar',
    icon: 'send',
    disabled: false,
    loading: false,
    compact: false,
  });
  const [cliques, setCliques] = useState(0);
  const set = <K extends keyof Config>(key: K, value: Config[K]) => setConfig((c) => ({ ...c, [key]: value }));

  return (
    <div className="pg-builder">
      <form className="card pg-controls" onSubmit={(e) => e.preventDefault()}>
        <h3>Props do Button</h3>
        <fieldset>
          <legend>mode</legend>
          <div className="pg-radios">
            {MODES.map((m) => (
              <label key={m} className={config.mode === m ? 'is-active' : ''}>
                <input type="radio" name="mode" value={m} checked={config.mode === m} onChange={() => set('mode', m)} />
                {m}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="pg-field">
          <span>children (texto)</span>
          <input value={config.label} maxLength={24} onChange={(e) => set('label', e.target.value)} />
        </label>
        <label className="pg-field">
          <span>icon</span>
          <select value={config.icon} onChange={(e) => set('icon', e.target.value)}>
            {ICONS.map((i) => (
              <option key={i} value={i}>
                {i || '(nenhum)'}
              </option>
            ))}
          </select>
        </label>
        <div className="pg-toggles">
          {(['loading', 'disabled', 'compact'] as const).map((k) => (
            <label key={k}>
              <input type="checkbox" checked={config[k]} onChange={(e) => set(k, e.target.checked)} />
              {k}
            </label>
          ))}
        </div>
      </form>

      <PhoneFrame theme={theme} label="Construtor de Button">
        <View style={styles.center}>
          <Button
            mode={config.mode}
            icon={config.icon || undefined}
            loading={config.loading}
            disabled={config.disabled}
            compact={config.compact}
            onPress={() => setCliques(cliques + 1)}
          >
            {config.label || ' '}
          </Button>
          <Text variant="bodySmall" style={styles.hint}>
            Pressionado {cliques} {cliques === 1 ? 'vez' : 'vezes'}
          </Text>
        </View>
      </PhoneFrame>

      <CodeBlock files={[{ name: 'Button.tsx', code: toCode(config) }]} className="pg-code" />
    </div>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  hint: { opacity: 0.7 },
});
