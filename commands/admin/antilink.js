/**
 * Antilink Command - Toggle anti-link feature
 */

const database = require('../../src/database');

module.exports = {
    name: 'antilink',
    description: 'Enable/disable anti-link',
    category: 'admin',
    groupOnly: true,
    adminOnly: true,
    botAdminNeeded: true,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const currentSettings = database.getGroupSettings(from);
        const action = args[0]?.toLowerCase();
        
        let newStatus;
        if (action === 'on') {
            newStatus = true;
        } else if (action === 'off') {
            newStatus = false;
        } else {
            newStatus = !currentSettings.antilink;
        }
        
        database.updateGroupSettings(from, { antilink: newStatus });
        
        const statusText = newStatus ? '✅ Activé' : '❌ Désactivé';
        await sock.sendMessage(from, { 
            text: `${statusText} Anti-lien pour ce groupe!` 
        });
    }
};
