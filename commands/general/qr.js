/**
 * QR Code Generator Command
 */

const qrcode = require('qrcode');

module.exports = {
    name: 'qr',
    aliases: ['qrcode', 'qrcode generator'],
    category: 'general',
    description: 'Generate QR code from text',
    usage: '.qr <text>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            if (args.length === 0) {
                return await sock.sendMessage(from, { 
                    text: '❌ Usage: .qr <text>\n\nExample: .qr https://google.com' 
                });
            }
            
            const text = args.join(' ');
            
            const qrBuffer = await qrcode.toBuffer(text, {
                type: 'png',
                width: 500,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            
            await sock.sendMessage(from, {
                image: qrBuffer,
                caption: `✅ QR Code Generated!\n\n📝 Text: ${text}`
            }, { quoted: msg });
            
        } catch (error) {
            console.error('QR command error:', error);
            await sock.sendMessage(from, { 
                text: `❌ Error: ${error.message}` 
            });
        }
    }
};
