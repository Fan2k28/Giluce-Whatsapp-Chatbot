@extends('layouts.app')

@section('title', 'Giluce - Automatisez votre WhatsApp avec une IA')

@section('styles')

<style>
    /* Existing Particles */
    .particles {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 0;
    }

    .particle {
        position: absolute;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        animation: float 8s infinite ease-in-out;
    }
    @keyframes float {
        0% { transform: translateY(0) scale(0.5); opacity: 1; }
        100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    /* ===== NEW ANIMATED DESIGN PATTERNS ===== */
    
    /* Floating Shapes Container */
    .floating-shapes {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
        pointer-events: none;
    }
    
    /* Animated Circle Shape */
    .shape-circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
        animation: morphShape 15s infinite ease-in-out;
    }
    
    /* Animated Square Shape */
    .shape-square {
        position: absolute;
        border-radius: 20px;
        opacity: 0.08;
        animation: rotateScale 20s infinite ease-in-out;
    }
    
    /* Animated Triangle (using clip-path) */
    .shape-triangle {
        position: absolute;
        opacity: 0.08;
        animation: floatTriangle 18s infinite ease-in-out;
    }
    
    @keyframes morphShape {
        0%, 100% { transform: scale(1) rotate(0deg); border-radius: 50%; }
        25% { transform: scale(1.1) rotate(90deg); border-radius: 40% 60% 60% 40% / 40% 50% 50% 60%; }
        50% { transform: scale(0.9) rotate(180deg); border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%; }
        75% { transform: scale(1.05) rotate(270deg); border-radius: 50%; }
    }
    
    @keyframes rotateScale {
        0%, 100% { transform: rotate(0deg) scale(1); }
        33% { transform: rotate(120deg) scale(1.2); }
        66% { transform: rotate(240deg) scale(0.8); }
    }
    
    @keyframes floatTriangle {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(180deg); }
    }
    
    /* Wave Pattern */
    .wave-pattern {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
    }
    
    .wave-pattern svg {
        position: relative;
        display: block;
        width: calc(100% + 1.3px);
        height: 60px;
    }
    
    .wave-pattern .shape-fill {
        fill: #ffffff;
    }
    
    /* ===== ENHANCED CARDS WITH SHADOWS & ANIMATIONS ===== */
    
    /* Feature Card Enhanced */
    .feature-card {
        padding: 2rem;
        border-radius: 24px;
        background: var(--white);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        height: 100%;
        border: 1px solid rgba(74, 143, 216, 0.1);
        position: relative;
        overflow: hidden;
    }
    
    .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-15px);
        box-shadow: 0 25px 50px rgba(74, 143, 216, 0.2);
    }
    
    .feature-card:hover::before {
        transform: scaleX(1);
    }
    
    /* Feature Icon Enhanced */
    .feature-icon {
        width: 80px;
        height: 80px;
        border-radius: 24px;
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: var(--white);
        margin-bottom: 1.5rem;
        transition: all 0.4s ease;
        box-shadow: 0 10px 30px rgba(74, 143, 216, 0.3);
    }
    
    .feature-card:hover .feature-icon {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 15px 40px rgba(74, 143, 216, 0.4);
    }
    
    /* Testimonial Card Enhanced */
    .testimonial-card {
        border-radius: 24px;
        background: var(--white);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid rgba(0, 0, 0, 0.05);
        overflow: hidden;
    }
    
    .testimonial-card:hover {
        transform: translateY(-12px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    }
    
    /* Stats Card Enhanced */
    .stat-item {
        text-align: center;
        color: var(--white);
        padding: 2rem;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .stat-item::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        transform: scale(0);
        transition: transform 0.5s ease;
    }
    
    .stat-item:hover::before {
        transform: scale(1);
    }
    
    .stat-item:hover {
        transform: translateY(-8px);
        background: rgba(255, 255, 255, 0.15);
    }
    
    .stat-number {
        font-size: 3rem;
        font-weight: bold;
        display: block;
        position: relative;
        z-index: 1;
    }
    
    .stat-label {
        font-size: 1rem;
        opacity: 0.9;
        position: relative;
        z-index: 1;
    }
    
    /* CTA Card Enhanced */
    .cta-card {
        border-radius: 30px;
        padding: 4rem;
        text-align: center;
        color: var(--white);
        position: relative;
        overflow: hidden;
    }
    
    .cta-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        animation: shimmer 4s infinite linear;
    }
    
    @keyframes shimmer {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* How It Works Steps Enhanced */
    .step-card {
        padding: 1.5rem;
        border-radius: 20px;
        background: var(--white);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
    }
    
    .step-card:hover {
        transform: translateX(10px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    }
    
    .step-number {
        width: 60px;
        height: 60px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.5rem;
        margin-right: 15px;
        transition: all 0.3s ease;
    }
    
    .step-card:hover .step-number {
        transform: scale(1.1) rotate(10deg);
    }
    
    /* Image Container with Shape */
    .image-container {
        position: relative;
        border-radius: 30px;
        overflow: hidden;
        box-shadow: 0 30px 60px rgba(74, 143, 216, 0.3);
    }
    
    .image-container::before {
        content: '';
        position: absolute;
        top: -20px;
        right: -20px;
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-radius: 30px;
        z-index: -1;
        animation: floatShape 6s infinite ease-in-out;
    }
    
    .image-container::after {
        content: '';
        position: absolute;
        bottom: -30px;
        left: -30px;
        width: 150px;
        height: 150px;
        background: linear-gradient(135deg, var(--accent), var(--secondary));
        border-radius: 40px;
        z-index: -1;
        animation: floatShape 8s infinite ease-in-out reverse;
    }
    
    @keyframes floatShape {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(10deg); }
    }
    
    /* Section Pattern Backgrounds */
    .section-pattern-1 {
        background-image: 
            radial-gradient(circle at 20% 80%, rgba(74, 143, 216, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(62, 209, 106, 0.05) 0%, transparent 50%);
    }
    
    .section-pattern-2 {
        background-image: 
            linear-gradient(45deg, rgba(74, 143, 216, 0.03) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(74, 143, 216, 0.03) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(74, 143, 216, 0.03) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(74, 143, 216, 0.03) 75%);
        background-size: 20px 20px;
    }
    
    /* Gradient Text */
    .gradient-text {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    /* Animated Border for Cards */
    .animated-border {
        position: relative;
    }
    
    .animated-border::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
        background-size: 200% 100%;
        animation: gradientMove 3s linear infinite;
    }
    
    @keyframes gradientMove {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 0%; }
    }
</style>
@endsection

@section('content')
<!-- Hero Section -->
<div class="hero" id="hero">
    <div class="particles" id="particles"></div>
    <div class="hero-content">
        <h1 class="hero-title">
            Automatisez votre WhatsApp avec une IA puissante
        </h1>
        <p class="hero-subtitle">
            Transformez votre WhatsApp en CRM intelligent, envoyez des campagnes automatisées
            et gérez vos clients directement depuis vos conversations.
        </p>
        <div>
            <a href="/register" class="btn-glow" style="animation: pulse 2s infinite;">
                Commencer l'essai gratuit
            </a>
            <a href="/demo" class="btn-glow" style="margin-left: 1rem; background: transparent; border: 2px solid white;">
                Voir la Démo
            </a>
        </div>
    </div>
</div>

<!-- Features Preview Section -->
<section class="section section-pattern-1" style="background: white; position: relative; overflow: hidden;">
    <!-- Animated Floating Shapes -->
    <div class="floating-shapes">
        <div class="shape-circle" style="width: 300px; height: 300px; background: var(--primary); top: -100px; left: -50px; animation-delay: 0s;"></div>
        <div class="shape-square" style="width: 200px; height: 200px; background: var(--secondary); top: 50%; right: -50px; animation-delay: -5s;"></div>
        <div class="shape-circle" style="width: 150px; height: 150px; background: var(--accent); bottom: 10%; left: 20%; animation-delay: -10s;"></div>
    </div>
    
    <div class="container position-relative" style="z-index: 1;">
        <h2 class="section-title">Pourquoi choisir Giluce ?</h2>
        <p class="section-subtitle">Découvrez comment Giluce peut transformer votre manière de communiquer avec vos clients</p>
        
        <div class="row g-4">
            <div class="col-md-4">
                <div class="feature-card animated-border">
                    <div class="feature-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <h4 class="feature-title">Assistant IA Intelligent</h4>
                    <p class="feature-text">Notre intelligence artificielle répond automatiquement à vos clients 24h/24, 7j/7.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-card animated-border">
                    <div class="feature-icon">
                        <i class="fas fa-paper-plane"></i>
                    </div>
                    <h4 class="feature-title">Campagnes Automatisées</h4>
                    <p class="feature-text">Envoyez des messages à des milliers de contacts en un seul clic.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-card animated-border">
                    <div class="feature-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h4 class="feature-title">Analyse en Temps Réel</h4>
                    <p class="feature-text">Suivez vos performances et optimisez votre stratégie commerciale.</p>
                </div>
            </div>
        </div>
        
        <div class="text-center mt-5">
            <a href="/features" class="btn btn-primary btn-lg" style="border-radius: 30px; padding: 12px 35px; box-shadow: 0 10px 30px rgba(74, 143, 216, 0.4);">Voir toutes les fonctionnalités</a>
        </div>
    </div>
</section>

<!-- Stats Section -->
<section class="stats-section" style="position: relative; overflow: hidden;">
    <!-- Animated Background Elements -->
    <div class="floating-shapes">
        <div class="shape-circle" style="width: 400px; height: 400px; background: rgba(255,255,255,0.1); top: -150px; left: -100px; animation-delay: 0s;"></div>
        <div class="shape-circle" style="width: 300px; height: 300px; background: rgba(255,255,255,0.08); bottom: -100px; right: -50px; animation-delay: -5s;"></div>
        <div class="shape-square" style="width: 150px; height: 150px; background: rgba(255,255,255,0.05); top: 30%; left: 60%; animation-delay: -10s;"></div>
    </div>
    
    <div class="container position-relative" style="z-index: 1;">
        <div class="row">
            <div class="col-6 col-md-3">
                <div class="stat-item">
                    <span class="stat-number">10K+</span>
                    <span class="stat-label">Utilisateurs actifs</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="stat-item">
                    <span class="stat-number">1M+</span>
                    <span class="stat-label">Messages envoyés</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="stat-item">
                    <span class="stat-number">99.9%</span>
                    <span class="stat-label">Uptime</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="stat-item">
                    <span class="stat-number">24/7</span>
                    <span class="stat-label">Support</span>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- How It Works Section -->
<section class="section section-pattern-2" style="background: #f8f9fa; position: relative; overflow: hidden;">
    <!-- Animated Floating Shapes -->
    <div class="floating-shapes">
        <div class="shape-circle" style="width: 250px; height: 250px; background: var(--primary); bottom: -80px; left: -80px; animation-delay: -2s;"></div>
        <div class="shape-square" style="width: 180px; height: 180px; background: var(--accent); top: 10%; right: 10%; animation-delay: -7s;"></div>
    </div>
    
    <div class="container position-relative" style="z-index: 1;">
        <h2 class="section-title">Comment ça marche ?</h2>
        <p class="section-subtitle">Démarrez en quelques minutes seulement</p>
        
        <div class="row align-items-center">
            <div class="col-md-6">
                <div class="mb-4">
                    <div class="step-card d-flex align-items-center mb-3">
                        <div class="step-number" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark));">1</div>
                        <div>
                            <h5 class="mb-0">Créez votre compte</h5>
                            <small class="text-muted">Inscription gratuite en 30 secondes</small>
                        </div>
                    </div>
                    <div class="step-card d-flex align-items-center mb-3">
                        <div class="step-number" style="background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));">2</div>
                        <div>
                            <h5 class="mb-0">Connectez WhatsApp</h5>
                            <small class="text-muted">Scannez votre QR code</small>
                        </div>
                    </div>
                    <div class="step-card d-flex align-items-center">
                        <div class="step-number" style="background: linear-gradient(135deg, var(--accent), var(--accent-dark));">3</div>
                        <div>
                            <h5 class="mb-0">Commencez à automatiser</h5>
                            <small class="text-muted">Configurez vos workflows</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 text-center">
                <div class="image-container">
                    <img src="{{asset('images/demo.webp')}}" alt="Demo" class="img-fluid" style="max-width: 100%;">
                </div>
            </div>
        </div>
        
        <div class="text-center mt-5">
            <a href="/how-it-works" class="btn btn-outline-primary btn-lg" style="border-radius: 30px; padding: 12px 35px;">En savoir plus</a>
        </div>
    </div>
