import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  FAB,
  PaperProvider,
  ProgressBar,
  SegmentedButtons,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';
import { criarTema, paletas } from './temas';

export default function TemaDemo() {
  const [escuro, setEscuro] = useState(false);
  const [paleta, setPaleta] = useState('roxo');
  const tema = criarTema(paleta, escuro);

  return (
    // Um único lugar define o visual; nenhum componente abaixo recebe cor fixa.
    <PaperProvider theme={tema}>
      <ScrollView style={{ backgroundColor: tema.colors.background }} contentContainerStyle={styles.conteudo}>
        <View style={styles.linha}>
          <Text variant="titleMedium">Tema escuro</Text>
          <Switch value={escuro} onValueChange={setEscuro} />
        </View>

        <View style={styles.chips}>
          {Object.entries(paletas).map(([chave, p]) => (
            <Chip key={chave} selected={paleta === chave} onPress={() => setPaleta(chave)} compact>
              {p.nome}
            </Chip>
          ))}
        </View>

        <Card mode="elevated">
          <Card.Title title="Pedido #1024" subtitle="Saiu para entrega" />
          <Card.Content style={styles.gap}>
            <View style={styles.barra}>
              <ProgressBar progress={0.7} />
            </View>
            <Text variant="bodyMedium">Chega em aproximadamente 15 minutos.</Text>
          </Card.Content>
          <Card.Actions>
            <Button>Detalhes</Button>
            <Button mode="contained">Rastrear</Button>
          </Card.Actions>
        </Card>

        <TextInput mode="outlined" label="Cupom de desconto" />
        <SegmentedButtons
          value="pix"
          onValueChange={() => {}}
          buttons={[
            { value: 'pix', label: 'Pix' },
            { value: 'cartao', label: 'Cartão' },
          ]}
        />

        <View style={styles.paleta}>
          {(['primary', 'secondaryContainer', 'surfaceVariant', 'error'] as const).map((token) => (
            <View key={token} style={[styles.cor, { backgroundColor: tema.colors[token] }]} />
          ))}
        </View>
        <FAB icon="cart" label="Carrinho" style={styles.fab} onPress={() => {}} />
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 16, gap: 12 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gap: { gap: 8 },
  barra: { height: 4 }, // na web o ProgressBar ocupa 100% da altura do pai
  paleta: { flexDirection: 'row', gap: 8 },
  cor: { flex: 1, height: 28, borderRadius: 8 },
  fab: { alignSelf: 'flex-end' },
});
