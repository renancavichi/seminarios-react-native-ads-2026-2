import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, FAB, IconButton, SegmentedButtons, Text, useTheme } from 'react-native-paper';

export default function BotoesDemo() {
  const theme = useTheme();
  const [cliques, setCliques] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [periodo, setPeriodo] = useState('semana');

  function salvar() {
    setSalvando(true);
    setTimeout(() => setSalvando(false), 1500);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text variant="labelLarge">Button · mode</Text>
        <Button mode="contained" onPress={() => setCliques(cliques + 1)}>
          Contained · {cliques} cliques
        </Button>
        <Button mode="contained-tonal" icon="send">Contained tonal</Button>
        <Button mode="outlined" icon="download">Outlined</Button>
        <Button mode="elevated" loading={salvando} onPress={salvar}>
          {salvando ? 'Salvando…' : 'Elevated · salvar'}
        </Button>
        <View style={styles.linha}>
          <Button mode="text">Text</Button>
          <Button mode="contained" disabled>Desabilitado</Button>
        </View>

        <Text variant="labelLarge">IconButton</Text>
        <View style={styles.linha}>
          <IconButton
            icon={favorito ? 'heart' : 'heart-outline'}
            iconColor={theme.colors.error}
            accessibilityLabel="Favoritar"
            onPress={() => setFavorito(!favorito)}
          />
          <IconButton icon="share-variant" mode="contained" onPress={() => {}} />
          <IconButton icon="pencil" mode="outlined" onPress={() => {}} />
          <IconButton icon="delete" mode="contained-tonal" disabled />
        </View>

        <Text variant="labelLarge">SegmentedButtons</Text>
        <SegmentedButtons
          value={periodo}
          onValueChange={setPeriodo}
          buttons={[
            { value: 'dia', label: 'Dia' },
            { value: 'semana', label: 'Semana' },
            { value: 'mes', label: 'Mês' },
          ]}
        />
        <Text variant="bodySmall">Período selecionado: {periodo}</Text>
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={() => setCliques(0)} accessibilityLabel="Zerar" />
    </View>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 16, gap: 10, paddingBottom: 96 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});
