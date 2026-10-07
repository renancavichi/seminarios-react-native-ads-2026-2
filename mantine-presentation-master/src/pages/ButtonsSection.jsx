import { useState } from 'react';
import { Title, Text, Stack, Button, FileButton, UnstyledButton, Group, Paper } from '@mantine/core';
import { IconUpload, IconHeart } from '@tabler/icons-react';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

export default function ButtonsSection() {
  const [file, setFile] = useState(null);
  const [liked, setLiked] = useState(false);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Componentes de Buttons
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Da ação principal ao botão totalmente customizado.
        </Text>
      </div>

      <DemoSection
        title="Button"
        description="Variantes, cores e tamanhos prontos para qualquer ação principal."
        code={`<Button>Padrão</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="light">Light</Button>\n<Button variant="subtle">Subtle</Button>\n<Button loading>Carregando</Button>\n<Button disabled>Desabilitado</Button>`}
      >
        <Group>
          <Button>Padrão</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="light">Light</Button>
          <Button variant="subtle">Subtle</Button>
          <Button loading>Carregando</Button>
          <Button disabled>Desabilitado</Button>
        </Group>
      </DemoSection>

      <DemoSection
        title="FileButton"
        description="Abre o seletor de arquivos nativo do sistema e expõe o arquivo escolhido via ref/callback."
        code={`const [file, setFile] = useState(null);\n\n<FileButton onChange={setFile} accept="image/png,image/jpeg">\n  {(props) => <Button {...props} leftSection={<IconUpload size={16} />}>Selecionar arquivo</Button>}\n</FileButton>\n{file && <Text size="sm">{file.name}</Text>}`}
      >
        <Group>
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => (
              <Button {...props} leftSection={<IconUpload size={16} />}>
                Selecionar arquivo
              </Button>
            )}
          </FileButton>
          <Text size="sm" c="dimmed">
            {file ? file.name : 'Nenhum arquivo selecionado'}
          </Text>
        </Group>
      </DemoSection>

      <DemoSection
        title="UnstyledButton"
        description="Um <button> funcional sem nenhum estilo aplicado — ponto de partida para componentes 100% customizados."
        code={`const [liked, setLiked] = useState(false);\n\n<UnstyledButton onClick={() => setLiked((v) => !v)}>\n  <IconHeart fill={liked ? 'currentColor' : 'none'} />\n</UnstyledButton>`}
      >
        <UnstyledButton onClick={() => setLiked((v) => !v)}>
          <Paper withBorder radius="xl" p="xs" style={{ display: 'inline-flex' }}>
            <IconHeart
              size={22}
              color="var(--mantine-color-red-6)"
              fill={liked ? 'var(--mantine-color-red-6)' : 'none'}
            />
          </Paper>
        </UnstyledButton>
      </DemoSection>

      <PageFooterNav />
    </Stack>
  );
}
