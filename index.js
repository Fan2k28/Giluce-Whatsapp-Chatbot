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

// Setup handlers for a socket
const setupSocketHandlers = (sock, sessionId) => {
    // Messages upsert
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        
        // Check if socket is authenticated
        if (!sock.user || !sock.user.id) return;
        
        for (const msg of messages) {
            if (!msg.message || !msg.key?.id) continue;
            
            const from = msg.key.remoteJid;
            if (!from) continue;
            
            // Skip system JIDs
            if (from.includes('@broadcast') || from.includes('status.broadcast') || 
                from.includes('@newsletter')) {
                continue;
            }
            
            // Process message
            await processMessage(sock, msg, sessionId);
        }
    });
    
    // Group updates
    sock.ev.on('group-participants.update', async (update) => {
        await handler.handleGroupUpdate(sock, update);
    });
    
    // Anti-call
    handler.initializeAntiCall(sock);
    
    // Initialize automation - don't pass sock, it will get sessions from sessionManager
    // handler.initializeAutomation(sock);
};

// ==================== AUTO-LOAD EXISTING SESSIONS ====================

// Initialize automation system once at startup (it will get sessions internally)
handler.initializeAutomation();

// Wait for sessions to load then setup handlers
setTimeout(() => {
    console.log('Setting up message handlers for existing sessions...');
    setupSessionHandlers();
    
    // Also setup handlers for new sessions when they're created
    const originalCreateSession = sessionManager.createSession;
    sessionManager.createSession = async function(...args) {
        const session = await originalCreateSession.apply(this, args);
        if (session && session.socket) {
            setupSocketHandlers(session.socket, session.id);
        }
        return session;
    };
}, 3000);

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
