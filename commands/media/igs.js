/**
 * Instagram to Sticker - Convert Instagram media to sticker
 * Uses the same APIs as KnightBot-Mini
 */

const APIs = require('../../src/utils/api');
const config = require('../../config');

module.exports = {
    name: 'igs',
    aliases: ['igsticker'],
    description: 'Convert Instagram post/reel to sticker (with padding)',
    usage: '.igs <Instagram URL>',
    category: 'media',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     args.join(' ');
        
        const urlMatch = text.match(/https?:\/\/\S+/);
        if (!urlMatch) {
            return await sock.sendMessage(from, { 
                text: `Send an Instagram post/reel link.\nUsage:\n.igs <url>` 
            });
        }
        
        await sock.sendMessage(from, { 
            text: '📥 Downloading...',
            react: { text: '📥', key: msg.key } 
        });
        
        try {
            // Use Siputzx API from src/utils/api.js
            const result = await APIs.igDownload(urlMatch[0]);
            
            if (!result || !result.data || result.data.length === 0) {
                return await sock.sendMessage(from, { 
                    text: '❌ Failed to fetch media from Instagram link.' 
                });
            }
            
            const mediaData = result.data;
            
            // Process first item
            const media = mediaData[0];
            const mediaUrl = media.url || media.videoUrl || media.imageUrl;
            
            if (!mediaUrl) {
                return await sock.sendMessage(from, { 
                    text: '❌ Could not get media URL.' 
                });
            }
            
            const isVideo = media.type === 'video' || mediaUrl.includes('.mp4');
            
            // Send as image/video (sticker conversion requires FFmpeg)
            if (isVideo) {
                await sock.sendMessage(from, {
                    video: { url: mediaUrl },
                    caption: `*DOWNLOADED BY ${config.botName.toUpperCase()}*\n\n💡 Video sent as video.`
                }, { quoted: msg });
            } else {
                await sock.sendMessage(from, {
                    image: { url: mediaUrl },
                    caption: `*DOWNLOADED BY ${config.botName.toUpperCase()}*\n\n💡 Image sent as image.`
                }, { quoted: msg });
            }
            
        } catch (err) {
            console.error('Error in igs command:', err.message);
            await sock.sendMessage(from, { 
                text: '❌ Failed to process Instagram link.' 
            });
        }
    }
};
