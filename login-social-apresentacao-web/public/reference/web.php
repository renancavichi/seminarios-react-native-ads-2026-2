<?php

use App\Http\Controllers\GoogleLoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Copie para routes/web.php (middleware web com sessão e CSRF).
Route::get('/login', function () {
    return view('login');
})->middleware('guest')->name('login');

Route::middleware(['guest', 'throttle:20,1'])->group(function () {
    Route::get('/auth/google/redirect', [GoogleLoginController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleLoginController::class, 'callback']);
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth')->name('dashboard');

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect()->route('login');
})->middleware('auth')->name('logout');
