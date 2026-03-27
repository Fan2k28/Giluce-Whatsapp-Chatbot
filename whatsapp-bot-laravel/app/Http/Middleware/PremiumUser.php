<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PremiumUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return redirect('/login')->with('error', 'Veuillez vous connecter pour accéder à cette page.');
        }

        if (!$request->user()->isPremium()) {
            return redirect('/pricing')->with('error', 'Cette fonctionnalité est reservée aux utilisateurs premium.');
        }

        return $next($request);
    }
}
