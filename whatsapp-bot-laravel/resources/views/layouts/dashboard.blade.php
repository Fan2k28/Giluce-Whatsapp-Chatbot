<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Dashboard - Giluce')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <style>
        :root {
            --primary: #4A8FD8;
            --primary-dark: #2F6FB3;
            --secondary: #3ED16A;
            --secondary-dark: #1FA650;
            --accent: #F2C94C;
            --accent-dark: #D9A72F;
            --dark: #1E1E1E;
            --gray: #6E6E6E;
            --light: #F8F9FA;
            --white: #FFFFFF;
            --sidebar-width: 280px;
            --header-height: 70px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: #f0f2f5;
            overflow-x: hidden;
        }
        
        /* ===== SIDEBAR ===== */
        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: var(--sidebar-width);
            height: 100vh;
            background: linear-gradient(180deg, var(--dark) 0%, #2d2d2d 100%);
            z-index: 1000;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        
        .sidebar-brand {
            padding: 25px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            background-color: #fff;
        }
        
        .sidebar-brand img {
            width: 120px;
            border-radius: 12px;
        }
        
        .sidebar-brand span {
            font-size: 1.4rem;
            font-weight: bold;
            color: white;
        }
        
        .sidebar-menu {
            padding: 20px 15px;
            flex: 1;
        }
        
        .menu-section {
            margin-bottom: 25px;
        }
        
        .menu-title {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: rgba(255,255,255,0.4);
            padding: 0 10px;
            margin-bottom: 10px;
        }
        
        .menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            border-radius: 14px;
            margin-bottom: 6px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .menu-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: var(--secondary);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }
        
        .menu-item:hover, .menu-item.active {
            background: rgba(255,255,255,0.08);
            color: white;
        }
        
        .menu-item:hover::before, .menu-item.active::before {
            transform: scaleY(1);
        }
        
        .menu-item i {
            font-size: 1.3rem;
            width: 24px;
            text-align: center;
        }
        
        .menu-item .badge {
            margin-left: auto;
            background: var(--secondary);
            color: white;
            font-size: 0.75rem;
            padding: 3px 10px;
            border-radius: 20px;
        }
        
        /* Sidebar Footer */
        .sidebar-footer {
            padding: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .user-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: rgba(255,255,255,0.05);
            border-radius: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .user-card:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .user-avatar {
            width: 45px;
            height: 45px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .user-info {
            flex: 1;
        }
        
        .user-name {
            color: white;
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        .user-role {
            color: rgba(255,255,255,0.5);
            font-size: 0.8rem;
        }
        
        /* ===== MAIN CONTENT ===== */
        .main-content {
            margin-left: var(--sidebar-width);
            min-height: 100vh;
            transition: margin-left 0.3s ease;
        }
        
        /* ===== HEADER ===== */
        .header {
            height: var(--header-height);
            background: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .menu-toggle {
            display: none;
            width: 45px;
            height: 45px;
            border: none;
            background: var(--light);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .menu-toggle:hover {
            background: #e9ecef;
        }
        
        .menu-toggle i {
            font-size: 1.3rem;
            color: var(--dark);
        }
        
        .search-box {
            position: relative;
        }
        
        .search-box input {
            width: 300px;
            padding: 12px 20px 12px 45px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            background: var(--light);
        }
        
        .search-box input:focus {
            outline: none;
            border-color: var(--primary);
            background: white;
            box-shadow: 0 0 0 4px rgba(74,143,216,0.1);
        }
        
        .search-box i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray);
        }
        
        .header-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .header-btn {
            width: 45px;
            height: 45px;
            border: none;
            background: var(--light);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .header-btn:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
        
        .header-btn i {
            font-size: 1.2rem;
            color: var(--gray);
        }
        
        .header-btn .notification-dot {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 10px;
            height: 10px;
            background: #e74c3c;
            border-radius: 50%;
            border: 2px solid white;
        }
        
        /* ===== CONTENT AREA ===== */
        .content-area {
            padding: 30px;
        }
        
        /* Page Title */
        .page-title {
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 8px;
        }
        
        .page-subtitle {
            color: var(--gray);
            margin-bottom: 30px;
        }
        
        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            opacity: 0.1;
            transform: translate(30%, -30%);
        }
        
        .stat-card.blue::before { background: var(--primary); }
        .stat-card.green::before { background: var(--secondary); }
        .stat-card.yellow::before { background: var(--accent); }
        .stat-card.purple::before { background: #9B59B6; }
        
        .stat-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            margin-bottom: 15px;
        }
        
        .stat-card.blue .stat-icon {
            background: rgba(74, 143, 216, 0.1);
            color: var(--primary);
        }
        
        .stat-card.green .stat-icon {
            background: rgba(62, 209, 106, 0.1);
            color: var(--secondary);
        }
        
        .stat-card.yellow .stat-icon {
            background: rgba(242, 201, 76, 0.1);
            color: var(--accent-dark);
        }
        
        .stat-card.purple .stat-icon {
            background: rgba(155, 89, 182, 0.1);
            color: #9B59B6;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: var(--gray);
            font-size: 0.9rem;
        }
        
        .stat-trend {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-top: 10px;
            font-size: 0.85rem;
        }
        
        .stat-trend.up { color: var(--secondary); }
        .stat-trend.down { color: #e74c3c; }
        
        /* ===== CARDS SECTION ===== */
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
        }
        
        .content-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.6s ease forwards;
            animation-delay: 0.5s;
        }
        
        .content-card.wide {
            grid-column: span 2;
            animation-delay: 0.6s;
        }
        
        .card-header {
            padding: 20px 25px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--dark);
        }
        
        .card-action {
            color: var(--primary);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .card-action:hover {
            color: var(--primary-dark);
        }
        
        .card-body {
            padding: 25px;
        }
        
        /* Quick Actions */
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        
        .action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 25px 15px;
            background: var(--light);
            border-radius: 16px;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
        }
        
        .action-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .action-btn i {
            font-size: 2rem;
        }
        
        .action-btn span {
            color: var(--dark);
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .action-btn.blue i { color: var(--primary); }
        .action-btn.green i { color: var(--secondary); }
        .action-btn.yellow i { color: var(--accent-dark); }
        
        /* Recent Messages */
        .message-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .message-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: var(--light);
            border-radius: 14px;
            transition: all 0.3s ease;
        }
        
        .message-item:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }
        
        .message-avatar {
            width: 50px;
            height: 50px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
        }
        
        .message-avatar.blue { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); }
        .message-avatar.green { background: linear-gradient(135deg, var(--secondary), var(--secondary-dark)); }
        .message-avatar.yellow { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); }
        
        .message-content {
            flex: 1;
        }
        
        .message-name {
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 3px;
        }
        
        .message-text {
            color: var(--gray);
            font-size: 0.9rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 300px;
        }
        
        .message-time {
            color: var(--gray);
            font-size: 0.8rem;
        }
        
        /* Sessions Table */
        .table-responsive {
            overflow-x: auto;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .data-table th,
        .data-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .data-table th {
            font-weight: 600;
            color: var(--gray);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .data-table tr:hover td {
            background: var(--light);
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .status-badge.connected {
            background: rgba(62, 209, 106, 0.1);
            color: var(--secondary);
        }
        
        .status-badge.disconnected {
            background: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        }
        
        .status-badge .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: currentColor;
        }
        
        .action-btns {
            display: flex;
            gap: 8px;
        }
        
        .action-btns button {
            width: 35px;
            height: 35px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .btn-view {
            background: rgba(74, 143, 216, 0.1);
            color: var(--primary);
        }
        
        .btn-view:hover {
            background: var(--primary);
            color: white;
        }
        
        .btn-delete {
            background: rgba(231, 76, 60, 0.1);
            color: #e74c3c;
        }
        
        .btn-delete:hover {
            background: #e74c3c;
            color: white;
        }
        
        /* ===== EMPTY STATE ===== */
        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }
        
        .empty-icon {
            width: 150px;
            height: 150px;
            margin: 0 auto 30px;
            background: linear-gradient(135deg, rgba(74, 143, 216, 0.1), rgba(62, 209, 106, 0.1));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .empty-icon i {
            font-size: 4rem;
            color: var(--primary);
        }
        
        .empty-title {
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--dark);
            margin-bottom: 15px;
        }
        
        .empty-text {
            color: var(--gray);
            font-size: 1.1rem;
            margin-bottom: 30px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .empty-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 16px 35px;
            background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        .empty-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(62, 209, 106, 0.4);
        }
        
        /* ===== MOBILE RESPONSIVE ===== */
        @media (max-width: 1200px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 992px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .sidebar.active {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
            }
            
            .menu-toggle {
                display: flex;
            }
            
            .cards-grid {
                grid-template-columns: 1fr;
            }
            
            .content-card.wide {
                grid-column: span 1;
            }
            
            .quick-actions {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .search-box input {
                width: 200px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .header {
                padding: 0 15px;
            }
            
            .content-area {
                padding: 20px 15px;
            }
        }
        
        /* Overlay for mobile */
        .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        }
        
        .sidebar-overlay.active {
            display: block;
        }
        
        /* Modal Styles */
        .modal-content {
            border: none;
            border-radius: 24px;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            border-bottom: none;
            border-radius: 0;
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .form-control {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(74, 143, 216, 0.1);
        }
    </style>
    @yield('styles')
</head>
<body>
    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
            <img src="{{ asset('images/logo/logo.png') }}" alt="Giluce">
        </div>
        
        <nav class="sidebar-menu">
            <div class="menu-section">
                <div class="menu-title">Principal</div>
                <a href="/dashboard" class="menu-item @if(request()->is('dashboard')) active @endif">
                    <i class="ph ph-squares-four"></i>
                    <span>Dashboard</span>
                </a>
                <a href="/sessions" class="menu-item @if(request()->is('sessions*')) active @endif">
                    <i class="ph ph-whatsapp-logo"></i>
                    <span>WhatsApp</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="ph ph-chat-circle-dots"></i>
                    <span>Messages</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="ph ph-users-three"></i>
                    <span>Contacts</span>
                </a>
            </div>
            
            <div class="menu-section">
                <div class="menu-title">Outils</div>
                <a href="#" class="menu-item">
                    <i class="ph ph-robot"></i>
                    <span>Automatisation</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="ph ph-paper-plane-tilt"></i>
                    <span>Campagnes</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="ph ph-calendar-blank"></i>
                    <span>Planification</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="ph ph-download-simple"></i>
                    <span>Téléchargements</span>
                </a>
            </div>
            
            <div class="menu-section">
                <div class="menu-title">Analytique</div>
                <a href="#" class="menu-item">
                    <i class="ph ph-chart-line-up"></i>
                    <span>Statistiques</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="ph ph-file-text"></i>
                    <span>Rapports</span>
                </a>
            </div>
            
            <div class="menu-section">
                <div class="menu-title">Paramètres</div>
                <a href="#" class="menu-item">
                    <i class="ph ph-gear"></i>
                    <span>Configuration</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="ph ph-lifebuoy"></i>
                    <span>Support</span>
                </a>
                <a href="/logout" class="menu-item" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                    <i class="ph ph-sign-out"></i>
                    <span>Déconnexion</span>
                </a>
            </div>
        </nav>
        
        <div class="sidebar-footer">
            <div class="user-card">
                <div class="user-avatar">U</div>
                <div class="user-info">
                    <div class="user-name">Utilisateur</div>
                    <div class="user-role">Membre</div>
                </div>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Header -->
        <header class="header">
            <div class="header-left">
                <button class="menu-toggle" id="menuToggle">
                    <i class="ph ph-list"></i>
                </button>
                <div class="search-box">
                    <i class="ph ph-magnifying-glass"></i>
                    <input type="text" placeholder="Rechercher...">
                </div>
            </div>
            <div class="header-right">
                <button class="header-btn" title="Messages">
                    <i class="ph ph-chat-circle"></i>
                </button>
                <button class="header-btn" title="Notifications">
                    <i class="ph ph-bell"></i>
                    <span class="notification-dot"></span>
                </button>
                <button class="header-btn" title="Paramètres">
                    <i class="ph ph-gear"></i>
                </button>
            </div>
        </header>

        <!-- Content Area -->
        <div class="content-area">
            @yield('content')
        </div>
    </main>

    <!-- Logout Form -->
    <form id="logout-form" action="/logout" method="POST" style="display: none;">
        @csrf
    </form>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Mobile sidebar toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });
        
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    </script>
    
    @yield('scripts')
</body>
</html>
