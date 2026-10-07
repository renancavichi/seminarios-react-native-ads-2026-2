import { Paper, Text, Group, ThemeIcon } from '@mantine/core';

export default function StatCard({ icon: Icon, value, label, color = 'indigo' }) {
  return (
    <Paper withBorder radius="md" p="lg" shadow="md">
      <Group justify="space-between" mb={6}>
        <Text size="xs" c="dimmed" fw={600} tt="uppercase">
          {label}
        </Text>
        <ThemeIcon variant="light" color={color} size={30} radius="md">
          <Icon size={18} />
        </ThemeIcon>
      </Group>
      <Text fz={32} fw={800}>
        {value}
      </Text>
    </Paper>
  );
}
