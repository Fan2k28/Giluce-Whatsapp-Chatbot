/**
 * Get Profile Picture Command
 * Get profile picture of a user
 */

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'getpp',
    aliases: ['gp', 'getpic', 'profilepic', 'pp'],
    category: 'general',
    description: 'Get profile picture of a user',
    usage: '.getpp (reply to message or tag user)',
    
    async execute(sock, msg, args, context) {
        const { from, sender } = context;
        
        try {
            let targetUser = null;
            
            // Check if it's a reply
            const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quotedMessage) {
                // Get the participant who sent the quoted message
                targetUser = msg.message.extendedTextMessage.contextInfo.participant;
            } else {
                // Check if user is tagged
                const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
                if (mentionedJid && mentionedJid.length > 0) {
                    targetUser = mentionedJid[0];
                } else {
                    // If no reply or tag, use the sender of current message
                    targetUser = sender;
                }
            }
            
            if (!targetUser) {
                return await sock.sendMessage(from, { 
                    text: '❌ Could not identify target user. Please reply to a message or tag a user.' 
                });
            }
            
            try {
                // Try to get the profile picture
                const ppUrl = await sock.profilePictureUrl(targetUser, 'image');
                
                if (!ppUrl) {
                    return await sock.sendMessage(from, { 
                        text: '❌ Profile picture not found for this user.' 
                    });
                }
                
                // Download the profile picture
                const response = await axios.get(ppUrl, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data);
                
                // Send the profile picture
                await sock.sendMessage(from, { 
                    image: buffer,
                    caption: `👤 Profile picture of @${targetUser.split('@')[0]}`,
                    mentions: [targetUser]
                }, { quoted: msg });
                
            } catch (profileError) {
                // Handle different types of errors
                return await sock.sendMessage(from, { 
                    text: '❌ Profile picture not found for this user.' 
                });
            }
            
        } catch (error) {
            console.error('GetPP command error:', error);
            await sock.sendMessage(from, { 
                text: '❌ Profile picture not found for this user.' 
            });
        }
    }
};
