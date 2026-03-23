/**
 * TTS - Text to Speech Command
 */

const APIs = require('../../src/utils/api');

module.exports = {
    name: 'tts',
    aliases: ['speak', 'say', 'synthesize'],
    category: 'general',
    description: 'Convert text to speech using TTS',
    usage: '.tts <text>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            const text = args.join(' ');

            if (!text) {
                return await sock.sendMessage(from, { 
                    text: 'Please provide text to convert to speech.\nExample: .tts hi how are you' 
                });
            }

            await sock.sendMessage(from, { 
                text: '🔊 Generating speech...',
                react: { text: '🔊', key: msg.key }
            });

            const audioBuffer = await APIs.textToSpeech(text);

            if (!audioBuffer || audioBuffer.length === 0) {
                throw new Error('Failed to generate audio');
            }

            await sock.sendMessage(from, {
                audio: audioBuffer,
                mimetype: 'audio/mp3',
                ptt: true // Play as voice message
            }, { quoted: msg });

        } catch (error) {
            console.error('TTS command error:', error);
            await sock.sendMessage(from, { 
                text: `❌ Failed to generate speech: ${error.message}` 
            });
        }
    }
};
