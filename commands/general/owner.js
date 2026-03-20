/**
 * Owner Command - Display owner information
 */

const config = require('../../config');

module.exports = {
    name: 'owner',
    description: 'Display owner information',
    category: 'general',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const ownerText = `╔══════════════════════════════╗
║       *👑 Owner Info*       ║
╠══════════════════════════════╣
║ Nom: ${config.ownerName[0]}            ║
║ WhatsApp: +${config.ownerNumber[0]}    ║
╚══════════════════════════════╝

💬 Pour contacter le owner,
envoyez un message direct!`;

        await sock.sendMessage(from, { text: ownerText });
    }
};
