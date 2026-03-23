/**
 * Set Bot Profile Picture Command - Set bot profile picture from image or sticker
 */

const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Max file size: 10MB for profile pictures
const MAX_FILE_SIZE = 10 * 1024 * 1024;

module.exports = {
    name: 'setbotpp',
    aliases: ['setppbot', 'setpp'],
    category: 'owner',
    description: 'Set bot profile picture from image or sticker',
    usage: '.setbotpp (reply to image or sticker)',
    ownerOnly: true,

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            // Check if message is a reply
            const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quotedMessage) {
                return sock.sendMessage(from, { text: '⚠️ Please reply to an image or sticker with the .setbotpp command!' });
            }

            // Check if quoted message contains an image or sticker
            const imageMessage = quotedMessage.imageMessage;
            const stickerMessage = quotedMessage.stickerMessage;
            
            if (!imageMessage && !stickerMessage) {
                return sock.sendMessage(from, { text: '❌ The replied message must contain an image or sticker!' });
            }
            
            // Use whichever message type is available
            const mediaMessage = imageMessage || stickerMessage;

            const tmpDir = path.join(process.cwd(), 'tmp');
            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir, { recursive: true });
            }
            const imagePath = path.join(tmpDir, `profile_${Date.now()}.jpg`);
            
            try {
                // Download the media (image or sticker)
                const stream = await downloadContentFromMessage(mediaMessage, 'image');
                let buffer = Buffer.from([]);
                
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                // Check file size
                if (buffer.length > MAX_FILE_SIZE) {
                    return sock.sendMessage(from, { text: `❌ File too large: ${(buffer.length / 1024 / 1024).toFixed(2)}MB (max: ${MAX_FILE_SIZE / 1024 / 1024}MB)` });
                }
                
                // Save the image
                fs.writeFileSync(imagePath, buffer);

                // Set the profile picture
                await sock.updateProfilePicture(sock.user.id.split(':')[0] + '@s.whatsapp.net', { url: imagePath });

                await sock.sendMessage(from, { text: '✅ Successfully updated bot profile picture!' });
            } catch (error) {
                console.error('setbotpp error:', error);
                sock.sendMessage(from, { text: '❌ Failed to update profile picture!' });
            } finally {
                // Always cleanup temp file
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (e) {
                    console.warn('Could not delete temp file:', e);
                }
            }
        } catch (error) {
            console.error('setbotpp error:', error);
            sock.sendMessage(from, { text: '❌ Failed to update profile picture!' });
        }
    }
};
