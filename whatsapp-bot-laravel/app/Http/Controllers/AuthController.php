<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Show login form
     */
    public function showLoginForm()
    {
        if (Auth::check()) {
            return redirect('/dashboard');
        }
        return view('auth.login');
    }

    /**
     * Handle login
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun compte trouvé avec cet email.'
            ], 422);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Votre compte a été désactivé. Veuillez contacter le support.'
            ], 422);
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Le mot de passe est incorrect.'
            ], 422);
        }

        // Update last login
        $user->updateLastLogin();

        // Login the user
        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Bienvenue ' . $user->name . '!',
            'redirect' => '/dashboard'
        ]);
    }

    /**
     * Show registration form
     */
    public function showRegistrationForm()
    {
        if (Auth::check()) {
            return redirect('/dashboard');
        }
        return view('auth.register');
    }

    /**
     * Handle registration
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'terms' => 'accepted',
        ]);

        // Create user with free plan
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'plan_type' => 'free',
            'max_sessions' => 1,
            'is_active' => true,
        ]);

        // Auto-login after registration
        Auth::login($user);

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Bienvenue ' . $user->name . '! Votre compte gratuit a été créé.',
            'redirect' => '/dashboard'
        ]);
    }

    /**
     * Handle logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Vous avez été déconnecté avec succès.',
            'redirect' => '/'
        ]);
    }
}
