import { useState } from 'react';
import { View } from 'react-native';
import { Avatar, Button, Card, Chip, FAB, ProgressBar, Switch, Text, ThemeProvider } from 'react-native-paper';
import { BookOpen, GraduationCap, User } from 'lucide-react';
import { presenter } from '../data/presenter';
import { versions } from '../data/versions';
import { lightTheme } from '../theme/paperThemes';

/** Composição da capa — componentes reais do Paper, não imagens. */
function CoverShowcase() {
  const [ligado, setLigado] = useState(true);
  const [chip, setChip] = useState(true);
  return (
    <ThemeProvider theme={lightTheme}>
      <div className="cover-showcase">
        <div className="cover-showcase__card cover-showcase__card--main">
          <Card mode="elevated">
            <Card.Title
              title="Apresentação"
              subtitle="React Native Paper"
              left={(p) => <Avatar.Icon {...p} icon="cellphone" />}
            />
            <Card.Content style={{ gap: 10 }}>
              <View style={{ height: 4 }}>
                <ProgressBar progress={0.35} />
              </View>
              <Text variant="bodySmall">Seminário · ~20 minutos</Text>
            </Card.Content>
            <Card.Actions>
              <Button>Docs</Button>
              <Button mode="contained">Começar</Button>
            </Card.Actions>
          </Card>
        </div>
        <div className="cover-showcase__card cover-showcase__card--chips">
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Chip icon="palette" selected={chip} onPress={() => setChip(!chip)}>
              Tema
            </Chip>
            <Switch value={ligado} onValueChange={setLigado} />
          </View>
        </div>
        <div className="cover-showcase__card cover-showcase__card--fab">
          <FAB icon="plus" label="Novo" onPress={() => {}} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default function Slide01Cover() {
  return (
    <section className="slide slide--cover">
      <div className="cover">
        <div className="cover__text">
          <p className="slide__kicker">Seminário · {presenter.discipline}</p>
          <h1 className="cover__title">
            React Native <span>Paper</span>
          </h1>
          <p className="cover__subtitle">Construindo interfaces mobile com componentes prontos</p>
          <p className="cover__pitch">
            Do <code>StyleSheet</code> escrito à mão a uma interface consistente, temática e acessível — com componentes do
            Material Design 3.
          </p>
          <ul className="cover__meta">
            <li>
              <User size={16} aria-hidden /> {presenter.name}
            </li>
            <li>
              <GraduationCap size={16} aria-hidden /> {presenter.course} · {presenter.institution}
            </li>
            <li>
              <BookOpen size={16} aria-hidden /> {presenter.date} · react-native-paper v{versions.paper}
            </li>
          </ul>
        </div>
        <div className="cover__visual">
          <CoverShowcase />
          <p className="cover__hint">Componentes reais — pode clicar.</p>
        </div>
      </div>
    </section>
  );
}
