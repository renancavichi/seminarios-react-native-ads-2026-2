import { useState } from 'react';
import {
  Title,
  Text,
  Stack,
  Avatar,
  BackgroundImage,
  RollingNumber,
  Spoiler,
  Timeline,
  Group,
  Button,
} from '@mantine/core';
import { IconGitBranch, IconGitCommit, IconGitPullRequest } from '@tabler/icons-react';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

export default function DataDisplaySection() {
  const [counter, setCounter] = useState(1234);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Componentes de Data Display
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Como apresentar informação — de avatares a linhas do tempo.
        </Text>
      </div>

      <DemoSection
        title="Avatar"
        description="Representa uma pessoa ou entidade, com fallback automático para iniciais."
        code={`<Avatar src="..." radius="xl" />\n<Avatar color="indigo" radius="xl">JD</Avatar>`}
      >
        <Avatar.Group>
          <Avatar color="indigo" radius="xl">JD</Avatar>
          <Avatar color="teal" radius="xl">MS</Avatar>
          <Avatar color="grape" radius="xl">+5</Avatar>
        </Avatar.Group>
      </DemoSection>

      <DemoSection
        title="BackgroundImage"
        description="Define uma imagem de fundo responsiva para qualquer bloco de conteúdo."
        code={`<BackgroundImage src="/banner.jpg" radius="md" h={120}>\n  <Text c="white" p="md">Conteúdo sobre a imagem</Text>\n</BackgroundImage>`}
      >
        <BackgroundImage
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=60"
          radius="md"
          h={120}
        >
          <Text c="white" p="md" fw={600}>
            Conteúdo sobreposto à imagem
          </Text>
        </BackgroundImage>
      </DemoSection>

      <DemoSection
        title="RollingNumber"
        description="Anima a transição entre valores numéricos, dígito a dígito."
        code={`const [value, setValue] = useState(1234);\n<RollingNumber value={value} fz={36} />\n<Button onClick={() => setValue((v) => v + Math.floor(Math.random() * 500))}>Aumentar</Button>`}
      >
        <RollingNumber value={counter} fz={36} fw={700} />
        <Group mt="xs">
          <Button size="xs" variant="default" onClick={() => setCounter((v) => v + Math.floor(Math.random() * 500))}>
            Aumentar
          </Button>
          <Button size="xs" variant="default" onClick={() => setCounter((v) => Math.max(0, v - Math.floor(Math.random() * 500)))}>
            Diminuir
          </Button>
        </Group>
      </DemoSection>

      <DemoSection
        title="Spoiler"
        description="Esconde conteúdo longo, exibindo um botão para 'mostrar mais'."
        code={`<Spoiler maxHeight={60} showLabel="Mostrar mais" hideLabel="Mostrar menos">\n  {textoLongo}\n</Spoiler>`}
      >
        <Spoiler maxHeight={60} showLabel="Mostrar mais" hideLabel="Mostrar menos">
          <Text size="sm">
            A Mantine UI é uma biblioteca de componentes React criada para acelerar o
            desenvolvimento de interfaces sem sacrificar acessibilidade. Ela cobre desde
            elementos básicos como botões e inputs até padrões mais avançados como
            tabelas, calendários e editores de texto rico — tudo com suporte nativo a
            tema claro e escuro, customização via props e total tipagem em TypeScript.
          </Text>
        </Spoiler>
      </DemoSection>

      <DemoSection
        title="Timeline"
        description="Sequência cronológica de eventos, com indicação visual da etapa atual."
        code={`<Timeline active={1} bulletSize={24}>\n  <Timeline.Item bullet={<IconGitBranch size={12} />} title="Branch criada" />\n  <Timeline.Item bullet={<IconGitCommit size={12} />} title="Commit enviado" />\n  <Timeline.Item bullet={<IconGitPullRequest size={12} />} title="Pull request aberto" />\n</Timeline>`}
      >
        <Timeline active={1} bulletSize={24}>
          <Timeline.Item bullet={<IconGitBranch size={12} />} title="Branch criada">
            <Text size="sm" c="dimmed">feature/apresentacao-mantine</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<IconGitCommit size={12} />} title="Commit enviado">
            <Text size="sm" c="dimmed">Implementa páginas de componentes</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<IconGitPullRequest size={12} />} title="Pull request aberto">
            <Text size="sm" c="dimmed">Aguardando revisão</Text>
          </Timeline.Item>
        </Timeline>
      </DemoSection>

      <PageFooterNav />
    </Stack>
  );
}
