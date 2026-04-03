/**
 * My Activity Command - Check user's activity stats for today
 */

const { getGroupStats } = require('../../src/utils/groupstats');

module.exports = {
    name: 'myactivity',
    aliases: ['mystats', 'mymsgs', 'rank', 'myrank'],
    category: 'general',
    description: 'Check your activity stats for today',
    usage: '.myactivity',
    groupOnly: true,

    async execute(sock, msg, args, context) {
        const { from, sender } = context;
        
        try {
            const stats = getGroupStats(from);

            if (!stats || !stats.users || !stats.users[sender]) {
                return await sock.sendMessage(from, { 
                    text: '📊 You haven\'t sent any messages today yet!' 
                });
            }

            const userCount = stats.members[sender].messages;
            const totalMessages = stats.totalMessages;
            const percentage = ((userCount / totalMessages) * 100).toFixed(1);

            // Calculate rank
            const sortedUsers = Object.entries(stats.members)
                .sort((a, b) => b[1].messages - a[1].messages);
            
            const rank = sortedUsers.findIndex(([id]) => id === sender) + 1;

            const text = `
📊 *Your Activity Today*

👤 *User:* @${sender.split('@')[0]}
📝 *Messages Sent:* ${userCount}
📈 *Your Share:* ${percentage}%
🏆 *Rank:* #${rank} of ${sortedUsers.length}

Keep chatting! 💬
`.trim();

            await sock.sendMessage(from, {
                text,
                mentions: [sender]
            }, { quoted: msg });

        } catch (err) {
            console.error('[myactivity cmd] error:', err);
            await sock.sendMessage(from, { 
                text: '❌ Error loading your activity stats.' 
            });
        }
    }
};
