import { Paper, Title, Text, Stack, Divider } from '@mantine/core';
import CodeBlock from './CodeBlock';

export default function DemoSection({ title, description, code, language = 'tsx', children }) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={4} mb={4}>
        {title}
      </Title>
      {description && (
        <Text size="sm" c="dimmed" mb="md">
          {description}
        </Text>
      )}
      <div className="demo-box">
        <Stack>{children}</Stack>
      </div>
      {code && (
        <>
          <Divider my="md" label="código" labelPosition="left" />
          <CodeBlock code={code} language={language} />
        </>
      )}
    </Paper>
  );
}
