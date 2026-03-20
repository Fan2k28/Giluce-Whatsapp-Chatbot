/**
 * Kick Command - Remove a member from group
 */

module.exports = {
    name: 'kick',
    description: 'Remove a member from group',
    category: 'admin',
    groupOnly: true,
    adminOnly: true,
    botAdminNeeded: true,
    
    async execute(sock, msg, args, context) {
        const { from, isBotAdmin, groupMetadata } = context;
        
        // Get mentioned user or use the person who sent the command
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            await sock.sendMessage(from, { text: '❌ Veuillez mentionner un utilisateur à expulser!' });
            return;
        }
        
        try {
            await sock.groupParticipantsUpdate(from, [mentioned], 'remove');
            await sock.sendMessage(from, { text: '✅ Utilisateur expulsé avec succès!' });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Erreur: ${error.message}` });
        }
    }
};
