export const snippets = {
  auth: {
    lang: "php",
    file: "permissions.php",
    code: `// Identidade reconhecida?
auth()->check();

// Permissão para esta ação?
$user->can('access-admin');`,
  },
  install: {
    lang: "bash",
    file: "terminal",
    code: "composer require laravel/socialite",
  },
  env: {
    lang: "dotenv",
    file: ".env",
    code: `GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback`,
  },
  config: {
    lang: "php",
    file: "config/services.php",
    code: `'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],`,
  },
  frontend: {
    lang: "tsx",
    file: "Login.tsx",
    code: `export function Login() {
  return (
    <a href="/auth/google/redirect">
      Continuar com Google
    </a>
  );
}`,
  },
  redirect: {
    lang: "php",
    file: "routes/web.php",
    code: `use Laravel\\Socialite\\Facades\\Socialite;

Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
})->middleware('guest');`,
  },
  identity: {
    lang: "php",
    file: "GoogleLoginController.php",
    code: `$googleUser = Socialite::driver('google')->user();

$id = $googleUser->getId();
$name = $googleUser->getName();
$email = $googleUser->getEmail();
$avatar = $googleUser->getAvatar();`,
  },
  session: {
    lang: "php",
    file: "GoogleLoginController.php",
    code: `// Conta previamente vinculada pelo ID externo
$account = SocialAccount::query()
    ->where('provider', 'google')
    ->where('provider_user_id', $googleUser->getId())
    ->firstOrFail();

$user = $account->user;
Auth::login($user);
$request->session()->regenerate();`,
  },
  unsafe: {
    lang: "js",
    file: "frontend.js · NÃO FAÇA",
    code: `// Tudo que está no bundle é público.
const clientSecret = "segredo-exposto";`,
  },
  token: {
    lang: "json",
    file: "id-token.payload.json · ilustrativo",
    code: `{
  "iss": "https://accounts.google.com",
  "sub": "identidade-estavel-do-usuario",
  "aud": "client-id-da-sua-aplicacao",
  "exp": 2000000000
}`,
  },
};
