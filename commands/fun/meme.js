/**
 * Meme Command - Send random memes
 */

const APIs = require('../../src/utils/api');
const axios = require('axios');

module.exports = {
    name: 'meme',
    aliases: ['memes'],
    category: 'fun',
    description: 'Get random memes',
    usage: '.meme',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const meme = await APIs.getMeme();
            
            const imageBuffer = await axios.get(meme.url, { responseType: 'arraybuffer' });
            
            await sock.sendMessage(from, {
                image: Buffer.from(imageBuffer.data),
                caption: `😂 *${meme.title}*\n\n📱 From: r/${meme.subreddit}\n👤 By: ${meme.author}\n⬆️ Upvotes: ${meme.ups}`
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Meme Error:', error);
            await sock.sendMessage(from, { text: `❌ Error: ${error.message}` }, { quoted: msg });
        }
    }
};
