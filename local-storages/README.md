# 📦 React Native Storages - Apresentação

Uma apresentação web interativa sobre as soluções de armazenamento no React Native, abordando **AsyncStorage**, **MMKV**, **Expo SecureStore**, **Expo SQLite** e a integração com **Zustand** para gerenciamento de estado persistente.

![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Vite](https://img.shields.io/badge/Vite-6.3-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-cyan)

---

## 🎯 Sobre

Este projeto é uma apresentação técnica em formato de slides que cobre:

- **AsyncStorage** — O storage padrão do React Native
- **MMKV** — Storage ultra-rápido criado pelo Tencent (WeChat)
- **Expo SecureStore** — Armazenamento criptografado para dados sensíveis
- **Expo SQLite** — Banco de dados relacional local com suporte a SQL e ACID
- **Zustand** — State management com persistência integrada
- **Benchmarks** — Comparação de performance entre as soluções

---

## 📑 Resumo da apresentação

A apresentação começa com o contexto geral de armazenamento local em aplicativos React Native e introduz os principais cenários de uso: persistir preferências, manter sessões, proteger credenciais e armazenar grandes volumes de dados estruturados.

1. **MMKV** apresenta uma solução C++ de alta performance baseada em `mmap`, escrita atômica com `msync` e comunicação direta pela arquitetura JSI/NitroModules. Os slides mostram sua API síncrona, suporte a diferentes tipos, criptografia opcional, Hooks e integração com componentes da interface.

2. **Expo SecureStore** explica como dados sensíveis são armazenados no hardware seguro da plataforma, por meio do Keychain no iOS e do Keystore no Android. Também aborda o tamanho limitado dos itens, o acesso assíncrono, a autenticação biométrica e o fluxo arquitetural das chamadas nativas.

3. **Expo SQLite** apresenta um banco relacional embutido com propriedades ACID, transações, consultas SQL, `WAL` e `Prepared Statements`. A arquitetura utiliza JSI para comunicação direta com o motor C++, enquanto operações assíncronas evitam bloquear a thread principal e operações síncronas pesadas podem afetar os FPS.

4. **Zustand** demonstra como separar o estado da aplicação da persistência local. A apresentação mostra adaptadores para MMKV, AsyncStorage, SecureStore e SQLite, explicando hidratação, armazenamento em memória RAM e gravação em segundo plano.

5. **Comparação e escolha técnica:** MMKV é indicado para preferências e estado não sensível com acesso rápido; SecureStore é a opção adequada para tokens e credenciais; SQLite atende dados relacionais, buscas e grandes volumes; AsyncStorage continua sendo uma API simples, porém mais lenta por depender da Bridge antiga; o Zustand organiza o estado e delega a persistência a um dos storages anteriores.

Ao final, os slides apresentam os casos de uso recomendados, uma tabela comparativa e as referências utilizadas na pesquisa.

---

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior ([download](https://nodejs.org/))
- **npm** versão 9 ou superior (vem junto com o Node.js)

Verifique sua instalação:

```bash
node --version   # Deve ser >= 18.x.x
npm --version    # Deve ser >= 9.x.x
```

---

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/rn-storages-presentation.git
cd rn-storages-presentation
```

### 2. Instale as dependências

```bash
npm install
```

---

## 💻 Scripts Disponíveis

### Desenvolvimento

Inicia o servidor de desenvolvimento com hot-reload:

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:5173**

### Build para Produção

Gera os arquivos otimizados para deploy:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

### Verificação de Tipos

Executa o typecheck do TypeScript sem gerar arquivos:

```bash
npm run typecheck
```

### Preview do Build

Para visualizar a versão de produção localmente:

```bash
npm run build
npx vite preview
```

---

## 📁 Estrutura do Projeto

```
├── index.html                          # HTML base da aplicação
├── package.json                        # Dependências e scripts
├── tsconfig.json                       # Configuração do TypeScript
├── vite.config.js                      # Configuração do Vite
│
├── src/
│   ├── main.tsx                        # Entry point da aplicação
│   ├── App.tsx                         # Componente raiz com navegação
│   ├── index.css                       # Estilos globais e animações
│   │
│   ├── components/
│   │   ├── PresentationHeader.tsx      # Header com botões Voltar/Avançar
│   │   ├── SlideIndicator.tsx          # Indicador de progresso (dots)
│   │   └── shared.tsx                  # Componentes reutilizáveis
│   │                                   # (CodeBlock, FeatureCard, etc.)
│   │
│   └── slides/
│       ├── HomeSlide.tsx               # Slide 1 - Introdução
│       ├── MMKVSlide.tsx               # Slide 2 - MMKV
│       ├── ExpoSecureStoreSlide.tsx    # Slide 3 - SecureStore
│       ├── StoragesAndZustandSlide.tsx # Slide 4 - Zustand
│       ├── BenchmarksSlide.tsx         # Slide 5 - Benchmarks
│       └── ConclusionSlide.tsx         # Slide 6 - Conclusão
│
└── dist/                               # Build de produção (gerado)
```

---

## 🎮 Como Usar

### Navegação

A apresentação pode ser navegada de 3 formas:

| Método | Ação |
|--------|------|
| **Botões** | Clique em "Voltar" e "Avançar" no header |
| **Teclado** | Use as setas `←` `→` ou `↑` `↓` |
| **Indicador** | Clique nos dots no topo para ir a qualquer slide |

### Slides

| # | Slide | Conteúdo |
|---|-------|----------|
| 1 | **Home** | Visão geral dos 4 tópicos da apresentação |
| 2 | **MMKV** | Características, funcionamento e exemplos de código |
| 3 | **Expo SecureStore** | Casos de uso, segurança e exemplos |
| 4 | **Storages & Zustand** | Arquitetura e integração com persist middleware |
| 5 | **Benchmarks** | Gráficos de performance e tabela comparativa |
| 6 | **Conclusão** | Recomendações e estratégia ideal |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 18.2 | Biblioteca UI |
| TypeScript | 5.7 | Tipagem estática |
| Vite | 6.3 | Build tool e dev server |
| Tailwind CSS | 4.1 | Framework CSS utility-first |

---

## 🎨 Identidade Visual

- **Tema:** Dark mode com gradientes indigo/cyan
- **Animações:** Transições suaves entre slides com efeitos de entrada
- **Background:** Efeitos de blur decorativos com orbs coloridos
- **Cards:** Bordas com gradientes e hover effects
- **Tipografia:** Hierarquia clara com badges e ícones

---

## 📝 Personalização

### Adicionar um novo slide

1. Crie um novo arquivo em `src/slides/MeuSlide.tsx`:

```tsx
import { SlideWrapper, SlideTitle } from '../components/shared';

export function MeuSlide() {
  return (
    <SlideWrapper>
      <SlideTitle
        badge="Meu Badge"
        title="Meu Título"
        subtitle="Minha descrição"
      />
      {/* Seu conteúdo aqui */}
    </SlideWrapper>
  );
}
```

2. Registre o slide em `src/App.tsx`:

```tsx
import { MeuSlide } from './slides/MeuSlide';

const slides = [
  // ... slides existentes
  { id: 'meu-slide', title: 'Meu Slide', component: MeuSlide },
];
```

### Componentes disponíveis

| Componente | Descrição |
|------------|-----------|
| `SlideWrapper` | Wrapper com padding e max-width |
| `SlideTitle` | Título com badge e subtítulo |
| `CodeBlock` | Bloco de código com syntax highlighting visual |
| `FeatureCard` | Card de feature com ícone e cor |
| `ComparisonTable` | Tabela comparativa estilizada |
| `StatCard` | Card de estatística com valor e label |

---

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novos slides
- Melhorar a identidade visual
- Adicionar novos tópicos

---

