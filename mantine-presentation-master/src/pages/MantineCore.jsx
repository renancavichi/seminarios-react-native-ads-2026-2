import { Title, Text, Stack, SimpleGrid, Paper, Group, Badge, ThemeIcon } from '@mantine/core';
import {
  IconBox,
  IconBolt,
  IconForms,
  IconCalendar,
  IconBellRinging,
  IconLayout2,
  IconUpload,
  IconChartBar,
  IconCode,
} from '@tabler/icons-react';
import PageFooterNav from '../components/PageFooterNav';

const packages = [
  {
    name: '@mantine/core',
    icon: IconBox,
    desc: 'O coração da biblioteca: mais de 120 componentes de UI (botões, inputs, layout, overlays, etc).',
    tag: 'obrigatório',
  },
  {
    name: '@mantine/hooks',
    icon: IconBolt,
    desc: 'Mais de 70 hooks utilitários para estado, DOM, storage, performance e muito mais.',
    tag: 'obrigatório',
  },
  {
    name: '@mantine/form',
    icon: IconForms,
    desc: 'Gerenciamento de formulários performático, com validação e integração nativa com os inputs.',
    tag: 'extensão',
  },
  {
    name: '@mantine/dates',
    icon: IconCalendar,
    desc: 'Calendários, date pickers e time pickers construídos sobre os componentes do core.',
    tag: 'extensão',
  },
  {
    name: '@mantine/notifications',
    icon: IconBellRinging,
    desc: 'Sistema de notificações (toasts) disparadas via JavaScript, fora do fluxo de render.',
    tag: 'extensão',
  },
  {
    name: '@mantine/modals',
    icon: IconLayout2,
    desc: 'Gerenciador de modais imperativo — abre confirmações e diálogos sem montar JSX manualmente.',
    tag: 'extensão',
  },
  {
    name: '@mantine/dropzone',
    icon: IconUpload,
    desc: 'Área de upload de arquivos com drag-and-drop, validação de tipo e tamanho.',
    tag: 'extensão',
  },
  {
    name: '@mantine/charts',
    icon: IconChartBar,
    desc: 'Gráficos (linha, barra, pizza, área) construídos sobre Recharts com a identidade visual da Mantine.',
    tag: 'extensão',
  },
  {
    name: '@mantine/code-highlight',
    icon: IconCode,
    desc: 'Exibição de blocos de código com syntax highlight — usado em todos os exemplos deste site.',
    tag: 'extensão',
  },
];

export default function MantineCore() {
  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Mantine Core
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          A Mantine é dividida em pacotes independentes. Apenas{' '}
          <Text span fw={600}>
            @mantine/core
          </Text>{' '}
          e{' '}
          <Text span fw={600}>
            @mantine/hooks
          </Text>{' '}
          são obrigatórios — o restante é instalado sob demanda.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {packages.map((pkg) => (
          <Paper key={pkg.name} withBorder radius="md" p="lg">
            <Group justify="space-between" mb={6}>
              <Group gap={8}>
                <ThemeIcon variant="light" color="indigo" radius="md">
                  <pkg.icon size={16} />
                </ThemeIcon>
                <Text fw={600} ff="monospace" fz="sm">
                  {pkg.name}
                </Text>
              </Group>
              <Badge
                size="sm"
                variant="dot"
                color={pkg.tag === 'obrigatório' ? 'red' : 'gray'}
              >
                {pkg.tag}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {pkg.desc}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      <PageFooterNav />
    </Stack>
  );
}
