import { useState } from 'react';
import { View } from 'react-native';
import { Button, Checkbox, Chip, Icon, IconButton, Surface, Text, ThemeProvider } from 'react-native-paper';
import { SlideLayout } from '../components/SlideLayout';
import { features } from '../data/content';
import { darkTheme, lightTheme } from '../theme/paperThemes';

type DemoKey = (typeof features)[number]['demo'];

const row = { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' } as const;

function MiniDemo({ kind }: { kind: DemoKey }) {
  const [checked, setChecked] = useState(true);
  const [fav, setFav] = useState(false);
  switch (kind) {
    case 'components':
      return (
        <View style={row}>
          <Button mode="contained" compact>
            Button
          </Button>
          <Chip compact>Chip</Chip>
          <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={() => setChecked(!checked)} />
        </View>
      );
    case 'md3':
      return (
        <View style={row}>
          {([0, 1, 3, 5] as const).map((e) => (
            <Surface key={e} elevation={e} style={{ width: 40, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="labelSmall">{e}</Text>
            </Surface>
          ))}
        </View>
      );
    case 'theme':
      return (
        <View style={row}>
          {(['primary', 'secondary', 'tertiary', 'error', 'primaryContainer'] as const).map((c) => (
            <View key={c} style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: lightTheme.colors[c] }} />
          ))}
        </View>
      );
    case 'dark':
      return (
        <View style={row}>
          <Button mode="contained-tonal" compact icon="white-balance-sunny">
            Claro
          </Button>
          <ThemeProvider theme={darkTheme}>
            <Surface style={{ borderRadius: 20, padding: 2, backgroundColor: darkTheme.colors.background }} elevation={0}>
              <Button mode="contained-tonal" compact icon="weather-night">
                Escuro
              </Button>
            </Surface>
          </ThemeProvider>
        </View>
      );
    case 'type':
      return (
        <View>
          <Text variant="titleMedium">titleMedium</Text>
          <Text variant="bodySmall">bodySmall</Text>
          <Text variant="labelSmall">labelSmall</Text>
        </View>
      );
    case 'a11y':
      return (
        <View style={row}>
          <IconButton
            icon={fav ? 'heart' : 'heart-outline'}
            mode="contained-tonal"
            accessibilityLabel="Favoritar"
            onPress={() => setFav(!fav)}
          />
          <Text variant="labelSmall">accessibilityLabel="Favoritar"</Text>
        </View>
      );
    case 'platforms':
      return (
        <View style={row}>
          {['android', 'apple', 'web'].map((name) => (
            <Chip key={name} compact icon={() => <Icon source={name} size={16} />}>
              {name === 'apple' ? 'iOS' : name === 'web' ? 'Web' : 'Android'}
            </Chip>
          ))}
        </View>
      );
    case 'docs':
      return (
        <View style={row}>
          <Chip compact icon="book-open-variant">
            docs 5.x
          </Chip>
          <Chip compact icon="flask-outline">
            6.x alpha
          </Chip>
        </View>
      );
  }
}

export default function Slide05Features() {
  return (
    <SlideLayout title="Principais recursos" lead="Cada card tem um mini exemplo real do Paper.">
      <div className="feature-grid">
        {features.map((f, i) => (
          <article key={f.title} className="card feature" style={{ animationDelay: `${i * 50}ms` }}>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
            <div className="feature__demo">
              <ThemeProvider theme={lightTheme}>
                <MiniDemo kind={f.demo} />
              </ThemeProvider>
            </div>
          </article>
        ))}
      </div>
    </SlideLayout>
  );
}
