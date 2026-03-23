/**
 * Auto-React Command - Configure automatic reactions
 */

const { load, save } = require('../../src/utils/autoReact');

module.exports = {
    name: 'autoreact',
    aliases: ['ar'],
    category: 'owner',
    description: 'Configure automatic reactions to messages',
    usage: '.autoreact <on/off/set bot/set all>',
    ownerOnly: true,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            if (!args[0]) {
                return sock.sendMessage(from, {
                    text: '📋 *Auto-React Options:*\n\n• on - Enable auto-react\n• off - Disable auto-react\n• set bot - React only to bot commands\n• set all - React to all messages'
                });
            }

            const db = load();
            const opt = args.join(' ').toLowerCase();

            if (opt === 'on') {
                db.enabled = true;
                save(db);
                return sock.sendMessage(from, { text: '✅ Auto-react enabled.' });
            }

            if (opt === 'off') {
                db.enabled = false;
                save(db);
                return sock.sendMessage(from, { text: '❌ Auto-react disabled.' });
            }

            if (opt === 'set bot') {
                db.mode = 'bot';
                save(db);
                return sock.sendMessage(from, { text: '🤖 Auto-react mode: Bot commands only (⏳ reaction)' });
            }

            if (opt === 'set all') {
                db.mode = 'all';
                save(db);
                return sock.sendMessage(from, { text: '🌟 Auto-react mode: All messages (random emojis)' });
            }

            sock.sendMessage(from, { text: '❌ Invalid option. Use: on | off | set bot | set all' });
        } catch (err) {
            console.error('[autoreact cmd] error:', err);
            sock.sendMessage(from, { text: '❌ Error configuring auto-react.' });
        }
    }
};
