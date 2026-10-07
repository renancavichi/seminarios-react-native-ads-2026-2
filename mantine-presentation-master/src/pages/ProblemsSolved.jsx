import { Title, Text, Stack, Accordion, Group, ThemeIcon } from '@mantine/core';
import {
  IconBrush,
  IconLayout2,
  IconDeviceMobile,
  IconAccessible,
  IconRecycle,
} from '@tabler/icons-react';
import CodeBlock from '../components/CodeBlock';
import PageFooterNav from '../components/PageFooterNav';

const responsiveCode = `
import { Group } from '@mantine/core';

// Em telas pequenas os itens ficam em coluna,
// em telas médias+ ficam em linha — sem media query manual.
<Group grow preventGrowOverflow={false}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Group>

<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
  {/* ... */}
</SimpleGrid>
`;

const reuseCode = `
// Um único Button reutilizado em toda a aplicação,
// com variações controladas por props — não por cópias de CSS.
<Button variant="filled">Salvar</Button>
<Button variant="outline" color="red">Excluir</Button>
<Button variant="light" loading>Enviando...</Button>
`;

const problems = [
  {
    value: 'css',
    icon: IconBrush,
    title: 'Muito CSS para manter',
    text: 'Cada novo componente normalmente exige escrever, nomear e manter arquivos CSS próprios. A Mantine já entrega o estilo base de mais de 120 componentes, restando apenas ajustar via props e tema.',
  },
  {
    value: 'consistencia',
    icon: IconLayout2,
    title: 'Falta de consistência visual',
    text: 'Sem um sistema central, cada desenvolvedor acaba criando variações sutis de cor, espaçamento e tipografia. O tema da Mantine centraliza esses tokens, garantindo a mesma aparência em qualquer tela.',
  },
  {
    value: 'responsividade',
    icon: IconDeviceMobile,
    title: 'Responsividade',
    text: 'Adaptar layouts para mobile, tablet e desktop manualmente exige várias media queries. Componentes como SimpleGrid, Group e Flex aceitam valores responsivos diretamente como prop.',
    code: responsiveCode,
  },
  {
    value: 'acessibilidade',
    icon: IconAccessible,
    title: 'Acessibilidade',
    text: 'Atributos ARIA, foco visível e navegação por teclado são frequentemente esquecidos em componentes feitos do zero. Na Mantine, esse comportamento já vem implementado e testado.',
  },
  {
    value: 'reutilizacao',
    icon: IconRecycle,
    title: 'Reutilização de componentes',
    text: 'Em vez de duplicar markup e estilos para cada variação visual, um único componente Mantine cobre múltiplos casos através de props.',
    code: reuseCode,
  },
];

export default function ProblemsSolved() {
  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Problemas que a Mantine resolve
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Cinco dores comuns no desenvolvimento de interfaces React — e como a
          biblioteca endereça cada uma delas.
        </Text>
      </div>

      <Accordion variant="separated" radius="md" defaultValue="css">
        {problems.map((p) => (
          <Accordion.Item key={p.value} value={p.value}>
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" color="indigo" size={28} radius="md">
                  <p.icon size={16} />
                </ThemeIcon>
              }
            >
              {p.title}
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" mb={p.code ? 'sm' : 0}>
                {p.text}
              </Text>
              {p.code && <CodeBlock code={p.code} language="tsx" />}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      <PageFooterNav />
    </Stack>
  );
}
