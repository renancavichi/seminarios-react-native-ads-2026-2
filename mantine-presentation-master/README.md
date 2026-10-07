# Mantine UI — Apresentação Interativa

Aplicação React + Mantine UI desenvolvida para a disciplina de Desenvolvimento Web III.
A própria apresentação sobre a biblioteca Mantine foi construída usando a biblioteca,
no lugar de slides tradicionais.

<img width="1919" height="946" alt="image" src="https://github.com/user-attachments/assets/a8d05f56-d534-4d5e-81b4-a125ad4f7c08" />


## Como executar

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior instalado.

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Depois abra o endereço exibido no terminal (geralmente `http://localhost:5173`).

## Build de produção

```bash
npm run build   # gera a versão otimizada na pasta dist/
npm run preview # serve a versão de build localmente
```

## Estrutura do projeto

```
src/
  main.jsx              # ponto de entrada, MantineProvider, BrowserRouter
  App.jsx                # AppShell (Header + Navbar) e definição das rotas
  theme.js                # tema Mantine (cores, radius, fontes)
  index.css               # fontes e pequenos ajustes globais
  data/
    navigation.js          # lista das 16 páginas (ordem usada no menu e no Próximo/Anterior)
    playgroundData.jsx     # componentes disponíveis no Playground Interativo
  components/
    CodeBlock.jsx           # wrapper do CodeHighlight (@mantine/code-highlight)
    DemoSection.jsx          # card padrão usado em todas as seções de componentes
    PageFooterNav.jsx        # botões "Anterior" / "Próximo"
    StatCard.jsx              # card de estatística usado na página inicial
  pages/
    Home.jsx                  # 1. Página inicial
    WhyUseLibrary.jsx          # 2. Por que utilizar uma biblioteca UI
    ProblemsSolved.jsx          # 3. Problemas que a Mantine resolve
    Installation.jsx             # 4. Instalação
    MantineCore.jsx                # 5. Mantine Core (pacotes)
    LayoutSection.jsx               # 6. AspectRatio, Flex, Grid, Group, Splitter, Stack
    InputsSection.jsx                # 7. Input, PasswordInput, Checkbox, ColorInput, Slider...
    ButtonsSection.jsx                # 8. Button, FileButton, UnstyledButton
    NavigationSection.jsx              # 9. Tabs, Pagination, Tree
    FeedbackSection.jsx                 # 10. Alert, Notification, Loader, Progress
    OverlaysSection.jsx                  # 11. Dialog, Drawer, LoadingOverlay, Menu
    DataDisplaySection.jsx                # 12. Avatar, BackgroundImage, RollingNumber, Spoiler, Timeline
    TypographySection.jsx                  # 13. Title, Text, Highlight
    HooksSection.jsx                         # 14. 7 hooks do @mantine/hooks
    Playground.jsx                            # 15. Playground interativo
    Conclusion.jsx                              # 16. Conclusão
```

## Tecnologias usadas

- React 18
- Mantine UI (`@mantine/core`, `@mantine/hooks`, `@mantine/notifications`, `@mantine/code-highlight`)
- React Router (navegação entre as 16 páginas)
- @tabler/icons-react (ícones)
- Vite (build tool)

## Observação

Este projeto contém apenas o código-fonte — a pasta `node_modules` não está incluída
(é gerada pelo `npm install`). Caso o `npm install` apresente conflitos de versão de
`react`/`react-dom`, ajuste as versões em `package.json` para as mais recentes
disponíveis no momento.
