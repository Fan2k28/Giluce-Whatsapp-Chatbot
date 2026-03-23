/**
 * Unblock Command - Unblock a user
 */

module.exports = {
    name: 'unblock',
    aliases: [],
    category: 'owner',
    description: 'Unblock a user',
    usage: '.unblock @user or reply',
    ownerOnly: true,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            let target;
            
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            const mentioned = ctx?.mentionedJid || [];
            
            if (mentioned && mentioned.length > 0) {
                target = mentioned[0];
            } else if (ctx?.participant && ctx.stanzaId && ctx.quotedMessage) {
                target = ctx.participant;
            } else {
                await sock.sendMessage(from, { text: '❌ Please mention or reply to a user to unblock!' });
                return;
            }
            
            await sock.updateBlockStatus(target, 'unblock');
            
            await sock.sendMessage(from, {
                text: `✅ @${target.split('@')[0]} has been unblocked!`,
                mentions: [target]
            });
            
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    }
};
