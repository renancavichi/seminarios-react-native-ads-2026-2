import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Badge, Button, Card, DataTable, Divider, List, Text, useTheme } from 'react-native-paper';

interface Tarefa {
  id: number;
  titulo: string;
  responsavel: string;
  feita: boolean;
}

const INICIAIS: Tarefa[] = [
  { id: 1, titulo: 'Tela de login', responsavel: 'Ana Souza', feita: true },
  { id: 2, titulo: 'Integração com a API', responsavel: 'Bruno Lima', feita: false },
  { id: 3, titulo: 'Testes do carrinho', responsavel: 'Carla Dias', feita: false },
  { id: 4, titulo: 'Ícones e splash', responsavel: 'Ana Souza', feita: false },
];

const iniciais = (nome: string) => nome.split(' ').map((p) => p[0]).join('');

export default function ListasDemo() {
  const theme = useTheme();
  const [tarefas, setTarefas] = useState(INICIAIS);
  const [ordemAsc, setOrdemAsc] = useState(true);

  const pendentes = tarefas.filter((t) => !t.feita).length;
  const alternar = (id: number) =>
    setTarefas((lista) => lista.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));

  const porPessoa = Object.entries(
    tarefas.reduce<Record<string, number>>((acc, t) => ({ ...acc, [t.responsavel]: (acc[t.responsavel] ?? 0) + 1 }), {}),
  ).sort(([a], [b]) => (ordemAsc ? a.localeCompare(b) : b.localeCompare(a)));

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.conteudo}>
      <Card mode="elevated">
        <Card.Title
          title="Sprint 12 · App de pedidos"
          subtitle={`${tarefas.length - pendentes} de ${tarefas.length} concluídas`}
          left={(props) => <Avatar.Icon {...props} icon="rocket-launch" />}
          right={() => <Badge style={styles.badge}>{pendentes}</Badge>}
        />
        <Card.Actions>
          <Button onPress={() => setTarefas(INICIAIS)}>Reiniciar</Button>
          <Button mode="contained-tonal" onPress={() => setTarefas((l) => l.map((t) => ({ ...t, feita: true })))}>
            Concluir todas
          </Button>
        </Card.Actions>
      </Card>

      <List.Section>
        <List.Subheader>Tarefas (toque para concluir)</List.Subheader>
        {tarefas.map((t, i) => (
          <View key={t.id}>
            {i > 0 && <Divider />}
            <List.Item
              title={t.titulo}
              description={t.responsavel}
              titleStyle={t.feita ? styles.feita : undefined}
              onPress={() => alternar(t.id)}
              left={() => <Avatar.Text size={36} label={iniciais(t.responsavel)} style={styles.avatar} />}
              right={(props) => <List.Icon {...props} icon={t.feita ? 'check-circle' : 'circle-outline'} />}
            />
          </View>
        ))}
      </List.Section>

      <List.Accordion title="Resumo por pessoa" left={(props) => <List.Icon {...props} icon="table" />}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title sortDirection={ordemAsc ? 'ascending' : 'descending'} onPress={() => setOrdemAsc(!ordemAsc)}>
              Pessoa
            </DataTable.Title>
            <DataTable.Title numeric>Tarefas</DataTable.Title>
          </DataTable.Header>
          {porPessoa.map(([pessoa, total]) => (
            <DataTable.Row key={pessoa}>
              <DataTable.Cell>{pessoa}</DataTable.Cell>
              <DataTable.Cell numeric>{total}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </List.Accordion>
      <Text variant="bodySmall" style={styles.rodape}>Toque no título “Pessoa” para ordenar.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 12, paddingBottom: 32 },
  badge: { marginRight: 16 },
  avatar: { marginLeft: 8 },
  feita: { textDecorationLine: 'line-through', opacity: 0.6 },
  rodape: { padding: 12, opacity: 0.7 },
});
