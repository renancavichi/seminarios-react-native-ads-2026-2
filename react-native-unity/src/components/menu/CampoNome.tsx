// Campo do nickname. Textos em src/config/textos.ts · visual em src/theme/tema.ts
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { textos } from '@/config/textos';
import { cores, fontes, tamanhos } from '@/theme/tema';

type Props = { valor: string; aoMudar: (t: string) => void; erro?: string };

export default function CampoNome({ valor, aoMudar, erro }: Props) {
  return (
    <View>
      <Text style={s.rotulo}>{textos.rotuloNome}</Text>
      <TextInput
        style={[s.input, erro ? { borderColor: cores.erro } : null]}
        placeholder={textos.placeholderNome}
        placeholderTextColor={cores.textoSuave}
        value={valor}
        onChangeText={aoMudar}
        maxLength={14}
        autoCapitalize="words"
        autoComplete="off"
        autoCorrect={false}
        importantForAutofill="no"
      />
      {erro ? <Text style={s.erro}>{erro}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  rotulo: { fontFamily: fontes.forte, color: cores.textoSuave, fontSize: tamanhos.pequeno, marginBottom: 6 },
  input: {
    fontFamily: fontes.forte,
    fontSize: 16,
    color: cores.texto,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: cores.borda,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  erro: { fontFamily: fontes.normal, color: cores.erro, fontSize: tamanhos.pequeno, marginTop: 4 },
});
