import { useState } from 'react';
import { Title, Text, Stack, Alert, Notification, Loader, Progress, Group, Button } from '@mantine/core';
import { IconInfoCircle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import DemoSection from '../components/DemoSection';
import PageFooterNav from '../components/PageFooterNav';

export default function FeedbackSection() {
  const [progress, setProgress] = useState(62);

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} mb="xs">
          Componentes de Feedback
        </Title>
        <Text c="dimmed" size="lg" maw={680}>
          Como comunicar estado, progresso e resultado de uma ação ao usuário.
        </Text>
      </div>

      <DemoSection
        title="Alert"
        description="Mensagem fixa na tela, usada para avisos contextuais que não desaparecem por conta própria."
        code={`<Alert icon={<IconInfoCircle />} title="Atenção" color="indigo">\n  Esta é uma mensagem de alerta contextual.\n</Alert>`}
      >
        <Alert icon={<IconInfoCircle size={18} />} title="Atenção" color="indigo">
          Esta é uma mensagem de alerta contextual.
        </Alert>
      </DemoSection>

      <DemoSection
        title="Notification"
        description="Componente estático de notificação (card), e também o sistema de toasts via JavaScript, disparado fora do fluxo de render."
        code={`<Notification icon={<IconCheck />} color="teal" title="Salvo com sucesso">\n  Suas alterações foram salvas.\n</Notification>\n\n// Disparado via JS, sem precisar montar JSX:\nnotifications.show({ title: 'Pronto!', message: 'Ação concluída.', color: 'teal' });`}
      >
        <Notification icon={<IconCheck size={18} />} color="teal" title="Salvo com sucesso" onClose={() => {}}>
          Suas alterações foram salvas.
        </Notification>
        <Group>
          <Button
            variant="light"
            onClick={() =>
              notifications.show({
                title: 'Notificação disparada',
                message: 'Esta é uma notificação via @mantine/notifications.',
                color: 'indigo',
              })
            }
          >
            Disparar toast
          </Button>
        </Group>
      </DemoSection>

      <DemoSection
        title="Loader"
        description="Indicador de carregamento, com três variantes visuais."
        code={`<Loader />\n<Loader type="dots" />\n<Loader type="bars" />`}
      >
        <Group>
          <Loader />
          <Loader type="dots" />
          <Loader type="bars" />
        </Group>
      </DemoSection>

      <DemoSection
        title="Progress"
        description="Barra de progresso determinada, útil para uploads, downloads e etapas de um processo."
        code={`const [progress, setProgress] = useState(62);\n<Progress value={progress} animated />`}
      >
        <Progress value={progress} animated color="indigo" />
        <Group>
          <Button size="xs" variant="default" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
            -10%
          </Button>
          <Button size="xs" variant="default" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
            +10%
          </Button>
          <Text size="sm" c="dimmed">{progress}%</Text>
        </Group>
      </DemoSection>

      <PageFooterNav />
    </Stack>
  );
}
