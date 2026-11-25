import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Checkbox,
  Chip,
  HelperText,
  RadioButton,
  Searchbar,
  Switch,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

const AREAS = ['Mobile', 'Front-end', 'Back-end', 'Dados', 'UX', 'DevOps', 'Testes'];

export default function FormularioDemo() {
  const theme = useTheme();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [busca, setBusca] = useState('');
  const [areas, setAreas] = useState<string[]>(['Mobile']);
  const [turno, setTurno] = useState('noite');
  const [avisos, setAvisos] = useState(true);
  const [aceito, setAceito] = useState(false);

  const emailInvalido = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);
  const podeEnviar = nome.trim() !== '' && email !== '' && !emailInvalido && aceito;
  const visiveis = AREAS.filter((a) => a.toLowerCase().includes(busca.toLowerCase()));

  function alternarArea(area: string) {
    setAreas((atual) => (atual.includes(area) ? atual.filter((a) => a !== area) : [...atual, area]));
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.conteudo}>
      <TextInput mode="outlined" label="Nome" value={nome} onChangeText={setNome} left={<TextInput.Icon icon="account" />} />

      <TextInput
        mode="outlined"
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        error={emailInvalido}
        autoCapitalize="none"
        left={<TextInput.Icon icon="email-outline" />}
      />
      <HelperText type="error" visible={emailInvalido} style={styles.helper}>
        Formato de e-mail inválido
      </HelperText>

      <Text variant="labelLarge">Áreas de interesse</Text>
      <Searchbar placeholder="Filtrar áreas" value={busca} onChangeText={setBusca} />
      <View style={styles.chips}>
        {visiveis.map((area) => (
          <Chip key={area} selected={areas.includes(area)} showSelectedOverlay onPress={() => alternarArea(area)}>
            {area}
          </Chip>
        ))}
      </View>

      <Text variant="labelLarge">Turno</Text>
      <RadioButton.Group value={turno} onValueChange={setTurno}>
        <View style={styles.linha}>
          <RadioButton.Item label="Manhã" value="manha" style={styles.radio} />
          <RadioButton.Item label="Noite" value="noite" style={styles.radio} />
        </View>
      </RadioButton.Group>

      <View style={styles.linhaEntre}>
        <Text variant="bodyLarge">Receber avisos</Text>
        <Switch value={avisos} onValueChange={setAvisos} />
      </View>

      <Checkbox.Item
        label="Li e aceito os termos"
        status={aceito ? 'checked' : 'unchecked'}
        onPress={() => setAceito(!aceito)}
        position="leading"
        style={styles.check}
      />

      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {nome || 'Sem nome'} · {areas.length} área(s) · turno {turno} · avisos {avisos ? 'on' : 'off'}
      </Text>
      <Button mode="contained" icon="send" disabled={!podeEnviar} onPress={() => {}}>
        Enviar inscrição
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 16, gap: 8, paddingBottom: 32 },
  helper: { marginTop: -8, marginBottom: -4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  linha: { flexDirection: 'row' },
  radio: { paddingVertical: 2, paddingHorizontal: 4 },
  linhaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  check: { paddingHorizontal: 0, paddingVertical: 0 },
});
