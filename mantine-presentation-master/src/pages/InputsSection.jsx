import { useState } from 'react';
import {
  Title,
  Text,
  Stack,
  Input,
  PasswordInput,
  Checkbox,
  ColorInput,
  Slider,
  RangeSlider,
  Rating,
  Switch,
  AlphaSlider,
  HueSlider,
  Fieldset,
  TextInput,
  Group,
} from '@mantine/core';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

export default function InputsSection() {
  const [color, setColor] = useState('#4263eb');
  const [hue, setHue] = useState(228);
  const [alpha, setAlpha] = useState(0.8);
  const [range, setRange] = useState([20, 70]);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Componentes de Inputs
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Onze componentes de entrada de dados, todos funcionando de verdade nesta página.
        </Text>
      </div>

      <DemoSection
        title="Input & Fieldset"
        description="Input é o bloco base usado por outros componentes; Fieldset agrupa campos relacionados com um título."
        code={`<Fieldset legend="Dados pessoais">\n  <Input placeholder="Seu nome" mb="sm" />\n  <TextInput placeholder="seuemail@exemplo.com" label="E-mail" />\n</Fieldset>`}
      >
        <Fieldset legend="Dados pessoais">
          <Input placeholder="Seu nome" mb="sm" />
          <TextInput placeholder="seuemail@exemplo.com" label="E-mail" />
        </Fieldset>
      </DemoSection>

      <DemoSection
        title="PasswordInput"
        description="Input de senha com botão de visibilidade integrado."
        code={`<PasswordInput label="Senha" placeholder="Sua senha" />`}
      >
        <PasswordInput label="Senha" placeholder="Sua senha" maw={320} />
      </DemoSection>

      <DemoSection
        title="Checkbox & Switch"
        description="Dois jeitos de capturar um valor booleano."
        code={`<Checkbox label="Aceito os termos" defaultChecked />\n<Switch label="Notificações ativas" defaultChecked />`}
      >
        <Group>
          <Checkbox label="Aceito os termos" defaultChecked />
          <Switch label="Notificações ativas" defaultChecked />
        </Group>
      </DemoSection>

      <DemoSection
        title="ColorInput"
        description="Seleção de cor com preview, paleta e entrada manual de hexadecimal."
        code={`const [color, setColor] = useState('#4263eb');\n<ColorInput value={color} onChange={setColor} label="Cor principal" />`}
      >
        <ColorInput value={color} onChange={setColor} label="Cor principal" maw={320} />
      </DemoSection>

      <DemoSection
        title="Slider & RangeSlider"
        description="Seleção de um valor único ou de um intervalo, com marcações."
        code={`<Slider defaultValue={40} marks={[{ value: 0, label: '0%' }, { value: 100, label: '100%' }]} />\n\nconst [range, setRange] = useState([20, 70]);\n<RangeSlider value={range} onChange={setRange} />`}
      >
        <Text size="sm" fw={500}>Slider</Text>
        <Slider
          defaultValue={40}
          marks={[{ value: 0, label: '0%' }, { value: 50, label: '50%' }, { value: 100, label: '100%' }]}
        />
        <Text size="sm" fw={500} mt="md">
          RangeSlider — {range[0]} a {range[1]}
        </Text>
        <RangeSlider value={range} onChange={setRange} />
      </DemoSection>

      <DemoSection
        title="Rating"
        description="Avaliação por estrelas, com suporte a metades e tamanhos customizados."
        code={`<Rating defaultValue={3.5} fractions={2} />`}
      >
        <Rating defaultValue={3.5} fractions={2} />
      </DemoSection>

      <DemoSection
        title="HueSlider & AlphaSlider"
        description="Os mesmos seletores usados internamente pelo ColorPicker, disponíveis isoladamente."
        code={`const [hue, setHue] = useState(228);\nconst [alpha, setAlpha] = useState(0.8);\n\n<HueSlider value={hue} onChange={setHue} />\n<AlphaSlider color="#4263eb" value={alpha} onChange={setAlpha} />`}
      >
        <Text size="sm">Hue: {hue}</Text>
        <HueSlider value={hue} onChange={setHue} />
        <Text size="sm" mt="md">Alpha: {alpha.toFixed(2)}</Text>
        <AlphaSlider color="#4263eb" value={alpha} onChange={setAlpha} />
      </DemoSection>

      <PageFooterNav />
    </Stack>
  );
}
