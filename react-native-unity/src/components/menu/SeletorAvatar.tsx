// Fileira de avatares. O escolhido cresce com uma animação de "mola".
// A lista de avatares fica em src/config/avatares.ts
import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { avatares, type Avatar } from '@/config/avatares';
import { textos } from '@/config/textos';
import { cores, fontes, tamanhos } from '@/theme/tema';

type Props = { selecionado: string; aoEscolher: (id: string) => void };

export default function SeletorAvatar({ selecionado, aoEscolher }: Props) {
  const escolhido = avatares.find((a) => a.id === selecionado);
  return (
    <View>
      <Text style={s.rotulo}>
        {textos.rotuloAvatar}
        {escolhido ? <Text style={s.nomeAvatar}>  ·  {escolhido.nome}</Text> : null}
      </Text>
      <View style={s.linha}>
        {avatares.map((a) => (
          <ItemAvatar key={a.id} avatar={a} ativo={a.id === selecionado} onPress={() => aoEscolher(a.id)} />
        ))}
      </View>
    </View>
  );
}

export function FotoAvatar({ avatar, tamanho }: { avatar: Avatar; tamanho: number }) {
  return (
    <View style={[s.circulo, { width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: avatar.cor }]}>
      {avatar.imagem ? (
        <Image source={avatar.imagem} style={{ width: tamanho, height: tamanho, borderRadius: tamanho / 2 }} />
      ) : (
        <Text style={{ fontSize: tamanho * 0.55 }}>{avatar.emoji}</Text>
      )}
    </View>
  );
}

function ItemAvatar({ avatar, ativo, onPress }: { avatar: Avatar; ativo: boolean; onPress: () => void }) {
  const escala = useRef(new Animated.Value(ativo ? 1.15 : 1)).current;
  useEffect(() => {
    Animated.spring(escala, { toValue: ativo ? 1.15 : 1, friction: 4, useNativeDriver: true }).start();
  }, [ativo]);

  return (
    <Pressable onPress={onPress} hitSlop={6}>
      <Animated.View style={[s.anel, ativo && { borderColor: cores.texto }, { transform: [{ scale: escala }] }]}>
        <FotoAvatar avatar={avatar} tamanho={32} />
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  rotulo: { fontFamily: fontes.forte, color: cores.textoSuave, fontSize: tamanhos.pequeno, marginBottom: 8 },
  nomeAvatar: { color: cores.texto },
  linha: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  anel: { borderWidth: 3, borderColor: 'transparent', borderRadius: 30, padding: 2 },
  circulo: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
