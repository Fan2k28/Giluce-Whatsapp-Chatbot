<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WhatsAppSessionController;
use App\Http\Controllers\AuthController;
use App\Models\WhatsAppSession;
use Illuminate\Support\Facades\Auth;

// Public routes
Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/features', function () {
    return view('features');
});

Route::get('/how-it-works', function () {
    return view('how-it-works');
});

Route::get('/pricing', function () {
    return view('pricing');
});

// All routes within this group have web middleware (session, CSRF, etc.)
Route::middleware('web')->group(function () {
    // Auth routes
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Protected routes - require authentication
    Route::middleware('auth')->group(function () {
        Route::get('/dashboard', function () {
            $user = Auth::user();
            
            // Check if user has any sessions in the database
            $sessionCount = WhatsAppSession::forUser($user->id)->count();
            
            // Button should only show when there are NO sessions
            $canCreateSession = $sessionCount === 0;
            
            return view('dashboard.index', [
                'sessionCount' => $sessionCount,
                'canCreateSession' => $canCreateSession
            ]);
        })->name('dashboard');
        
        // Custom routes for QR code, reconnect and pair number (must come before resource route)
        Route::get('/sessions/{id}/qr', [WhatsAppSessionController::class, 'getQrCode'])->name('sessions.qr');
        Route::post('/sessions/{id}/reconnect', [WhatsAppSessionController::class, 'reconnect'])->name('sessions.reconnect');
        Route::get('/pair-number', [WhatsAppSessionController::class, 'getPairNumber'])->name('sessions.pair-number');
        
        Route::resource('sessions', WhatsAppSessionController::class)->except(['edit', 'update']);
        Route::get('/sessions/{id}', [WhatsAppSessionController::class, 'show'])->name('sessions.show');
    });
});
