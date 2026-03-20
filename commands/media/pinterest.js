/**
 * Pinterest Downloader - Download images/videos from Pinterest
 */

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'pinterest',
    aliases: ['pin', 'pindl', 'pinterestdl'],
    category: 'media',
    description: 'Download images/videos from Pinterest',
    usage: '.pinterest <Pinterest URL>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const text = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text ||
                     args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(from, { 
                text: '📌 *Pinterest Downloader*\n\nDownload images or videos from Pinterest.\n\nUsage: .pinterest <Pinterest URL>\n\nExample:\n.pinterest https://in.pinterest.com/pin/1109363320773690068/'
            });
        }
        
        // Extract URL from text - match Pinterest pin URLs
        let urlMatch = text.match(/https?:\/\/[^\s]*pinterest[^\s]*\/pin\/[^\s]+/i);
        
        // Also match pin.it shortened URLs
        if (!urlMatch) {
            urlMatch = text.match(/https?:\/\/pin\.it\/[^\s]+/i);
        }
        
        if (!urlMatch) {
            return await sock.sendMessage(from, { 
                text: '❌ Please provide a valid Pinterest pin URL!\n\nExamples:\n• https://in.pinterest.com/pin/1109363320773690068/\n• https://pin.it/dddddd' 
            });
        }
        
        const pinterestUrl = urlMatch[0];
        
        await sock.sendMessage(from, { 
            text: '📥 Downloading from Pinterest...',
            react: { text: '📥', key: msg.key }
        });
        
        try {
            // Call Pinterest API
            const apiUrl = `https://api.nexray.web.id/downloader/pinterest?url=${encodeURIComponent(pinterestUrl)}`;
            
            const response = await axios.get(apiUrl, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.data || !response.data.status || !response.data.result) {
                return await sock.sendMessage(from, { 
                    text: '❌ Invalid response from API. The pin might not exist or be private.' 
                });
            }
            
            const pinData = response.data.result;
            
            // Check for both image and video fields
            const isVideo = !!pinData.video;
            const imageUrl = pinData.video || pinData.image || pinData.url;
            const title = pinData.title || 'Pinterest Pin';
            
            if (!imageUrl) {
                console.error('Pinterest API response structure:', JSON.stringify(pinData, null, 2));
                return await sock.sendMessage(from, { 
                    text: '❌ No media URL found in API response. The pin might be a video or have a different format.' 
                });
            }
            
            // Build caption
            let caption = `📌 *${title}*\n\n*Downloaded by ${config.botName}*`;
            
            // Send media
            if (isVideo) {
                // Download video as buffer
                try {
                    const videoResponse = await axios.get(imageUrl, {
                        responseType: 'arraybuffer',
                        timeout: 120000,
                        maxContentLength: 100 * 1024 * 1024,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'video/mp4,video/*,*/*',
                            'Referer': 'https://www.pinterest.com/'
                        }
                    });
                    
                    const videoBuffer = Buffer.from(videoResponse.data);
                    
                    await sock.sendMessage(from, {
                        video: videoBuffer,
                        caption: caption
                    }, { quoted: msg });
                } catch (videoError) {
                    console.error('Video download/send error:', videoError.message);
                    return await sock.sendMessage(from, { 
                        text: '❌ Failed to download or send video. The video might be expired or require authentication.' 
                    });
                }
            } else {
                await sock.sendMessage(from, {
                    image: { url: imageUrl },
                    caption: caption
                }, { quoted: msg });
            }
            
        } catch (error) {
            console.error('Error in pinterest command:', error);
            return await sock.sendMessage(from, { 
                text: `❌ Error: ${error.message || 'Unknown error occurred'}` 
            });
        }
    },
};
