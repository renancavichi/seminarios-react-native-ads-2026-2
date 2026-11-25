# Referência Laravel: Google → conta local → sessão

Este diretório é material de estudo, não um backend executado pela apresentação. O frontend funciona sem PHP, banco, API ou credenciais. Os snippets nos slides são recortes; o slide de callback mostra apenas uma associação existente.

## Para experimentar em um Laravel 12 separado

1. Crie um projeto Laravel 12 com PHP e banco compatíveis e o modelo `User` padrão. Instale `composer require laravel/socialite:^5.0`; use uma versão que disponibilize `enablePKCE()`. Essa API foi conferida no código oficial do Socialite 5.x. O projeto de slides não instala dependências PHP.
2. Coloque `GoogleLoginController.php` em `app/Http/Controllers/` e `SocialAccount.php` em `app/Models/`. O User padrão deve permitir mass assignment de `name`, `email`, `password` (padrão do Laravel).
3. Gere uma migration e copie o conteúdo de `create_social_accounts_table.php`; execute `php artisan migrate`. O e-mail de contas novas fica **nulo** e a senha recebe um hash de valor aleatório não divulgado. Adapte fluxos de e-mail, recuperação de acesso e validação à nulabilidade. Não apresente essas contas como e-mails verificados.
4. Mescle `services.php` com `config/services.php`, preservando as outras configurações.
5. Copie `web.php` para `routes/web.php` ou mescle as rotas em uma instalação limpa. Coloque `login.blade.php` e `dashboard.blade.php` em `resources/views/`. Evite conflitos com starter kits já instalados.
6. Configure no `.env` do **backend**, com valores reais obtidos por você (nunca os publique):

```env
APP_URL=http://localhost:8000
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

7. Configure o consentimento e um cliente OAuth Web no Google; cadastre exatamente o callback. Em modo de teste, configure os usuários autorizados. Execute `php artisan config:clear` e `php artisan serve`. Abra `/login` no mesmo host em que começou a tentativa.

O exemplo completo mantém `state` e habilita PKCE em **ambas** as rotas. Não utiliza `stateless()`. O driver Google troca o código e consulta o endpoint autenticado `userinfo` com o access token. Isso é diferente de escrever um validador de ID Token: se consumir um ID Token diretamente, use biblioteca OIDC confiável e valide assinatura, emissor, audiência, expiração e nonce quando aplicável. O exemplo dos slides com `redirect()` e `user()` ilustra a API mínima; o exemplo completo acrescenta PKCE e tratamento de falhas.

## Política de contas

A chave única é `(provider, provider_user_id)`. O `provider` neste exemplo é fixo e só representa o Google, de emissor conhecido. Não aceite emissores ou nomes de provedores vindos de parâmetros sem validação.

Se já houver associação, recuperamos seu usuário. Se não houver, criamos uma **nova conta** em transação. O e-mail retornado pelo Google não é usado para buscar, unir ou sobrescrever contas. A restrição única protege corridas; em conflito, a transação reverte e o usuário pode reiniciar.

Vincular a uma conta local existente é um fluxo separado, **não implementado neste exemplo**. Exija sessão local, reautenticação recente, intenção explícita, nova tentativa OAuth correlacionada e proteção contra CSRF; rejeite identidade já vinculada a outra conta. Nunca faça `firstOrCreate(['email' => $googleUser->getEmail()])` como política de login social.

## Limites e verificação

Não persistimos tokens, não criamos vínculo por e-mail e não recebemos destinos de redirecionamento arbitrários. O Google não cria a sessão Laravel. `Auth::login` e a regeneração de sessão acontecem no nosso servidor. Logout local não faz logout do Google.

Para produção, configure HTTPS, cookies HttpOnly/Secure/SameSite de acordo com a arquitetura, armazenamento de sessão, monitoramento sem códigos/tokens/segredos, política de contas bloqueadas e testes de integração (recusa, estado inválido, callback repetido, colisão de conta e concorrência). Um app mobile deve usar o tipo de cliente, navegador do sistema, redirect e PKCE adequados à plataforma; segredo de cliente Web não deve ser embarcado no aplicativo.

Os arquivos PHP receberam verificação sintática quando o interpretador esteve disponível. Não foi executada autenticação real com o Google, nem banco Laravel, pois este repositório é uma aplicação estática e não contém credenciais.

Fontes: [Socialite](https://laravel.com/docs/12.x/socialite), [código do driver Google](https://github.com/laravel/socialite/blob/5.x/src/Two/GoogleProvider.php), [PKCE no AbstractProvider](https://github.com/laravel/socialite/blob/5.x/src/Two/AbstractProvider.php), [Google OIDC](https://developers.google.com/identity/openid-connect/openid-connect), [OAuth Security BCP](https://www.rfc-editor.org/rfc/rfc9700).
