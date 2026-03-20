/**
 * Instagram to Sticker Cropped - Convert Instagram media to cropped square sticker
 * Uses API-based approach
 */

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'igsc',
    aliases: ['igstickercrop'],
    description: 'Convert Instagram post/reel to cropped square sticker',
    usage: '.igsc <Instagram URL>',
    category: 'media',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     args.join(' ');
        
        const urlMatch = text.match(/https?:\/\/\S+/);
        if (!urlMatch) {
            return await sock.sendMessage(from, { 
                text: `Send an Instagram post/reel link.\nUsage:\n.igsc <url>` 
            });
        }
        
        await sock.sendMessage(from, { 
            text: '📥 Downloading...',
            react: { text: '📥', key: msg.key } 
        });
        
        try {
            // Use API to download Instagram media
            const apiUrl = `https://api.nexray.web.id/downloader/ig?url=${encodeURIComponent(urlMatch[0])}`;
            
            const response = await axios.get(apiUrl, {
                timeout: 30000
            });
            
            if (!response.data || !response.data.status || !response.data.result) {
                return await sock.sendMessage(from, { 
                    text: '❌ Failed to fetch media from Instagram link.' 
                });
            }
            
            const results = response.data.result;
            
            if (!results || results.length === 0) {
                return await sock.sendMessage(from, { 
                    text: '❌ No media found at the provided link.' 
                });
            }
            
            // Process first item
            const media = results[0];
            const mediaUrl = media.url || media.videoUrl || media.imageUrl;
            
            if (!mediaUrl) {
                return await sock.sendMessage(from, { 
                    text: '❌ Could not get media URL.' 
                });
            }
            
            const isVideo = media.type === 'video' || mediaUrl.includes('.mp4');
            
            if (isVideo) {
                await sock.sendMessage(from, {
                    video: { url: mediaUrl },
                    caption: `*DOWNLOADED BY ${config.botName.toUpperCase()}*\n\n💡 Cropped sticker requires FFmpeg. Sent as video instead.`
                }, { quoted: msg });
            } else {
                await sock.sendMessage(from, {
                    image: { url: mediaUrl },
                    caption: `*DOWNLOADED BY ${config.botName.toUpperCase()}*\n\n💡 Cropped sticker conversion requires FFmpeg setup. Sent as image instead.`
                }, { quoted: msg });
            }
            
        } catch (err) {
            console.error('Error in igsc command:', err.message);
            await sock.sendMessage(from, { 
                text: '❌ Failed to process Instagram link.' 
            });
        }
    }
};
