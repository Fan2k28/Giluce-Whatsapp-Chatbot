@extends('layouts.app')

@section('title', 'Comment ça marche - Giluce')

@section('styles')
<style>
    /* ===== HERO SECTION ===== */
    .how-hero {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        padding: 120px 0 80px;
        position: relative;
        overflow: hidden;
        min-height: 50vh;
        display: flex;
        align-items: center;
    }
    
    .how-hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    }
    
    /* Floating particles */
    .floating-particles {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
    }
    
    .particle {
        position: absolute;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        animation: floatParticle 15s infinite linear;
    }
    
    @keyframes floatParticle {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
    }
    
    /* ===== TIMELINE CONTAINER ===== */
    .timeline-container {
        padding: 80px 0;
        background: linear-gradient(180deg, #f8f9fa 0%, white 100%);
        position: relative;
        overflow: hidden;
    }
    
    /* Animated background shapes */
    .bg-shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.05;
        animation: morphShape 20s infinite ease-in-out;
    }
    
    .bg-shape-1 {
        width: 500px;
        height: 500px;
        background: var(--primary);
        top: -200px;
        left: -200px;
    }
    
    .bg-shape-2 {
        width: 400px;
        height: 400px;
        background: var(--secondary);
        bottom: -150px;
        right: -150px;
        animation-delay: -10s;
    }
    
    @keyframes morphShape {
        0%, 100% { transform: scale(1) rotate(0deg); border-radius: 50%; }
        33% { transform: scale(1.1) rotate(120deg); border-radius: 40% 60% 60% 40%; }
        66% { transform: scale(0.9) rotate(240deg); border-radius: 60% 40% 40% 60%; }
    }
    
    /* ===== TIMELINE ===== */
    .timeline {
        position: relative;
        max-width: 900px;
        margin: 0 auto;
        padding: 20px 0;
    }
    
    /* Central line */
    .timeline::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, var(--primary), var(--secondary), var(--accent));
        border-radius: 2px;
        animation: lineGlow 3s infinite alternate;
    }
    
    @keyframes lineGlow {
        0% { box-shadow: 0 0 10px rgba(74, 143, 216, 0.3); }
        100% { box-shadow: 0 0 20px rgba(62, 209, 106, 0.5); }
    }
    
    /* ===== TIMELINE ITEM ===== */
    .timeline-item {
        position: relative;
        width: 50%;
        padding: 20px 60px;
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .timeline-item.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .timeline-item:nth-child(odd) {
        left: 0;
        text-align: right;
        padding-right: 80px;
    }
    
    .timeline-item:nth-child(even) {
        left: 50%;
        text-align: left;
        padding-left: 80px;
    }
    
    /* Timeline dot */
    .timeline-dot {
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
        top: 30px;
        z-index: 10;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transition: all 0.4s ease;
    }
    
    .timeline-item:nth-child(odd) .timeline-dot {
        right: -30px;
    }
    
    .timeline-item:nth-child(even) .timeline-dot {
        left: -30px;
    }
    
    .timeline-item:hover .timeline-dot {
        transform: scale(1.2);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
    
    .dot-1 { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); }
    .dot-2 { background: linear-gradient(135deg, var(--secondary), var(--secondary-dark)); }
    .dot-3 { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: black; }
    .dot-4 { background: linear-gradient(135deg, #9B59B6, #8E44AD); }
    
    /* Pulse animation on dot */
    .timeline-dot::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 3px solid;
        border-color: inherit;
        opacity: 0;
        animation: pulseRing 2s infinite;
    }
    
    .dot-1::after { border-color: var(--primary); }
    .dot-2::after { border-color: var(--secondary); }
    .dot-3::after { border-color: var(--accent); }
    .dot-4::after { border-color: #9B59B6; }
    
    @keyframes pulseRing {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(1.5); opacity: 0; }
    }
    
    /* ===== STEP CARD ===== */
    .step-card {
        padding: 2.5rem;
        border-radius: 24px;
        background: white;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
    }
    
    .step-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
    }
    
    .timeline-item:hover .step-card {
        transform: scale(1.03);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
    }
    
    .step-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
    }
    
    .step-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--black);
        margin-bottom: 0.75rem;
    }
    
    .step-description {
        color: var(--gray);
        line-height: 1.7;
        font-size: 1rem;
    }
    
    /* ===== CONNECTING ARROW ===== */
    .timeline-arrow {
        position: absolute;
        font-size: 2rem;
        color: var(--primary);
        opacity: 0.3;
        animation: arrowBounce 2s infinite;
    }
    
    .timeline-item:nth-child(odd) .timeline-arrow {
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
    }
    
    .timeline-item:nth-child(even) .timeline-arrow {
        left: 20px;
        top: 50%;
        transform: translateY(-50%) rotate(180deg);
    }
    
    @keyframes arrowBounce {
        0%, 100% { opacity: 0.3; transform: translateY(-50%); }
        50% { opacity: 0.6; transform: translateY(-60%); }
    }
    
    .timeline-item:nth-child(even) .timeline-arrow {
        animation: arrowBounceReverse 2s infinite;
    }
    
    @keyframes arrowBounceReverse {
        0%, 100% { opacity: 0.3; transform: translateY(-50%) rotate(180deg); }
        50% { opacity: 0.6; transform: translateY(-60%) rotate(180deg); }
    }
    
    /* ===== CTA SECTION ===== */
    .cta-section {
        background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));
        padding: 80px 0;
        position: relative;
        overflow: hidden;
    }
    
    .cta-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        animation: ctaShimmer 8s infinite linear;
    }
    
    @keyframes ctaShimmer {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .cta-content {
        text-align: center;
        color: white;
        position: relative;
        z-index: 1;
    }
    
    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
        .timeline::before {
            left: 30px;
        }
        
        .timeline-item {
            width: 100%;
            padding: 20px 20px 20px 80px !important;
            text-align: left !important;
        }
        
        .timeline-item:nth-child(odd),
        .timeline-item:nth-child(even) {
            left: 0;
        }
        
        .timeline-dot {
            left: 0 !important;
            right: auto !important;
        }
        
        .timeline-arrow {
            display: none;
        }
    }
