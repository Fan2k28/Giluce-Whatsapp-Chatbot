/**
 * Joke Command - Send random jokes
 */

const APIs = require('../../src/utils/api');

module.exports = {
    name: 'joke',
    aliases: ['jokes'],
    category: 'fun',
    description: 'Get random joke',
    usage: '.joke',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const joke = await APIs.getJoke();
            
            let text = `${joke.setup}\n\n${joke.punchline}`;
            
            await sock.sendMessage(from, { text }, { quoted: msg });
            
        } catch (error) {
            console.error('Joke Error:', error);
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` }, { quoted: msg });
        }
    }
};
