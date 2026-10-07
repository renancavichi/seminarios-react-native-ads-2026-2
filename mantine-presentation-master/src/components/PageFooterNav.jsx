import { Group, Button, Text, Box } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSurroundingPages } from '../data/navigation';

export default function PageFooterNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prev, next, index, total } = getSurroundingPages(location.pathname);

  return (
    <Box mt="xl" pt="lg" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
      <Group justify="space-between" wrap="nowrap">
        <Button
          variant="default"
          leftSection={<IconArrowLeft size={16} />}
          disabled={!prev}
          onClick={() => prev && navigate(prev.path)}
        >
          {prev ? prev.label : 'Anterior'}
        </Button>

        <Text size="sm" c="dimmed">
          {index + 1} / {total}
        </Text>

        <Button
          rightSection={<IconArrowRight size={16} />}
          disabled={!next}
          onClick={() => next && navigate(next.path)}
        >
          {next ? next.label : 'Próximo'}
        </Button>
      </Group>
    </Box>
  );
}
