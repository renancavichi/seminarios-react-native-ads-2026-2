# Autenticação Biométrica no React Native com Expo

**Guia de estudos — React Native, biometria, gerenciamento de credenciais e segurança mobile**

Este material acompanha uma apresentação de **43 slides** sobre autenticação biométrica em aplicativos React Native, com foco em Expo, Android, iOS, armazenamento seguro de credenciais e passkeys.

O objetivo deste README é permitir que qualquer estudante compreenda os conceitos apresentados, entenda os fluxos de autenticação e conheça as bibliotecas utilizadas, mesmo sem assistir à apresentação.

## Sumário

1. [Introdução à autenticação biométrica](#1-introdução-à-autenticação-biométrica)
2. [Como a biometria funciona no dispositivo](#2-como-a-biometria-funciona-no-dispositivo)
3. [Biometria, backend e gerenciamento de sessões](#3-biometria-backend-e-gerenciamento-de-sessões)
4. [Armazenamento seguro com Expo SecureStore](#4-armazenamento-seguro-com-expo-securestore)
5. [Implementação com Expo LocalAuthentication](#5-implementação-com-expo-localauthentication)
6. [Diferenças entre Android e iOS](#6-diferenças-entre-android-e-ios)
7. [Tratamento de falhas e recuperação de acesso](#7-tratamento-de-falhas-e-recuperação-de-acesso)
8. [Biometria, segurança e LGPD](#8-biometria-segurança-e-lgpd)
9. [Passkeys e autenticação criptográfica](#9-passkeys-e-autenticação-criptográfica)
10. [Demonstrações práticas](#10-demonstrações-práticas)
11. [Testes e recomendações](#11-testes-e-recomendações)
12. [Revisão para estudo](#12-revisão-para-estudo)
13. [Referências](#13-referências)

---

## 1. Introdução à autenticação biométrica

A autenticação é o processo de comprovar que uma pessoa, dispositivo ou sistema é realmente quem afirma ser.

Em aplicativos tradicionais, essa comprovação costuma ser realizada por senha. Nos dispositivos móveis modernos, também podemos utilizar características biométricas, como impressão digital e reconhecimento facial.

### Identificação vs. autenticação

Esses dois conceitos representam etapas diferentes.

**Identificação:** informa qual identidade está tentando acessar um sistema.

Exemplos:
- E-mail
- CPF
- Nome de usuário

**Autenticação:** verifica se aquela identidade pode ser considerada legítima.

Exemplos:
- Senha
- PIN
- Token
- Autenticação biométrica

Um usuário pode informar seu e-mail para se identificar e utilizar sua senha para comprovar a identidade.

### Fatores de autenticação

Os fatores são tradicionalmente divididos em três categorias:

| Fator | Definição | Exemplos |
|---|---|---|
| Conhecimento | Algo que você sabe | Senha e PIN |
| Posse | Algo que você tem | Smartphone e token físico |
| Inerência | Algo que você é | Digital, rosto e íris |

Combinar dois mecanismos não significa necessariamente utilizar dois fatores diferentes. Por exemplo, senha e PIN pertencem à mesma categoria: conhecimento.

### Tipos de biometria

A biometria pode ser classificada em duas categorias principais.

**Biometria física:** utiliza características biológicas, como impressão digital, rosto e íris.

**Biometria comportamental:** utiliza padrões de comportamento, como ritmo de digitação, modo de caminhar e assinatura dinâmica.

A voz pode combinar características físicas e comportamentais.

Em aplicações React Native, o foco desta apresentação é a utilização dos autenticadores biométricos locais disponibilizados pelo Android e pelo iOS.

### Por que biometria não é uma senha?

Uma senha comprometida pode ser substituída. Uma impressão digital ou uma característica facial não pode ser trocada da mesma maneira.

Por isso, dados biométricos exigem mecanismos específicos de proteção, isolamento e controle.

**Conceito fundamental:** a biometria é uma característica da pessoa, enquanto um token ou senha é uma credencial que pode ser substituída ou revogada.

---

## 2. Como a biometria funciona no dispositivo

Uma dúvida frequente é se o aplicativo recebe a impressão digital ou o reconhecimento facial do usuário e transmite essas informações para o backend.

**Na autenticação biométrica local fornecida pelo sistema operacional, isso não acontece.**

O React Native solicita a autenticação ao Android ou iOS, e o próprio sistema operacional realiza a verificação biométrica.

### Fluxo de autenticação local

```text
Aplicativo React Native
        |
        v
Solicita autenticação
        |
        v
Sistema operacional
(Android / iOS)
        |
        v
Sensor biométrico
        |
        v
Comparação biométrica
        |
        v
Resultado da autenticação
        |
        v
Aplicativo React Native
```

O aplicativo recebe o resultado da operação, mas não recebe a imagem da digital, a representação facial ou o template biométrico.

Esse funcionamento é diferente de sistemas que capturam selfies e enviam imagens para um serviço externo de verificação de identidade.

### O que é um template biométrico?

O template biométrico é uma representação produzida a partir de características extraídas da leitura biométrica.

Por exemplo:

1. O usuário cadastra sua impressão digital no dispositivo.
2. O sensor realiza a leitura.
3. O sistema extrai características relevantes.
4. Uma representação é registrada de maneira protegida.
5. Nas autenticações futuras, novas leituras são comparadas à referência cadastrada.

O aplicativo comum não tem acesso direto a esse template.

### Onde os dados biométricos são protegidos?

**No iOS:** o processo biométrico está integrado aos mecanismos de segurança do sistema, incluindo o Secure Enclave.

**No Android:** o sistema utiliza sua infraestrutura biométrica e mecanismos de isolamento, com proteções que dependem do dispositivo e do hardware disponível.

É importante não confundir os componentes:

- O **template biométrico** representa características biométricas cadastradas.
- O **Android Keystore** protege material criptográfico e suas condições de utilização.
- O **Apple Keychain** permite armazenar credenciais e outros itens sensíveis.
- O **Secure Enclave** é um componente de segurança que participa de operações e proteções criptográficas nos dispositivos compatíveis.

O Android Keystore não é um banco de impressões digitais, assim como o Keychain não deve ser confundido com o próprio Secure Enclave.

---

## 3. Biometria, backend e gerenciamento de sessões

Este é um dos conceitos mais importantes da apresentação.

**A biometria local não substitui automaticamente a autenticação realizada pelo backend.**

Normalmente, o backend continua sendo responsável por validar credenciais e gerenciar sessões.

### Primeiro acesso do usuário

Em uma arquitetura tradicional, o primeiro login pode funcionar assim:

```text
Usuário
   |
   v
Informa e-mail e senha
   |
   v
Backend verifica credenciais
   |
   v
Backend emite tokens
   |
   v
Aplicativo recebe os tokens
   |
   v
Credencial armazenada com proteção
```

Nesse momento, o servidor já identificou e autenticou o usuário.

A biometria pode ser utilizada posteriormente para autorizar, no próprio dispositivo, o acesso a uma credencial protegida.

### Access token e refresh token

Um sistema pode utilizar dois tipos principais de token:

| Característica | Access token | Refresh token |
|---|---|---|
| Finalidade | Autorizar acesso à API | Renovar a sessão |
| Duração típica | Mais curta | Mais longa |
| Utilização | Requisições autenticadas | Solicitação de novos tokens |
| Proteção | Necessária | Especialmente importante |
| Expiração/revogação | Conforme o backend | Conforme o backend |

O **access token** representa uma autorização ou sessão que o backend reconhece.

O **refresh token** permite solicitar novos tokens sem exigir que o usuário informe novamente suas credenciais em todas as ocasiões.

Os prazos de validade e a estratégia de renovação dependem da arquitetura do servidor. Refresh tokens também podem expirar, ser revogados ou passar por rotação.

### Onde a biometria entra?

Após o login inicial, o aplicativo pode proteger uma credencial sensível no armazenamento seguro do dispositivo.

Nos próximos acessos:

```text
Usuário abre o aplicativo
           |
           v
Solicita acesso à credencial
           |
           v
Sistema exige autenticação local
           |
           v
Biometria aprovada
           |
           v
Credencial protegida liberada
           |
           v
Backend valida ou renova sessão
           |
           v
Usuário acessa o sistema
```

A biometria autoriza o uso local da credencial. O backend continua responsável por aceitar ou rejeitar sua utilização.

Se o refresh token tiver sido revogado, por exemplo, uma digital válida não será suficiente para recuperar a sessão. Será necessário realizar um novo login ou outro processo previsto pelo servidor.

### Atenção à arquitetura

Existe uma diferença importante entre:

1. Executar uma autenticação biométrica e verificar `result.success` no JavaScript.
2. Proteger uma credencial ou chave criptográfica com uma política nativa que exige autenticação para permitir seu acesso ou utilização.

No primeiro caso, a aplicação controla uma decisão de fluxo.

No segundo, a proteção é aplicada também ao material sensível pelo mecanismo nativo de segurança.

Essa distinção é essencial para construir um sistema mais resistente a falhas e comprometimento do aplicativo.

---

## 4. Armazenamento seguro com Expo SecureStore

O `expo-secure-store` é uma biblioteca do Expo utilizada para armazenar pequenas informações sensíveis com mecanismos seguros disponibilizados pelo Android e iOS.

Documentação: https://docs.expo.dev/versions/latest/sdk/securestore/

### SecureStore vs. AsyncStorage

| Característica | AsyncStorage | Expo SecureStore |
|---|---|---|
| Finalidade | Persistência comum de dados | Armazenamento de pequenos segredos |
| Armazenamento criptografado e protegido pelo SO | Não é sua finalidade | Sim, conforme a plataforma |
| Suporte a autenticação para acesso ao item | Não | Sim, com `requireAuthentication` |
| Indicado para | Preferências não sensíveis e dados comuns | Tokens e pequenas credenciais |

O AsyncStorage não deve ser tratado como cofre de credenciais sensíveis.

### Instalação

```bash
npx expo install expo-secure-store
```

### Armazenamento básico

```javascript
import * as SecureStore from 'expo-secure-store';

// refreshToken foi recebido previamente do backend.

await SecureStore.setItemAsync(
  'refreshToken',
  refreshToken
);

const token = await SecureStore.getItemAsync(
  'refreshToken'
);
```

Esse exemplo salva e recupera uma credencial utilizando o SecureStore.

Entretanto, armazenar uma credencial no SecureStore **não significa que o usuário precisará realizar autenticação biométrica em cada leitura**.

São mecanismos relacionados, mas distintos.

### Protegendo o item com autenticação

Para solicitar autenticação do dispositivo no acesso a uma credencial, é possível utilizar `requireAuthentication`.

```javascript
import * as SecureStore from 'expo-secure-store';

const options = {
  requireAuthentication: true,
  authenticationPrompt: 'Confirme sua identidade',
};

// Credencial recebida anteriormente do backend.
await SecureStore.setItemAsync(
  'protectedRefreshToken',
  refreshToken,
  options
);

// Acesso posterior ao item protegido.
const token = await SecureStore.getItemAsync(
  'protectedRefreshToken',
  options
);
```

O sistema operacional aplica a política de autenticação associada ao item.

**Diferenças importantes:**

- No iOS, a criação inicial do item protegido geralmente não solicita autenticação, mas sua leitura ou atualização pode solicitá-la.
- No Android, a autenticação pode ser exigida nas operações associadas ao item protegido.
- Algumas configurações dependem de hardware, versão do sistema e disponibilidade biométrica.
- A leitura pode retornar `null` caso a credencial esteja ausente ou tenha sido invalidada.
- O aplicativo precisa tratar erros e cancelamentos.

É possível consultar a disponibilidade dessa proteção:

```javascript
const disponivel =
  SecureStore.canUseBiometricAuthentication();
```

### Mudanças na biometria cadastrada

Imagine o seguinte cenário:

1. O usuário cadastra uma digital.
2. O aplicativo protege uma credencial utilizando autenticação biométrica.
3. Outra impressão digital é adicionada ao dispositivo.
4. O sistema pode invalidar o material anteriormente protegido.

O comportamento reduz o risco de um novo cadastro biométrico receber automaticamente acesso a determinadas credenciais protegidas.

Quando uma credencial é invalidada, a recuperação deve passar por um fluxo legítimo, como novo login no backend.

Não é adequado simplesmente remover a proteção biométrica para contornar a falha.

---

## 5. Implementação com Expo LocalAuthentication

A biblioteca `expo-local-authentication` oferece uma interface para acessar a autenticação local disponibilizada pelo Android e iOS.

Ela faz a ponte entre o aplicativo React Native e as APIs nativas do sistema operacional.

Documentação: https://docs.expo.dev/versions/latest/sdk/local-authentication/

### Instalação

```bash
npx expo install expo-local-authentication
```

### Importação

```javascript
import * as LocalAuthentication
  from 'expo-local-authentication';
```

### Verificações antes da autenticação

Antes de solicitar a biometria, é importante verificar três condições.

**1. O dispositivo possui hardware compatível?**

```javascript
const hasHardware =
  await LocalAuthentication.hasHardwareAsync();
```

**2. Existe biometria cadastrada?**

```javascript
const isEnrolled =
  await LocalAuthentication.isEnrolledAsync();
```

**3. Quais modalidades de autenticação biométrica são suportadas?**

```javascript
const types =
  await LocalAuthentication.supportedAuthenticationTypesAsync();
```

A última chamada informa as modalidades suportadas pelo dispositivo, mas não necessariamente quais estão cadastradas.

Exemplo de validação:

```javascript
const hasHardware =
  await LocalAuthentication.hasHardwareAsync();

const isEnrolled =
  await LocalAuthentication.isEnrolledAsync();

if (!hasHardware || !isEnrolled) {
  // Oferecer login tradicional ou alternativa prevista.
  return;
}
```

### Solicitando autenticação

O método principal é `authenticateAsync()`.

```javascript
const result =
  await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirme sua identidade',
    cancelLabel: 'Cancelar',
    biometricsSecurityLevel: 'strong',
  });

if (result.success) {
  // Autenticação local aprovada.
} else {
  // Tratar cancelamento ou falha.
}
```

A biblioteca solicita ao sistema operacional que apresente o prompt de autenticação.

O usuário interage com a interface nativa, e o aplicativo recebe um resultado.

### Atenção ao resultado

`result.success === true` significa que a autenticação local foi aprovada conforme as opções e a política da plataforma.

Isso **não significa que o backend emitiu uma nova sessão**.

Além disso, determinadas configurações podem permitir autenticação pela credencial do dispositivo, como PIN ou código de desbloqueio.

Quando o objetivo é restringir o fluxo a determinadas modalidades, as opções disponíveis e o comportamento nativo precisam ser avaliados.

### Níveis de segurança biométrica

No Android, existem diferentes classes de segurança biométrica.

A apresentação destaca:

| Classe | Identificação | Característica |
|---|---|---|
| Classe 2 | `BIOMETRIC_WEAK` | Biometria com nível de garantia inferior ao da classe 3 |
| Classe 3 | `BIOMETRIC_STRONG` | Biometria que atende aos requisitos mais elevados da classificação Android |

No Expo:

```javascript
biometricsSecurityLevel: 'strong'
```

Essa opção solicita biometria forte no Android.

O nível `'weak'` permite as classes 2 e 3 e é o padrão documentado.

A modalidade não determina sozinha o nível de segurança. Dois dispositivos com reconhecimento facial, por exemplo, podem utilizar mecanismos e classificações diferentes.

---

## 6. Diferenças entre Android e iOS

Embora Expo ofereça APIs comuns, existem diferenças na implementação nativa.

| Componente | Android | iOS |
|---|---|---|
| API nativa de autenticação | BiometricPrompt | LocalAuthentication |
| Proteção de chaves | Android Keystore | Keychain/Secure Enclave |
| Autenticação biométrica comum | Digital e rosto, conforme hardware | Face ID e Touch ID |
| Configuração específica | Permissões e políticas Android | Descrição de uso do Face ID |
| Comportamento de credenciais | Conforme Keystore e política nativa | Conforme Keychain e política nativa |

### Configuração do Face ID no Expo

No iOS, é necessário informar ao sistema a finalidade do uso do Face ID.

Exemplo de `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Use o Face ID para entrar."
        }
      ],
      [
        "expo-secure-store",
        {
          "faceIDPermission": "Use o Face ID para proteger suas credenciais."
        }
      ]
    ]
  }
}
```

Os plugins utilizados dependem das bibliotecas e funcionalidades presentes no projeto.

Essa configuração fornece a descrição de uso associada à permissão nativa do Face ID (`NSFaceIDUsageDescription`).

**Importante:** alterações em configurações nativas exigem uma nova compilação do aplicativo.

Para testar adequadamente Face ID, utilize um development build. O Expo Go não oferece suporte completo a essa experiência de autenticação.

### SecureStore e autenticação explícita são iguais?

Não.

**SecureStore com `requireAuthentication`:**

A autenticação é vinculada à proteção de um item sensível.

**LocalAuthentication com `authenticateAsync()`:**

O aplicativo solicita explicitamente uma autenticação e recebe seu resultado.

Por exemplo:

```javascript
const result =
  await LocalAuthentication.authenticateAsync();

if (result.success) {
  const token =
    await SecureStore.getItemAsync('token');
}
```

Esse código não torna automaticamente o item `'token'` protegido por biometria.

Se o token foi salvo sem `requireAuthentication`, sua leitura não está vinculada criptograficamente ao resultado desse prompt.

Essa diferença é demonstrada nos exemplos finais da apresentação.

---

## 7. Tratamento de falhas e recuperação de acesso

A autenticação biométrica não deve ser implementada considerando somente o cenário de sucesso.

O usuário pode cancelar a operação, não possuir biometria cadastrada ou sofrer bloqueios temporários após falhas.

### Resultados possíveis

| Resultado | Significado | Tratamento recomendado |
|---|---|---|
| Sucesso | Autenticação local aprovada | Continuar a operação autorizada |
| `user_cancel` | Usuário cancelou | Manter o fluxo anterior |
| `not_available` | Autenticação indisponível | Oferecer alternativa |
| `not_enrolled` | Nenhuma biometria cadastrada | Orientar configuração ou login alternativo |
| `authentication_failed` | Tentativa não aprovada | Permitir nova tentativa conforme política |
| `lockout` | Autenticação temporariamente bloqueada | Respeitar o bloqueio e oferecer recuperação |
| `system_cancel` | Sistema interrompeu a operação | Permitir retomada quando apropriado |
| `timeout` | Tempo da autenticação esgotado | Oferecer nova tentativa |

Os códigos e resultados efetivamente retornados dependem da API e da plataforma.

### Por que um fallback é necessário?

Imagine que o sensor biométrico pare de funcionar ou que uma atualização altere a configuração biométrica do dispositivo.

Se o aplicativo depender exclusivamente da digital, o usuário poderá ficar sem acesso à sua conta.

Um fluxo de recuperação pode envolver:

- Repetição da autenticação após falhas temporárias.
- Código ou senha do dispositivo, quando permitido pela política.
- Login tradicional no backend.
- Emissão de uma nova credencial após autenticação válida.

**Atenção:** uma alternativa de login não deve permitir contornar arbitrariamente uma credencial protegida pelo sistema operacional.

Caso a chave ou o segredo esteja inacessível, é necessário recuperar a autenticação pelos mecanismos legítimos previstos pela arquitetura.

---

## 8. Biometria, segurança e LGPD

### A biometria resolve todos os problemas de segurança?

Não.

A autenticação biométrica protege uma parte do fluxo, mas não substitui outras medidas de segurança.

Entre os riscos que continuam existindo estão:

- Vazamento ou roubo de tokens.
- Sessões comprometidas.
- Falhas de autorização no backend.
- Dispositivos comprometidos por root ou jailbreak.
- Engenharia social.
- Armazenamento inadequado de credenciais.
- Problemas na renovação ou revogação de sessões.

Um aplicativo pode utilizar biometria corretamente e ainda possuir vulnerabilidades graves em outras partes de sua arquitetura.

### Biometria local vs. captura de dados biométricos

São situações diferentes.

**Autenticação biométrica local:**

```text
Sensor
   |
   v
Sistema operacional
   |
   v
Validação local
   |
   v
Resultado ao aplicativo
```

**Sistema com captura biométrica própria:**

```text
Aplicativo captura imagem
   |
   v
Processamento ou transmissão
   |
   v
Serviço de verificação
   |
   v
Resultado ao aplicativo
```

No primeiro caso, a aplicação utiliza o autenticador do sistema operacional.

No segundo, a aplicação pode efetivamente coletar ou processar dados relacionados à biometria.

### O que a LGPD diz?

A Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), em seu artigo 5º, inciso II, classifica o dado biométrico vinculado a uma pessoa natural como **dado pessoal sensível**.

Isso implica requisitos específicos para seu tratamento.

É importante observar que uma selfie não é necessariamente utilizada como dado biométrico. O contexto e a finalidade do processamento são relevantes.

Utilizar autenticação biométrica local pode reduzir a necessidade de coletar diretamente informações biométricas, mas não elimina as demais obrigações de proteção de dados do aplicativo.

Fonte: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm

---

## 9. Passkeys e autenticação criptográfica

As passkeys representam uma abordagem diferente da simples proteção local de um token.

Elas utilizam criptografia assimétrica e padrões como WebAuthn/FIDO2 para autenticar o usuário perante um serviço.

### Como funciona uma passkey?

Durante o registro de uma credencial, um autenticador gera ou utiliza um par de chaves criptográficas.

- **Chave privada:** permanece protegida pelo autenticador e não é enviada ao servidor.
- **Chave pública:** é registrada pelo serviço para verificar assinaturas.

Na autenticação, o servidor envia um desafio, e o autenticador produz uma resposta criptográfica.

```text
SERVIDOR                       DISPOSITIVO
   |                                |
   |------ Desafio ---------------->|
   |                                |
   |                        Verificação local
   |                        Biometria ou PIN
   |                                |
   |                        Uso da chave privada
   |                                |
   |<----- Resposta assinada -------|
   |                                |
Verificação criptográfica
   |
   v
Emissão da sessão
```

A biometria pode autorizar o uso da chave privada, mas não é transmitida ao servidor.

Passkeys podem ser vinculadas a um dispositivo ou sincronizadas por um provedor compatível.

### Passkey vs. biometria com token

| Característica | Biometria com credencial protegida | Passkey |
|---|---|---|
| Uso da biometria | Autorizar acesso local à credencial | Pode autorizar o uso da chave privada |
| Credencial utilizada | Token ou outro segredo emitido | Credencial criptográfica assimétrica |
| Backend | Valida ou renova a sessão existente | Verifica uma resposta criptográfica |
| Primeiro acesso | Normalmente exige login anterior | Exige registro prévio da passkey |
| Padrão envolvido | APIs locais e mecanismos de armazenamento | WebAuthn/FIDO2 |

Uma passkey não é simplesmente uma impressão digital transformada em senha.

O servidor confia na verificação criptográfica vinculada à credencial registrada, não em uma imagem biométrica.

### React Native e passkeys

A biblioteca `expo-local-authentication` não implementa, sozinha, um sistema de passkeys.

Uma integração completa pode exigir:

- Biblioteca de passkeys compatível.
- Registro prévio da credencial.
- Backend com suporte a WebAuthn.
- Desafios únicos e validação criptográfica.
- Configuração de domínio associado no iOS.
- Configuração de associação de aplicativos no Android.
- Development build e configuração nativa adequada.

Uma biblioteca abordada na apresentação é:

https://github.com/peterferguson/react-native-passkeys

---

## 10. Demonstrações práticas

A apresentação termina com três exemplos que ilustram arquiteturas diferentes.

Os códigos completos estão nos slides 41, 42 e 43 do arquivo [`biometria-react-native.html`](./biometria-react-native.html).

### Demonstração 1 — Face ID / Touch ID e Keychain

**Slide 41**

Utiliza `expo-secure-store` para proteger uma credencial fictícia no iOS.

O exemplo utiliza:

```javascript
const options = {
  requireAuthentication: true,
  authenticationPrompt: 'Acessar credencial',
  keychainAccessible:
    SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};
```

Funcionamento:

1. O aplicativo verifica se a proteção biométrica está disponível.
2. O usuário seleciona a opção para preparar a demonstração.
3. Uma credencial fictícia é salva com proteção.
4. Em uma leitura posterior, o sistema solicita autenticação local.
5. A credencial é liberada somente conforme a política de proteção nativa.

A opção `WHEN_UNLOCKED_THIS_DEVICE_ONLY` restringe o acesso ao contexto de desbloqueio do dispositivo e impede a migração do item para outro aparelho.

**O que esse exemplo demonstra?**

Que a proteção pode estar associada ao item armazenado, sem que o aplicativo precise executar previamente um prompt explícito com `authenticateAsync()`.

O exemplo não realiza autenticação real no backend.

### Demonstração 2 — Prompt explícito com LocalAuthentication

**Slide 42**

Utiliza:

- `expo-local-authentication`
- `expo-secure-store`

O fluxo é:

```text
Aplicativo
   |
   v
Verifica hardware e cadastro
   |
   v
authenticateAsync()
   |
   v
Sistema apresenta prompt
   |
   v
Autenticação aprovada
   |
   v
Aplicativo lê o SecureStore
```

No exemplo, a credencial fictícia é salva sem `requireAuthentication`.

Portanto, embora o aplicativo exija que a biometria seja aprovada antes de executar a leitura, **o próprio segredo não está vinculado à biometria no armazenamento**.

Essa demonstração é importante porque revela a diferença entre controlar um fluxo no JavaScript e proteger efetivamente o material sensível.

### Demonstração 3 — Autenticação com passkey

**Slide 43**

Apresenta um fluxo ilustrativo de autenticação criptográfica.

O aplicativo utiliza uma biblioteca de passkeys para interagir com o autenticador.

Fluxo:

1. O aplicativo solicita ao backend as opções para autenticação.
2. O servidor gera um novo desafio.
3. O dispositivo solicita verificação local do usuário.
4. O autenticador utiliza a chave privada para assinar o desafio.
5. A resposta é enviada ao servidor.
6. O backend verifica o desafio, a assinatura e os demais requisitos WebAuthn.
7. Após validação, o servidor pode emitir a sessão.

Na apresentação, os endpoints `/passkeys/options` e `/passkeys/verify` são **ilustrativos**.

O exemplo não inclui um backend WebAuthn funcional e pressupõe uma passkey previamente registrada.

### Comparação das demonstrações

| Demo | Biblioteca principal | O que comprova |
|---|---|---|
| 1 | Expo SecureStore | Proteção nativa do acesso a uma credencial |
| 2 | Expo LocalAuthentication | Autenticação local explícita e controle do fluxo do aplicativo |
| 3 | React Native Passkeys | Uso de uma credencial criptográfica para autenticação no servidor |

---

## 11. Testes e recomendações

Uma implementação biométrica não deve ser considerada correta apenas porque funcionou uma vez no dispositivo do desenvolvedor.

### Cenários que precisam ser testados

**Autenticação local:**
- Sucesso.
- Cancelamento.
- Digital ou rosto não reconhecido.
- Bloqueio após tentativas.
- Tempo de espera esgotado.

**Dispositivo:**
- Ausência de hardware biométrico.
- Biometria não cadastrada.
- Modalidade biométrica incompatível com a política.
- Alteração no cadastro biométrico.
- Diferentes versões do Android e iOS.

**Credenciais e backend:**
- Token existente e válido.
- Token expirado.
- Token revogado.
- Credencial protegida invalidada.
- Sessão não autorizada pelo backend.
- Falha de rede na renovação da sessão.

### Emulador vs. dispositivo físico

Emuladores e simuladores são úteis para exercitar estados e respostas controladas.

Entretanto, não reproduzem integralmente todas as condições e políticas de proteção de credenciais implementadas pelo hardware e sistema operacional.

O acesso biométrico real a um item protegido pelo SecureStore deve ser validado em dispositivo físico compatível.

### Recomendações de arquitetura

1. Utilize o backend como autoridade para emissão, validação, renovação e revogação de sessões.
2. Armazene pequenos segredos usando mecanismos próprios para credenciais sensíveis.
3. Não confunda autenticação local com autenticação perante o servidor.
4. Utilize proteção nativa vinculada ao segredo ou à chave quando essa garantia for necessária.
5. Evite armazenar tokens em mecanismos de persistência comum sem proteção apropriada.
6. Trate cancelamentos e falhas como estados esperados do fluxo.
7. Preveja recuperação legítima quando a biometria estiver indisponível.
8. Não registre tokens ou segredos em logs.
9. Mantenha autenticação e autorização do backend independentes da confiança na interface do aplicativo.
10. Valide o comportamento em Android e iOS reais antes de utilizar a solução em produção.

---

## 12. Revisão para estudo

### 1. O React Native recebe a impressão digital do usuário?

Não. Na autenticação biométrica local, o sistema operacional realiza a verificação e informa o resultado ao aplicativo.

### 2. O que é um template biométrico?

É uma representação de características biométricas utilizada como referência para comparações posteriores.

### 3. A biometria substitui a senha?

Ela pode substituir a digitação recorrente da senha em determinados fluxos, mas não substitui automaticamente a arquitetura de autenticação e gerenciamento de sessões.

### 4. O que acontece quando `authenticateAsync()` retorna sucesso?

O aplicativo sabe que a autenticação local foi aprovada conforme a política utilizada. Isso não significa que o servidor criou uma nova sessão.

### 5. Qual a diferença entre SecureStore e LocalAuthentication?

O SecureStore armazena pequenos segredos e pode aplicar proteção nativa para acessá-los. O LocalAuthentication inicia e controla explicitamente uma solicitação de autenticação local.

### 6. O que faz `requireAuthentication`?

Solicita que o sistema aplique uma política de autenticação ao acesso a um item protegido.

### 7. Por que um refresh token exige cuidado especial?

Porque pode permitir a continuidade ou renovação de uma sessão, inclusive sem nova digitação de senha, enquanto estiver válido e aceito pelo backend.

### 8. O que acontece se uma nova digital for cadastrada?

Dependendo da plataforma e da política utilizada, credenciais protegidas anteriormente podem ser invalidadas e exigir nova autenticação no backend.

### 9. Qual a diferença entre uma passkey e uma digital?

A digital é uma característica biométrica. Uma passkey é uma credencial criptográfica que pode ter seu uso autorizado por biometria, PIN ou outro método local compatível.

### 10. Por que o backend continua necessário?

Porque autenticar localmente alguém no dispositivo não prova, por si só, que o servidor deve conceder acesso a uma conta ou recurso. O backend continua aplicando validação de credenciais, sessões e regras de autorização.

### Resumo essencial

O princípio central de toda a apresentação é:

**O dispositivo verifica a biometria. O sistema operacional controla o acesso ao material protegido. O backend valida a credencial ou a prova criptográfica e decide sobre a sessão.**

Essas responsabilidades devem ser compreendidas separadamente para desenvolver sistemas de autenticação mobile seguros.

---

## 13. Referências

### Documentação técnica

- [Expo — LocalAuthentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
- [Expo — SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo — Authentication](https://docs.expo.dev/develop/authentication/)
- [Android — Biometrics](https://source.android.com/docs/security/features/biometric)
- [Apple — Platform Security](https://support.apple.com/guide/security/optic-face-touch-passcodes-passwords-sec9479035f1/web)
- [FIDO Alliance — Passkeys](https://fidoalliance.org/passkeys/)
- [React Native Passkeys](https://github.com/peterferguson/react-native-passkeys)
- [Lei Geral de Proteção de Dados Pessoais — LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm)

### Como acessar a apresentação

A apresentação completa está disponível em:

[`biometria-react-native.html`](./biometria-react-native.html)

O arquivo contém **43 slides** e pode ser aberto diretamente em um navegador, inclusive offline.

Controles disponíveis:

| Comando | Função |
|---|---|
| `←` / `→` | Navegar entre os slides |
| `G` | Abrir índice |
| `N` | Consultar notas e fontes do slide |
| `F` | Alternar tela cheia |
| `H` | Ocultar ou exibir controles |
| `B` | Escurecer temporariamente a apresentação |
| `Home` / `End` | Primeiro ou último slide |
| `?` | Consultar atalhos |

As notas de cada slide incluem explicações complementares e referências utilizadas na elaboração do conteúdo.

---

**Seminários de React Native — Análise e Desenvolvimento de Sistemas — IFSP**

Material de apoio para estudo de autenticação biométrica, segurança de credenciais e integração entre aplicações React Native e mecanismos nativos de autenticação.
