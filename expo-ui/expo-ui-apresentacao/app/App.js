import { useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  useColorScheme,
  View,
} from 'react-native';
import {
  BottomSheet,
  Button,
  Column,
  FieldGroup,
  Host,
  Picker,
  Row,
  Slider,
  Spacer,
  Switch,
  Text,
  TextInput,
} from '@expo/ui';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { MenuView } from '@expo/ui/community/menu';
import PagerView from '@expo/ui/community/pager-view';

/* ---------- helpers ---------- */
const useInk = () => (useColorScheme() === 'dark' ? '#FFFFFF' : '#000000');

// Texto do Expo UI (precisa estar dentro de um <Host>)
function Label({ children, size = 17, bold = false }) {
  return (
    <Text textStyle={{ color: useInk(), fontSize: size, fontWeight: bold ? '700' : '400' }}>
      {children}
    </Text>
  );
}

// Texto do React Native (fica fora do Host)
function Txt({ children, size = 17, bold = false }) {
  return (
    <RNText style={{ color: useInk(), fontSize: size, fontWeight: bold ? '700' : '400' }}>
      {children}
    </RNText>
  );
}

function Linha({ label, children }) {
  return (
    <Row alignment="center" spacing={16}>
      <Label>{label}</Label>
      <Spacer flexible />
      {children}
    </Row>
  );
}

/* ---------- 1. Ajustes: FieldGroup, Switch, Slider, Button ---------- */
function AjustesTela() {
  const [push, setPush] = useState(true);
  const [sons, setSons] = useState(false);
  const [brilho, setBrilho] = useState(0.6);

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Notificações">
          <Linha label="Push">
            <Switch value={push} onValueChange={setPush} />
          </Linha>
          <Linha label="Sons">
            <Switch value={sons} onValueChange={setSons} />
          </Linha>
        </FieldGroup.Section>

        <FieldGroup.Section title="Tela">
          <Linha label={`Brilho ${Math.round(brilho * 100)}%`}>
            <Slider value={brilho} onValueChange={setBrilho} />
          </Linha>
          <FieldGroup.SectionFooter>
            <Label size={13}>Arraste o controle para ajustar o brilho.</Label>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>

        <FieldGroup.Section>
          <Row alignment="center" style={{ padding: 12 }}>
            <Spacer flexible />
            <Button variant="outlined" label="Sair" onPress={() => alert('Saiu')} />
            <Spacer flexible />
          </Row>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}

/* ---------- 2. Picker universal ---------- */
const FRUTAS = ['Maçã', 'Uva', 'Manga'];
const PESOS = ['250 g', '500 g', '1 kg'];

function PickerTela() {
  const [fruta, setFruta] = useState('Maçã');
  const [peso, setPeso] = useState('500 g');

  return (
    <View style={s.tela}>
      <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
        <Column spacing={12} style={{ padding: 8 }}>
          <Linha label="Fruta">
            <Picker selectedValue={fruta} onValueChange={setFruta}>
              {FRUTAS.map(f => (
                <Picker.Item key={f} label={f} value={f} />
              ))}
            </Picker>
          </Linha>
          <Linha label="Quantidade">
            <Picker selectedValue={peso} onValueChange={setPeso}>
              {PESOS.map(p => (
                <Picker.Item key={p} label={p} value={p} />
              ))}
            </Picker>
          </Linha>
        </Column>
      </Host>
      <Txt bold>{`Pedido: ${peso} de ${fruta}`}</Txt>
    </View>
  );
}

/* ---------- 3. Data: drop-in do datetimepicker ---------- */
function DataTela() {
  const [data, setData] = useState(new Date());
  // No iOS, display="inline" mostra o calendário completo.
  const extra = Platform.OS === 'ios' ? { display: 'inline' } : {};

  return (
    <View style={s.tela}>
      <DateTimePicker
        value={data}
        mode="date"
        presentation="inline"
        onValueChange={(e, d) => setData(d)}
        {...extra}
      />
      <Txt bold>{`Selecionada: ${data.toLocaleDateString('pt-BR')}`}</Txt>
    </View>
  );
}

