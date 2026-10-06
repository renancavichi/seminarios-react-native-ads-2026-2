# Biometria no React Native — resumo da apresentação

Esta apresentação de **43 slides** explica como usar autenticação biométrica em aplicativos React Native com Expo, considerando Android, iOS, armazenamento de credenciais e passkeys.

## Ideia central

Na autenticação biométrica local, **o dispositivo verifica a digital ou o rosto** e devolve ao aplicativo um resultado. O app não recebe a imagem, o template biométrico nem os dados brutos do sensor. **O backend, por sua vez, valida a credencial ou a sessão** usada para acessar o serviço. Portanto, uma biometria aprovada no celular não cria, por si só, uma sessão válida no servidor.

## Conteúdo dos slides

- **Fundamentos (1–12):** diferença entre identificação e autenticação; fatores de conhecimento, posse e biometria; funcionamento da verificação local e isolamento dos dados biométricos pelo sistema operacional.
- **Credenciais e sessão (13–22):** login inicial, *access token* e *refresh token*, armazenamento de pequenos segredos com `expo-secure-store` e uso de `requireAuthentication` para condicionar o acesso a uma credencial protegida.
- **Implementação com Expo (23–30):** `expo-local-authentication`, verificações de hardware e cadastro biométrico, abertura do prompt nativo com `authenticateAsync()` e tratamento de sucesso, cancelamento, indisponibilidade e falhas. No Android, a apresentação também aborda as classes de segurança biométrica.
- **Plataformas e segurança (31–40):** recuperação quando a biometria falha, diferenças entre Android e iOS, configuração do Face ID, mudanças no cadastro biométrico, limites dessa proteção, privacidade e LGPD. O fluxo com passkeys mostra uma chave privada no autenticador e a verificação da assinatura pelo servidor.

## Três demonstrações finais

1. **iOS, Face ID/Touch ID e Keychain (slide 41):** `expo-secure-store` guarda uma credencial fictícia com `requireAuthentication`; a leitura do item protegido solicita a autenticação local.
2. **Prompt explícito (slide 42):** `expo-local-authentication` pede a biometria antes de ler um item do SecureStore. Neste exemplo, o prompt controla o fluxo do aplicativo, mas **o item armazenado não está vinculado à biometria**.
3. **Passkey (slide 43):** o dispositivo assina um desafio recebido do backend; o servidor verifica a resposta e emite a sessão. O exemplo depende de uma passkey já registrada, configuração das plataformas e um backend WebAuthn; esses componentes não estão incluídos no HTML.

Os exemplos usam tokens fictícios ou endpoints ilustrativos. Para um aplicativo real, é preciso integrar o login e a renovação de sessão ao backend, lidar com credenciais expiradas ou revogadas e testar o acesso biométrico em dispositivo físico.

## Como assistir

Abra `biometria-react-native.html` em um navegador. A apresentação funciona offline. Use as setas **←/→** para navegar, **G** para abrir o índice e **N** para ver as notas e fontes de cada slide.
