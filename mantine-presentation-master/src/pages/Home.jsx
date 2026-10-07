import {
  Title,
  Text,
  Badge,
  Group,
  SimpleGrid,
  List,
  ThemeIcon,
  Paper,
  Stack,
} from '@mantine/core';
import { IconCheck, IconBox, IconBolt, IconStar } from '@tabler/icons-react';
import StatCard from '../components/StatCard';
import PageFooterNav from '../components/PageFooterNav';

const advantages = [
  'Mais de 120 componentes prontos, acessíveis e estilizados de fábrica.',
  'Sistema de hooks (mais de 70) que resolve problemas comuns sem dependências extras.',
  'Tema centralizado: cores, espaçamentos, tipografia e radius configuráveis em um único lugar.',
  'Dark mode nativo em todos os componentes, sem CSS adicional.',
  'Totalmente tipado em TypeScript, com ótimo suporte de autocomplete.',
  'Comunidade enorme: mais de 30 mil estrelas no GitHub e 500+ contribuidores.',
];

export default function Home() {
  return (
    <Stack gap="xl">
      <div>
        <Badge variant="light" color="indigo" mb="sm">
          Desenvolvimento Web III
        </Badge>
        <Title order={1} fz={40} mb="xs">
          Mantine UI
        </Title>
        <Text size="lg" c="dimmed" maw={680}>
          Uma biblioteca moderna de componentes, hooks e utilitários para React —
          e esta própria apresentação foi construída com ela, navegue pelo menu lateral
          para explorar cada parte.
        </Text>
      </div>

      <Paper withBorder radius="md" p="xl" shadow="md">
        <Title order={3} mb="xs">
          O que é a Mantine?
        </Title>
        <Text>
          Mantine é uma biblioteca open-source de componentes React focada em
          usabilidade, acessibilidade e experiência do desenvolvedor. Em vez de
          escrever CSS do zero para cada botão, input ou modal, a Mantine entrega
          blocos de interface prontos — totalmente customizáveis através de um
          sistema de tema único — junto de uma coleção de hooks para resolver
          problemas comuns de estado e interação em React.
        </Text>
      </Paper>

      <div>
        <Title order={3} mb="md">
          Em números
        </Title>
        <SimpleGrid cols={{ base: 2, sm: 4 }}>
          <StatCard icon={IconBox} value="120+" label="Componentes" />
          <StatCard icon={IconBolt} value="70+" label="Hooks" />
          <StatCard icon={IconCheck} value="100%" label="TypeScript" />
          <StatCard icon={IconStar} value="30k+" label="Estrelas no GitHub" />
        </SimpleGrid>
      </div>

      <div>
        <Title order={3} mb="sm">
          Principais vantagens
        </Title>
        <List
          spacing="sm"
          icon={
            <ThemeIcon color="indigo" size={22} radius="xl" variant="light">
              <IconCheck size={14} />
            </ThemeIcon>
          }
        >
          {advantages.map((item) => (
            <List.Item key={item}>{item}</List.Item>
          ))}
        </List>
      </div>

      <Group gap={6}>
        <Text size="sm" c="dimmed">
          Use os botões abaixo (ou o menu lateral) para navegar pela apresentação, como em slides.
        </Text>
      </Group>

      <PageFooterNav />
    </Stack>
  );
}
