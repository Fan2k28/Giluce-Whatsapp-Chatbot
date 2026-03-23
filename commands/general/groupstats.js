/**
 * Group Stats Command - Display group chat statistics
 */

const { getStats } = require('../../src/utils/groupstats');

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
            const stats = getStats(from);

            if (!stats) {
                return await sock.sendMessage(from, { 
                    text: '📊 No activity recorded today.' 
                });
            }

            const { total, users } = stats;

            // top members
            const sortedUsers = Object.entries(users)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            let topText = sortedUsers.length
                ? sortedUsers.map(([id, count], i) => `${i + 1}) @${id.split('@')[0]} — ${count} msgs`).join('\n')
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
                mentions: sortedUsers.map(u => u[0])
            }, { quoted: msg });

        } catch (err) {
            console.error('[groupstats cmd] error:', err);
            await sock.sendMessage(from, { 
                text: '❌ Error loading stats.' 
            });
        }
    }
};
