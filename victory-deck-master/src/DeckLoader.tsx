/**
 * Caminho nativo (Android/iOS): o Skia já está disponível no momento em
 * que o app monta, então o deck é importado direto.
 *
 * O Metro escolhe automaticamente o arquivo `.web.tsx` quando roda no
 * navegador — você nunca importa um dos dois explicitamente.
 */
export { default } from "./DeckRoot";
