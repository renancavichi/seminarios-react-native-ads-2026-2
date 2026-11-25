export type TaskSettings = {
  message: string;
  minimumInterval: number;
};

export const DEFAULT_SETTINGS: TaskSettings = {
  message: 'Sua tarefa foi executada',
  minimumInterval: 15,
};

/** Valida o intervalo e substitui mensagens vazias pelo texto padrão. */
export function normalizeSettings(settings: TaskSettings): TaskSettings {
  if (!Number.isSafeInteger(settings.minimumInterval) || settings.minimumInterval < 15) {
    throw new Error('Informe um intervalo inteiro de pelo menos 15 minutos.');
  }
  if (typeof settings.message !== 'string') {
    throw new Error('Configuração inválida.');
  }
  return { message: settings.message.trim() || DEFAULT_SETTINGS.message, minimumInterval: settings.minimumInterval };
}
