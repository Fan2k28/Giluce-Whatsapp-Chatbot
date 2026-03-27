/**
 * TikTok Downloader - Download TikTok videos
 * Uses the same APIs as KnightBot-Mini
 */

const axios = require('axios');
const APIs = require('../../src/utils/api');
const config = require('../../config');

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

module.exports = {
    name: 'tiktok',
    aliases: ['tt', 'ttdl', 'tiktokdl'],
    category: 'media',
    description: 'Download TikTok videos',
    usage: '.tiktok <TikTok URL>',
    //test
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        // Check if message has already been processed
        if (processedMessages.has(msg.key.id)) {
            return;
        }
        
        // Add message ID to processed set
        processedMessages.add(msg.key.id);
        
        // Clean up old message IDs after 5 minutes
        setTimeout(() => {
            processedMessages.delete(msg.key.id);
        }, 5 * 60 * 1000);
        
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text ||
                     args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(from, { 
                text: 'Please provide a TikTok link for the video.' 
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
            react: { text: '🔄', key: msg.key }
        });
        
        try {
            let videoUrl = null;
            let title = null;
            
            // Try Siputzx API first (from src/utils/api.js)
            try {
                const result = await APIs.getTikTokDownload(url);
                videoUrl = result.videoUrl;
                title = result.title;
            } catch (apiError) {
                console.error(`Siputzx API failed: ${apiError.message}`);
            }
            
            // Send the video if we got a URL
            if (videoUrl) {
                try {
                    // Download video as buffer
                    const videoResponse = await axios.get(videoUrl, {
                        responseType: 'arraybuffer',
                        timeout: 60000,
                        maxContentLength: 100 * 1024 * 1024,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'video/mp4,video/*,*/*;q=0.9',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Referer': 'https://www.tiktok.com/'
                        }
                    });
                    
                    const videoBuffer = Buffer.from(videoResponse.data);
                    
                    if (videoBuffer.length === 0) {
                        throw new Error('Video buffer is empty');
                    }
                    
                    const botName = config.botName.toUpperCase();
                    const caption = title ? `*DOWNLOADED BY ${botName}*\n\n📝 Title: ${title}` : `*DOWNLOADED BY ${botName}*`;
                    
                    await sock.sendMessage(from, {
                        video: videoBuffer,
                        mimetype: 'video/mp4',
                        caption: caption
                    }, { quoted: msg });
                    
                    return;
                } catch (downloadError) {
                    console.error(`Failed to download video: ${downloadError.message}`);
                    // Fallback to URL method
                    try {
                        const botName = config.botName.toUpperCase();
                        const caption = title ? `*DOWNLOADED BY ${botName}*\n\n📝 Title: ${title}` : `*DOWNLOADED BY ${botName}*`;
                        
                        await sock.sendMessage(from, {
                            video: { url: videoUrl },
                            mimetype: 'video/mp4',
                            caption: caption
                        }, { quoted: msg });
                        return;
                    } catch (urlError) {
                        console.error(`URL method also failed: ${urlError.message}`);
                    }
                }
            }
            
            // If we reach here, no method worked
            return await sock.sendMessage(from, { 
                text: '❌ Failed to download TikTok video. All download methods failed. Please try again with a different link.' 
            });
            
        } catch (error) {
            console.error('Error in TikTok download:', error);
            await sock.sendMessage(from, { 
                text: 'Failed to download the TikTok video. Please try again with a different link.' 
            });
        }
    }
};
