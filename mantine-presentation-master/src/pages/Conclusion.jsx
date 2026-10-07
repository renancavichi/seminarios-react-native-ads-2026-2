import { Title, Text, Stack, SimpleGrid, Paper, Group, ThemeIcon, List, Badge } from '@mantine/core';
import { IconThumbUp, IconThumbDown, IconConfetti } from '@tabler/icons-react';
import PageFooterNav from '../components/PageFooterNav';

const pros = [
  'Mais de 120 componentes prontos, acessíveis e bem documentados.',
  'Sistema de tema único, com dark mode nativo em todos os componentes.',
  'Mais de 70 hooks utilitários que resolvem problemas comuns sem dependências extras.',
  'TypeScript de ponta a ponta, com excelente autocomplete.',
  'Comunidade grande e ativa, com atualizações frequentes.',
];

const cons = [
  'Curva de aprendizado inicial para entender o sistema de tema e Styles API.',
  'Bundle final pode crescer se muitos pacotes @mantine/* forem incluídos sem necessidade.',
  'Customizações muito fora do padrão visual da Mantine exigem mais esforço de sobrescrita.',
  'Depende de manter os pacotes @mantine/* sempre na mesma versão entre si.',
];

export default function Conclusion() {
  return (
    <Stack gap="xl">
      <div>
        <Badge variant="light" color="indigo" mb="sm">
          Encerramento
        </Badge>
        <Title order={1} mb="xs">
          Conclusão
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          A Mantine se mostrou uma biblioteca completa para acelerar o desenvolvimento
          de interfaces React sem abrir mão de acessibilidade, consistência visual e
          experiência de desenvolvimento — inclusive esta própria apresentação é prova disso.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Paper withBorder radius="md" p="lg">
          <Group mb="sm">
            <ThemeIcon color="teal" variant="light" radius="md">
              <IconThumbUp size={16} />
            </ThemeIcon>
            <Text fw={600}>Vantagens</Text>
          </Group>
          <List size="sm" spacing="sm">
            {pros.map((item) => (
              <List.Item key={item}>{item}</List.Item>
            ))}
          </List>
        </Paper>

        <Paper withBorder radius="md" p="lg">
          <Group mb="sm">
            <ThemeIcon color="red" variant="light" radius="md">
              <IconThumbDown size={16} />
            </ThemeIcon>
            <Text fw={600}>Desvantagens</Text>
          </Group>
          <List size="sm" spacing="sm">
            {cons.map((item) => (
              <List.Item key={item}>{item}</List.Item>
            ))}
          </List>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="lg" bg="indigo.0">
        <Group mb={6}>
          <ThemeIcon color="indigo" variant="filled" radius="md">
            <IconConfetti size={16} />
          </ThemeIcon>
          <Text fw={600}>Para fechar</Text>
        </Group>
        <Text size="sm">
          Construir esta apresentação como uma aplicação React com Mantine, em vez de
          slides estáticos, foi também a forma mais direta de demonstrar, na prática,
          tudo o que foi explicado: componentização, reaproveitamento de código,
          responsividade e um sistema de tema consistente do início ao fim.
        </Text>
      </Paper>

      <PageFooterNav />
    </Stack>
  );
}
