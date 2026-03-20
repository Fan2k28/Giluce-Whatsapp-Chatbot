/**
 * Groupinfo Command - Display group information
 */

module.exports = {
    name: 'groupinfo',
    description: 'Display group information',
    category: 'general',
    groupOnly: true,
    
    async execute(sock, msg, args, context) {
        const { from, groupMetadata, isGroup } = context;
        
        if (!isGroup || !groupMetadata) {
            await sock.sendMessage(from, { text: '❌ Cette commande doit être utilisée dans un groupe!' });
            return;
        }
        
        const participants = groupMetadata.participants || [];
        const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        
        const info = `╔══════════════════════════════╗
║      *�Group Info*          ║
╠══════════════════════════════╣
║ Nom: ${groupMetadata.subject}        ║
║ Membres: ${participants.length}           ║
║ Admins: ${admins.length}                  ║
║ Créé: ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}      ║
╚══════════════════════════════╝`;

        await sock.sendMessage(from, { text: info });
    }
};
