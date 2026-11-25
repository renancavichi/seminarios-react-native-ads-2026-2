import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'background-tasks';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** Prepara o canal Android e solicita a permissão necessária para exibir notificações. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Tarefas em segundo plano',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** Emite uma notificação local imediatamente após a tarefa ser executada. */
export async function sendTaskNotification(message: string): Promise<void> {
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) throw new Error('Permissão para notificações não concedida.');
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Background Tasks', body: message },
    trigger: Platform.OS === 'android' ? { channelId: CHANNEL_ID } : null,
  });
}
