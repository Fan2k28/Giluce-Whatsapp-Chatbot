/**
 * Group Stats Command - Display group chat statistics
 */

const { getGroupStats } = require('../../src/utils/groupstats');

module.exports = {
    name: 'groupstats',
    aliases: ['stats', 'leaderboard', 'gstats', 'topmembers', 'msgs', 'messagestats', 'gcleaderboard'],
    category: 'general',
    description: "Show today's group chat statistics",
    usage: '.groupstats',
    groupOnly: true,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const stats = getGroupStats(from);

            if (!stats || !stats.members) {
                return await sock.sendMessage(from, { 
                    text: '📊 No activity recorded today.' 
                });
            }

            const total = stats.totalMessages || 0;
            const users = stats.members || {};

            // top members
            const sortedUsers = Object.entries(users)
                .sort((a, b) => b[1].messages - a[1].messages)
                .slice(0, 5);

            let topText = sortedUsers.length
                ? sortedUsers.map(([id, data], i) => `${i + 1}) @${id.split('@')[0]} — ${data.messages} msgs`).join('\n')
                : 'No active users yet.';

            const text = `
📊 *Group Stats — Today*

📌 *Total Messages:* ${total}

👥 *Top Active Members:*
${topText}

Type .myactivity to see your stats.
`.trim();

            await sock.sendMessage(from, {
                text,
                mentions: sortedUsers.map(([id]) => id)
            }, { quoted: msg });

        } catch (err) {
            console.error('[groupstats cmd] error:', err);
            await sock.sendMessage(from, { 
                text: '❌ Error loading stats.' 
            });
        }
    }
};
