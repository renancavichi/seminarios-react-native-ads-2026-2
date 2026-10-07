import { Title, Text, Stack, SimpleGrid, Paper, Group, ThemeIcon, Table, Badge } from '@mantine/core';
import {
  IconCode,
  IconRocket,
  IconLayout2,
  IconDeviceMobile,
  IconAccessible,
  IconX,
  IconCheck,
} from '@tabler/icons-react';
import CodeBlock from '../components/CodeBlock';
import PageFooterNav from '../components/PageFooterNav';

const plainCss = `
function Button({ children }) {
  return (
    <button className="my-button" onClick={...}>
      {children}
    </button>
  );
}

/* my-button.css — escrito e mantido manualmente */
.my-button {
  background: #4263eb;
  color: white;
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
.my-button:hover { background: #364fc7; }
.my-button:focus-visible { outline: 2px solid #4263eb; }
.my-button:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const withMantine = `
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button color="indigo" radius="md" onClick={...}>
      Clique aqui
    </Button>
  );
}

// Acessibilidade, foco, hover, disabled, loading e dark mode
// já vêm prontos — sem escrever uma linha de CSS.
`;

const benefits = [
  { icon: IconRocket, title: 'Produtividade', text: 'Componentes prontos eliminam horas de CSS e markup repetitivo.' },
  { icon: IconLayout2, title: 'Padronização', text: 'Mesmo tema, espaçamentos e cores em toda a aplicação, sem retrabalho.' },
  { icon: IconDeviceMobile, title: 'Responsividade', text: 'Props responsivas (base/sm/md/lg) já integradas a cada componente.' },
  { icon: IconAccessible, title: 'Acessibilidade', text: 'Foco, ARIA roles e navegação por teclado seguem padrões WCAG por padrão.' },
];

export default function WhyUseLibrary() {
  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Por que usar uma biblioteca de UI?
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Construir interfaces "na mão" funciona — até a aplicação crescer. Uma
          biblioteca como a Mantine padroniza o que normalmente seria
          reescrito (e re-testado) em todo componente novo.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Paper withBorder radius="md" p="md">
          <Group mb="xs">
            <ThemeIcon color="red" variant="light" radius="md">
              <IconCode size={16} />
            </ThemeIcon>
            <Text fw={600}>Desenvolvimento "puro"</Text>
          </Group>
          <CodeBlock code={plainCss} language="tsx" />
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Group mb="xs">
            <ThemeIcon color="teal" variant="light" radius="md">
              <IconCheck size={16} />
            </ThemeIcon>
            <Text fw={600}>Com Mantine</Text>
          </Group>
          <CodeBlock code={withMantine} language="tsx" />
        </Paper>
      </SimpleGrid>

      <div>
        <Title order={3} mb="md">
          Os quatro ganhos mais diretos
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {benefits.map((b) => (
            <Paper key={b.title} withBorder radius="md" p="lg">
              <Group mb={6}>
                <ThemeIcon variant="light" color="indigo" radius="md">
                  <b.icon size={18} />
                </ThemeIcon>
                <Text fw={600}>{b.title}</Text>
              </Group>
              <Text size="sm" c="dimmed">
                {b.text}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </div>

      <div>
        <Title order={3} mb="sm">
          Comparação resumida
        </Title>
        <Table withTableBorder withColumnBorders verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Critério</Table.Th>
              <Table.Th>CSS / componentes próprios</Table.Th>
              <Table.Th>Mantine UI</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[
              ['Tempo de desenvolvimento', 'Alto — tudo escrito do zero', 'Baixo — componentes prontos'],
              ['Consistência visual', 'Depende de disciplina do time', 'Garantida pelo tema central'],
              ['Acessibilidade', 'Precisa ser implementada manualmente', 'Já incluída nos componentes'],
              ['Dark mode', 'Reescrever estilos', 'Suporte nativo'],
              ['Manutenção', 'Cresce com o projeto', 'Centralizada na biblioteca'],
            ].map(([criterio, semLib, comLib]) => (
              <Table.Tr key={criterio}>
                <Table.Td fw={500}>{criterio}</Table.Td>
                <Table.Td>
                  <Group gap={6} wrap="nowrap">
                    <IconX size={14} color="var(--mantine-color-red-6)" />
                    <Text size="sm">{semLib}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap={6} wrap="nowrap">
                    <IconCheck size={14} color="var(--mantine-color-teal-6)" />
                    <Text size="sm">{comLib}</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Badge mt="sm" variant="light" color="gray">
          Resumo simplificado para fins didáticos
        </Badge>
      </div>

      <PageFooterNav />
    </Stack>
  );
}
