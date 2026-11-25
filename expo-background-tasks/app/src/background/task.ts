import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { sendTaskNotification } from './notifications';
import { loadSettings } from './settings';
import { executeTask } from './task-execution';

export const TASK_NAME = 'background-notification-task';

// A definição precisa existir ao iniciar o JavaScript, inclusive sem interface montada.
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const settings = await loadSettings();
    await executeTask(settings, { notify: sendTaskNotification });
    console.log('Tarefa executada; notificação local solicitada.');
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('Falha ao executar a tarefa:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});
