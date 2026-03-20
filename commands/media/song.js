/**
 * Song Downloader - Download audio from YouTube
 */

const yts = require('yt-search');
const APIs = require('../../src/utils/api');
const config = require('../../config');

module.exports = {
    name: 'song',
    aliases: ['play', 'music', 'yta'],
    category: 'media',
    description: 'Download audio from YouTube',
    usage: '.song <song name or YouTube link>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const text = args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(from, { 
                text: 'Usage: .song <song name or YouTube link>' 
            }, { quoted: msg });
        }
        
        let video;
        
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
            video = { url: text, title: 'YouTube Video' };
        } else {
            const search = await yts(text);
            if (!search || !search.videos.length) {
                return await sock.sendMessage(from, { 
                    text: 'No results found.' 
                }, { quoted: msg });
            }
            video = search.videos[0];
        }
        
        // Send thumbnail
        await sock.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎵 Downloading: *${video.title}*\n⏱ Duration: ${video.timestamp}`
        }, { quoted: msg });
        
        // Try APIs to download
        let audioData = null;
        
        // Try each API
        try {
            audioData = await APIs.getEliteProTechDownloadByUrl(video.url);
        } catch (e1) {
            try {
                audioData = await APIs.getYupraDownloadByUrl(video.url);
            } catch (e2) {
                try {
                    audioData = await APIs.getOkatsuDownloadByUrl(video.url);
                } catch (e3) {
                    console.error('All song APIs failed:', e1.message, e2.message, e3.message);
                }
            }
        }
        
        if (!audioData || !audioData.download) {
            return await sock.sendMessage(from, { 
                text: '❌ Failed to download song. All download sources failed.' 
            }, { quoted: msg });
        }
        
        // Download the audio file
        let audioBuffer = null;
        try {
            const axios = require('axios');
            const response = await axios.get(audioData.download, {
                responseType: 'arraybuffer',
                timeout: 90000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });
            audioBuffer = Buffer.from(response.data);
        } catch (downloadError) {
            console.error('Audio download error:', downloadError.message);
            return await sock.sendMessage(from, { 
                text: '❌ Failed to download the audio file.' 
            }, { quoted: msg });
        }
        
        // Send audio
        await sock.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${(audioData.title || video.title || 'song').replace(/[^\w\s-]/g, '')}.mp3`,
            ptt: false
        }, { quoted: msg });
        
    }
};
