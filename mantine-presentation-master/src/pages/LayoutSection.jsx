import { Title, Text, Stack as MStack, Flex, Grid, Group, AspectRatio, Splitter, Paper } from '@mantine/core';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

const colorBox = (color, label) => (
  <Paper bg={color} c="white" p="sm" radius="sm" ta="center" fz="sm" fw={600} key={label}>
    {label}
  </Paper>
);

export default function LayoutSection() {
  return (
    <MStack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Componentes de Layout
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          A base de qualquer interface: como posicionar e organizar elementos na tela.
        </Text>
      </div>

      <DemoSection
        title="AspectRatio"
        description="Mantém uma proporção fixa entre largura e altura, ideal para vídeos, mapas e imagens."
        code={`<AspectRatio ratio={16 / 9} maw={400}>\n  <iframe title="demo" src="about:blank" />\n</AspectRatio>`}
      >
        <AspectRatio ratio={16 / 9} maw={400}>
          <Paper bg="indigo.5" c="white" ta="center" radius="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            16 : 9
          </Paper>
        </AspectRatio>
      </DemoSection>

      <DemoSection
        title="Flex"
        description="Wrapper sobre flexbox com props diretas para direção, alinhamento e espaçamento."
        code={`<Flex gap="md" justify="space-between" align="center" wrap="wrap">\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</Flex>`}
      >
        <Flex gap="md" justify="space-between" align="center" wrap="wrap">
          {colorBox('indigo.5', 'Item 1')}
          {colorBox('indigo.6', 'Item 2')}
          {colorBox('indigo.7', 'Item 3')}
        </Flex>
      </DemoSection>

      <DemoSection
        title="Grid"
        description="Sistema de grid de 12 colunas, com breakpoints responsivos por coluna."
        code={`<Grid>\n  <Grid.Col span={4}>Coluna 4</Grid.Col>\n  <Grid.Col span={4}>Coluna 4</Grid.Col>\n  <Grid.Col span={4}>Coluna 4</Grid.Col>\n</Grid>`}
      >
        <Grid>
          <Grid.Col span={4}>{colorBox('teal.6', 'span 4')}</Grid.Col>
          <Grid.Col span={4}>{colorBox('teal.7', 'span 4')}</Grid.Col>
          <Grid.Col span={4}>{colorBox('teal.8', 'span 4')}</Grid.Col>
        </Grid>
      </DemoSection>

      <DemoSection
        title="Group"
        description="Distribui elementos em linha horizontal, com controle de espaçamento e quebra."
        code={`<Group gap="sm">\n  <Button>Salvar</Button>\n  <Button variant="outline">Cancelar</Button>\n</Group>`}
      >
        <Group gap="sm">
          {colorBox('grape.5', 'A')}
          {colorBox('grape.6', 'B')}
          {colorBox('grape.7', 'C')}
        </Group>
      </DemoSection>

      <DemoSection
        title="Splitter"
        description="Painéis redimensionáveis pelo usuário, arrastando a divisória entre eles."
        code={`<Splitter orientation="horizontal" h={140}>\n  <Splitter.Pane defaultSize={50} min={20}>Painel 1</Splitter.Pane>\n  <Splitter.Pane defaultSize={50} min={20}>Painel 2</Splitter.Pane>\n</Splitter>`}
      >
        <Splitter orientation="horizontal" h={140}>
          <Splitter.Pane defaultSize={50} min={20}>
            <Paper h="100%" bg="orange.1" p="sm">
              Arraste a divisória →
            </Paper>
          </Splitter.Pane>
          <Splitter.Pane defaultSize={50} min={20}>
            <Paper h="100%" bg="orange.2" p="sm">
              ← para redimensionar
            </Paper>
          </Splitter.Pane>
        </Splitter>
      </DemoSection>

      <DemoSection
        title="Stack"
        description="Distribui elementos em coluna vertical, com espaçamento consistente."
        code={`<Stack gap="xs">\n  <div>Linha 1</div>\n  <div>Linha 2</div>\n  <div>Linha 3</div>\n</Stack>`}
      >
        <MStack gap="xs">
          {colorBox('cyan.5', 'Linha 1')}
          {colorBox('cyan.6', 'Linha 2')}
          {colorBox('cyan.7', 'Linha 3')}
        </MStack>
      </DemoSection>

      <PageFooterNav />
    </MStack>
  );
}
