import { useState } from 'react';
import { Title, Text, Stack, Tabs, Pagination, Tree, useTree, getTreeExpandedState } from '@mantine/core';
import { IconPhoto, IconMessage, IconSettings } from '@tabler/icons-react';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

const treeData = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'src/components',
        label: 'components',
        children: [
          { value: 'src/components/Button.tsx', label: 'Button.tsx' },
          { value: 'src/components/Input.tsx', label: 'Input.tsx' },
        ],
      },
      { value: 'src/App.tsx', label: 'App.tsx' },
    ],
  },
  { value: 'package.json', label: 'package.json' },
];

export default function NavigationSection() {
  const [page, setPage] = useState(1);
  const tree = useTree({ initialExpandedState: getTreeExpandedState(treeData, ['src']) });

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Componentes de Navigation
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Como organizar e mover o usuário entre conteúdos.
        </Text>
      </div>

      <DemoSection
        title="Tabs"
        description="Organiza conteúdo em seções alternáveis, mantendo o contexto na mesma área."
        code={`<Tabs defaultValue="gallery">\n  <Tabs.List>\n    <Tabs.Tab value="gallery" leftSection={<IconPhoto size={16} />}>Galeria</Tabs.Tab>\n    <Tabs.Tab value="messages" leftSection={<IconMessage size={16} />}>Mensagens</Tabs.Tab>\n    <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>Configurações</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel value="gallery" pt="sm">Conteúdo da galeria</Tabs.Panel>\n  ...\n</Tabs>`}
      >
        <Tabs defaultValue="gallery">
          <Tabs.List>
            <Tabs.Tab value="gallery" leftSection={<IconPhoto size={16} />}>
              Galeria
            </Tabs.Tab>
            <Tabs.Tab value="messages" leftSection={<IconMessage size={16} />}>
              Mensagens
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
              Configurações
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="gallery" pt="sm">
            <Text size="sm">Conteúdo da galeria.</Text>
          </Tabs.Panel>
          <Tabs.Panel value="messages" pt="sm">
            <Text size="sm">Conteúdo de mensagens.</Text>
          </Tabs.Panel>
          <Tabs.Panel value="settings" pt="sm">
            <Text size="sm">Conteúdo de configurações.</Text>
          </Tabs.Panel>
        </Tabs>
      </DemoSection>

      <DemoSection
        title="Pagination"
        description="Navegação entre páginas de uma listagem, com estado controlado."
        code={`const [page, setPage] = useState(1);\n<Pagination total={10} value={page} onChange={setPage} />`}
      >
        <Pagination total={10} value={page} onChange={setPage} />
        <Text size="sm" c="dimmed">Página atual: {page}</Text>
      </DemoSection>

      <DemoSection
        title="Tree"
        description="Estrutura hierárquica expansível, útil para árvores de arquivos, categorias e menus aninhados."
        code={`const tree = useTree({ initialExpandedState: getTreeExpandedState(data, ['src']) });\n<Tree data={data} tree={tree} />`}
      >
        <Tree data={treeData} tree={tree} />
      </DemoSection>

      <PageFooterNav />
    </Stack>
  );
}