/* ---------- 4. Bottom sheet universal ---------- */
function SheetTela() {
  const [aberto, setAberto] = useState(false);
  const [msg, setMsg] = useState('');

  const escolher = texto => {
    setMsg(texto);
    setAberto(false);
  };

  return (
    <View style={s.tela}>
      <Host matchContents>
        <Button label="Abrir bottom sheet" onPress={() => setAberto(true)} />
      </Host>
      <Txt bold>{msg ? `✓ ${msg}` : 'Nenhuma ação ainda'}</Txt>

      <BottomSheet isPresented={aberto} onDismiss={() => setAberto(false)}>
        <Column spacing={12} style={{ padding: 16 }}>
          <Label size={20} bold>
            Compartilhar
          </Label>
          <Button label="Copiar link" onPress={() => escolher('Link copiado')} />
          <Button label="Enviar por e-mail" onPress={() => escolher('E-mail aberto')} />
          <Button variant="outlined" label="Fechar" onPress={() => setAberto(false)} />
        </Column>
      </BottomSheet>
    </View>
  );
}

/* ---------- 5. Campo de texto universal ---------- */
function TextoTela() {
  const [nome, setNome] = useState('');
  const ref = useRef(null);

  return (
    <View style={s.tela}>
      <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
        <Column spacing={8}>
          <TextInput
            ref={ref}
            defaultValue=""
            placeholder="Seu nome"
            maxLength={20}
            onChangeText={setNome}
          />
          <Button
            variant="outlined"
            label="Limpar"
            onPress={() => {
              ref.current?.clear();
              setNome('');
            }}
          />
        </Column>
      </Host>
      <Txt bold>{nome ? `Olá, ${nome}!` : 'Digite seu nome'}</Txt>
      <Txt size={14}>{`${nome.length}/20 caracteres`}</Txt>
    </View>
  );
}

/* ---------- 6. Menu: ordenar produtos (drop-in do @react-native-menu/menu) ---------- */
const PRODUTOS = [
  { nome: 'Maçã', data: '2026-11-02', preco: 6.9 },
  { nome: 'Uva', data: '2026-09-14', preco: 12.5 },
  { nome: 'Manga', data: '2026-10-20', preco: 8.4 },
  { nome: 'Banana', data: '2026-08-05', preco: 5.2 },
  { nome: 'Morango', data: '2026-11-07', preco: 15.9 },
  { nome: 'Abacaxi', data: '2026-07-18', preco: 9.9 },
];

const ORDENACOES = {
  az: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
  recente: (a, b) => b.data.localeCompare(a.data),
  antigo: (a, b) => a.data.localeCompare(b.data),
  barato: (a, b) => a.preco - b.preco,
  caro: (a, b) => b.preco - a.preco,
};

const ROTULOS = {
  az: 'Nome: ordem alfabética (A–Z)',
  recente: 'Data: mais recente',
  antigo: 'Data: mais tempo no sistema',
  barato: 'Preço: mais barato',
  caro: 'Preço: mais caro',
};

const brl = n => `R$ ${n.toFixed(2).replace('.', ',')}`;
const dia = d => d.split('-').reverse().join('/');

