/**
 * Lyrics Finder - Get lyrics of a song
 */

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'lyrics',
    aliases: ['lyric', 'lirik'],
    category: 'media',
    description: 'Get lyrics of a song',
    usage: '.lyrics <song name>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { 
                text: `❌ Please provide a song name!\n\nExample: .lyrics Eminem - Lose Yourself` 
            });
        }
        
        const query = args.join(' ');
        
        let lyricsData = null;
        
        // API 1: Vreden
        try {
            const response = await axios.get(`https://api.vreden.my.id/api/lyrics?query=${encodeURIComponent(query)}`);
            if (response.data && response.data.result) {
                lyricsData = {
                    title: response.data.result.title,
                    artist: response.data.result.artist,
                    lyrics: response.data.result.lyrics,
                    thumbnail: response.data.result.thumbnail
                };
            }
        } catch (err) {
            console.log('Vreden API failed, trying next...');
        }
        
        // API 2: Siputzx (fallback)
        if (!lyricsData) {
            try {
                const response = await axios.get(`https://api.siputzx.my.id/api/s/lyrics?query=${encodeURIComponent(query)}`);
                if (response.data && response.data.status && response.data.data) {
                    lyricsData = {
                        title: response.data.data.title,
                        artist: response.data.data.artist,
                        lyrics: response.data.data.lyrics,
                        thumbnail: response.data.data.image
                    };
                }
            } catch (err) {
                console.log('Siputzx API failed');
            }
        }
        
        // API 3: Lyrics.ovh (free API - fallback)
        if (!lyricsData) {
            try {
                // First, search for the song to get artist and title
                const searchQuery = query.replace(/\s+/g, ' ').trim();
                const searchParts = searchQuery.split(' - ');
                
                if (searchParts.length >= 2) {
                    // Format: "Artist - Title"
                    const artist = searchParts[0].trim();
                    const title = searchParts.slice(1).join(' ').trim();
                    
                    const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
                    if (response.data && response.data.lyrics) {
                        lyricsData = {
                            title: title,
                            artist: artist,
                            lyrics: response.data.lyrics,
                            thumbnail: null
                        };
                    }
                } else {
                    // Try common patterns - if user just type song name, we need to guess
                    // Try finding artist/title from different formats
                    // Try just direct query (less accurate)
                    const tryQueries = [
                        searchQuery,
                        searchQuery + ' lyrics'
                    ];
                    
                    for (const q of tryQueries) {
                        // We need both artist and title, so this is harder
                        // Try some common patterns
                        const parts = q.split(' ');
                        if (parts.length >= 2) {
                            // Try first word as artist, rest as title
                            const artist = parts.slice(0, 2).join(' ');
                            const title = parts.slice(2).join(' ');
                            if (title) {
                                const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
                                if (response.data && response.data.lyrics) {
                                    lyricsData = {
                                        title: title,
                                        artist: artist,
                                        lyrics: response.data.lyrics,
                                        thumbnail: null
                                    };
                                    break;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.log('Lyrics.ovh API failed:', err.message);
            }
        }
        
        // API 4: Genius-Lyrics (free API - fallback)
        if (!lyricsData) {
            try {
                const searchQuery = query.replace(/\s+/g, ' ').trim();
                
                // Try to search via search APIs then get lyrics
                const parts = searchQuery.split(/[-–—]/);
                if (parts.length >= 2) {
                    const artist = parts[0].trim();
                    const title = parts.slice(1).join('-').trim();
                    
                    // Try multiple title formats (clean parentheses and brackets)
                    const titleVariants = [
                        title,
                        title.replace(/\([^)]*\)/g, '').trim(),
                        title.replace(/\[[^\]]*\]/g, '').trim(),
                        title.replace(/\(.*\)|\[.*\]/g, '').trim()
                    ];
                    
                    for (const t of titleVariants) {
                        if (t && t.length > 2) {
                            // Try first with Lyrics.ovh (which sources from Genius)
                            const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(t)}`);
                            if (response.data && response.data.lyrics) {
                                lyricsData = {
                                    title: t,
                                    artist: artist,
                                    lyrics: response.data.lyrics,
                                    thumbnail: null
                                };
                                break;
                            }
                        }
                    }
                }
            } catch (err) {
                console.log('Genius-Lyrics API failed:', err.message);
            }
        }
        
        if (!lyricsData) {
            return await sock.sendMessage(from, { 
                text: '❌ Could not find lyrics for this song!' 
            });
        }
        
        // Format lyrics (limit to prevent message too long)
        let lyrics = lyricsData.lyrics;
        if (lyrics.length > 4000) {
            lyrics = lyrics.substring(0, 4000) + '...\n\n_Lyrics too long, showing first part only_';
        }
        
        const caption = `🎵 *${lyricsData.title}*\n` +
                       `👤 *Artist:* ${lyricsData.artist}\n\n` +
                       `📝 *Lyrics:*\n${lyrics}\n\n` +
                       `_Fetched by ${config.botName}_`;
        
        if (lyricsData.thumbnail) {
            await sock.sendMessage(from, {
                image: { url: lyricsData.thumbnail },
                caption: caption
            });
        } else {
            await sock.sendMessage(from, { text: caption });
        }
    }
};
