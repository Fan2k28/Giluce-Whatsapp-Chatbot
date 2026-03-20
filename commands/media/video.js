/**
 * Video Downloader - Download video from YouTube
 */

const yts = require('yt-search');
const APIs = require('../../src/utils/api');
const config = require('../../config');

module.exports = {
    name: 'video',
    aliases: ['ytv', 'ytmp4', 'ytvid', 'ytvideo'],
    category: 'media',
    description: 'Download video from YouTube',
    usage: '.video <video name or URL>',

    async execute(sock, msg, args, context) {
        const { from } = context;
        
        const text = args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(from, {
                text: 'What video do you want to download?'
            }, { quoted: msg });
        }
        
        let videoUrl = '';
        let videoTitle = '';
        let videoThumbnail = '';
        
        if (text.startsWith('http://') || text.startsWith('https://')) {
            videoUrl = text;
        } else {
            // Search YouTube for the video
            const search = await yts(text);
            if (!search || search.videos.length === 0) {
                return await sock.sendMessage(from, {
                    text: 'No videos found!'
                }, { quoted: msg });
            }
            videoUrl = search.videos[0].url;
            videoTitle = search.videos[0].title;
            videoThumbnail = search.videos[0].thumbnail;
        }
        
        // Send thumbnail immediately
        try {
            const ytId = (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
            const thumb = videoThumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : undefined);
            const captionTitle = videoTitle || text;
            if (thumb) {
                await sock.sendMessage(from, {
                    image: { url: thumb },
                    caption: `*${captionTitle}*\nDownloading...`
                }, { quoted: msg });
            }
        } catch (e) {
            console.error('[VIDEO] thumb error:', e?.message || e);
        }
        
        // Validate YouTube URL
        const urls = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) {
            return await sock.sendMessage(from, {
                text: 'This is not a valid YouTube link!'
            }, { quoted: msg });
        }
        
        // Try to get video
        let videoData = null;
        try {
            videoData = await APIs.getEliteProTechVideoByUrl(videoUrl);
        } catch (e1) {
            try {
                videoData = await APIs.getYupraVideoByUrl(videoUrl);
            } catch (e2) {
                try {
                    videoData = await APIs.getOkatsuVideoByUrl(videoUrl);
                } catch (e3) {
                    console.error('All video APIs failed:', e1.message, e2.message, e3.message);
                }
            }
        }
        
        if (!videoData || !videoData.download) {
            return await sock.sendMessage(from, {
                text: '❌ Failed to get video download URL. Please try again.'
            }, { quoted: msg });
        }
        
        // Send video directly using the download URL
        await sock.sendMessage(from, {
            video: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `${(videoData.title || videoTitle || 'video').replace(/[^\w\s-]/g, '')}.mp4`,
            caption: `*${videoData.title || videoTitle || 'Video'}*\n\n> *_Downloaded by ${config.botName}_*`
        }, { quoted: msg });
    }
};
