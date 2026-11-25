/** Textos dos slides conceituais (separados do layout para facilitar a edição). */

export const problems = [
  { icon: 'palette', title: 'Estilização manual', text: 'Cada borda, raio, cor e espaçamento é decidido e escrito à mão.' },
  { icon: 'copy', title: 'Repetição de código', text: 'O mesmo botão e o mesmo input são recriados (ou copiados) em várias telas.' },
  { icon: 'shuffle', title: 'Inconsistência visual', text: 'Pequenas diferenças se acumulam: um raio de 4px aqui, 6px ali.' },
  { icon: 'pointer', title: 'Estados de interação', text: 'Foco, toque, desabilitado, erro, carregando — cada um precisa de código.' },
  { icon: 'accessibility', title: 'Tema e acessibilidade', text: 'Modo escuro, contraste e rótulos para leitores de tela ficam por sua conta.' },
] as const;

export const features = [
  { title: 'Componentes prontos', text: 'Botões, campos, listas, cards, diálogos, menus, barras de navegação e mais.', demo: 'components' },
  { title: 'Material Design 3', text: 'Segue o MD3 por padrão desde a v5. O tema MD2 continua disponível.', demo: 'md3' },
  { title: 'Temas personalizáveis', text: 'Cores, fontes e arredondamento definidos uma vez no PaperProvider.', demo: 'theme' },
  { title: 'Claro e escuro', text: 'MD3LightTheme e MD3DarkTheme prontos; basta trocar o objeto de tema.', demo: 'dark' },
  { title: 'Tipografia, cores e elevação', text: 'Escala tipográfica (variant), tokens de cor e níveis de elevação.', demo: 'type' },
  { title: 'Acessibilidade', text: 'Papéis e estados acessíveis nos componentes, além de props como accessibilityLabel.', demo: 'a11y' },
  { title: 'Multiplataforma', text: 'Android e iOS; na web, por meio do react-native-web — como nesta apresentação.', demo: 'platforms' },
  { title: 'Documentação e versões', text: 'Exemplos por componente, guias de tema e migração e documentação por versão.', demo: 'docs' },
] as const;

export const libraryLimits = [
  { title: 'Opinião de design forte', text: 'Interfaces que não seguem Material Design (ex.: visual iOS ou identidade muito própria) exigem sobrescrever estilos ou criar componentes.' },
  { title: 'Curva de aprendizado do tema', text: 'O MD3 tem muitos tokens (primaryContainer, onSurfaceVariant…) e uma escala tipográfica por variant.' },
  { title: 'Não cobre tudo', text: 'Não traz navegação entre telas (usa-se React Navigation) nem seletor de datas — este vem de pacotes da comunidade.' },
  { title: 'Mudanças entre versões', text: 'A troca de MD2 (v4) para MD3 (v5) exigiu migração; a v6 está em alpha.' },
] as const;

export const environmentLimits = [
  { title: 'Dependências iniciais', text: 'react-native-safe-area-context e uma biblioteca de ícones (já inclusa no Expo).' },
  { title: 'Custo de mais uma dependência', text: 'Tamanho do bundle, atualizações e compatibilidade com a versão do React Native/Expo. Há um plugin Babel opcional para reduzir o bundle.' },
  { title: 'Web ≠ mobile', text: 'Na web depende do react-native-web. Nesta apresentação: animações rodam em JS (sem driver nativo), ícones de fonte viraram SVG e o ProgressBar precisou de uma View com altura fixa.' },
] as const;

export type Rating = 'alto' | 'medio' | 'baixo' | 'na';

export const comparison = {
  columns: ['React Native Paper', 'RN puro (core)', 'React Native Elements', 'NativeWind'],
  rows: [
    {
      label: 'Proposta principal',
      cells: ['Kit de componentes Material Design 3 + sistema de tema', 'Primitivas da plataforma: View, Text, TextInput, Pressable', 'Kit de componentes multiplataforma com visual próprio', 'Estilização com classes do Tailwind CSS (className)'],
    },
    {
      label: 'Componentes prontos',
      cells: ['Muitos: inputs, cards, listas, diálogos, menus, appbar…', 'Somente primitivas', 'Muitos: Button, Input, ListItem, Card, Dialog…', 'Nenhum — estiliza os seus componentes'],
    },
    {
      label: 'Sistema visual',
      cells: ['Material Design 3 (tokens, elevação, tipografia)', 'Nenhum: você define tudo', 'Visual neutro, não preso ao Material', 'Escala do Tailwind (cores, espaços) configurável'],
    },
    {
      label: 'Personalização',
      cells: ['Tema global + style por componente', 'Total, porém manual', 'Tema global (ThemeProvider) + props', 'Total, via utilitários e tailwind.config'],
    },
    {
      label: 'Facilidade de adoção',
      cells: ['Alta se o design for Material', 'Imediata, sem dependências', 'Alta; API simples baseada em props', 'Alta para quem já usa Tailwind; requer config de Babel/Metro'],
    },
    {
      label: 'Quando faz sentido',
      cells: ['Apps corporativos, CRUD, MVPs, apps com cara Material', 'Design 100% próprio, apps pequenos, controle total', 'Apps que querem componentes prontos sem seguir Material', 'Design system próprio; combina com componentes próprios ou de terceiros'],
    },
  ],
} as const;
