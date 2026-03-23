/**
 * SSWeb - Screenshot Website Command
 */

const APIs = require('../../src/utils/api');

module.exports = {
    name: 'ssweb',
    aliases: ['screenshot', 'ss', 'webss', 'webshot'],
    category: 'general',
    description: 'Take a screenshot of a website',
    usage: '.ssweb <url>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            if (args.length === 0) {
                return await sock.sendMessage(from, { 
                    text: '❌ Please provide a website URL!\n\nExample: .ssweb https://github.com' 
                });
            }
            
            const url = args.join(' ');
            
            // Validate URL
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                return await sock.sendMessage(from, { 
                    text: '❌ Please provide a valid URL starting with http:// or https://' 
                });
            }
            
            await sock.sendMessage(from, { 
                text: '📸 Taking screenshot...',
                react: { text: '📸', key: msg.key }
            });
            
            const screenshotBuffer = await APIs.screenshotWebsite(url);
            
            await sock.sendMessage(from, {
                image: screenshotBuffer,
                caption: `📸 Screenshot of: ${url}`
            }, { quoted: msg });
            
        } catch (error) {
            console.error('SSWeb command error:', error);
            await sock.sendMessage(from, { 
                text: `❌ Failed to screenshot website: ${error.message}` 
            });
        }
    }
};
