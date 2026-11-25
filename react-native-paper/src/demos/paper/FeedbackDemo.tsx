import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Banner, Button, Dialog, Portal, ProgressBar, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';

export default function FeedbackDemo() {
  const theme = useTheme();
  const [banner, setBanner] = useState(true);
  const [nome, setNome] = useState('Ana Souza');
  const [salvando, setSalvando] = useState(false);
  const [dialogo, setDialogo] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [progresso, setProgresso] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => () => clearInterval(timer.current), []);

  function salvar() {
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      setMensagem('Perfil salvo com sucesso!');
    }, 1500);
  }

  function enviarArquivo() {
    clearInterval(timer.current);
    setProgresso(0);
    timer.current = setInterval(() => {
      setProgresso((p) => {
        if (p >= 1) {
          clearInterval(timer.current);
          setMensagem('Upload concluído');
          return 1;
        }
        return Math.min(p + 0.1, 1);
      });
    }, 250);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Banner
        visible={banner}
        icon="wifi-off"
        actions={[
          { label: 'Entendi', onPress: () => setBanner(false) },
          { label: 'Tentar de novo', onPress: () => setMensagem('Ainda sem conexão…') },
        ]}
      >
        Você está offline. As alterações serão sincronizadas depois.
      </Banner>

      {/* Indicador de carregamento indeterminado enquanto salva.
          A View com altura fixa é necessária na web: lá o ProgressBar ocupa 100% da altura do pai. */}
      <View style={styles.barra}>
        <ProgressBar indeterminate visible={salvando} />
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text variant="titleMedium">Editar perfil</Text>
        <TextInput mode="outlined" label="Nome de exibição" value={nome} onChangeText={setNome} />
        <Button mode="contained" icon="content-save" loading={salvando} disabled={salvando} onPress={salvar}>
          Salvar
        </Button>

        <Text variant="titleMedium">Foto de perfil</Text>
        <View style={styles.barra}>
          <ProgressBar progress={progresso} />
        </View>
        <Button mode="outlined" icon="upload" onPress={enviarArquivo}>
          Simular upload ({Math.round(progresso * 100)}%)
        </Button>

        <Button mode="text" icon="delete" textColor={theme.colors.error} onPress={() => setDialogo(true)}>
          Excluir conta
        </Button>
        {!banner && (
          <Button mode="text" icon="refresh" onPress={() => setBanner(true)}>
            Mostrar banner de novo
          </Button>
        )}
      </ScrollView>

      {/* Portal: o diálogo é desenhado acima de toda a interface */}
      <Portal>
        <Dialog visible={dialogo} onDismiss={() => setDialogo(false)} style={styles.dialogo}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={styles.centro}>Excluir conta?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Esta ação não pode ser desfeita. (Demonstração: nada será excluído.)</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogo(false)}>Cancelar</Button>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                setDialogo(false);
                setMensagem('Conta excluída (é só uma demo)');
              }}
            >
              Excluir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={mensagem !== ''}
        onDismiss={() => setMensagem('')}
        duration={3000}
        action={{ label: 'OK', onPress: () => setMensagem('') }}
      >
        {mensagem}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 16, gap: 12 },
  barra: { height: 4 },
  centro: { textAlign: 'center' },
  dialogo: { width: '90%', maxWidth: 420, alignSelf: 'center' }, // limita a largura em tablets/telas grandes
});
