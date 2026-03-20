@extends('layouts.app')

@section('title', 'Fonctionnalités - Giluce')

@section('styles')
<style>
    /* ===== ENHANCED FEATURES PAGE STYLES ===== */
    
    /* Page Header */
    .features-hero {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        padding: 100px 0 60px;
        position: relative;
        overflow: hidden;
    }
    
    .features-hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    /* Floating Shapes */
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
        opacity: 0.1;
        animation: floatShape 20s infinite ease-in-out;
    }
    
    .shape-1 {
        width: 300px;
        height: 300px;
        background: white;
        border-radius: 50%;
        top: -100px;
        left: -50px;
    }
    
    .shape-2 {
        width: 200px;
        height: 200px;
        background: white;
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        bottom: -50px;
        right: 10%;
        animation-delay: -5s;
    }
    
    .shape-3 {
        width: 150px;
        height: 150px;
        background: white;
        border-radius: 50%;
        top: 20%;
        right: 20%;
        animation-delay: -10s;
    }
    
    @keyframes floatShape {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        33% { transform: translateY(-30px) rotate(120deg); }
        66% { transform: translateY(20px) rotate(240deg); }
    }
    
    /* Section Styles */
    .features-section {
        padding: 80px 0;
        position: relative;
        overflow: hidden;
    }
    
    .features-section:nth-child(odd) {
        background: #f8f9fa;
    }
    
    .features-section:nth-child(even) {
        background: white;
    }
    
    /* Section Title */
    .section-header {
        text-align: center;
        margin-bottom: 60px;
    }
    
    .section-title {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--primary-dark);
        margin-bottom: 15px;
    }
    
    .section-subtitle {
        font-size: 1.1rem;
        color: var(--gray);
        max-width: 600px;
        margin: 0 auto;
    }
    
    /* Feature Card */
    .feature-card {
        padding: 2rem;
        border-radius: 24px;
        background: white;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
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
    
    /* Feature Icon */
    .feature-icon {
        width: 80px;
        height: 80px;
        border-radius: 24px;
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: white;
        margin-bottom: 1.5rem;
        transition: all 0.4s ease;
        box-shadow: 0 10px 30px rgba(74, 143, 216, 0.3);
    }
    
    .feature-card:hover .feature-icon {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 15px 40px rgba(74, 143, 216, 0.4);
    }
    
    .feature-icon.download { background: linear-gradient(135deg, #E1306C, #C13584); }
    .feature-icon.ai { background: linear-gradient(135deg, #3ED16A, #1FA650); }
    .feature-icon.automation { background: linear-gradient(135deg, #F2C94C, #D9A72F); }
    .feature-icon.media { background: linear-gradient(135deg, #4A8FD8, #2F6FB3); }
    .feature-icon.crm { background: linear-gradient(135deg, #9B59B6, #8E44AD); }
    .feature-icon.security { background: linear-gradient(135deg, #1ABC9C, #16A085); }
    
    .feature-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--black);
    }
    
    .feature-text {
        color: var(--gray);
        line-height: 1.6;
    }
    
    /* Category Badge */
    .category-badge {
        display: inline-block;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .badge-media { background: rgba(74, 143, 216, 0.1); color: var(--primary); }
    .badge-ai { background: rgba(62, 209, 106, 0.1); color: var(--secondary); }
    .badge-automation { background: rgba(242, 201, 76, 0.1); color: var(--accent-dark); }
    .badge-enterprise { background: rgba(155, 89, 182, 0.1); color: #9B59B6; }
    
    /* Staggered Animation */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* CTA Section */
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
        animation: shimmer 4s infinite linear;
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
    
    .cta-title {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 15px;
    }
    
    .cta-text {
        font-size: 1.2rem;
        margin-bottom: 30px;
        opacity: 0.9;
    }
    
    /* Decorative Elements */
    .decorative-line {
        width: 60px;
        height: 4px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        border-radius: 2px;
        margin: 0 auto 20px;
    }
</style>
@endsection

@section('content')
<!-- Hero Section -->
<div class="features-hero">
    <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
    </div>
    <div class="container position-relative" style="z-index: 1;">
        <div class="text-center text-white">
            <h1 class="display-4 fw-bold mb-4" style="animation: fadeInDown 1s ease;">Fonctionnalités Puissantes</h1>
            <p class="lead mb-0" style="animation: fadeInUp 1.2s ease; opacity: 0.9;">Découvrez toutes les capacités de Giluce pour transformer votre communication WhatsApp</p>
        </div>
    </div>
</div>

<!-- Media Download Section -->
<section class="features-section">
    <div class="container">
        <div class="section-header">
            <span class="category-badge badge-media">📥 Téléchargement Media</span>
            <h2 class="section-title">Téléchargez tout depuis WhatsApp</h2>
            <p class="section-subtitle">Extrayez facilement tous les types de médias partagés sur WhatsApp sans perdre en qualité</p>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon download">
                        <i class="fab fa-tiktok"></i>
                    </div>
                    <h4 class="feature-title">Téléchargement TikTok</h4>
                    <p class="feature-text">Téléchargez directement les vidéos TikTok partagées dans vos conversations WhatsApp. Pas besoin d'ouvrir l'application TikTok - Giluce s'occupe de tout automatiquement.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon download">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <h4 class="feature-title">Téléchargement YouTube</h4>
                    <p class="feature-text">Téléchargez des vidéos YouTube directement depuis WhatsApp sans utiliser l'application YouTube. Obtenez la meilleure qualité disponible.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.3s;">
                <div class="feature-card">
                    <div class="feature-icon download">
                        <i class="fab fa-instagram"></i>
                    </div>
                    <h4 class="feature-title">Contenu Instagram</h4>
                    <p class="feature-text">Sauvegardez photos et vidéos Instagram partagées dans vos chats. Stories, Reels et posts - tout est récupérable en un clic.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon media">
                        <i class="fas fa-video"></i>
                    </div>
                    <h4 class="feature-title">Vidéos WhatsApp</h4>
                    <p class="feature-text">Téléchargez toutes les vidéos envoyées ou reçues sur WhatsApp. Préserve la qualité originale pour un partage facile.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon media">
                        <i class="fas fa-image"></i>
                    </div>
                    <h4 class="feature-title">Images & Photos</h4>
                    <p class="feature-text">Exportez toutes les images et photos partagées dans vos conversations. Support des formats HD et qualité originale.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.3s;">
                <div class="feature-card">
                    <div class="feature-icon media">
                        <i class="fas fa-microphone"></i>
                    </div>
                    <h4 class="feature-title">Messages Vocaux</h4>
                    <p class="feature-text">Téléchargez et sauvegardez tous les messages vocaux. Parfait pour archiver des informations importantes.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- AI Features Section -->
<section class="features-section">
    <div class="container">
        <div class="section-header">
            <span class="category-badge badge-ai">🤖 Intelligence Artificielle</span>
            <h2 class="section-title">Assistant IA Intelligent</h2>
            <p class="section-subtitle">Automatisez vos réponses et offrez une expérience client exceptionnelle 24/7</p>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon ai">
                        <i class="fas fa-robot"></i>
                    </div>
                    <h4 class="feature-title">Réponses Automatiques</h4>
                    <p class="feature-text">L'IA répond automatiquement à vos clients 24h/24, 7j/7. Configurez des réponses personnalisées basées sur des mots-clés ou des questions fréquentes.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon ai">
                        <i class="fas fa-comments"></i>
                    </div>
                    <h4 class="feature-title">Chatbot Avancé</h4>
                    <p class="feature-text">Créez des flux de conversation complexes avec des menus interactifs. Guidez vos clients à travers vos services automatiquement.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.3s;">
                <div class="feature-card">
                    <div class="feature-icon ai">
                        <i class="fas fa-brain"></i>
                    </div>
                    <h4 class="feature-title">Apprentissage Continu</h4>
                    <p class="feature-text">L'IA apprend de chaque interaction pour améliorer progressivement ses réponses. Votre assistant devient plus intelligent avec le temps.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon ai">
                        <i class="fas fa-language"></i>
                    </div>
                    <h4 class="feature-title">Multilingue</h4>
                    <p class="feature-text">L'IA comprend et répond dans toutes les langues. Offrez un support client international sans effort supplémentaire.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon ai">
                        <i class="fas fa-headset"></i>
                    </div>
                    <h4 class="feature-title">Support Client 24/7</h4>
                    <p class="feature-text">Ne manquez jamais une requête client. Votre assistant IA répond instantanément, même en dehors des heures de bureau.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.3s;">
                <div class="feature-card">
                    <div class="feature-icon ai">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <h4 class="feature-title">Analyse des Sentiments</h4>
                    <p class="feature-text">L'IA analyse le ton des messages pour identifier les clients satisfaits ou mécontents. Intervention rapide quand nécessaire.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Automation Section -->
<section class="features-section">
    <div class="container">
        <div class="section-header">
            <span class="category-badge badge-automation">⚙️ Automatisation</span>
            <h2 class="section-title">Automatisez vos Communications</h2>
            <p class="section-subtitle">Gagnez du temps en automatisant les tâches répétitives et les suivis</p>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon automation">
                        <i class="fas fa-paper-plane"></i>
                    </div>
                    <h4 class="feature-title">Campagnes de Messages</h4>
                    <p class="feature-text">Envoyez des messages promotionnels à des milliers de contacts en un seul clic. Segmentation avancée pour des campagnes ciblées.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon automation">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <h4 class="feature-title">Programmation de Messages</h4>
                    <p class="feature-text">Planifiez l'envoi de messages pour n'importe quelle date et heure. Idéal pour les rappels, anniversaires et notifications.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.3s;">
                <div class="feature-card">
                    <div class="feature-icon automation">
                        <i class="fas fa-bell"></i>
                    </div>
                    <h4 class="feature-title">Rappels Automatiques</h4>
                    <p class="feature-text">Envoyez des rappels de paiement, rendez-vous ou suivi automatiquement. Réduisez les oublis et améliorez votre productivité.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon automation">
                        <i class="fas fa-users"></i>
                    </div>
                    <h4 class="feature-title">Gestion de Groupes</h4>
                    <p class="feature-text">Automatisez l'ajout et la suppression de membres dans vos groupes. Créez des groupes privés pour vos clients VIP.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon automation">
                        <i class="fas fa-tags"></i>
                    </div>
                    <h4 class="feature-title">Tags & Étiquettes</h4>
                    <p class="feature-text">Créez des tags pour segmenter vos contacts. Automatisez le tagging basé sur le comportement ou les mots-clés.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.3s;">
                <div class="feature-card">
                    <div class="feature-icon automation">
                        <i class="fas fa-sync"></i>
                    </div>
                    <h4 class="feature-title">Workflows Personnalisés</h4>
                    <p class="feature-text">Créez des flux de travail automatisés complexes. Déclenchez des actions en chaîne basées sur des conditions spécifiques.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CRM & Enterprise Section -->
<section class="features-section">
    <div class="container">
        <div class="section-header">
            <span class="category-badge badge-enterprise">📊 CRM & Entreprise</span>
            <h2 class="section-title">Gestion d'Entreprise</h2>
            <p class="section-subtitle">Tous les outils pour gérer efficacement vos clients et prospects</p>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon crm">
                        <i class="fas fa-address-book"></i>
                    </div>
                    <h4 class="feature-title">CRM Intégré</h4>
                    <p class="feature-text">Gérez vos prospects, clients et conversations dans un seul dashboard. Suivez chaque interaction du premier contact à la vente.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon crm">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <h4 class="feature-title">Extraction de Contacts</h4>
                    <p class="feature-text">Extrayez les membres d'un groupe WhatsApp et transformez-les en prospects qualifiés. Listes de diffusion ciblées.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.3s;">
                <div class="feature-card">
                    <div class="feature-icon crm">
                        <i class="fas fa-file-export"></i>
                    </div>
                    <h4 class="feature-title">Export de Données</h4>
                    <p class="feature-text">Exportez vos contacts, conversations et statistiques en Excel, CSV ou PDF. Intégrez avec vos autres outils.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon crm">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h4 class="feature-title">Analyses & Rapports</h4>
                    <p class="feature-text">Suivez vos performances en temps réel. Tableaux de bord personnalisés avec toutes les métriques importantes.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon crm">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <h4 class="feature-title">Gestion d'Équipe</h4>
                    <p class="feature-text">Attribuez des conversations à différents agents. Suivi des performances et quotas par utilisateur.</p>
                </div>
            </div>
            <div class="col-md-4 animate-on-scroll" style="transition-delay: 0.3s;">
                <div class="feature-card">
                    <div class="feature-icon security">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h4 class="feature-title">Sécurité Avancée</h4>
                    <p class="feature-text">Chiffrement de bout en bout, authentification à deux facteurs et journaux d'audit. Conforme RGPD.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- API Section -->
<section class="features-section">
    <div class="container">
        <div class="section-header">
            <span class="category-badge badge-media">🔌 API & Intégrations</span>
            <h2 class="section-title">API Puissante</h2>
            <p class="section-subtitle">Intégrez Giluce à vos systèmes existants grâce à notre API complète</p>
        </div>
        
        <div class="row g-4">
            <div class="col-md-6 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon media">
                        <i class="fas fa-code"></i>
                    </div>
                    <h4 class="feature-title">API REST Complète</h4>
                    <p class="feature-text">Accédez à toutes les fonctionnalités via notre API REST. Documentation détaillée, exemples de code et SDK disponibles.</p>
                </div>
            </div>
            <div class="col-md-6 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon media">
                        <i class="fas fa-plug"></i>
                    </div>
                    <h4 class="feature-title">Webhooks</h4>
                    <p class="feature-text">Recevez des notifications en temps réel pour tous les événements. Intégrez facilement avec vos propres serveurs.</p>
                </div>
            </div>
            <div class="col-md-6 animate-on-scroll" style="transition-delay: 0.1s;">
                <div class="feature-card">
                    <div class="feature-icon media">
                        <i class="fab fa-zapier"></i>
                    </div>
                    <h4 class="feature-title">Intégrations Zapier</h4>
                    <p class="feature-text">Connectez Giluce à plus de 5000 applications sans écrire de code. Slack, Google Sheets, CRM et plus encore.</p>
                </div>
            </div>
            <div class="col-md-6 animate-on-scroll" style="transition-delay: 0.2s;">
                <div class="feature-card">
                    <div class="feature-icon security">
                        <i class="fas fa-key"></i>
                    </div>
                    <h4 class="feature-title">Clés API Sécurisées</h4>
                    <p class="feature-text">Générez des clés API avec permissions granulaires. Contrôlez l'accès à des fonctionnalités spécifiques.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="container">
        <div class="cta-content">
            <div class="decorative-line"></div>
            <h2 class="cta-title">Prêt à démarrer ?</h2>
            <p class="cta-text">Rejoignez plus de 10,000 entreprises qui font confiance à Giluce</p>
            <div>
                <a href="/register" class="btn btn-light btn-lg" style="color: var(--secondary); font-weight: 600; border-radius: 30px; padding: 14px 40px;">Commencer gratuitement</a>
                <a href="/demo" class="btn btn-outline-light btn-lg" style="border-radius: 30px; padding: 14px 40px; margin-left: 15px;">Voir la démo</a>
            </div>
        </div>
    </div>
</section>
@endsection

@section('scripts')
<script>
    // Scroll Animation
    document.addEventListener('DOMContentLoaded', function() {
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

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    });
</script>
@endsection
