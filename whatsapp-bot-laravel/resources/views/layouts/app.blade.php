<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Giluce - Automatisez votre WhatsApp avec une IA')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <script src="https://unpkg.com/alpinejs" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            /* Primary brand color (blue from the logo) */
            --primary: #4A8FD8;
            /* Darker blue */
            --primary-dark: #2F6FB3;
            /* Secondary green from the chat bubble */
            --secondary: #3ED16A;
            /* Dark green */
            --secondary-dark: #1FA650;
            /* Gold / coin color */
            --accent: #F2C94C;
            /* Accent hover */
            --accent-dark: #D9A72F;
            /* Background colors */
            --black: #0F0F0F;
            --dark-gray: #1E1E1E;
            --gray: #6E6E6E;
            --light-gray: #D9D9D9;
            --white: #FFFFFF;
        }
        
        /* Default to light theme */
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: var(--white);
            color: var(--black);
        }
        
        /* Sticky Header */
        nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 1000;
            padding: 0.75rem 0;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        nav.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 30px rgba(0, 0, 0, 0.15);
            padding: 0.5rem 0;
        }
        
        .nav-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }
        
        .nav-brand {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary);
            text-decoration: none;
            letter-spacing: 1px;
        }
        
        .nav-links {
            display: flex;
            align-items: center;
            gap: 2rem;
            flex-wrap: wrap;
            justify-content: flex-end;
        }
        
        /* Simple text links instead of buttons */
        .nav-link {
            color: var(--black);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: color 0.3s ease;
            position: relative;
        }
        
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary);
            transition: width 0.3s ease;
        }
        
        .nav-link:hover {
            color: var(--primary);
        }
        
        .nav-link:hover::after {
            width: 100%;
        }
        
        /* CTA Buttons */
        .nav-cta-login {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            padding: 0.5rem 1.25rem;
            border-radius: 25px;
            transition: all 0.3s ease;
        }
        
        .nav-cta-login:hover {
            background: rgba(74, 143, 216, 0.1);
        }
        
        .nav-cta-register {
            background: var(--primary);
            color: white !important;
            text-decoration: none;
            font-weight: 600;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            transition: all 0.3s ease;
        }
        
        .nav-cta-register:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(74, 143, 216, 0.4);
        }
        
        /* Footer Styles */
        .custom-footer {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: var(--white);
            padding: 4rem 0 2rem;
        }
        
        .footer-logo {
            font-size: 1.75rem;
            font-weight: bold;
            color: var(--white);
            margin-bottom: 1rem;
        }
        
        .footer-slogan {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.95rem;
            line-height: 1.6;
        }
        
        .footer-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
            color: var(--white);
        }
        
        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-links li {
            margin-bottom: 0.75rem;
        }
        
        .footer-links a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: var(--white);
        }
        
        .social-links {
            display: flex;
            gap: 1rem;
        }
        
        .social-link {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            background: var(--white);
            color: var(--primary);
            transform: translateY(-3px);
        }
        
        .footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            margin-top: 2rem;
            padding-top: 1.5rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
        }
        
        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .hero-content {
            text-align: center;
            color: var(--white);
            max-width: 800px;
            padding: 0 20px;
            position: relative;
            z-index: 1;
        }
        
        .hero-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            animation: fadeInDown 1s ease;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .hero-subtitle {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            animation: fadeInUp 1.2s ease;
            color: var(--light-gray);
        }
        
        .btn-glow {
            background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));
            color: var(--white);
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            border: none;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            font-weight: 600;
        }
        
        .btn-glow:hover {
            box-shadow: 0 0 20px rgba(62, 209, 106, 0.6);
            transform: translateY(-2px);
            background: linear-gradient(135deg, var(--secondary-dark), var(--secondary));
        }
        
        @keyframes fadeInDown {
            0% { transform: translateY(-50px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInUp {
            0% { transform: translateY(50px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        .page-content {
            padding-top: 100px;
        }
        
        /* Section Styles */
        .section {
            padding: 5rem 0;
        }
        
        .section-title {
            font-size: 2.25rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 1rem;
            color: var(--primary-dark);
        }
        
        .section-subtitle {
            text-align: center;
            color: var(--gray);
            font-size: 1.1rem;
            margin-bottom: 3rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .feature-card {
            padding: 2rem;
            border-radius: 15px;
            background: var(--white);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            height: 100%;
            border: 1px solid var(--light-gray);
        }
        
        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
        }
        
        .feature-icon {
            width: 70px;
            height: 70px;
            border-radius: 15px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            color: var(--white);
            margin-bottom: 1.5rem;
        }
        
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
        
        /* Stats Section */
        .stats-section {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            padding: 4rem 0;
        }
        
        .stat-item {
            text-align: center;
            color: var(--white);
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: bold;
            display: block;
        }
        
        .stat-label {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        /* CTA Section */
        .cta-section {
            padding: 5rem 0;
            background: var(--light-gray);
        }
        
        .cta-card {
            background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            color: var(--white);
        }
        
        .cta-title {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        
        .cta-text {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
    </style>
    @yield('styles')
</head>
<body>
    <nav id="mainNav">
        <div class="nav-container">
            <a href="/" class="nav-brand"><img src="{{ asset('images/logo/logo.png') }}" alt="Giluce" width="150" height="150" class="img-fluid"></a>
            <div class="nav-links">
                <a href="/" class="nav-link">Accueil</a>
                <a href="/features" class="nav-link">Fonctionnalités</a>
                <a href="/how-it-works" class="nav-link">Comment ça marche</a>
                <a href="/pricing" class="nav-link">Tarification</a>
                <a href="/docs" class="nav-link">Documentation</a>
                
                @auth
                    <a href="/dashboard" class="nav-cta-register">Dashboard</a>
                @else
                    <a href="/login" class="nav-cta-login">Connexion</a>
                    <a href="/register" class="nav-cta-register">Inscription</a>
                @endauth
            </div>
        </div>
    </nav>

    @yield('content')

    <!-- Custom Footer -->
    <footer class="custom-footer">
        <div class="container">
            <div class="row">
                <!-- Part 1: Logo & Slogan -->
                <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                    <div class="footer-logo">
                    <img src="{{ asset('images/logo/logo.png') }}" alt="Giluce" width="250" height="250" class="img-fluid">
                    </div>
                    <p class="footer-slogan">
                        Automatisez votre WhatsApp avec une IA puissante. 
                        Transformez vos conversations en opportunités commerciales.
                    </p>
                </div>
                
                <!-- Part 2: Quick Links -->
                <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                    <h5 class="footer-title">Liens Rapides</h5>
                    <ul class="footer-links">
                        <li><a href="/">Accueil</a></li>
                        <li><a href="/features">Fonctionnalités</a></li>
                        <li><a href="/pricing">Tarification</a></li>
                        <li><a href="/docs">Documentation</a></li>
                        <li><a href="/login">Connexion</a></li>
                    </ul>
                </div>
                
                <!-- Part 3: Social Links -->
                <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
                    <h5 class="footer-title">Suivez-nous</h5>
                    <div class="social-links">
                        <a href="#" class="social-link" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-link" title="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-link" title="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-link" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" class="social-link" title="YouTube"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                
                <!-- Contact Info -->
                <div class="col-lg-3 col-md-6">
                    <h5 class="footer-title">Contact</h5>
                    <ul class="footer-links">
                        <li><a href="mailto:contact@giluce.com">contact@giluce.com</a></li>
                        <li><a href="#">Support</a></li>
                        <li><a href="#">Partenariats</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2026 Giluce. Tous droits réservés. | Construire l'avenir de l'automatisation WhatsApp.</p>
            </div>
        </div>
    </footer>

    <script>
        // Sticky header effect
        window.addEventListener('scroll', function() {
            const nav = document.getElementById('mainNav');
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    </script>

    @yield('scripts')
</body>
</html>
