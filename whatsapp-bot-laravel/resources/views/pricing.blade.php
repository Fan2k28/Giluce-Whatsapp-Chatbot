@extends('layouts.app')

@section('title', 'Tarification - Giluce')

@section('styles')
<style>
    /* ===== HERO SECTION ===== */
    .pricing-hero {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        padding: 120px 0 60px;
        position: relative;
        overflow: hidden;
    }
    
    .pricing-hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    /* Floating shapes */
    .floating-shapes {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
    }
    
    .shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
        animation: float 10s infinite ease-in-out;
    }
    
    .shape-1 {
        width: 400px;
        height: 400px;
        background: white;
        top: -150px;
        right: -100px;
        animation-delay: 0s;
    }
    
    .shape-2 {
        width: 250px;
        height: 250px;
        background: white;
        bottom: -100px;
        left: -50px;
        animation-delay: -5s;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-30px); }
    }
    
    /* ===== PRICING SECTION ===== */
    .pricing-section {
        padding: 80px 0;
        background: linear-gradient(180deg, #f8f9fa 0%, white 100%);
        position: relative;
    }
    
    /* Toggle */
    .pricing-toggle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 50px;
    }
    
    .toggle-label {
        font-weight: 600;
        margin: 0 15px;
        color: var(--gray);
        transition: color 0.3s;
    }
    
    .toggle-label.active {
        color: var(--primary);
    }
    
    .toggle-switch {
        width: 60px;
        height: 32px;
        background: var(--primary);
        border-radius: 20px;
        position: relative;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .toggle-switch::after {
        content: '';
        position: absolute;
        width: 26px;
        height: 26px;
        background: white;
        border-radius: 50%;
        top: 3px;
        left: 3px;
        transition: transform 0.3s;
    }
    
    .toggle-switch.annual::after {
        transform: translateX(28px);
    }
    
    .save-badge {
        background: var(--secondary);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 10px;
    }
    
    /* ===== PRICING CARDS ===== */
    .pricing-cards {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
        align-items: stretch;
    }
    
    .pricing-card {
        background: white;
        border-radius: 24px;
        padding: 2.5rem 2rem;
        text-align: center;
        width: 320px;
        position: relative;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(0, 0, 0, 0.05);
        opacity: 0;
        transform: translateY(30px);
    }
    
    .pricing-card.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .pricing-card:hover {
        transform: translateY(-15px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    }
    
    /* Featured card */
    .pricing-card.featured {
        transform: scale(1.05);
        border: 2px solid var(--primary);
        z-index: 10;
    }
    
    .pricing-card.featured:hover {
        transform: scale(1.05) translateY(-15px);
    }
    
    .pricing-card.featured::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        border-radius: 24px 24px 0 0;
    }
    
    /* Popular badge */
    .popular-badge {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--accent), var(--accent-dark));
        color: black;
        font-weight: bold;
        padding: 8px 25px;
        border-radius: 20px;
        font-size: 0.85rem;
        box-shadow: 0 5px 20px rgba(242, 201, 76, 0.4);
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { box-shadow: 0 5px 20px rgba(242, 201, 76, 0.4); }
        50% { box-shadow: 0 5px 30px rgba(242, 201, 76, 0.6); }
    }
    
    /* Plan name */
    .plan-name {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--black);
        margin-bottom: 1rem;
    }
    
    /* Price */
    .plan-price {
        margin-bottom: 1.5rem;
    }
    
    .price-amount {
        font-size: 3.5rem;
        font-weight: bold;
        color: var(--primary);
        line-height: 1;
    }
    
    .pricing-card.featured .price-amount {
        color: var(--secondary);
    }
    
    .price-period {
        font-size: 1rem;
        color: var(--gray);
    }
    
    .price-note {
        font-size: 0.85rem;
        color: var(--gray);
        margin-top: 5px;
    }
    
    /* Features list */
    .features-list {
        list-style: none;
        padding: 0;
        margin: 2rem 0;
        text-align: left;
    }
    
    .features-list li {
        padding: 10px 0;
        display: flex;
        align-items: center;
        color: var(--gray);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .features-list li:last-child {
        border-bottom: none;
    }
    
    .feature-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-size: 0.8rem;
    }
    
    .feature-icon.included {
        background: rgba(62, 209, 106, 0.1);
        color: var(--secondary);
    }
    
    .feature-icon.excluded {
        background: rgba(0, 0, 0, 0.05);
        color: var(--gray);
    }
    
    /* CTA Button */
    .cta-btn {
        display: inline-block;
        padding: 14px 35px;
        border-radius: 30px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        width: 100%;
    }
    
    .cta-btn.primary {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
    }
    
    .cta-btn.primary:hover {
        box-shadow: 0 10px 30px rgba(74, 143, 216, 0.4);
        transform: translateY(-3px);
    }
    
    .cta-btn.secondary {
        background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));
        color: white;
    }
    
    .cta-btn.secondary:hover {
        box-shadow: 0 10px 30px rgba(62, 209, 106, 0.4);
        transform: translateY(-3px);
    }
    
    .cta-btn.accent {
        background: linear-gradient(135deg, var(--accent), var(--accent-dark));
        color: black;
    }
    
    .cta-btn.accent:hover {
        box-shadow: 0 10px 30px rgba(242, 201, 76, 0.4);
        transform: translateY(-3px);
    }
    
    /* ===== NOTICE SECTION ===== */
    .notice-section {
        background: linear-gradient(135deg, #fff9e6, #fff3cd);
        padding: 30px;
        border-radius: 20px;
        margin: 60px auto;
        max-width: 800px;
        border-left: 5px solid var(--accent);
        box-shadow: 0 10px 30px rgba(242, 201, 76, 0.2);
    }
    
    .notice-title {
        font-weight: bold;
        color: #856404;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notice-text {
        color: #856404;
        line-height: 1.7;
        font-size: 0.95rem;
    }
    
    /* ===== FAQ SECTION ===== */
    .faq-section {
        padding: 80px 0;
        background: white;
    }
    
    .faq-title {
        text-align: center;
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--primary-dark);
        margin-bottom: 50px;
    }
    
    /* ===== CTA SECTION ===== */
    .cta-footer {
        background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));
        padding: 80px 0;
        position: relative;
        overflow: hidden;
    }
    
    .cta-footer::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        animation: shimmer 8s infinite linear;
    }
    
    @keyframes shimmer {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .cta-content {
        text-align: center;
        color: white;
        position: relative;
        z-index: 1;
    }
    
    /* Responsive */
    @media (max-width: 992px) {
        .pricing-card.featured {
            transform: scale(1);
        }
        
        .pricing-card.featured:hover {
            transform: translateY(-15px);
        }
        
        .pricing-cards {
            flex-direction: column;
            align-items: center;
        }
        
        .pricing-card {
            width: 100%;
            max-width: 400px;
        }
    }
</style>
@endsection

@section('content')
<!-- Hero Section -->
<div class="pricing-hero">
    <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
    </div>
    <div class="container text-center text-white position-relative" style="z-index: 1;">
        <h1 class="display-3 fw-bold mb-4" style="animation: fadeInDown 1s ease;">Tarification Simple</h1>
        <p class="lead mb-0" style="animation: fadeInUp 1.2s ease; opacity: 0.9; max-width: 600px; margin: 0 auto;">Choisissez le plan qui correspond à vos besoins. Aucun frais cachés.</p>
    </div>
</div>

<!-- Pricing Section -->
<section class="pricing-section">
    <div class="container">
        <!-- Toggle -->
        <div class="pricing-toggle">
            <span class="toggle-label active">Mensuel</span>
            <div class="toggle-switch" onclick="this.classList.toggle('annual')"></div>
            <span class="toggle-label">Annuel <span class="save-badge">Économisez 20%</span></span>
        </div>
        
        <!-- Pricing Cards -->
        <div class="pricing-cards">
            <!-- Starter Plan -->
            <div class="pricing-card" style="transition-delay: 0.1s;">
                <h3 class="plan-name">Starter</h3>
                <div class="plan-price">
                    <span class="price-amount">5,900</span>
                    <span class="price-period">FCFA/mois</span>
                    <div class="price-note">Facturation mensuelle</div>
                </div>
                <ul class="features-list">
                    <li><span class="feature-icon included">✓</span> 1 compte WhatsApp</li>
                    <li><span class="feature-icon included">✓</span> Réponses automatiques</li>
                    <li><span class="feature-icon included">✓</span> Planificateur de messages</li>
                    <li><span class="feature-icon included">✓</span> Extraction de contacts</li>
                    <li><span class="feature-icon included">✓</span> 100 messages/jour</li>
                    <li><span class="feature-icon included">✓</span> Support par email</li>
                    <li><span class="feature-icon excluded">✗</span> CRM intégré</li>
                    <li><span class="feature-icon excluded">✗</span> Campagnes broadcast</li>
                    <li><span class="feature-icon excluded">✗</span> Accès API</li>
                </ul>
                <a href="/register" class="cta-btn primary">Commencer</a>
            </div>
            
            <!-- Pro Plan -->
            <div class="pricing-card featured" style="transition-delay: 0.2s;">
                <div class="popular-badge">POPULAIRE</div>
                <h3 class="plan-name">Pro</h3>
                <div class="plan-price">
                    <span class="price-amount">19,000</span>
                    <span class="price-period">FCF/mois</span>
                    <div class="price-note">Facturation mensuelle</div>
                </div>
                <ul class="features-list">
                    <li><span class="feature-icon included">✓</span> 5 comptes WhatsApp</li>
                    <li><span class="feature-icon included">✓</span> Assistant IA intégré</li>
                    <li><span class="feature-icon included">✓</span> CRM complet</li>
                    <li><span class="feature-icon included">✓</span> Campagnes broadcast illimitées</li>
                    <li><span class="feature-icon included">✓</span> Messages illimités</li>
                    <li><span class="feature-icon included">✓</span> Analytiques avancées</li>
                    <li><span class="feature-icon included">✓</span> Tags & segments</li>
                    <li><span class="feature-icon included">✓</span> Export de données</li>
                    <li><span class="feature-icon included">✓</span> Support prioritaire</li>
                    <li><span class="feature-icon excluded">✗</span> Accès API</li>
                </ul>
                <a href="/register" class="cta-btn secondary">Commencer</a>
            </div>
            
            <!-- Business Plan -->
            <div class="pricing-card" style="transition-delay: 0.3s;">
                <h3 class="plan-name">Business</h3>
                <div class="plan-price">
                    <span class="price-amount">65,000</span>
                    <span class="price-period">FCF/mois</span>
                    <div class="price-note">Pour les grandes équipes</div>
                </div>
                <ul class="features-list">
                    <li><span class="feature-icon included">✓</span> WhatsApp illimités</li>
                    <li><span class="feature-icon included">✓</span> Assistant IA Advanced</li>
                    <li><span class="feature-icon included">✓</span> Accès API complet</li>
                    <li><span class="feature-icon included">✓</span> Webhooks</li>
                    <li><span class="feature-icon included">✓</span> Intégrations Zapier</li>
                    <li><span class="feature-icon included">✓</span> Automatisations avancées</li>
                    <li><span class="feature-icon included">✓</span> Gestion d'équipe</li>
                    <li><span class="feature-icon included">✓</span> Rapports personnalisés</li>
                    <li><span class="feature-icon included">✓</span> Manager de compte dédié</li>
                    <li><span class="feature-icon included">✓</span> Support 24/7</li>
                </ul>
                <a href="/register" class="cta-btn accent">Commencer</a>
            </div>
        </div>
        
        <!-- Notice -->
        <div class="notice-section animate-on-scroll">
            <div class="notice-title">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Utilisation Responsable</span>
            </div>
            <p class="notice-text">
                Cette plateforme doit être utilisée de manière responsable et conformément aux Conditions Générales d'Utilisations des services de messagerie. 
                Nous vous encourageons à respecter les meilleures pratiques : n'envoyez pas de messages non sollicités (spam), respectez la vie privée de vos contacts, 
                et assurez-vous d'avoir le consentement de vos destinataires pour toute communication commerciale. 
                Une utilisation abusive peut entraîner la suspension de votre compte. 
                Giluce fournit des outils puissants - à vous de les utiliser de manière éthique pour protéger votre réputation et maintenir la confiance de vos clients.
            </p>
        </div>
    </div>
</section>

<!-- CTA Footer -->
<section class="cta-footer">
    <div class="container">
        <div class="cta-content">
            <h2 class="display-4 fw-bold mb-4">Questions?</h2>
            <p class="lead mb-4">Contactez-nous pour une démonstration personnalisée</p>
            <a href="/contact" class="btn btn-light btn-lg" style="color: var(--secondary); font-weight: 600; border-radius: 30px; padding: 14px 45px;">Nous contacter</a>
        </div>
    </div>
</section>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Animate cards on load
        setTimeout(() => {
            document.querySelectorAll('.pricing-card').forEach(card => {
                card.classList.add('visible');
            });
        }, 300);
        
        // Scroll animation
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.notice-section').forEach(el => {
            observer.observe(el);
        });
    });
</script>
@endsection
