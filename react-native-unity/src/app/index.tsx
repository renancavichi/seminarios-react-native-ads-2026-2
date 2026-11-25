// TELA DE ENTRADA (menu do jogo, na horizontal).
// Esta tela só "monta" as peças. Para personalizar, edite as peças em:
//   src/components/menu/*   (fundo, logo, avatar, campo, botão, música)
//   src/config/*            (textos, avatares, imagens e música)
//   src/theme/tema.ts       (cores, fontes, tamanhos)
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';

import BotaoJogar from '@/components/menu/BotaoJogar';
import CampoNome from '@/components/menu/CampoNome';
import FundoSlideshow from '@/components/menu/FundoSlideshow';
import Logo from '@/components/menu/Logo';
import MusicaDeFundo from '@/components/menu/MusicaDeFundo';
import SeletorAvatar from '@/components/menu/SeletorAvatar';
import { textos } from '@/config/textos';
import { useSessao } from '@/sessao';
import { cores, fontes, tamanhos } from '@/theme/tema';

export default function Menu() {
  const { nickname, avatarId, definirJogador, ultimo, recorde } = useSessao();
  const [nome, setNome] = useState(nickname);
  const [avatar, setAvatar] = useState(avatarId);
  const [erro, setErro] = useState('');
  const cortina = useRef(new Animated.Value(0)).current; // transição para o jogo

  const jogar = () => {
    if (nome.trim().length < 3) return setErro(textos.erroNome);
    setErro('');
    definirJogador(nome.trim(), avatar);
    // escurece a tela e só então abre o jogo
    Animated.timing(cortina, { toValue: 1, duration: 450, useNativeDriver: true }).start(() => {
      router.push('/jogo');
      setTimeout(() => cortina.setValue(0), 600);
    });
  };

  return (
    <View style={s.tela}>
      <FundoSlideshow />
      <MusicaDeFundo />

      <KeyboardAvoidingView style={s.conteudo} behavior="height">
        {/* lado esquerdo: identidade do jogo */}
        <View style={s.esquerda}>
          <Logo />
          {ultimo ? (
            <View style={s.placares}>
              <Placar rotulo={textos.ultimoPlacar} valor={ultimo.pontos} />
              <Placar rotulo={textos.recorde} valor={recorde} />
            </View>
          ) : null}
        </View>

        {/* lado direito: painel de "vidro" com nickname, avatar e botão */}
        <View style={s.painel}>
          <CampoNome valor={nome} aoMudar={setNome} erro={erro} />
          <SeletorAvatar selecionado={avatar} aoEscolher={setAvatar} />
          <BotaoJogar onPress={jogar} />
        </View>
      </KeyboardAvoidingView>

      <Text style={s.rodape}>{textos.rodape}</Text>

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, s.cortina, { opacity: cortina }]} />
    </View>
  );
}

function Placar({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <View style={s.placar}>
      <Text style={s.placarValor}>{valor}</Text>
      <Text style={s.placarRotulo}>{rotulo}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 48,
    gap: 32,
  },
  esquerda: { flex: 1.2 },
  painel: {
    flex: 1,
    maxWidth: 360,
    gap: 10,
    padding: 16,
    borderRadius: tamanhos.raio + 4,
    backgroundColor: cores.painel,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  placares: { flexDirection: 'row', gap: 12, marginTop: 20 },
  placar: {
    backgroundColor: cores.painel,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  placarValor: { fontFamily: fontes.titulo, color: cores.sucesso, fontSize: 26 },
  placarRotulo: { fontFamily: fontes.normal, color: cores.textoSuave, fontSize: tamanhos.pequeno },
  rodape: {
    position: 'absolute',
    bottom: 10,
    left: 48,
    fontFamily: fontes.normal,
    color: cores.textoSuave,
    fontSize: 11,
  },
  cortina: { backgroundColor: '#000' },
});
