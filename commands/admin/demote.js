/**
 * Demote Command - Remove admin from user
 */

module.exports = {
    name: 'demote',
    description: 'Remove admin from user',
    category: 'admin',
    groupOnly: true,
    adminOnly: true,
    botAdminNeeded: true,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            await sock.sendMessage(from, { text: '❌ Veuillez mentionner un utilisateur à rétrograder!' });
            return;
        }
        
        try {
            await sock.groupParticipantsUpdate(from, [mentioned], 'demote');
            await sock.sendMessage(from, { text: '✅ Administrateur rétrogradé!' });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Erreur: ${error.message}` });
        }
    }
};
