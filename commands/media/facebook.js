/**
 * Facebook Downloader - Download Facebook videos
 * Uses the same APIs as KnightBot-Mini
 */

const axios = require('axios');
const APIs = require('../../src/utils/api');
const config = require('../../config');

module.exports = {
    name: 'facebook',
    aliases: ['fb', 'fbdl', 'facebookdl'],
    category: 'media',
    description: 'Download Facebook videos',
    usage: '.facebook <Facebook URL>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text ||
                     args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(from, { 
                text: 'Please provide a Facebook link for the video.\n\nUsage: .facebook <Facebook URL>' 
            });
        }
        
        // Extract URL from command
        const url = text.split(' ').slice(1).join(' ').trim();
        
        if (!url) {
            return await sock.sendMessage(from, { 
                text: 'Please provide a Facebook link for the video.' 
            });
        }
        
        // Check for various Facebook URL formats
        const facebookPatterns = [
            /https?:\/\/(?:www\.|m\.)?facebook\.com\//,
            /https?:\/\/(?:www\.|m\.)?fb\.com\//,
            /https?:\/\/fb\.watch\//,
            /https?:\/\/(?:www\.)?facebook\.com\/watch/,
            /https?:\/\/(?:www\.)?facebook\.com\/.*\/videos\//
        ];
        
        const isValidUrl = facebookPatterns.some(pattern => pattern.test(url));
        
        if (!isValidUrl) {
            return await sock.sendMessage(from, { 
                text: 'That is not a valid Facebook link. Please provide a valid Facebook video link.' 
            });
        }
        
        await sock.sendMessage(from, { 
            text: '🔄 Downloading Facebook video...',
            react: { text: '🔄', key: msg.key }
        });
        
        try {
            // Use RapidAPI Facebook Download
            const result = await APIs.fbDownloadRapid(url);
            
            if (!result || !result.videoUrl) {
                throw new Error('Could not get video URL from API');
            }
            
            // Build caption
            const botName = config.botName.toUpperCase();
            let caption = `*DOWNLOADED BY ${botName}*`;
            
            if (result.title) {
                caption = `*${result.title}*\n\n${caption}`;
            }
            
            // Try to send video
            try {
                await sock.sendMessage(from, {
                    video: { url: result.videoUrl },
                    mimetype: 'video/mp4',
                    caption: caption
                }, { quoted: msg });
            } catch (sendError) {
                // If URL fails, try downloading as buffer
                console.error('URL send failed, trying buffer:', sendError.message);
                
                const videoResponse = await axios.get(result.videoUrl, {
                    responseType: 'arraybuffer',
                    timeout: 60000,
                    maxContentLength: 100 * 1024 * 1024,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://www.facebook.com/'
                    }
                });
                
                const videoBuffer = Buffer.from(videoResponse.data);
                await sock.sendMessage(from, {
                    video: videoBuffer,
                    mimetype: 'video/mp4',
                    caption: caption
                }, { quoted: msg });
            }
            
        } catch (error) {
            console.error('Error in Facebook download:', error.message);
            await sock.sendMessage(from, { 
                text: `❌ Failed to download Facebook video.\n\nError: ${error.message}\n\nPlease try again with a different link.` 
            });
        }
    }
};
