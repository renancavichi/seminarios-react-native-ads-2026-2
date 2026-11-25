import type { AudioMode } from 'expo-audio';

/**
 * [Slide 11] Modos da sessão de áudio.
 *
 * O objeto completo é sempre enviado para o setAudioModeAsync. Assim nenhum
 * campo volta para o valor padrão sem querer quando o app troca de modo.
 */
export const PLAYBACK_MODE: Partial<AudioMode> = {
  playsInSilentMode: true, // iOS: toca mesmo com a chave do silencioso ligada
  shouldPlayInBackground: true, // continua tocando com o app minimizado ou a tela bloqueada
  interruptionMode: 'doNotMix', // pausa outros apps; exigido para os controles da tela de bloqueio
  allowsRecording: false, // iOS: microfone liberado só durante a gravação (RECORDING_MODE)
};

/** [Slide 16] Durante a gravação, o microfone é liberado. */
export const RECORDING_MODE: Partial<AudioMode> = {
  ...PLAYBACK_MODE,
  allowsRecording: true,
};
