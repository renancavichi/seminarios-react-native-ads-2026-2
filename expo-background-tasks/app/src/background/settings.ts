import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS, normalizeSettings, type TaskSettings } from './settings-validation';

const SETTINGS_KEY = '@background-tasks/settings';

/** Recupera a configuração persistida ou os valores padrão na primeira execução. */
export async function loadSettings(): Promise<TaskSettings> {
  const value = await AsyncStorage.getItem(SETTINGS_KEY);
  if (value === null) return DEFAULT_SETTINGS;
  return normalizeSettings(JSON.parse(value) as TaskSettings);
}

/** Valida e persiste a configuração que será lida pelo executor em segundo plano. */
export async function saveSettings(settings: TaskSettings): Promise<TaskSettings> {
  const normalized = normalizeSettings(settings);
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(normalized));
  return normalized;
}
