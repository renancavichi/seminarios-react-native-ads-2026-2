import { Title, Text, Stack, Tabs, Paper, Group, ThemeIcon } from '@mantine/core';
import { IconBrandNpm, IconBrandYarn } from '@tabler/icons-react';
import CodeBlock from '../components/CodeBlock';
import PageFooterNav from '../components/PageFooterNav';

const npmInstall = `npm install @mantine/core @mantine/hooks`;
const yarnInstall = `yarn add @mantine/core @mantine/hooks`;
const pnpmInstall = `pnpm add @mantine/core @mantine/hooks`;

const stylesImport = `
// no arquivo de entrada da aplicação (ex: main.jsx)
import '@mantine/core/styles.css';
`;

const providerSetup = `
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {/* o restante da aplicação */}
    </MantineProvider>
  );
}
`;

function Step({ number, title, description, children }) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Group mb="xs">
        <ThemeIcon color="indigo" radius="xl" size={28}>
          {number}
        </ThemeIcon>
        <div>
          <Text fw={600}>{title}</Text>
          <Text size="xs" c="dimmed">{description}</Text>
        </div>
      </Group>
      {children}
    </Paper>
  );
}

export default function Installation() {
  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Instalação
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Três passos para ter a Mantine funcionando em um projeto React/Vite.
        </Text>
      </div>

      <Stack gap="md">
        <Step number={1} title="Instalar pacotes" description="@mantine/core + @mantine/hooks">
          <Tabs defaultValue="npm">
            <Tabs.List>
              <Tabs.Tab value="npm" leftSection={<IconBrandNpm size={16} />}>
                npm
              </Tabs.Tab>
              <Tabs.Tab value="yarn" leftSection={<IconBrandYarn size={16} />}>
                yarn
              </Tabs.Tab>
              <Tabs.Tab value="pnpm">pnpm</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="npm" pt="sm">
              <CodeBlock code={npmInstall} language="bash" />
            </Tabs.Panel>
            <Tabs.Panel value="yarn" pt="sm">
              <CodeBlock code={yarnInstall} language="bash" />
            </Tabs.Panel>
            <Tabs.Panel value="pnpm" pt="sm">
              <CodeBlock code={pnpmInstall} language="bash" />
            </Tabs.Panel>
          </Tabs>
        </Step>

        <Step number={2} title="Importar estilos" description="styles.css global, uma única vez">
          <Text size="sm" mb="sm">
            A folha de estilos base precisa ser importada antes de qualquer estilo
            próprio da aplicação.
          </Text>
          <CodeBlock code={stylesImport} language="tsx" />
        </Step>

        <Step number={3} title="Configurar o Provider" description="MantineProvider + tema">
          <Text size="sm" mb="sm">
            Todo componente Mantine precisa estar dentro de um{' '}
            <Text span fw={600}>
              MantineProvider
            </Text>
            , responsável por distribuir o tema (cores, radius, fontes) para a árvore
            de componentes.
          </Text>
          <CodeBlock code={providerSetup} language="tsx" />
        </Step>
      </Stack>

      <PageFooterNav />
    </Stack>
  );
}
