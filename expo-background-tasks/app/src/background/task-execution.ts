import type { TaskSettings } from './settings-validation';

/** Envia a mensagem configurada. */
export async function executeTask(
  settings: TaskSettings,
  actions: { notify: (message: string) => Promise<void> },
): Promise<void> {
  await actions.notify(settings.message);
}
