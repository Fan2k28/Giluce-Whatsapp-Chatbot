/**
 * Translate Command - Translate text to different languages
 */

const APIs = require('../../src/utils/api');

module.exports = {
    name: 'translate',
    aliases: ['tr', 'trans', 'terjemahan'],
    category: 'general',
    description: 'Translate text to another language',
    usage: '.translate <lang code> <text>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            if (args.length < 2) {
                return await sock.sendMessage(from, { 
                    text: '❌ Usage: .translate <lang> <text>\n\nExample: .translate es Hello world\n\nSupported codes: en, es, fr, de, it, pt, ru, ja, ko, zh, ar, hi, id' 
                });
            }
            
            const targetLang = args[0];
            const text = args.slice(1).join(' ');
            
            await sock.sendMessage(from, { 
                text: '🔄 Translating...',
                react: { text: '🔄', key: msg.key }
            });
            
            const result = await APIs.translate(text, targetLang);
            
            let replyText = `🌐 *Translation*\n\n`;
            replyText += `📝 Original: ${text}\n`;
            replyText += `🔤 Translated: ${result.translation || result}\n`;
            replyText += `🌍 Language: ${targetLang.toUpperCase()}`;
            
            await sock.sendMessage(from, { text: replyText });
            
        } catch (error) {
            console.error('Translate command error:', error);
            await sock.sendMessage(from, { 
                text: `❌ Translation failed!\n\nSupported codes: en, es, fr, de, it, pt, ru, ja, ko, zh, ar, hi, id\n\nError: ${error.message}` 
            });
        }
    }
};
