/**
 * ViewOnce Private Command - Reveal view-once messages to private chat
 */

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'vvp',
    aliases: ['readvo-private', 'read-private', 'vvp', 'vo-private', 'vp'],
    category: 'general',
    description: 'Save view-once messages to your private chat',
    usage: '.vvp (reply to view-once message)',
    
    async execute(sock, msg, args, context) {
        const { from, sender } = context;
        
        try {
            const chatId = msg.key.remoteJid;
            
            // Use context.sender as the user's JID (properly normalized)
            const userJid = sender;
            // Try to get contextInfo from different message types
            const ctx = msg.message?.extendedTextMessage?.contextInfo
                || msg.message?.imageMessage?.contextInfo
                || msg.message?.videoMessage?.contextInfo
                || msg.message?.buttonsResponseMessage?.contextInfo
                || msg.message?.listResponseMessage?.contextInfo;

            if (!ctx?.quotedMessage || !ctx?.stanzaId) {
                return await sock.sendMessage(
                    chatId,
                    { text: '🗑️ Reply to a *view-once* message to reveal it.' },
                    { quoted: msg }
                );
            }

            const quotedMsg = ctx.quotedMessage;

            // Check various patterns used for view-once messages
            const hasViewOnce =
                !!quotedMsg.viewOnceMessageV2 ||
                !!quotedMsg.viewOnceMessageV2Extension ||
                !!quotedMsg.viewOnceMessage ||
                !!quotedMsg.viewOnce ||
                !!quotedMsg?.imageMessage?.viewOnce ||
                !!quotedMsg?.videoMessage?.viewOnce ||
                !!quotedMsg?.audioMessage?.viewOnce;

            if (!hasViewOnce) {
                return await sock.sendMessage(
                    chatId,
                    { text: '❌ This is not a view-once message!' },
                    { quoted: msg }
                );
            }

            let actualMsg = null;
            let mtype = null;

            // Newer Baileys: viewOnceMessageV2Extension
            if (quotedMsg.viewOnceMessageV2Extension?.message) {
                actualMsg = quotedMsg.viewOnceMessageV2Extension.message;
                mtype = Object.keys(actualMsg)[0];
            } else if (quotedMsg.viewOnceMessageV2?.message) {
                // Classic Baileys: viewOnceMessageV2
                actualMsg = quotedMsg.viewOnceMessageV2.message;
                mtype = Object.keys(actualMsg)[0];
            } else if (quotedMsg.viewOnceMessage?.message) {
                // Older: viewOnceMessage
                actualMsg = quotedMsg.viewOnceMessage.message;
                mtype = Object.keys(actualMsg)[0];
            } else if (quotedMsg.imageMessage?.viewOnce) {
                // Direct message with viewOnce flag on media
                actualMsg = { imageMessage: quotedMsg.imageMessage };
                mtype = 'imageMessage';
            } else if (quotedMsg.videoMessage?.viewOnce) {
                actualMsg = { videoMessage: quotedMsg.videoMessage };
                mtype = 'videoMessage';
            } else if (quotedMsg.audioMessage?.viewOnce) {
                actualMsg = { audioMessage: quotedMsg.audioMessage };
                mtype = 'audioMessage';
            }

            if (!actualMsg || !mtype) {
                return await sock.sendMessage(
                    chatId,
                    { text: '❌ Unsupported view-once message type.' },
                    { quoted: msg }
                );
            }

            const downloadType =
                mtype === 'imageMessage'
                    ? 'image'
                    : mtype === 'videoMessage'
                    ? 'video'
                    : 'audio';

            const mediaStream = await downloadContentFromMessage(
                actualMsg[mtype],
                downloadType
            );

            let buffer = Buffer.from([]);
            for await (const chunk of mediaStream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            const caption = actualMsg[mtype]?.caption || '';

            // Send to private chat
            if (/video/.test(mtype)) {
                await sock.sendMessage(
                    userJid,
                    {
                        video: buffer,
                        caption: `📹 View-once video from ${chatId}\n\n${caption}`,
                        mimetype: 'video/mp4'
                    }
                );
            } else if (/image/.test(mtype)) {
                await sock.sendMessage(
                    userJid,
                    {
                        image: buffer,
                        caption: `🖼️ View-once image from ${chatId}\n\n${caption}`,
                        mimetype: 'image/jpeg'
                    }
                );
            } else if (/audio/.test(mtype)) {
                await sock.sendMessage(
                    userJid,
                    {
                        audio: buffer,
                        ptt: true,
                        mimetype: 'audio/ogg; codecs=opus'
                    }
                );
            }
            
            // Notify in original chat that it's been sent to private
            await sock.sendMessage(
                chatId,
                { 
                    text: '✅' 
                },
                { quoted: msg }
            );
            
        } catch (error) {
            console.error('Error in viewonce-private command:', error);
            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: '❌ Error processing view-once message: ' + (error.message || 'Unknown error')
                },
                { quoted: msg }
            );
        }
    }
};