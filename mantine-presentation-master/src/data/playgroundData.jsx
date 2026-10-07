import {
  Button,
  Badge,
  Avatar,
  Switch,
  Progress,
  Alert,
  Rating,
  Tooltip,
  ActionIcon,
  Chip,
  ThemeIcon,
} from '@mantine/core';
import { IconHeart, IconInfoCircle, IconTrash } from '@tabler/icons-react';

export const playgroundItems = [
  {
    value: 'button',
    label: 'Button',
    category: 'Buttons',
    description:
      'Botão de ação principal. Aceita variantes visuais, cores do tema, tamanhos, ícones e estado de carregamento.',
    code: `<Button color="indigo" radius="md" leftSection={<IconHeart size={16} />}>\n  Curtir\n</Button>`,
    render: () => (
      <Button color="indigo" radius="md" leftSection={<IconHeart size={16} />}>
        Curtir
      </Button>
    ),
  },
  {
    value: 'badge',
    label: 'Badge',
    category: 'Data Display',
    description: 'Rótulo curto para status, categorias ou contadores.',
    code: `<Badge color="teal" variant="light">\n  Em estoque\n</Badge>`,
    render: () => (
      <Badge color="teal" variant="light">
        Em estoque
      </Badge>
    ),
  },
  {
    value: 'avatar',
    label: 'Avatar',
    category: 'Data Display',
    description: 'Representação visual de um usuário, com fallback automático para iniciais quando não há imagem.',
    code: `<Avatar color="indigo" radius="xl">\n  MS\n</Avatar>`,
    render: () => (
      <Avatar color="indigo" radius="xl" size="lg">
        MS
      </Avatar>
    ),
  },
  {
    value: 'switch',
    label: 'Switch',
    category: 'Inputs',
    description: 'Alternância booleana estilo iOS — usada para ativar/desativar configurações.',
    code: `<Switch defaultChecked label="Modo escuro" />`,
    render: () => <Switch defaultChecked label="Modo escuro" />,
  },
  {
    value: 'progress',
    label: 'Progress',
    category: 'Feedback',
    description: 'Barra horizontal que comunica o progresso de uma tarefa de duração conhecida.',
    code: `<Progress value={72} color="indigo" animated />`,
    render: () => <Progress value={72} color="indigo" animated />,
  },
  {
    value: 'alert',
    label: 'Alert',
    category: 'Feedback',
    description: 'Caixa de aviso contextual, com ícone, título e cor configuráveis.',
    code: `<Alert icon={<IconInfoCircle />} color="yellow" title="Aviso">\n  Verifique os dados antes de continuar.\n</Alert>`,
    render: () => (
      <Alert icon={<IconInfoCircle size={18} />} color="yellow" title="Aviso">
        Verifique os dados antes de continuar.
      </Alert>
    ),
  },
  {
    value: 'rating',
    label: 'Rating',
    category: 'Inputs',
    description: 'Avaliação por estrelas com suporte a valores fracionados.',
    code: `<Rating defaultValue={4} />`,
    render: () => <Rating defaultValue={4} />,
  },
  {
    value: 'tooltip',
    label: 'Tooltip',
    category: 'Overlays',
    description: 'Texto explicativo exibido ao passar o mouse (ou focar) sobre um elemento.',
    code: `<Tooltip label="Excluir item permanentemente">\n  <ActionIcon color="red" variant="light">\n    <IconTrash size={16} />\n  </ActionIcon>\n</Tooltip>`,
    render: () => (
      <Tooltip label="Excluir item permanentemente">
        <ActionIcon color="red" variant="light" size="lg">
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    ),
  },
  {
    value: 'chip',
    label: 'Chip',
    category: 'Inputs',
    description: 'Seleção visual compacta, comum em filtros e tags selecionáveis.',
    code: `<Chip defaultChecked color="indigo">\n  React\n</Chip>`,
    render: () => (
      <Chip defaultChecked color="indigo">
        React
      </Chip>
    ),
  },
  {
    value: 'themeicon',
    label: 'ThemeIcon',
    category: 'Data Display',
    description: 'Envolve um ícone em um fundo colorido consistente com o tema — usado em listas e cards.',
    code: `<ThemeIcon color="grape" variant="light" size={36} radius="md">\n  <IconHeart size={18} />\n</ThemeIcon>`,
    render: () => (
      <ThemeIcon color="grape" variant="light" size={36} radius="md">
        <IconHeart size={18} />
      </ThemeIcon>
    ),
  },
];