</section>

<!-- Testimonials Section -->
<section class="section section-pattern-1" style="background: white; position: relative; overflow: hidden;">
    <!-- Animated Floating Shapes -->
    <div class="floating-shapes">
        <div class="shape-circle" style="width: 200px; height: 200px; background: var(--secondary); top: -50px; right: 5%; animation-delay: -3s;"></div>
        <div class="shape-square" style="width: 120px; height: 120px; background: var(--primary); bottom: 20%; left: -30px; animation-delay: -8s;"></div>
    </div>
    
    <div class="container position-relative" style="z-index: 1;">
        <h2 class="section-title">Ce que disent nos clients</h2>
        <p class="section-subtitle">Rejoignez des milliers d'entrepreneurs satisfaits</p>
        
        <div class="row g-4">
            <div class="col-md-4">
                <div class="testimonial-card h-100">
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                        </div>
                        <p class="card-text" style="font-style: italic;">"Giluce a révolutionné notre service client. Nous répondons 3x plus vite maintenant!"</p>
                        <div class="d-flex align-items-center mt-4">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 15px; box-shadow: 0 8px 20px rgba(74, 143, 216, 0.3);">JM</div>
                            <div>
                                <strong>Jean M.</strong><br>
                                <small class="text-muted">Directeur Commercial</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="testimonial-card h-100">
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                        </div>
                        <p class="card-text" style="font-style: italic;">"L'automatisation nous fait gagner 20 heures par semaine. Un investissement rentable!"</p>
                        <div class="d-flex align-items-center mt-4">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--secondary), var(--secondary-dark)); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 15px; box-shadow: 0 8px 20px rgba(62, 209, 106, 0.3);">SL</div>
                            <div>
                                <strong>Sophie L.</strong><br>
                                <small class="text-muted">CEO Startup</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="testimonial-card h-100">
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                        </div>
                        <p class="card-text" style="font-style: italic;">"Le support client est incroyable. Ils répondent en quelques minutes à chaque fois."</p>
                        <div class="d-flex align-items-center mt-4">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--accent), var(--accent-dark)); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; margin-right: 15px; box-shadow: 0 8px 20px rgba(242, 201, 76, 0.3);">DK</div>
                            <div>
                                <strong>David K.</strong><br>
                                <small class="text-muted">Chef d'entreprise</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section" style="position: relative; overflow: hidden; padding: 6rem 0;">
    <!-- Animated Floating Shapes -->
    <div class="floating-shapes">
        <div class="shape-circle" style="width: 350px; height: 350px; background: rgba(255,255,255,0.15); top: -150px; left: -100px; animation-delay: -1s;"></div>
        <div class="shape-square" style="width: 200px; height: 200px; background: rgba(255,255,255,0.08); bottom: -80px; right: -50px; animation-delay: -6s;"></div>
    </div>
    
    <div class="container position-relative" style="z-index: 1;">
        <div class="cta-card">
            <h2 class="cta-title" style="position: relative; z-index: 1;">Prêt à transformer votre business ?</h2>
            <p class="cta-text" style="position: relative; z-index: 1;">Rejoignez plus de 10,000 entreprises qui font confiance à Giluce</p>
            <div style="position: relative; z-index: 1;">
                <a href="/register" class="btn btn-light btn-lg" style="color: var(--primary); font-weight: 600; border-radius: 30px; padding: 14px 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">Commencer gratuitement</a>
                <a href="/demo" class="btn btn-outline-light btn-lg" style="margin-left: 10px; border-radius: 30px; padding: 14px 40px;">Voir la démo</a>
            </div>
        </div>
    </div>
</section>
@endsection

@section('scripts')
<script>
    const particlesContainer = document.getElementById('particles');
    
    for(let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
        particlesContainer.appendChild(particle);
    }
</script>
@endsection
