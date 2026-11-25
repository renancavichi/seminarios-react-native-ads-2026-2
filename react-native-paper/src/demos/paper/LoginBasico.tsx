import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// Tela de login só com componentes básicos do React Native.
export default function LoginBasico() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [foco, setFoco] = useState<'email' | 'senha' | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Entrar</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[styles.input, foco === 'email' && styles.inputFoco]}
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFoco('email')}
        onBlur={() => setFoco(null)}
        placeholder="voce@email.com"
        placeholderTextColor="#79747e"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={[styles.input, foco === 'senha' && styles.inputFoco]}
        value={senha}
        onChangeText={setSenha}
        onFocus={() => setFoco('senha')}
        onBlur={() => setFoco(null)}
        secureTextEntry
      />

      <Pressable
        onPress={() => {}}
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
      >
        <Text style={styles.botaoTexto}>Entrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fffbfe' },
  titulo: { fontSize: 28, fontWeight: '600', color: '#1c1b1f', marginBottom: 24 },
  label: { fontSize: 13, color: '#49454f', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#79747e',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1c1b1f',
    marginBottom: 16,
  },
  inputFoco: { borderColor: '#6750a4', borderWidth: 2 },
  botao: { backgroundColor: '#6750a4', borderRadius: 20, paddingVertical: 10, alignItems: 'center', marginTop: 8 },
  botaoPressionado: { opacity: 0.85 },
  botaoTexto: { color: '#ffffff', fontSize: 14, fontWeight: '500' },
});
