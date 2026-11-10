<!doctype html>
<html lang="pt-BR"><meta charset="utf-8"><title>Dashboard</title>
<h1>Olá, {{ auth()->user()->name }}.</h1>
<p>Você tem uma sessão local. Permissões continuam sob controle da aplicação.</p>
<form action="{{ route('logout') }}" method="POST">
    @csrf
    <button type="submit">Sair desta aplicação</button>
</form>
</html>
