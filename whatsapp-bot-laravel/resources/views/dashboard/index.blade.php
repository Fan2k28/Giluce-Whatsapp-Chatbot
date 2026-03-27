@extends('layouts.dashboard')

@section('title', 'Dashboard - Giluce')

@section('content')
<h1 class="page-title">Dashboard</h1>
<p class="page-subtitle">Bienvenue! Voici un aperçu de votre activité WhatsApp.</p>

<!-- Stats Grid - Always shown -->
<div class="stats-grid">
    <div class="stat-card blue">
        <div class="stat-icon">
            <i class="ph ph-chat-circle-dots"></i>
        </div>
        <div class="stat-value" id="messagesToday">0</div>
        <div class="stat-label">Messages aujourd'hui</div>
        <div class="stat-trend up">
            <i class="ph ph-trend-up"></i>
            <span>En attente de données</span>
        </div>
    </div>
    
    <div class="stat-card green">
        <div class="stat-icon">
            <i class="ph ph-users-three"></i>
        </div>
        <div class="stat-value" id="activeContacts">0</div>
        <div class="stat-label">Contacts actifs</div>
        <div class="stat-trend up">
            <i class="ph ph-trend-up"></i>
            <span>En attente de données</span>
        </div>
    </div>
    
    <div class="stat-card yellow">
        <div class="stat-icon">
            <i class="ph ph-paper-plane-tilt"></i>
        </div>
        <div class="stat-value" id="campaignsSent">0</div>
        <div class="stat-label">Campagnes envoyées</div>
        <div class="stat-trend up">
            <i class="ph ph-trend-up"></i>
            <span>En attente de données</span>
        </div>
    </div>
    
    <div class="stat-card purple">
        <div class="stat-icon">
            <i class="ph ph-robot"></i>
        </div>
        <div class="stat-value" id="aiResponses">0%</div>
        <div class="stat-label">Réponses IA</div>
        <div class="stat-trend up">
            <i class="ph ph-trend-up"></i>
            <span>En attente de données</span>
        </div>
    </div>
</div>

<!-- Cards Grid -->
<div class="cards-grid">
    <!-- Quick Actions -->
    <div class="content-card">
        <div class="card-header">
            <h3 class="card-title">Actions Rapides</h3>
        </div>
        <div class="card-body">
            <div class="quick-actions">
                <button class="action-btn blue">
                    <i class="ph ph-plus-circle"></i>
                    <span>Nouveau message</span>
                </button>
                <button class="action-btn green">
                    <i class="ph ph-users-plus"></i>
                    <span>Ajouter contact</span>
                </button>
                <button class="action-btn yellow">
                    <i class="ph ph-paper-plane-right"></i>
                    <span>Nouvelle campagne</span>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Recent Messages -->
    <div class="content-card">
        <div class="card-header">
            <h3 class="card-title">Messages Récents</h3>
            <a href="#" class="card-action">Voir tout</a>
        </div>
        <div class="card-body">
            <div class="message-list" id="recentMessages">
                <div class="message-item">
                    <div class="message-avatar blue">--</div>
                    <div class="message-content">
                        <div class="message-name">Aucun message</div>
                        <div class="message-text">Commencez une conversation</div>
                    </div>
                    <div class="message-time">--</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- WhatsApp Sessions -->
    <div class="content-card wide">
        <div class="card-header">
            <h3 class="card-title">Sessions WhatsApp</h3>
            @if(isset($canCreateSession) && $canCreateSession)
            <button type="button" class="card-action" data-bs-toggle="modal" data-bs-target="#connectWhatsAppModal">
                <i class="ph ph-plus"></i> Nouvelle session
            </button>
            @endif
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="data-table" id="sessionsTable">
                    <thead>
                        <tr>
                            <th>Appareil</th>
                            <th>Téléphone</th>
                            <th>Statut</th>
                            <th>Dernière activité</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="sessionsBody">
                        <!-- Sessions will be loaded dynamically -->
                    </tbody>
                </table>
                <div id="noSessionsMessage" class="text-center py-4" style="display: none;">
                    <i class="ph ph-whatsapp-logo" style="font-size: 3rem; color: var(--gray); opacity: 0.5;"></i>
                    <p class="mt-3" style="color: var(--gray);">Aucune session WhatsApp connectée</p>
                    @if(isset($canCreateSession) && $canCreateSession)
                    <button type="button" class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#connectWhatsAppModal">
                        <i class="ph ph-qr-code"></i> Connecter WhatsApp
                    </button>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Connect WhatsApp Modal -->
