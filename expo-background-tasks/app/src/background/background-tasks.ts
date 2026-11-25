import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { requestNotificationPermission } from './notifications';
import { saveSettings } from './settings';
import { type TaskSettings, normalizeSettings } from './settings-validation';
import { TASK_NAME } from './task';

/** Consulta a disponibilidade do serviço e o registro persistido da tarefa. */
export async function getTaskState(): Promise<{ available: boolean; registered: boolean }> {
  if (Platform.OS === 'web' || !(await TaskManager.isAvailableAsync())) {
    return { available: false, registered: false };
  }
  const [status, registered] = await Promise.all([
    BackgroundTask.getStatusAsync(),
    TaskManager.isTaskRegisteredAsync(TASK_NAME),
  ]);
  return { available: status === BackgroundTask.BackgroundTaskStatus.Available, registered };
}

/** Salva as opções e registra a tarefa, recriando o registro se o intervalo mudar. */
export async function registerTask(settings: TaskSettings): Promise<TaskSettings> {
  const normalized = normalizeSettings(settings);
  const state = await getTaskState();
  if (!state.available) throw new Error('Tarefas em segundo plano indisponíveis neste ambiente.');
  if (!(await requestNotificationPermission())) {
    throw new Error('Permita notificações nas configurações do dispositivo para continuar.');
  }
  const previous = state.registered
    ? await TaskManager.getTaskOptionsAsync<BackgroundTask.BackgroundTaskOptions>(TASK_NAME)
    : null;
  await saveSettings(normalized);
  // O SDK 54 ignora um novo registro enquanto a tarefa já estiver registrada.
  if (state.registered && previous?.minimumInterval !== normalized.minimumInterval) {
    await BackgroundTask.unregisterTaskAsync(TASK_NAME);
  }
  await BackgroundTask.registerTaskAsync(TASK_NAME, { minimumInterval: normalized.minimumInterval });
  if (!(await TaskManager.isTaskRegisteredAsync(TASK_NAME))) {
    throw new Error('Não foi possível confirmar o registro da tarefa.');
  }
  return normalized;
}

/** Cancela as próximas execuções da tarefa registrada. */
export async function unregisterTask(): Promise<void> {
  await BackgroundTask.unregisterTaskAsync(TASK_NAME);
}

/** Solicita ao worker a execução de teste, disponível apenas em desenvolvimento. */
export async function triggerTestWorker(): Promise<void> {
  if (!__DEV__) throw new Error('O disparo experimental só está disponível em desenvolvimento.');
  const triggered = await BackgroundTask.triggerTaskWorkerForTestingAsync();
  // No SDK 54 o Android pode resolver sem valor, apesar da tipagem Promise<boolean>.
  if (triggered === false) throw new Error('Não foi possível acionar o worker de teste.');
}
