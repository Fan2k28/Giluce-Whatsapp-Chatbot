/**
 * Auto-React Utility - Load and save auto-react settings
 */

const fs = require('fs');
const path = require('path');

const autoReactPath = path.join(__dirname, '../../database/autoreact.json');

function load() {
    try {
        if (fs.existsSync(autoReactPath)) {
            const data = fs.readFileSync(autoReactPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error loading auto-react data:', err);
    }
    return { enabled: false, mode: 'bot' };
}

function save(data) {
    try {
        const dir = path.dirname(autoReactPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(autoReactPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error saving auto-react data:', err);
    }
}

module.exports = { load, save };
