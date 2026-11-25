import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

/**
 * React Native Paper é escrito para React Native. Para rodar no navegador:
 *  - "react-native" é redirecionado para "react-native-web";
 *  - arquivos ".web.js" têm prioridade (ex.: react-native-safe-area-context);
 *  - __DEV__ (global do React Native) é definido;
 *  - o pacote de ícones nativo é trocado por ícones SVG (src/theme/vectorIconsShim.ts).
 */
const extensions = ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.mjs', '.tsx', '.ts', '.jsx', '.js', '.json'];

export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  resolve: {
    alias: [
      { find: /^react-native$/, replacement: 'react-native-web' },
      {
        find: /^@react-native-vector-icons\/material-design-icons$/,
        replacement: fileURLToPath(new URL('./src/theme/vectorIconsShim.ts', import.meta.url)),
      },
    ],
    extensions,
  },
  optimizeDeps: {
    include: ['react-native-paper', 'react-native-web', 'react-native-safe-area-context'],
    esbuildOptions: {
      resolveExtensions: extensions,
      loader: { '.js': 'jsx' },
    },
  },
  build: {
    chunkSizeWarningLimit: 4000,
    commonjsOptions: { transformMixedEsModules: true },
  },
});