function MenuTela() {
  const [ordem, setOrdem] = useState('az');
  const lista = [...PRODUTOS].sort(ORDENACOES[ordem]);
  const item = (id, title) => ({ id, title, state: ordem === id ? 'on' : 'off' });

  return (
    <View style={s.tela}>
      <MenuView
        title="Ordenar por"
        actions={[
          {
            id: 'g-nome',
            title: 'Nome',
            displayInline: true,
            subactions: [item('az', 'Ordem alfabética (A–Z)')],
          },
          {
            id: 'g-data',
            title: 'Data',
            displayInline: true,
            subactions: [item('recente', 'Mais recente'), item('antigo', 'Mais tempo no sistema')],
          },
          {
            id: 'g-preco',
            title: 'Preço',
            displayInline: true,
            subactions: [item('barato', 'Mais barato'), item('caro', 'Mais caro')],
          },
        ]}
        onPressAction={e => {
          const id = e.nativeEvent.event;
          if (ORDENACOES[id]) setOrdem(id);
        }}>
        <View style={s.botao}>
          <RNText style={s.botaoTxt}>Ordenar por ▾</RNText>
        </View>
      </MenuView>

      <Txt bold>{ROTULOS[ordem]}</Txt>

      <ScrollView contentContainerStyle={{ gap: 8 }}>
        {lista.map(p => (
          <View key={p.nome} style={s.produto}>
            <View>
              <Txt bold>{p.nome}</Txt>
              <Txt size={13}>{`No sistema desde ${dia(p.data)}`}</Txt>
            </View>
            <Txt bold>{brl(p.preco)}</Txt>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------- 7. Pager: drop-in do react-native-pager-view ---------- */
const PAGINAS = [
  ['Bem-vindo', '#fde68a'],
  ['Nativo', '#bfdbfe'],
  ['Pronto', '#bbf7d0'],
];

function PagerTela() {
  const ref = useRef(null);
  const [pg, setPg] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={ref}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={e => setPg(e.nativeEvent.position)}>
        {PAGINAS.map(([titulo, cor]) => (
          <View key={titulo} style={[s.pagina, { backgroundColor: cor }]}>
            <RNText style={s.paginaTxt}>{titulo}</RNText>
          </View>
        ))}
      </PagerView>
      <View style={s.linhaBotoes}>
        <Pressable style={s.botao} onPress={() => ref.current?.setPage(Math.max(0, pg - 1))}>
          <RNText style={s.botaoTxt}>Anterior</RNText>
        </Pressable>
        <Txt bold>{`${pg + 1} / ${PAGINAS.length}`}</Txt>
        <Pressable
          style={s.botao}
          onPress={() => ref.current?.setPage(Math.min(PAGINAS.length - 1, pg + 1))}>
          <RNText style={s.botaoTxt}>Próxima</RNText>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------- App ---------- */
const TELAS = [
  ['Ajustes', AjustesTela],
  ['Picker', PickerTela],
  ['Data', DataTela],
  ['Sheet', SheetTela],
  ['Texto', TextoTela],
  ['Menu', MenuTela],
  ['Pager', PagerTela],
];

export default function App() {
  const [aba, setAba] = useState(0);
  const dark = useColorScheme() === 'dark';
  const Tela = TELAS[aba][1];

  return (
    <View style={[s.raiz, { backgroundColor: dark ? '#000000' : '#F2F2F7' }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.abas} contentContainerStyle={s.abasConteudo}>
        {TELAS.map(([nome], n) => (
          <Pressable
            key={nome}
            onPress={() => setAba(n)}
            style={[s.aba, n === aba && s.abaAtiva]}>
            <RNText style={[s.abaTxt, n === aba && s.abaTxtAtiva]}>{nome}</RNText>
          </Pressable>
        ))}
      </ScrollView>
      <View style={{ flex: 1 }}>
        <Tela key={aba} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  raiz: { flex: 1, paddingTop: 56 },
  abas: { flexGrow: 0 },
  abasConteudo: { paddingHorizontal: 12, gap: 8, paddingBottom: 10 },
  aba: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99, backgroundColor: '#8e8e9333' },
  abaAtiva: { backgroundColor: '#6750a4' },
  abaTxt: { color: '#8e8e93', fontWeight: '600' },
  abaTxtAtiva: { color: '#FFFFFF' },
  tela: { flex: 1, padding: 16, gap: 16 },
  produto: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: '#8e8e9322' },
  botao: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 99, backgroundColor: '#6750a4', alignSelf: 'flex-start' },
  botaoTxt: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  pagina: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  paginaTxt: { fontSize: 32, fontWeight: '700', color: '#111111' },
  linhaBotoes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 32 },
});
