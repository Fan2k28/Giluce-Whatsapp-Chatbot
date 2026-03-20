/**
 * Welcome Command - Toggle welcome message
 */

const database = require('../../src/database');

module.exports = {
    name: 'welcome',
    description: 'Enable/disable welcome message',
    category: 'admin',
    groupOnly: true,
    adminOnly: true,
    
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
            newStatus = !currentSettings.welcome;
        }
        
        database.updateGroupSettings(from, { welcome: newStatus });
        
        const statusText = newStatus ? '✅ Activé' : '❌ Désactivé';
        await sock.sendMessage(from, { 
            text: `${statusText} Message de bienvenue pour ce groupe!` 
        });
    }
};
