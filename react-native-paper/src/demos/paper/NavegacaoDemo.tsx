import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Appbar, BottomNavigation, Drawer, Menu, Surface, Text, useTheme } from 'react-native-paper';

const Tela = ({ titulo, texto }: { titulo: string; texto: string }) => (
  <View style={styles.tela}>
    <Text variant="headlineSmall">{titulo}</Text>
    <Text variant="bodyMedium" style={styles.texto}>{texto}</Text>
  </View>
);

const rotas = [
  { key: 'inicio', title: 'Início', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'pedidos', title: 'Pedidos', focusedIcon: 'receipt-text', unfocusedIcon: 'receipt-text-outline', badge: 2 },
  { key: 'perfil', title: 'Perfil', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
];

const renderScene = BottomNavigation.SceneMap({
  inicio: () => <Tela titulo="Início" texto="Use as abas abaixo, o menu ☰ ou o menu ⋮." />,
  pedidos: () => <Tela titulo="Pedidos" texto="Você tem 2 pedidos em andamento." />,
  perfil: () => <Tela titulo="Perfil" texto="Configurações da conta." />,
});

export default function NavegacaoDemo() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [menuAberto, setMenuAberto] = useState(false);
  const [gavetaAberta, setGavetaAberta] = useState(false);
  const [ultimaAcao, setUltimaAcao] = useState('');

  function escolher(acao: string) {
    setMenuAberto(false);
    setUltimaAcao(acao);
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header elevated>
        <Appbar.Action icon="menu" onPress={() => setGavetaAberta(true)} accessibilityLabel="Abrir menu lateral" />
        <Appbar.Content title={rotas[index].title} subtitle={ultimaAcao || undefined} />
        <Menu
          visible={menuAberto}
          onDismiss={() => setMenuAberto(false)}
          anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuAberto(true)} />}
        >
          <Menu.Item leadingIcon="cog" title="Configurações" onPress={() => escolher('Configurações')} />
          <Menu.Item leadingIcon="help-circle" title="Ajuda" onPress={() => escolher('Ajuda')} />
          <Menu.Item leadingIcon="logout" title="Sair" onPress={() => escolher('Sair')} />
        </Menu>
      </Appbar.Header>

      <BottomNavigation
        navigationState={{ index, routes: rotas }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />

      {/* Paper fornece os itens visuais (Drawer.Section/Item); a gaveta
          deslizante de verdade normalmente vem do React Navigation. */}
      {gavetaAberta && (
        <Pressable style={styles.fundo} onPress={() => setGavetaAberta(false)}>
          <Surface style={[styles.gaveta, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <Drawer.Section title="Navegação" showDivider={false}>
              {rotas.map((rota, i) => (
                <Drawer.Item
                  key={rota.key}
                  label={rota.title}
                  icon={rota.focusedIcon}
                  active={index === i}
                  onPress={() => {
                    setIndex(i);
                    setGavetaAberta(false);
                  }}
                />
              ))}
            </Drawer.Section>
          </Surface>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 24, gap: 8 },
  texto: { opacity: 0.75 },
  fundo: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.32)' },
  gaveta: { width: '78%', height: '100%', paddingTop: 48 },
});
