const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.WEB_PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/src', express.static(path.join(__dirname, '../src')));

let qrData = null;
let connectionStatus = 'idle'; // idle | qr | paired | connecting | connected | error
let statusMessage = 'En attente de connexion...';
let listeners = [];

const broadcast = () => {
    const payload = { qrData, connectionStatus, statusMessage };
    listeners.forEach(fn => {
        try { fn(payload); } catch {}
    });
};

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(`data: ${JSON.stringify({ qrData, connectionStatus, statusMessage })}\n\n`);
    const onStatus = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    listeners.push(onStatus);
    req.on('close', () => {
        listeners = listeners.filter(fn => fn !== onStatus);
    });
});

app.post('/qr', (req, res) => {
    const { qr } = req.body || {};
    qrData = qr || null;
    if (qrData) {
        connectionStatus = 'qr';
        statusMessage = 'Scannez le QR code avec WhatsApp';
    }
    broadcast();
    res.json({ ok: true });
});

app.post('/status', (req, res) => {
    const { status, message } = req.body || {};
    connectionStatus = status || connectionStatus;
    statusMessage = message || statusMessage;
    broadcast();
    res.json({ ok: true });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Web QR interface available at http://localhost:${PORT}`);
});

module.exports = {
    updateQR: (qr) => {
        qrData = qr;
        if (qr) {
            connectionStatus = 'qr';
            statusMessage = 'Scannez le QR code avec WhatsApp';
        }
        broadcast();
    },
    setStatus: (status, message) => {
        connectionStatus = status;
        statusMessage = message || statusMessage;
        broadcast();
    },
    close: () => {
        server.close();
    }
};
