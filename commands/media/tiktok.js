/**
 * TikTok Downloader - Download TikTok videos
 * Uses API-based approach
 */

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'tiktok',
    aliases: ['tt', 'ttdl', 'tiktokdl'],
    category: 'media',
    description: 'Download TikTok videos',
    usage: '.tiktok <TikTok URL>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text ||
                     args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(from, { 
                text: 'Please provide a TikTok link for the video.\n\nUsage: .tiktok <TikTok URL>' 
            });
        }
        
        // Extract URL from command
        const url = text.split(' ').slice(1).join(' ').trim();
        
        if (!url) {
            return await sock.sendMessage(from, { 
                text: 'Please provide a TikTok link for the video.' 
            });
        }
        
        // Check for various TikTok URL formats
        const tiktokPatterns = [
            /https?:\/\/(?:www\.)?tiktok\.com\//,
            /https?:\/\/(?:vm\.)?tiktok\.com\//,
            /https?:\/\/(?:vt\.)?tiktok\.com\//,
            /https?:\/\/(?:www\.)?tiktok\.com\/@/,
            /https?:\/\/(?:www\.)?tiktok\.com\/t\//
        ];
        
        const isValidUrl = tiktokPatterns.some(pattern => pattern.test(url));
        
        if (!isValidUrl) {
            return await sock.sendMessage(from, { 
                text: 'That is not a valid TikTok link. Please provide a valid TikTok video link.' 
            });
        }
        
        await sock.sendMessage(from, { 
            text: '🔄 Downloading TikTok video...',
            react: { text: '🔄', key: msg.key }
        });
        
        try {
            // Use API to download TikTok
            const apiUrl = `https://api.nexray.web.id/downloader/tiktok?url=${encodeURIComponent(url)}`;
            
            const response = await axios.get(apiUrl, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.data || !response.data.status || !response.data.result) {
                throw new Error('Invalid API response');
            }
            
            const result = response.data.result;
            let videoUrl = result.videoUrl || result.url || result.download;
            
            // Try alternative formats
            if (!videoUrl) {
                if (result.hd || result.sd) {
                    videoUrl = result.hd || result.sd;
                } else if (result.media && result.media.length > 0) {
                    videoUrl = result.media[0].url;
                }
            }
            
            if (!videoUrl) {
                return await sock.sendMessage(from, { 
                    text: '❌ No video found at the provided TikTok link.' 
                });
            }
            
            // Build caption
            const botName = config.botName.toUpperCase();
            let caption = `*DOWNLOADED BY ${botName}*`;
            
            if (result.title) {
                caption = `*${result.title}*\n\n${caption}`;
            }
            
            // Send video
            try {
                await sock.sendMessage(from, {
                    video: { url: videoUrl },
                    mimetype: 'video/mp4',
                    caption: caption
                }, { quoted: msg });
            } catch (sendError) {
                // Try downloading as buffer if URL method fails
                const videoResponse = await axios.get(videoUrl, {
                    responseType: 'arraybuffer',
                    timeout: 120000,
                    maxContentLength: 100 * 1024 * 1024
                });
                
                const videoBuffer = Buffer.from(videoResponse.data);
                await sock.sendMessage(from, {
                    video: videoBuffer,
                    mimetype: 'video/mp4',
                    caption: caption
                }, { quoted: msg });
            }
            
        } catch (error) {
            console.error('Error in TikTok download:', error.message);
            await sock.sendMessage(from, { 
                text: `Failed to download the TikTok video: ${error.message}` 
            });
        }
    }
};
