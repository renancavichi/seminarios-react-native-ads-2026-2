<!doctype html>
<html lang="pt-BR"><meta charset="utf-8"><title>Entrar</title>
@if (session('status'))
    <p role="status">{{ session('status') }}</p>
@endif
<a href="/auth/google/redirect">Continuar com Google</a>
</html>
