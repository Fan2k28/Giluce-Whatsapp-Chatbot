/**
 * Giluce WhatsApp Bot - Main Entry Point
 * Based on KnightBot-Mini structure with multi-session support
 */

process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

const express = require('express');
const http = require('http');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// ==================== CONFIG & IMPORTS ====================
const config = require('./config');
const sessionManager = require('./src/sessionManager');
const handler = require('./src/handler');

// ==================== EXPRESS SERVER ====================
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ==================== API ROUTES ====================

// Get all sessions
app.get('/api/sessions', (req, res) => {
    res.json(sessionManager.getAllSessions());
});

// Create new session
app.post('/api/sessions', async (req, res) => {
    const sessionId = sessionManager.generateSessionId();
    await sessionManager.createSession(sessionId);
    res.json({ sessionId, message: 'Session created. Use /api/sessions/:id/qr to get QR code.' });
});

// Get session info
app.get('/api/sessions/:id', (req, res) => {
    const session = sessionManager.getSession(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    res.json({
        id: session.id,
        phoneNumber: session.phoneNumber,
        name: session.name,
        state: session.state,
        createdAt: session.createdAt,
        lastSeen: session.lastSeen
    });
});

// Get QR code
app.get('/api/sessions/:id/qr', async (req, res) => {
    const session = sessionManager.getSession(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    if (session.state === 'authenticated') {
        return res.json({ 
            state: 'authenticated', 
            phoneNumber: session.phoneNumber,
            message: 'Already authenticated' 
        });
    }

    if (!session.qrCode) {
        return res.json({ state: 'waiting', message: 'Waiting for QR code...' });
    }

    try {
        const qrImage = await QRCode.toDataURL(session.qrCode);
        res.json({ state: 'waiting_qr', qr: qrImage });
    } catch (e) {
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// Reconnect session
app.post('/api/sessions/:id/reconnect', async (req, res) => {
    await sessionManager.reconnectSession(req.params.id);
    res.json({ message: 'Reconnection initiated' });
});

// Get pair number for manual connection
app.get('/api/sessions/:id/pair-number', async (req, res) => {
    const session = sessionManager.getSession(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    // Generate and return pair number for manual connection
    const pairNumber = Math.floor(100000 + Math.random() * 900000).toString();
    res.json({ pairNumber, message: 'Use this pair number in WhatsApp > Settings > Linked Devices' });
});

// Delete session
app.delete('/api/sessions/:id', async (req, res) => {
    await sessionManager.deleteSession(req.params.id);
    res.json({ message: 'Session deleted' });
});

// ==================== MESSAGE HANDLING ====================

// Process incoming messages for all sessions
const processMessage = async (sock, msg, sessionId) => {
    try {
        // Pass session info to handler
        sock.sessionId = sessionId;
        
        // Handle the message
        await handler.handleMessage(sock, msg);
    } catch (error) {
        console.error(`Error processing message in session ${sessionId}:`, error);
    }
};

// Setup message handlers for all sessions
const setupSessionHandlers = () => {
    const sessions = sessionManager.getAllSessions();
    
    for (const sessionData of sessions) {
        const session = sessionManager.getSession(sessionData.id);
        if (session && session.socket) {
            setupSocketHandlers(session.socket, session.id);
        }
    }
};



// ==================== AUTO-LOAD EXISTING SESSIONS ====================

// Setup handlers for new sessions when they're created
const originalCreateSession = sessionManager.createSession.bind(sessionManager);
sessionManager.createSession = async function(...args) {
    const session = await originalCreateSession.apply(this, args);
    if (session && session.socket) {
        // Setup handlers immediately for new sessions
        setupSocketHandlers(session.socket, session.id);
    }
    return session;
};

// Also patch the createSocket method to setup handlers for loaded sessions
const originalCreateSocket = sessionManager.createSocket.bind(sessionManager);
sessionManager.createSocket = async function(sessionId, sessionDir) {
    const session = await originalCreateSocket(sessionId, sessionDir);
    if (session && session.socket) {
        // Setup handlers immediately
        setupSocketHandlers(session.socket, sessionId);
    }
    return session;
};

// When server restarts, existing sessions may have closed sockets
// We need to recreate them to ensure proper connection
const originalLoadExistingSessions = sessionManager.loadExistingSessions.bind(sessionManager);
sessionManager.loadExistingSessions = async function() {
    await originalLoadExistingSessions();
    
    // Recreate any sessions that have closed sockets
    for (const [sessionId, session] of this.sessions) {
        if (session.socket && !session.socket.user) {
            // Socket is closed, recreate it
            this.logger.info(`Recreating session ${sessionId} with closed socket`);
            await this.reconnectSession(sessionId);
        }
    }
};

// Wait for sessions to load, then attach handlers to all existing sessions
const waitForSessionsAndSetup = async () => {
    // Wait a moment for loadExistingSessions to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sessions = sessionManager.getAllSessions();
    for (const sessionData of sessions) {
        const session = sessionManager.getSession(sessionData.id);
        if (session && session.socket) {
            // If socket has no user, it's disconnected - need to reconnect
            if (!session.socket.user) {
                console.log(`Reconnecting session ${session.id} (closed socket)`);
                await sessionManager.reconnectSession(session.id);
            }
            setupSocketHandlers(session.socket, session.id);
            console.log(`Attached handlers to existing session: ${session.id}`);
        }
    }
    console.log(`Bot initialized with ${sessions.length} active session(s)`);
};

waitForSessionsAndSetup();

// ==================== START SERVER ====================

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║   Giluce WhatsApp Bot - Running Successfully!     ║
║                                                   ║
║   🌐 Web Dashboard: http://localhost:${PORT}      ║
║   📡 API Base: http://localhost:${PORT}/api       ║
║   ⚡ Prefix: ${config.prefix}                     ║
║   👑 Owner: ${config.ownerName[0]}                ║
║                                                   ║
║   Available Commands:                             ║
║   • .menu    - Display bot menu                   ║
║   • .ping    - Test bot response                  ║
║   • .info    - Bot information                    ║
║   • .kick    - Kick user (admin)                  ║
║   • .promote - Promote to admin                   ║
║   • .tagall  - Tag all members                    ║
║   • .welcome - Toggle welcome message             ║
║   • .antilink - Toggle anti-link                  ║
╚═══════════════════════════════════════════════════╝
    `);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nShutting down...');
    server.close(() => {
        process.exit(0);
    });
});
