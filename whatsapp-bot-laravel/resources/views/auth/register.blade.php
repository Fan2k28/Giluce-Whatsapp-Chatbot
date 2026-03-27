@extends('layouts.app')

@section('title', 'Inscription - Giluce')

@section('styles')
<!-- SweetAlert2 CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.0/dist/sweetalert2.min.css">

<style>
    /* ===== AUTH PAGE STYLES ===== */
    .auth-page {
        margin-top: 80px;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        padding: 40px 20px;
        position: relative;
        overflow: hidden;
    }
    
    /* Animated background */
    .auth-page::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    /* Floating shapes */
    .auth-shapes {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        overflow: hidden;
    }
    
    .auth-shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
        animation: floatAuth 15s infinite ease-in-out;
    }
    
    .auth-shape-1 {
        width: 400px;
        height: 400px;
        background: white;
        top: -150px;
        right: -100px;
    }
    
    .auth-shape-2 {
        width: 300px;
        height: 300px;
        background: white;
        bottom: -100px;
        left: -50px;
        animation-delay: -7s;
    }
    
    @keyframes floatAuth {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-40px); }
    }
    
    /* Auth Card */
    .auth-card {
        background: white;
        border-radius: 30px;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
        width: 100%;
        max-width: 500px;
        padding: 50px 40px;
        position: relative;
        z-index: 1;
        animation: slideUp 0.8s ease-out;
    }
    
    @keyframes slideUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    /* Logo */
    .auth-logo {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .auth-logo img {
        width: 150px;
        height: auto;
    }
    
    /* Title */
    .auth-title {
        text-align: center;
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--black);
        margin-bottom: 10px;
    }
    
    .auth-subtitle {
        text-align: center;
        color: var(--gray);
        margin-bottom: 30px;
    }
    
    /* Form */
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-label {
        display: block;
        font-weight: 600;
        color: var(--black);
        margin-bottom: 8px;
        font-size: 0.95rem;
    }
    
    .form-control {
        width: 100%;
        padding: 14px 18px;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #f8f9fa;
    }
    
    .form-control:focus {
        outline: none;
        border-color: var(--primary);
        background: white;
        box-shadow: 0 0 0 4px rgba(74, 143, 216, 0.1);
    }
    
    /* Submit Button */
    .btn-submit {
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
    }
    
    .btn-submit:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(74, 143, 216, 0.4);
    }
    
    .btn-submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
    
    /* Divider */
    .auth-divider {
        display: flex;
        align-items: center;
        margin: 25px 0;
    }
    
    .auth-divider::before,
    .auth-divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e0e0e0;
    }
    
    .auth-divider span {
        padding: 0 15px;
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    /* Social Login */
    .social-login {
        display: flex;
        gap: 15px;
        justify-content: center;
    }
    
    .social-btn {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        border: 2px solid #e0e0e0;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .social-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
    
    .social-btn.google { color: #DB4437; }
    .social-btn.google:hover { border-color: #DB4437; background: #fff5f5; }
    
    .social-btn.facebook { color: #4267B2; }
    .social-btn.facebook:hover { border-color: #4267B2; background: #f0f5ff; }
    
    /* Footer Link */
    .auth-footer {
        text-align: center;
        margin-top: 25px;
        color: var(--gray);
    }
    
    .auth-footer a {
        color: var(--primary);
        font-weight: 600;
        text-decoration: none;
    }
    
    .auth-footer a:hover {
        text-decoration: underline;
    }
    
    /* Password Strength */
    .password-strength {
        margin-top: 8px;
    }
    
    .strength-bar {
        height: 4px;
        background: #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
    }
    
    .strength-fill {
        height: 100%;
        width: 0;
        transition: all 0.3s ease;
        border-radius: 2px;
    }
    
    .strength-fill.weak { width: 33%; background: #e74c3c; }
    .strength-fill.medium { width: 66%; background: #f39c12; }
    .strength-fill.strong { width: 100%; background: #27ae60; }
    
    .strength-text {
        font-size: 0.8rem;
        margin-top: 5px;
    }
    
    .strength-text.weak { color: #e74c3c; }
    .strength-text.medium { color: #f39c12; }
    .strength-text.strong { color: #27ae60; }
    
    /* Checkbox */
    .checkbox-group {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .checkbox-group input {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        accent-color: var(--primary);
    }
    
    .checkbox-group label {
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    .checkbox-group a {
        color: var(--primary);
    }
</style>
@endsection

@section('content')
<div class="auth-page">
    <div class="auth-shapes">
        <div class="auth-shape auth-shape-1"></div>
        <div class="auth-shape auth-shape-2"></div>
    </div>
    
    <div class="auth-card">
        <div class="auth-logo">
            <img src="{{ asset('images/logo/logo.png') }}" alt="Giluce" style="margin: 0 auto;">
        </div>
        
        <h1 class="auth-title">Créer un compte</h1>
        <p class="auth-subtitle">Commencez à automatiser votre WhatsApp aujourd'hui</p>
        
        <form id="registerForm" method="POST" action="/register">
            @csrf
            
            <div class="form-group">
                <label class="form-label" for="name">Nom complet</label>
                <input type="text" id="name" name="name" class="form-control" placeholder="Entrez votre nom complet" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="email">Adresse email</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="exemple@email.com" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="password">Mot de passe</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required minlength="8">
                <div class="password-strength">
                    <div class="strength-bar">
                        <div class="strength-fill" id="strengthFill"></div>
                    </div>
                    <div class="strength-text" id="strengthText"></div>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="password_confirmation">Confirmer le mot de passe</label>
                <input type="password" id="password_confirmation" name="password_confirmation" class="form-control" placeholder="••••••••" required>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="terms" name="terms" required>
                <label for="terms">J'accepte les <a href="#">Conditions d'utilisation</a> et la <a href="#">Politique de confidentialité</a></label>
            </div>
            
            <button type="submit" class="btn-submit" id="submitBtn">Créer mon compte</button>
        </form>
        
        <div class="auth-divider">
            <span>ou</span>
        </div>
        
        <div class="social-login">
            <button type="button" class="social-btn google" style="border-radius:30px;" onclick="loginWithGoogle()">
                <i class="fab fa-google"></i>
            </button>
            <button type="button" class="social-btn facebook" style="border-radius:30px;" onclick="loginWithFacebook()">
                <i class="fab fa-facebook-f"></i>
            </button>
        </div>
        
        <div class="auth-footer">
            Déjà un compte? <a href="/login">Se connecter</a>
        </div>
    </div>
</div>

<!-- SweetAlert2 JS -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.0/dist/sweetalert2.min.js"></script>

<script>
    // Password strength checker
    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        strengthFill.className = 'strength-fill';
        strengthText.className = 'strength-text';
        
        if (password.length === 0) {
            strengthFill.style.width = '0';
            strengthText.textContent = '';
        } else if (strength <= 1) {
            strengthFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Mot de passe faible';
        } else if (strength <= 2) {
            strengthFill.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Mot de passe moyen';
        } else {
            strengthFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Mot de passe fort';
        }
    });
    
    // Form submission with SweetAlert and AJAX
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password_confirmation').value;
        const terms = document.getElementById('terms');
        
        // Check password match
        if (password !== passwordConfirm) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Les mots de passe ne correspondent pas!',
                confirmButtonColor: '#4A8FD8',
                confirmButtonText: 'Réessayer'
            });
            return;
        }
        
        // Check password length
        if (password.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Le mot de passe doit contenir au moins 8 caractères!',
                confirmButtonColor: '#4A8FD8',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        // Check terms
        if (!terms.checked) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Vous devez accepter les conditions d\'utilisation!',
                confirmButtonColor: '#4A8FD8',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        // Show loading
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création du compte...';
        
        // Get form data
        const formData = new FormData(this);
        
        // Submit form via AJAX
        fetch('/register', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': formData.get('_token')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Compte créé!',
                    text: data.message || 'Bienvenue sur Giluce!',
                    confirmButtonColor: '#3ED16A',
                    confirmButtonText: 'Continuer'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = data.redirect || '/dashboard';
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: data.message || 'Une erreur est survenue',
                    confirmButtonColor: '#4A8FD8'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur de connexion est survenue',
                confirmButtonColor: '#4A8FD8'
            });
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Créer mon compte';
        });
    });
    
    // Social login placeholders
    function loginWithGoogle() {
        Swal.fire({
            icon: 'info',
            title: 'Bientôt disponible',
            text: 'La connexion Google sera bientôt disponible!',
            confirmButtonColor: '#4A8FD8'
        });
    }
    
    function loginWithFacebook() {
        Swal.fire({
            icon: 'info',
            title: 'Bientôt disponible',
            text: 'La connexion Facebook sera bientôt disponible!',
            confirmButtonColor: '#4A8FD8'
        });
    }
    
    // Show flash messages with SweetAlert
    @if(session('success'))
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: '{{ session('success') }}',
            confirmButtonColor: '#3ED16A'
        });
    @endif
    
    @if(session('error'))
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: '{{ session('error') }}',
            confirmButtonColor: '#4A8FD8'
        });
    @endif
    
    @if($errors->any())
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: '{{ $errors->first() }}',
            confirmButtonColor: '#4A8FD8'
        });
    @endif
</script>
@endsection
