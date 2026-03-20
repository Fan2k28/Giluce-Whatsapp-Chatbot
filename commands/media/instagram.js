/**
 * Instagram Downloader - Download Instagram photos/videos/reels
 * Uses API-based approach
 */

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'instagram',
    aliases: ['ig', 'insta', 'igdl', 'reels'],
    category: 'media',
    description: 'Download Instagram photos/videos/reels',
    usage: '.instagram <Instagram URL>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text ||
                     args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(from, { 
                text: 'Please provide an Instagram link.\n\nUsage: .instagram <Instagram URL>' 
            });
        }
        
        // Check for various Instagram URL formats
        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//,
            /https?:\/\/(?:www\.)?instagram\.com\/p\//,
            /https?:\/\/(?:www\.)?instagram\.com\/reel\//,
            /https?:\/\/(?:www\.)?instagram\.com\/tv\//
        ];
        
        const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));
        
        if (!isValidUrl) {
            return await sock.sendMessage(from, { 
                text: 'That is not a valid Instagram link. Please provide a valid Instagram post, reel, or video link.' 
            });
        }
        
        await sock.sendMessage(from, { 
            text: '📥 Downloading from Instagram...',
            react: { text: '📥', key: msg.key }
        });
        
        try {
            // Use API to download Instagram media
            const apiUrl = `https://api.nexray.web.id/downloader/ig?url=${encodeURIComponent(text)}`;
            
            const response = await axios.get(apiUrl, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.data || !response.data.status || !response.data.result) {
                throw new Error('Invalid API response');
            }
            
            const results = response.data.result;
            
            if (!results || results.length === 0) {
                return await sock.sendMessage(from, { 
                    text: '❌ No media found at the provided link. The post might be private or the link is invalid.' 
                });
            }
            
            // Download each media item
            for (const media of results) {
                try {
                    const mediaUrl = media.url || media.videoUrl || media.imageUrl;
                    
                    if (!mediaUrl) continue;
                    
                    const isVideo = media.type === 'video' || mediaUrl.includes('.mp4');
                    
                    if (isVideo) {
                        await sock.sendMessage(from, {
                            video: { url: mediaUrl },
                            mimetype: 'video/mp4',
                            caption: `*DOWNLOADED BY ${config.botName.toUpperCase()}*`
                        }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, {
                            image: { url: mediaUrl },
                            caption: `*DOWNLOADED BY ${config.botName.toUpperCase()}*`
                        }, { quoted: msg });
                    }
                    
                    // Add small delay between downloads
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (mediaError) {
                    console.error(`Error downloading media:`, mediaError.message);
                }
            }
        } catch (error) {
            console.error('Error in Instagram command:', error.message);
            await sock.sendMessage(from, { 
                text: '❌ An error occurred while processing the Instagram request. Please try again.' 
            });
        }
    }
};
