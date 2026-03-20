/**
 * Ping Command - Test bot response time
 */

module.exports = {
    name: 'ping',
    description: 'Test bot ping',
    category: 'general',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const start = Date.now();
        await sock.sendMessage(from, { text: '🏓 Pinging...' });
        const latency = Date.now() - start;
        
        await sock.sendMessage(from, { 
            text: `✅ Pong!\n⏱️ Latence: ${latency}ms` 
        });
    }
};
