/**
 * Info Command - Display bot information
 */

const config = require('../../config');

module.exports = {
    name: 'info',
    description: 'Display bot information',
    category: 'general',
    
    async execute(sock, msg, args, context) {
        const { from, isGroup } = context;
        
        const info = `╔══════════════════════════════╗
║     *${config.botName}*      ║
╠══════════════════════════════╣
║ 🤖 Version: 1.0.0            ║
║ ⚡ Prefix: ${config.prefix}             ║
║ 👑 Owner: ${config.ownerName[0]}          ║
║ 🌐 Type: Multi-Device        ║
╚══════════════════════════════╝

💡 *Description:*
WhatsApp Bot with advanced features
including group management, AI, and more!`;

        await sock.sendMessage(from, { text: info });
    }
};
