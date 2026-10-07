import {
  Title,
  Text,
  Stack,
  Dialog,
  Drawer,
  LoadingOverlay,
  Menu,
  Button,
  Paper,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings, IconLogout, IconUser, IconTrash } from '@tabler/icons-react';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

export default function OverlaysSection() {
  const [dialogOpened, { toggle: toggleDialog, close: closeDialog }] = useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [loading, { toggle: toggleLoading }] = useDisclosure(false);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Componentes de Overlays
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Elementos que aparecem sobre o conteúdo principal, sem navegar para outra página.
        </Text>
      </div>

      <DemoSection
        title="Dialog"
        description="Caixa flutuante e discreta, geralmente usada para pedir uma confirmação rápida."
        code={`const [opened, { toggle, close }] = useDisclosure(false);\n\n<Button onClick={toggle}>Abrir dialog</Button>\n<Dialog opened={opened} onClose={close} title="Inscreva-se na newsletter">\n  <TextInput placeholder="seu@email.com" />\n</Dialog>`}
      >
        <Button onClick={toggleDialog}>Abrir dialog</Button>
        <Dialog opened={dialogOpened} onClose={closeDialog} size="lg" title="Inscreva-se na newsletter">
          <TextInput placeholder="seu@email.com" mt="sm" />
          <Button mt="sm" size="sm" onClick={closeDialog}>
            Confirmar
          </Button>
        </Dialog>
      </DemoSection>

      <DemoSection
        title="Drawer"
        description="Painel lateral que deslila sobre o conteúdo — ótimo para filtros e formulários secundários."
        code={`const [opened, { open, close }] = useDisclosure(false);\n\n<Button onClick={open}>Abrir drawer</Button>\n<Drawer opened={opened} onClose={close} title="Filtros">\n  {/* conteúdo */}\n</Drawer>`}
      >
        <Button onClick={openDrawer}>Abrir drawer</Button>
        <Drawer opened={drawerOpened} onClose={closeDrawer} title="Filtros" position="right">
          <Text size="sm" c="dimmed">
            Conteúdo de exemplo dentro do drawer.
          </Text>
        </Drawer>
      </DemoSection>

      <DemoSection
        title="LoadingOverlay"
        description="Sobrepõe uma área da tela com um indicador de carregamento, bloqueando interação."
        code={`const [loading, { toggle }] = useDisclosure(false);\n\n<Box pos="relative">\n  <LoadingOverlay visible={loading} />\n  {/* conteúdo */}\n</Box>`}
      >
        <Button onClick={toggleLoading} mb="sm">
          {loading ? 'Parar carregamento' : 'Simular carregamento'}
        </Button>
        <Paper withBorder p="lg" pos="relative" h={120}>
          <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />
          <Text size="sm">Conteúdo coberto durante o carregamento.</Text>
        </Paper>
      </DemoSection>

      <DemoSection
        title="Menu"
        description="Lista de ações flutuante, aberta a partir de um elemento de gatilho (geralmente um botão)."
        code={`<Menu>\n  <Menu.Target><Button>Abrir menu</Button></Menu.Target>\n  <Menu.Dropdown>\n    <Menu.Item leftSection={<IconUser size={14} />}>Perfil</Menu.Item>\n    <Menu.Item leftSection={<IconSettings size={14} />}>Configurações</Menu.Item>\n    <Menu.Divider />\n    <Menu.Item color="red" leftSection={<IconTrash size={14} />}>Excluir conta</Menu.Item>\n  </Menu.Dropdown>\n</Menu>`}
      >
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="default">Abrir menu</Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconUser size={14} />}>Perfil</Menu.Item>
            <Menu.Item leftSection={<IconSettings size={14} />}>Configurações</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
              Excluir conta
            </Menu.Item>
            <Menu.Item leftSection={<IconLogout size={14} />}>Sair</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </DemoSection>

      <PageFooterNav />
    </Stack>
  );
}
