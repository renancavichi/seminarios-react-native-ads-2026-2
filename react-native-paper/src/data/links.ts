// Documentação: os endereços callstack.github.io redirecionam para oss.callstack.com/react-native-paper.
// Usamos esta forma porque, na verificação feita, o HTTPS de oss.callstack.com apresentava certificado inválido.
const docsBase = 'https://callstack.github.io/react-native-paper';

export const links = {
  site: 'https://reactnativepaper.com/',
  docs: `${docsBase}/`,
  gettingStarted: `${docsBase}/docs/guides/getting-started`,
  components: `${docsBase}/docs/components/ActivityIndicator`,
  theming: `${docsBase}/docs/guides/theming`,
  github: 'https://github.com/callstack/react-native-paper',
  rnElements: 'https://reactnativeelements.com/',
  nativewind: 'https://www.nativewind.dev/',
  reactNative: 'https://reactnative.dev/',
} as const;
