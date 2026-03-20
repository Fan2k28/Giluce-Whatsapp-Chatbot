/**
 * Promote Command - Make user admin
 */

module.exports = {
    name: 'promote',
    description: 'Make user group admin',
    category: 'admin',
    groupOnly: true,
    adminOnly: true,
    botAdminNeeded: true,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            await sock.sendMessage(from, { text: '❌ Veuillez mentionner un utilisateur à promouvoir!' });
            return;
        }
        
        try {
            await sock.groupParticipantsUpdate(from, [mentioned], 'promote');
            await sock.sendMessage(from, { text: '✅ Utilisateur promu administrateur!' });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Erreur: ${error.message}` });
        }
    }
};
