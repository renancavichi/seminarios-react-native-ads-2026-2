<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Models\User;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;

// Referência educacional para Laravel 12 + Socialite 5.x.
// Não executado pela apresentação. Configuração e schema em README.md.
class GoogleLoginController extends Controller
{
    public function redirect(): RedirectResponse
    {
        // Requer Socialite 5.x com enablePKCE(). Preserva state e sessão web.
        return Socialite::driver('google')->enablePKCE()->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        // Recusa, parâmetros ausentes e state inválido nunca criam sessão.
        if ($request->has('error') || ! is_string($request->query('code'))
            || $request->query('code') === '' || ! is_string($request->query('state'))) {
            return redirect()->route('login')->with('status', 'Login não concluído. Tente novamente.');
        }

        try {
            // No fluxo de código, o driver consulta o userinfo com access token.
            // Este código não decodifica nem valida manualmente um ID Token.
            $googleUser = Socialite::driver('google')->enablePKCE()->user();
        } catch (InvalidStateException) {
            return redirect()->route('login')->with('status', 'Tentativa expirada ou inválida. Reinicie o login.');
        } catch (GuzzleException) {
            // Não registre a URL do callback, o código, o segredo ou tokens.
            return redirect()->route('login')->with('status', 'Provedor indisponível. Tente novamente.');
        }

        $externalId = $googleUser->getId();
        abort_unless(is_string($externalId) && $externalId !== '' && strlen($externalId) <= 255, 400);

        try {
            $user = DB::transaction(function () use ($externalId, $googleUser) {
                $account = SocialAccount::query()
                    ->where('provider', 'google')
                    ->where('provider_user_id', $externalId)
                    ->lockForUpdate()
                    ->first();

                if ($account) {
                    return $account->user;
                }

                // Cria uma conta nova, SEM procurar outra pelo e-mail.
                // E-mail local nulo evita usurpar endereço já usado e não
                // pressupõe uma política de verificação do provedor.
                $user = User::create([
                    'name' => Str::limit($googleUser->getName() ?: 'Novo usuário', 200, ''),
                    'email' => null,
                    'password' => Hash::make(Str::random(64)),
                ]);

                SocialAccount::create([
                    'provider' => 'google',
                    'provider_user_id' => $externalId,
                    'user_id' => $user->id,
                ]);

                // Não persistimos access / refresh / ID tokens neste login.
                return $user;
            });
        } catch (QueryException $e) {
            // Restrição UNIQUE protege contra duas criações concorrentes.
            // A transação reverte também o User recém-criado.
            if (in_array((string) $e->getCode(), ['23000', '23505'], true)) {
                return redirect()->route('login')->with('status', 'Conflito de cadastro. Reinicie o login.');
            }
            throw $e;
        }

        Auth::login($user);
        $request->session()->regenerate();

        // Destino local fixo; não aceitamos redirect arbitrário da query string.
        return redirect()->route('dashboard');
    }
}
