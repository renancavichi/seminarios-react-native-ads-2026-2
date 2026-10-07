import { useState } from 'react';
import { Title, Text, Stack, Select, Paper, Group, Badge, Divider } from '@mantine/core';
import CodeBlock from '../components/CodeBlock';
import PageFooterNav from '../components/PageFooterNav';
import { playgroundItems } from '../data/playgroundData';

export default function Playground() {
  const [selected, setSelected] = useState(playgroundItems[0].value);
  const current = playgroundItems.find((item) => item.value === selected);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Playground Interativo
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Escolha um componente abaixo para ver sua descrição, o código de exemplo e o
          resultado renderizado, lado a lado.
        </Text>
      </div>

      <Select
        label="Componente"
        placeholder="Selecione um componente"
        data={playgroundItems.map((item) => ({ value: item.value, label: item.label }))}
        value={selected}
        onChange={(value) => value && setSelected(value)}
        maw={320}
        allowDeselect={false}
      />

      {current && (
        <Paper withBorder radius="md" p="lg" key={current.value} className="section-fade">
          <Group justify="space-between" mb="sm">
            <Title order={3}>{current.label}</Title>
            <Badge variant="light" color="indigo">
              {current.category}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" mb="md">
            {current.description}
          </Text>

          <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={6}>
            Componente renderizado
          </Text>
          <div className="demo-box" style={{ marginBottom: 'var(--mantine-spacing-md)' }}>
            {current.render()}
          </div>

          <Divider mb="md" label="código de exemplo" labelPosition="left" />
          <CodeBlock code={current.code} language="tsx" />
        </Paper>
      )}

      <PageFooterNav />
    </Stack>
  );
}
