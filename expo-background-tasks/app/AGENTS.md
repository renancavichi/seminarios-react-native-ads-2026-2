# Orientações do aplicativo

- Projeto Expo SDK 54 com TypeScript estrito e Expo Router. As rotas ficam em `src/app/`; módulos que não são telas ficam fora dessa pasta.
- Consulte a documentação oficial correspondente ao SDK instalado antes de usar APIs Expo. As skills locais `expo-overview`, `expo-router` e `expo-native-ui` podem ajudar, mas suas recomendações precisam ser compatíveis com o SDK 54.
- Mantenha o aplicativo pequeno, com responsabilidades separadas e sem dependências desnecessárias. Use `npx expo install` para adicionar módulos Expo compatíveis.
- Documente instalação, execução, limitações e testes no README. Use comentários no estilo JSDoc acima das funções e comentários `//` apenas para detalhes relevantes.
- Execute `npm run typecheck` e `npm run lint` quando as dependências estiverem instaladas; relate limitações de validação em dispositivo.
- Pastas nativas são geradas pelo Expo; configure-as por `app.json` e plugins, sem editá-las manualmente.
