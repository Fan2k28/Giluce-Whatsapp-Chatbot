<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WhatsAppSessionController;

// Routes for the WhatsApp Bot SaaS
Route::get('/', function () {
    return view('home');
});

Route::get('/features', function () {
    return view('features');
});

Route::get('/how-it-works', function () {
    return view('how-it-works');
});

Route::get('/pricing', function () {
    return view('pricing');
});

Route::get('/docs', function () {
    return view('docs');
});

Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/register', function () {
    return view('auth.register');
})->name('register');

Route::get('/dashboard', function () {
    return view('dashboard.index');
});

Route::post('/logout', function () {
    auth()->logout();
    return redirect('/');
});

// Custom routes for QR code and reconnect (must come before resource route)
Route::get('/sessions/{id}/qr', [WhatsAppSessionController::class, 'getQrCode'])->name('sessions.qr');
Route::post('/sessions/{id}/reconnect', [WhatsAppSessionController::class, 'reconnect'])->name('sessions.reconnect');

Route::resource('sessions', WhatsAppSessionController::class)->except(['edit', 'update']);

Route::get('/sessions/{id}', [WhatsAppSessionController::class, 'show'])->name('sessions.show');
