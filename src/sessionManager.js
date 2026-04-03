/**
 * Session Manager - Handles multiple WhatsApp sessions
 * Supports SaaS multi-tenant architecture
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const SESSIONS_DIR = path.join(__dirname, '../sessions');

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.logger = pino({ level: 'info' });
        
        // Load existing sessions from filesystem on startup
        this.loadExistingSessions();
    }

    async loadExistingSessions() {
        try {
            if (!fs.existsSync(SESSIONS_DIR)) {
                return;
            }
            
            const dirs = fs.readdirSync(SESSIONS_DIR, { withFileTypes: true });
            for (const dir of dirs) {
                if (dir.isDirectory()) {
                    const sessionId = dir.name;
                    const sessionDir = path.join(SESSIONS_DIR, sessionId);
                    const credsFile = path.join(sessionDir, 'creds.json');
                    
                    if (fs.existsSync(credsFile)) {
                        this.logger.info(`Loading existing session: ${sessionId}`);
                        await this.createSocket(sessionId, sessionDir);
                    }
                }
            }
            this.logger.info(`Loaded ${this.sessions.size} existing sessions`);
        } catch (error) {
            this.logger.error('Error loading existing sessions:', error);
        }
    }

    generateSessionId() {
        return uuidv4();
    }

    getSessionDir(sessionId) {
        return path.join(SESSIONS_DIR, sessionId);
    }

    async createSession(sessionId) {
        const sessionDir = this.getSessionDir(sessionId);
        
        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }

        return await this.createSocket(sessionId, sessionDir);
    }

    async createSocket(sessionId, sessionDir) {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            auth: state,
            version: version,
            browser: ['Chrome', 'Windows', '10.0'],
            logger: this.logger,
            connectTimeoutMs: 60_000,
            keepAliveIntervalMs: 20_000,
            patchMessageBeforeSending: (msg) => msg,
            // Memory optimization: prevent loading old messages into RAM
            syncFullHistory: false,
            downloadHistory: false,
            markOnlineOnConnect: false,
            getMessage: async () => undefined
        });

        const sessionInfo = {
            id: sessionId,
            socket: sock,
            saveCreds,
            state: 'connecting',
            qrCode: null,
            phoneNumber: null,
            name: null,
            createdAt: new Date(),
            lastSeen: new Date(),
            sessionDir: sessionDir
        };

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                sessionInfo.qrCode = qr;
                sessionInfo.state = 'waiting_qr';
                this.logger.info(`Session ${sessionId}: QR Code generated`);
            }

            if (connection === 'open') {
                sessionInfo.state = 'authenticated';
                sessionInfo.phoneNumber = sock.user?.id?.split(':')[0];
                sessionInfo.name = sock.user?.name || sock.user?.pushName || 'Unknown';
                sessionInfo.lastSeen = new Date();
                this.logger.info(`Session ${sessionId}: Connected - ${sessionInfo.phoneNumber}`);
            } else if (connection === 'close') {
                const error = lastDisconnect?.error || {};
                const errorMessage = error.message || '';
                const statusCode = error.status || error.code || error.attrs?.code;
                
                this.logger.warn(`Session ${sessionId}: Disconnected - ${errorMessage} (status: ${statusCode})`);
                
                if (errorMessage.includes('conflict') || statusCode === 515 || statusCode === 428 || errorMessage.includes('restart required')) {
                    sessionInfo.state = 'connecting';
                    setTimeout(async () => {
                        await this.reconnectSession(sessionId);
                    }, 3000);
                }
            } else if (connection === 'connecting') {
                sessionInfo.state = 'connecting';
            }
        });

        // Setup message handler
        sock.ev.on('messages.upsert', async ({ messages }) => {
            sessionInfo.lastSeen = new Date();
            // Store reference to session for handler
            sock.sessionId = sessionId;
        });

        sock.ev.on('error', (err) => {
            this.logger.error(`Session ${sessionId}: Error - ${err.message}`);
        });

        this.sessions.set(sessionId, sessionInfo);
        this.logger.info(`Session ${sessionId}: Created`);
        
        return sessionInfo;
    }

    async reconnectSession(sessionId) {
        const oldSession = this.sessions.get(sessionId);
        if (!oldSession) {
            this.logger.warn(`Session ${sessionId}: Cannot reconnect - session not found`);
            return;
        }

        this.logger.info(`Session ${sessionId}: Reconnecting with saved credentials...`);
        
        try {
            oldSession.socket.end(undefined);
        } catch (e) {}

        await this.createSocket(sessionId, oldSession.sessionDir);
        
        this.logger.info(`Session ${sessionId}: Reconnection initiated`);
    }

    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }

    getAllSessions() {
        const sessions = [];
        for (const [id, session] of this.sessions) {
            sessions.push({
                id: id,
                phoneNumber: session.phoneNumber,
                name: session.name,
                state: session.state,
                createdAt: session.createdAt,
                lastSeen: session.lastSeen
            });
        }
        return sessions;
    }

    async deleteSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            try {
                session.socket.end(undefined);
            } catch (e) {}
            this.sessions.delete(sessionId);
            
            const sessionDir = this.getSessionDir(sessionId);
            if (fs.existsSync(sessionDir)) {
                fs.rmSync(sessionDir, { recursive: true, force: true });
            }
            this.logger.info(`Session ${sessionId}: Deleted`);
        }
    }

    async getQRCode(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session || !session.qrCode) return null;
        
        try {
            return await QRCode.toDataURL(session.qrCode);
        } catch (e) {
            return null;
        }
    }

    // Get socket by phone number (for handling messages)
    getSocketByPhone(phoneNumber) {
        for (const [id, session] of this.sessions) {
            if (session.phoneNumber === phoneNumber && session.state === 'authenticated') {
                return session.socket;
            }
        }
        return null;
    }

    // Get all authenticated sockets
    getAllAuthenticatedSockets() {
        const sockets = [];
        for (const [id, session] of this.sessions) {
            if (session.state === 'authenticated') {
                sockets.push(session.socket);
            }
        }
        return sockets;
    }
}

// Export singleton instance
module.exports = new SessionManager();
