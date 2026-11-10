<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // No schema padrão do Laravel, torne email opcional para contas sociais.
        // Compatibilize formulários, notificações e regras do seu aplicativo.
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
        });
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider', 32);
            $table->string('provider_user_id', 255);
            $table->timestamps();
            $table->unique(['provider', 'provider_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_accounts');
        // Não voltamos email para NOT NULL: contas sociais podem ter email nulo.
        // Exija migração de dados explícita se precisar reverter essa decisão.
    }
};
