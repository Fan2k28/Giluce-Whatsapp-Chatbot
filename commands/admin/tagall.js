/**
 * Tagall Command - Tag all group members
 */

module.exports = {
    name: 'tagall',
    description: 'Tag all group members',
    category: 'admin',
    groupOnly: true,
    adminOnly: true,
    
    async execute(sock, msg, args, context) {
        const { from, groupMetadata } = context;
        
        if (!groupMetadata || !groupMetadata.participants) {
            await sock.sendMessage(from, { text: '❌ Impossible de获取群成员列表!' });
            return;
        }
        
        const participants = groupMetadata.participants;
        const mentions = participants.map(p => p.id);
        
        const text = args.join(' ') || '📢 @all Tagging everyone!';
        
        await sock.sendMessage(from, {
            text: text,
            mentions: mentions
        });
    }
};
