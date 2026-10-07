import { useState, useEffect } from 'react';
import { Title, Text, Stack, Button, Group, TextInput, Badge } from '@mantine/core';
import {
  useDisclosure,
  useCounter,
  useClipboard,
  useToggle,
  useLocalStorage,
  useDebouncedValue,
  useInterval,
} from '@mantine/hooks';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { Modal } from '@mantine/core';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

export default function HooksSection() {
  // useDisclosure
  const [opened, { open, close }] = useDisclosure(false);

  // useCounter
  const [count, handlers] = useCounter(0, { min: 0, max: 20 });

  // useClipboard
  const clipboard = useClipboard({ timeout: 1000 });

  // useToggle
  const [variant, toggleVariant] = useToggle(['filled', 'outline', 'light']);

  // useLocalStorage
  const [name, setName] = useLocalStorage({ key: 'mantine-demo-name', defaultValue: '' });

  // useDebouncedValue
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 400);

  // useInterval
  const [seconds, setSeconds] = useState(0);
  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);
  useEffect(() => () => interval.stop(), [interval]);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Sessão de Hooks
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Sete hooks do pacote @mantine/hooks, cada um com uma demonstração funcional.
        </Text>
      </div>

      <DemoSection
        title="useDisclosure"
        description="Controla um estado booleano de abrir/fechar (modais, drawers, dialogs) com handlers prontos."
        code={`const [opened, { open, close }] = useDisclosure(false);\n\n<Button onClick={open}>Abrir modal</Button>\n<Modal opened={opened} onClose={close} title="Exemplo">...</Modal>`}
      >
        <Button onClick={open}>
          Abrir modal
        </Button>
        <Modal opened={opened} onClose={close} title="Controlado por useDisclosure">
          <Text size="sm">Este modal foi aberto e será fechado usando o hook useDisclosure.</Text>
        </Modal>
      </DemoSection>

      <DemoSection
        title="useCounter"
        description="Estado numérico com incremento, decremento, reset e limites mín/máx prontos."
        code={`const [count, handlers] = useCounter(0, { min: 0, max: 20 });\n\n<Button onClick={handlers.decrement}>-</Button>\n<Text>{count}</Text>\n<Button onClick={handlers.increment}>+</Button>`}
      >
        <Group>
          <Button variant="default" onClick={handlers.decrement}>-</Button>
          <Text fw={700} fz="lg" w={30} ta="center">{count}</Text>
          <Button variant="default" onClick={handlers.increment}>+</Button>
          <Button variant="subtle" onClick={handlers.reset}>Resetar</Button>
        </Group>
      </DemoSection>

      <DemoSection
        title="useClipboard"
        description="Copia texto para a área de transferência e expõe um estado temporário de 'copiado'."
        code={`const clipboard = useClipboard({ timeout: 1000 });\n\n<Button onClick={() => clipboard.copy('npm install @mantine/core')}>\n  {clipboard.copied ? 'Copiado!' : 'Copiar comando'}\n</Button>`}
      >
        <Button
          leftSection={clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          color={clipboard.copied ? 'teal' : 'indigo'}
          onClick={() => clipboard.copy('npm install @mantine/core')}
        >
          {clipboard.copied ? 'Copiado!' : 'Copiar comando de instalação'}
        </Button>
      </DemoSection>

      <DemoSection
        title="useToggle"
        description="Alterna ciclicamente entre uma lista de valores — útil para variantes, idiomas, temas, etc."
        code={`const [variant, toggleVariant] = useToggle(['filled', 'outline', 'light']);\n\n<Button variant={variant} onClick={() => toggleVariant()}>\n  Variante atual: {variant}\n</Button>`}
      >
        <Button variant={variant} onClick={() => toggleVariant()}>
          Variante atual: {variant}
        </Button>
      </DemoSection>

      <DemoSection
        title="useLocalStorage"
        description="Sincroniza um estado React com o localStorage do navegador — o valor sobrevive a um reload da página."
        code={`const [name, setName] = useLocalStorage({ key: 'demo-name', defaultValue: '' });\n\n<TextInput value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="Seu nome" />`}
      >
        <TextInput
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Digite seu nome e recarregue a página"
          maw={320}
        />
        <Text size="sm" c="dimmed">Valor salvo: {name || '(vazio)'}</Text>
      </DemoSection>

      <DemoSection
        title="useDebouncedValue"
        description="Atrasa a atualização de um valor — ideal para campos de busca que disparam requisições."
        code={`const [search, setSearch] = useState('');\nconst [debouncedSearch] = useDebouncedValue(search, 400);\n\n<TextInput value={search} onChange={(e) => setSearch(e.currentTarget.value)} />\n<Text>Valor com debounce: {debouncedSearch}</Text>`}
      >
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder="Digite para ver o debounce em ação"
          maw={320}
        />
        <Group gap="xs">
          <Text size="sm" c="dimmed">Valor com debounce (400ms):</Text>
          <Badge variant="light">{debouncedSearch || '—'}</Badge>
        </Group>
      </DemoSection>

      <DemoSection
        title="useInterval"
        description="Executa uma função repetidamente, com controle explícito de start/stop/toggle."
        code={`const [seconds, setSeconds] = useState(0);\nconst interval = useInterval(() => setSeconds((s) => s + 1), 1000);\n\n<Button onClick={interval.toggle}>{interval.active ? 'Pausar' : 'Iniciar'}</Button>\n<Text>{seconds}s</Text>`}
      >
        <Group>
          <Button variant="default" onClick={interval.toggle}>
            {interval.active ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button variant="subtle" onClick={() => { interval.stop(); setSeconds(0); }}>
            Resetar
          </Button>
          <Text fw={700}>{seconds}s</Text>
        </Group>
      </DemoSection>

      <PageFooterNav />
    </Stack>
  );
}