</style>
@endsection

@section('content')
<!-- Hero Section -->
<div class="how-hero">
    <div class="floating-particles" id="particles"></div>
    <div class="container text-center text-white position-relative" style="z-index: 1;">
        <h1 class="display-3 fw-bold mb-4" style="animation: fadeInDown 1s ease;">Comment ça marche</h1>
        <p class="lead mb-0" style="animation: fadeInUp 1.2s ease; opacity: 0.9; max-width: 600px; margin: 0 auto;">Commencez à automatiser votre WhatsApp en quelques minutes seulement</p>
        
        <!-- Scroll indicator -->
        <div style="margin-top: 50px; animation: fadeInUp 1.5s ease; animation-delay: 0.5s;">
            <div style="width: 30px; height: 50px; border: 2px solid rgba(255,255,255,0.5); border-radius: 15px; margin: 0 auto; position: relative;">
                <div style="width: 6px; height: 6px; background: white; border-radius: 50%; position: absolute; left: 50%; transform: translateX(-50%); top: 10px; animation: scrollDown 2s infinite;"></div>
            </div>
        </div>
    </div>
</div>

<!-- Timeline Section -->
<section class="timeline-container">
    <div class="bg-shape bg-shape-1"></div>
    <div class="bg-shape bg-shape-2"></div>
    
    <div class="container">
        <div class="timeline">
            <!-- Step 1 -->
            <div class="timeline-item" data-delay="0">
                <div class="timeline-dot dot-1">1</div>
                <div class="step-card">
                    <span class="step-icon">🚀</span>
                    <h3 class="step-title">Créer un compte</h3>
                    <p class="step-description">Inscrivez-vous gratuitement sur Giluce en quelques secondes. Aucun carte de crédit requise pour commencer.</p>
                </div>
            </div>
            
            <!-- Step 2 -->
            <div class="timeline-item" data-delay="200">
                <div class="timeline-dot dot-2">2</div>
                <div class="step-card">
                    <span class="step-icon">📱</span>
                    <h3 class="step-title">Scanner le QR Code</h3>
                    <p class="step-description">Connectez votre WhatsApp en scannant le QR Code depuis l'application WhatsApp sur votre téléphone.</p>
                </div>
            </div>
            
            <!-- Step 3 -->
            <div class="timeline-item" data-delay="400">
                <div class="timeline-dot dot-3">3</div>
                <div class="step-card">
                    <span class="step-icon">⚙️</span>
                    <h3 class="step-title">Configurer l'IA</h3>
                    <p class="step-description">Personnalisez votre assistant IA. Définissez les réponses automatiques et les flux de conversation.</p>
                </div>
            </div>
            
            <!-- Step 4 -->
            <div class="timeline-item" data-delay="600">
                <div class="timeline-dot dot-4">4</div>
                <div class="step-card">
                    <span class="step-icon">📈</span>
                    <h3 class="step-title">Commencez à automatiser</h3>
                    <p class="step-description">Lancez vos campagnes, automaticz vos réponses et regardez votre business grandir!</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="container">
        <div class="cta-content">
            <h2 class="display-4 fw-bold mb-4">Prêt à démarrer?</h2>
            <p class="lead mb-4">Rejoignez plus de 10,000 entreprises qui font confiance à Giluce</p>
            <div>
                <a href="/register" class="btn btn-light btn-lg" style="color: var(--secondary); font-weight: 600; border-radius: 30px; padding: 14px 45px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">Commencer gratuitement</a>
            </div>
        </div>
    </div>
</section>
@endsection

@section('scripts')
<script>
    // Create floating particles
    document.addEventListener('DOMContentLoaded', function() {
        const particlesContainer = document.getElementById('particles');
        
        for(let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 10 + 5) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = (Math.random() * 15) + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            particlesContainer.appendChild(particle);
        }
        
        // Timeline scroll animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                }
            });
        }, observerOptions);
        
        timelineItems.forEach(item => {
            observer.observe(item);
        });
        
        // Add visible class to first item immediately
        setTimeout(() => {
            timelineItems[0].classList.add('visible');
        }, 500);
    });
</script>
@endsection
