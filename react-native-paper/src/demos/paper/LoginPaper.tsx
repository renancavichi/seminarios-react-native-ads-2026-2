import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

// A mesma tela com React Native Paper: cores, bordas, foco e
// feedback de toque vêm do tema (PaperProvider).
export default function LoginPaper() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.titulo}>
        Entrar
      </Text>

      <TextInput
        mode="outlined"
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@email.com"
        autoCapitalize="none"
      />

      <TextInput
        mode="outlined"
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button mode="contained" onPress={() => {}}>
        Entrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  titulo: { marginBottom: 8 },
});
