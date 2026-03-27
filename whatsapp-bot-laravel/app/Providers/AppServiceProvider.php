<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use App\Models\WhatsAppSession;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share session-related data with all dashboard views
        View::composer('layouts.dashboard', function ($view) {
            try {
                // Check if the whatsapp_sessions table exists
                if (!Schema::hasTable('whatsapp_sessions')) {
                    $view->with([
                        'sessionCount' => 0,
                        'maxSessions' => 1,
                        'canCreateSession' => true,
                    ]);
                    return;
                }
                
                // Get current authenticated user
                $user = Auth::user();
                
                if ($user) {
                    // Debug: log the user ID and session count
                    \Log::info('User ID: ' . $user->id);
                    
                    // Get session count for current user ONLY
                    $userSessionCount = WhatsAppSession::forUser($user->id)->count();
                    
                    \Log::info('User session count: ' . $userSessionCount);
                    
                    // Get max sessions based on user plan (default: 1 for free)
                    $maxSessions = $user->max_sessions ?? 1;
                    
                    // Calculate if user can create more sessions
                    $canCreateSession = $userSessionCount < $maxSessions;
                    
                    // Share variables with views
                    $view->with([
                        'sessionCount' => $userSessionCount,
                        'maxSessions' => $maxSessions,
                        'canCreateSession' => $canCreateSession,
                    ]);
                } else {
                    // User not authenticated - set default values
                    $view->with([
                        'sessionCount' => 0,
                        'maxSessions' => 1,
                        'canCreateSession' => true,
                    ]);
                }
            } catch (\Exception $e) {
                // Fallback values if something goes wrong (e.g., database not ready)
                \Log::error('AppServiceProvider error: ' . $e->getMessage());
                $view->with([
                    'sessionCount' => 0,
                    'maxSessions' => 1,
                    'canCreateSession' => true,
                ]);
            }
        });
    }
}
