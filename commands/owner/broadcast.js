/**
 * Broadcast Command - Send message to all chats
 */

module.exports = {
    name: 'broadcast',
    aliases: ['bc'],
    category: 'owner',
    description: 'Broadcast message to all chats',
    usage: '.broadcast <message>',
    ownerOnly: true,
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            if (args.length === 0) {
                await sock.sendMessage(from, { text: '❌ Usage: .broadcast <message>\n\nExample: .broadcast Hello everyone!' });
                return;
            }
            
            const message = args.join(' ');
            
            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.values(chats);
            
            let success = 0;
            let failed = 0;
            
            for (const group of groups) {
                try {
                    await sock.sendMessage(group.id, {
                        text: `📢 *BROADCAST MESSAGE*\n\n${message}\n\n_This is a broadcast message from bot owner_`
                    });
                    success++;
                } catch (e) {
                    failed++;
                }
            }
            
            await sock.sendMessage(from, { text: `✅ Broadcast complete!\n\n✅ Success: ${success}\n❌ Failed: ${failed}` });
            
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
        }
    }
};
