import { Title, Text, Stack, Highlight } from '@mantine/core';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

export default function TypographySection() {
  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Componentes de Typography
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Texto é a base de qualquer interface — a Mantine padroniza escala e estilo.
        </Text>
      </div>

      <DemoSection
        title="Title"
        description="Equivalente direto às tags h1–h6, com a escala tipográfica do tema aplicada automaticamente."
        code={`<Title order={1}>Título 1</Title>\n<Title order={2}>Título 2</Title>\n<Title order={3}>Título 3</Title>`}
      >
        <Title order={1}>Título nível 1</Title>
        <Title order={2}>Título nível 2</Title>
        <Title order={3}>Título nível 3</Title>
        <Title order={4}>Título nível 4</Title>
      </DemoSection>

      <DemoSection
        title="Text"
        description="O componente de parágrafo, com props para tamanho, peso, cor, truncamento e gradiente."
        code={`<Text size="lg" fw={600}>Texto grande e em negrito</Text>\n<Text c="dimmed">Texto secundário (dimmed)</Text>\n<Text variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} fw={700}>\n  Texto com gradiente\n</Text>`}
      >
        <Text size="lg" fw={600}>Texto grande e em negrito</Text>
        <Text c="dimmed">Texto secundário (dimmed)</Text>
        <Text variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} fw={700} fz="xl">
          Texto com gradiente
        </Text>
      </DemoSection>

      <DemoSection
        title="Highlight"
        description="Destaca trechos específicos dentro de um bloco de texto, útil em resultados de busca."
        code={`<Highlight highlight={['Mantine', 'componentes']}>\n  A Mantine entrega mais de 120 componentes prontos para uso.\n</Highlight>`}
      >
        <Highlight highlight={['Mantine', 'componentes']} highlightStyles={{ fontWeight: 700 }}>
          A Mantine entrega mais de 120 componentes prontos para uso em qualquer aplicação React.
        </Highlight>
      </DemoSection>

      <PageFooterNav />
    </Stack>
  );
}
