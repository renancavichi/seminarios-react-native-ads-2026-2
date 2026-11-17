# 🗺️ React Native Maps

**Aplicação mobile interativa desenvolvida com React Native, Expo e TypeScript.**

Projeto demonstrativo que explora recursos de mapas nativos, permitindo adicionar elementos geográficos, personalizar estilos de visualização e interagir diretamente com o mapa.

![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 Sobre o projeto

O **React Native Maps** é uma aplicação desenvolvida para demonstrar as funcionalidades da biblioteca [`react-native-maps`](https://github.com/react-native-maps/react-native-maps).

A aplicação oferece um mapa interativo inicialmente centralizado em **São Paulo, Brasil**, permitindo trabalhar com coordenadas, desenhar elementos geográficos e alternar entre diferentes estilos de mapa.

O projeto utiliza **Expo** para facilitar o desenvolvimento e os testes em dispositivos Android e iOS.

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 📍 **Marker** | Adiciona ou reposiciona marcadores no mapa. |
| ⭕ **Circle** | Cria regiões circulares a partir de coordenadas. |
| 🛣️ **Polyline** | Desenha caminhos conectando múltiplos pontos. |
| 🔷 **Polygon** | Delimita áreas utilizando vértices geográficos. |
| 🗺️ **MapType** | Alterna entre os estilos Standard, Satellite e Hybrid. |
| 👆 **Map Interaction** | Permite adicionar elementos através de toques no mapa. |
| 🧹 **Clear** | Remove os elementos do tipo selecionado. |
| 🔄 **Reset** | Restaura o mapa ao estado inicial da demonstração. |

> O estilo **Terrain** também está disponível em dispositivos Android.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| **React Native 0.88** | Desenvolvimento da aplicação mobile |
| **Expo SDK 58** | Ambiente de desenvolvimento |
| **TypeScript** | Tipagem estática e manutenção do código |
| **React Native Maps** | Renderização de mapas e elementos geográficos |
| **Expo Go** | Execução e testes em dispositivos físicos |

---

## 🚀 Instalação e execução

### Pré-requisitos

Para executar o projeto, você precisará de:

- Node.js e npm.
- Git.
- Expo Go instalado no Android ou iOS.
- Conexão com a internet para utilizar o modo Tunnel.

### 1. Clone o repositório

```bash
git clone <URL-DO-REPOSITORIO>
```

Acesse o diretório do projeto:

```bash
cd <NOME-DO-PROJETO>
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o ambiente de desenvolvimento

**Tunnel Mode:**

```bash
npm run tunnel
```

**Local Network:**

```bash
npm start
```

### 4. Execute no dispositivo

1. Abra o aplicativo **Expo Go**.
2. Escaneie o QR Code exibido no terminal.
3. Aguarde o carregamento da aplicação.
4. Explore as funcionalidades disponíveis.

> Mantenha o servidor Expo ativo durante a utilização.

---

## 🧭 Como utilizar

### 1. Overlay Selection

Selecione uma das ferramentas disponíveis na interface:

- **Marker:** toque no mapa para adicionar ou reposicionar um marcador.
- **Circle:** toque para definir o centro de uma área circular.
- **Polyline:** toque em diferentes posições para construir um caminho.
- **Polygon:** adicione vértices para criar uma região delimitada.

### 2. Map Interaction

Após selecionar uma ferramenta, toque no mapa para inserir ou modificar os elementos geográficos.

### 3. MapType

Alterne entre os estilos de visualização disponíveis:

| MapType | Visualização |
|---|---|
| `standard` | Mapa convencional |
| `satellite` | Imagens de satélite |
| `hybrid` | Satélite com informações geográficas |
| `terrain` | Visualização de relevo, disponível no Android |

### 4. Clear & Reset

**Clear:** remove os elementos correspondentes ao overlay selecionado.

**Reset:** restaura os elementos e as configurações iniciais da demonstração.

---

## 📱 Compatibilidade

| Plataforma | Suporte |
|---|---|
| Android | ✅ |
| iOS | ✅ |
| Expo Go | ✅ |
| Web | Requer configuração adicional de mapas |

A aplicação utiliza o provedor de mapas nativo disponível no dispositivo.

### Google Maps API

Durante o desenvolvimento com **Expo Go**, não é necessário configurar uma chave de API do Google Maps.

Para distribuir uma aplicação Android independente utilizando Google Maps, será necessário configurar uma API Key e gerar uma nova build.

---

## 📦 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o Expo na rede local. |
| `npm run tunnel` | Inicia o Expo através de um túnel. |
| `npm run android` | Executa o projeto no ambiente Android. |
| `npm run ios` | Executa o projeto no ambiente iOS. |
| `npm run web` | Inicia o ambiente web, quando configurado. |

---

---

## 📚 Documentação

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [TypeScript](https://www.typescriptlang.org/docs/)

