import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Switch,
  Text,
} from 'react-native-paper';

// 1. Temas: parta do padrão MD3 e sobrescreva só o necessário.
const temaClaro = {
  ...MD3LightTheme,
  roundness: 3,
  colors: { ...MD3LightTheme.colors, primary: '#0061A4', primaryContainer: '#D1E4FF' },
};

const temaEscuro = {
  ...MD3DarkTheme,
  roundness: 3,
  colors: { ...MD3DarkTheme.colors, primary: '#9ECAFF', primaryContainer: '#00497D' },
};

// 2. O PaperProvider envolve o app inteiro e entrega o tema a todos os componentes.
export default function App() {
  const [escuro, setEscuro] = useState(false);
  const tema = escuro ? temaEscuro : temaClaro;

  return (
    <PaperProvider theme={tema}>
      <View style={[styles.tela, { backgroundColor: tema.colors.background }]}>
        <Text variant="titleLarge">Meu primeiro app</Text>

        <View style={styles.linha}>
          <Text variant="bodyLarge">Tema escuro</Text>
          <Switch value={escuro} onValueChange={setEscuro} />
        </View>

        <Card mode="contained">
          <Card.Title title="Tudo vem do tema" subtitle="sem cores fixas no componente" />
          <Card.Content>
            <Text variant="bodyMedium">Troque o tema e veja os componentes se adaptarem.</Text>
          </Card.Content>
        </Card>

        <Button mode="contained" icon="check" onPress={() => {}}>
          Botão primário
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 20, gap: 16 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
