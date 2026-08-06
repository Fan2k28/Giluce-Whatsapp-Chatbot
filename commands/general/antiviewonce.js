/**
 * AntiViewOnce Command - Toggle automatic view-once reveal
 */

const config = require('../../config');
const database = require('../../src/database');

module.exports = {
    name: 'antiviewonce',
    aliases: ['avo'],
    category: 'general',
    description: 'Toggle automatic view-once message reveal',
    usage: '.antiviewonce (on/off)',

    async execute(sock, msg, args, context) {
        const { from, sender, isOwner } = context;
        
        try {
            const isGroup = from.endsWith('@g.us');
            let newState = null;

            if (isGroup) {
                const groupSettings = database.getGroupSettings(from);
                const current = groupSettings.antiviewonce || false;
                newState = args.length > 0 ? args[0].toLowerCase() === 'on' : !current;
                database.updateGroupSettings(from, { antiviewonce: newState });
            } else {
                const cfg = config;
                const current = cfg.antiviewonce || false;
                newState = args.length > 0 ? args[0].toLowerCase() === 'on' : !current;
                
                // Update config in memory (not persistent across restarts unless env var)
                cfg.antiviewonce = newState;
            }

            if (newState === null) return;

            await sock.sendMessage(from, {
                text: `✅ AntiViewOnce is now ${newState ? 'enabled' : 'disabled'}`
            });
        } catch (error) {
            console.error('Error in antiviewonce command:', error);
            await sock.sendMessage(from, {
                text: '❌ Error toggling antiviewonce: ' + error.message
            });
        }
    }
};