<div class="modal fade" id="connectWhatsAppModal" tabindex="-1" aria-labelledby="connectWhatsAppModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border: none; border-radius: 24px; overflow: hidden;">
            <div class="modal-header" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); padding: 20px 25px;">
                <h5 class="modal-title text-white" id="connectWhatsAppModalLabel">
                    <i class="ph ph-device-mobile"></i> Connecter WhatsApp
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="padding: 30px;">
                <form id="connectForm" method="POST" action="{{ route('sessions.store') }}">
                    @csrf
                    <div class="mb-3">
                        <label for="sessionName" class="form-label" style="font-weight: 600; color: var(--dark);">
                            Nom de l'appareil
                        </label>
                        <input type="text" class="form-control" id="sessionName" name="device_name" placeholder="Ex: Mon iPhone, Samsung de bureau..." required style="padding: 14px 18px; border-radius: 12px; border: 2px solid #e9ecef;">
                        <small class="text-muted">Ce nom vous aidera à identifier cet appareil dans la liste</small>
                    </div>
                    
                    <div class="alert" style="background: rgba(74, 143, 216, 0.1); border: none; border-radius: 12px; padding: 15px;">
                        <i class="ph ph-info" style="color: var(--primary);"></i>
                        <span style="color: var(--dark);">Vous êtes sur le plan gratuit: 1 session maximale</span>
                    </div>
                    
                    <button type="submit" class="btn w-100" style="background: linear-gradient(135deg, var(--secondary), var(--secondary-dark)); border: none; padding: 14px; border-radius: 12px; font-weight: 600; color: white;">
                        <i class="ph ph-qr-code"></i> Générer le QR Code
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
// Load sessions from the Node.js API directly
function loadSessions() {
    fetch('{{ config("services.node_api_url") }}/sessions')
        .then(response => response.json())
        .then(sessions => {
            const tbody = document.getElementById('sessionsBody');
            const noSessions = document.getElementById('noSessionsMessage');
            const table = document.getElementById('sessionsTable');
            
            if (sessions && sessions.length > 0) {
                tbody.innerHTML = sessions.map(session => `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="ph ph-device-mobile" style="font-size: 1.5rem; color: var(--secondary);"></i>
                                <div>
                                    <div style="font-weight: 600;">${session.name || 'Unknown'}</div>
                                    <div style="font-size: 0.8rem; color: var(--gray);">${session.id.substring(0, 8)}...</div>
                                </div>
                            </div>
                        </td>
                        <td>${session.phoneNumber || 'Non connecté'}</td>
                        <td>
                            ${session.state === 'authenticated' ? 
                                '<span class="status-badge connected"><span class="status-dot"></span>Connecté</span>' :
                                '<span class="status-badge waiting"><span class="status-dot"></span>En attente</span>'
                            }
                        </td>
                        <td>${session.lastSeen ? new Date(session.lastSeen).toLocaleString('fr-FR') : 'Jamais'}</td>
                        <td>
                            <div class="action-btns">
                                <a href="/sessions/${session.id}" class="btn-view" title="Voir"><i class="ph ph-eye"></i></a>
                                <a href="/sessions/${session.id}/reconnect" class="btn-refresh" title="Reconnecter"><i class="ph ph-arrows-clockwise"></i></a>
                            </div>
                        </td>
                    </tr>
                `).join('');
                table.style.display = '';
                noSessions.style.display = 'none';
                
                // Update stats if connected
                const connectedSessions = sessions.filter(s => s.state === 'authenticated');
                if (connectedSessions.length > 0) {
                    document.getElementById('messagesToday').textContent = '0';
                    document.getElementById('activeContacts').textContent = '0';
                }
            } else {
                table.style.display = 'none';
                noSessions.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error loading sessions:', error);
            document.getElementById('sessionsTable').style.display = 'none';
            document.getElementById('noSessionsMessage').style.display = 'block';
        });
}

// Load sessions on page load
document.addEventListener('DOMContentLoaded', loadSessions);
</script>

@endsection
