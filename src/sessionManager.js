/**
 * Session Manager - Console single-session mode
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const https = require('https');

const SESSIONS_DIR = path.join(__dirname, '../sessions');

if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

const createSslAgent = () => {
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
        return new https.Agent({ rejectUnauthorized: false });
    }
    return undefined;
};

const DEFAULT_AGENT = createSslAgent();

class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.logger = pino({ level: 'info' });
    }

    generateSessionId() {
        const dirs = fs.readdirSync(SESSIONS_DIR, { withFileTypes: true });
        const existing = dirs.find(dir => dir.isDirectory());
        return existing ? existing.name : require('crypto').randomUUID();
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
            printQRInTerminal: false,
            connectTimeoutMs: 60_000,
            keepAliveIntervalMs: 20_000,
            patchMessageBeforeSending: (msg) => msg,
            syncFullHistory: false,
            downloadHistory: false,
            markOnlineOnConnect: false,
            getMessage: async () => undefined,
            agent: DEFAULT_AGENT,
            fetchAgent: DEFAULT_AGENT
        });

        const sessionInfo = {
            id: sessionId,
            socket: sock,
            saveCreds,
            state: 'connecting',
            phoneNumber: null,
            name: null,
            createdAt: new Date(),
            lastSeen: new Date(),
            sessionDir: sessionDir
        };

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, isNewLogin } = update;
            const error = lastDisconnect?.error || {};
            const errorMessage = error.message || '';
            const statusCode = error.status || error.code || error.attrs?.code;

            if (connection === 'open') {
                sessionInfo.state = 'authenticated';
                sessionInfo.phoneNumber = sock.user?.id?.split(':')[0];
                sessionInfo.name = sock.user?.name || sock.user?.pushName || 'Unknown';
                sessionInfo.lastSeen = new Date();
                this.logger.info(`Session ${sessionId}: Connected - ${sessionInfo.phoneNumber}`);
            } else if (connection === 'close' && !isNewLogin && !errorMessage.includes('pairing configured successfully')) {
                this.logger.warn(`Session ${sessionId}: connection closed - ${errorMessage || 'unknown'} (status: ${statusCode})`);
                sessionInfo.state = 'connecting';
            }
        });

        sock.ev.on('error', (err) => {
            this.logger.error(`Session ${sessionId}: Error - ${err.message}`);
        });

        this.sessions.set(sessionId, sessionInfo);
        this.logger.info(`Session ${sessionId}: Created`);

        return sessionInfo;
    }

    async reconnectSession(sessionId) {
        const sessionDir = this.getSessionDir(sessionId);
        const existing = this.sessions.get(sessionId);
        if (!existing) return null;

        try {
            existing.state = 'connecting';
            const result = await this.createSocket(sessionId, sessionDir);
            return result;
        } catch (err) {
            this.logger.error(`Session ${sessionId}: Reconnect failed - ${err.message}`);
            return null;
        }
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
}

module.exports = new SessionManager();
