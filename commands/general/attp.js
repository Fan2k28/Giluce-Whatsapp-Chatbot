/**
 * ATTP - Animated Text to Picture Sticker
 * Creates an animated sticker with blinking text
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { writeExifVid } = require('../../src/utils/exif');

module.exports = {
    name: 'attp',
    aliases: ['ttp', 'texttopicture'],
    category: 'general',
    description: 'Create animated text sticker',
    usage: '.attp <text>',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        
        try {
            if (args.length === 0) {
                return await sock.sendMessage(from, { 
                    text: '❌ Please provide text!\n\nExample: .attp Hello World' 
                });
            }
            
            const text = args.join(' ');
            if (text.length > 50) {
                return await sock.sendMessage(from, { 
                    text: '❌ Text is too long! Maximum 50 characters.' 
                });
            }
            
            await sock.sendMessage(from, { 
                text: '🎨 Creating animated sticker...',
                react: { text: '🎨', key: msg.key }
            });
            
            try {
                const webpBuffer = await renderBlinkingVideoWithFfmpeg(text);
                const finalBuffer = await writeExifVid(webpBuffer, { packname: 'Giluce Bot' });
                await sock.sendMessage(from, { sticker: finalBuffer }, { quoted: msg });
            } catch (error) {
                console.error('Error generating attp sticker:', error);
                await sock.sendMessage(from, { 
                    text: '❌ Failed to generate the sticker. Make sure FFmpeg is installed.' 
                });
            }
        } catch (error) {
            console.error('ATTP command error:', error);
            await sock.sendMessage(from, { 
                text: '❌ An error occurred while creating animated sticker!' 
            });
        }
    }
};

function renderBlinkingVideoWithFfmpeg(text) {
    return new Promise((resolve, reject) => {
        const fontPath = process.platform === 'win32'
            ? 'C:/Windows/Fonts/arialbd.ttf'
            : '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';

        const escapeDrawtextText = (s) => s
            .replace(/\\/g, '\\\\')
            .replace(/:/g, '\\:')
            .replace(/,/g, '\\,')
            .replace(/'/g, "\\'")
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]')
            .replace(/%/g, '\\%');

        const safeText = escapeDrawtextText(text);
        const safeFontPath = process.platform === 'win32'
            ? fontPath.replace(/\\/g, '/').replace(':', '\\:')
            : fontPath;

        // Blink cycle length (seconds) and fast delay ~0.1s per color
        const cycle = 0.3;
        const dur = 1.8; // 6 cycles

        const drawRed = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=red:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='lt(mod(t\\,${cycle})\\,0.1)'`;
        const drawBlue = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=blue:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(mod(t\\,${cycle})\\,0.1\\,0.2)'`;
        const drawGreen = `drawtext=fontfile='${safeFontPath}':text='${safeText}':fontcolor=green:borderw=2:bordercolor=black@0.6:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:enable='gte(mod(t\\,${cycle})\\,0.2)'`;

        const filter = `${drawRed},${drawBlue},${drawGreen}`;

        const tmpDir = os.tmpdir();
        const outputPath = path.join(tmpDir, `attp_${Date.now()}.mp4`);

        const ffmpegPath = process.platform === 'win32' ? 'ffmpeg' : 'ffmpeg';
        const args = [
            '-y',
            '-f', 'lavfi',
            '-i', `color=c=black:s=512x512:d=${dur}:r=20`,
            '-vf', filter,
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart+frag_keyframe+empty_moov',
            '-t', String(dur),
            '-f', 'mp4',
            outputPath
        ];

        const ff = spawn(ffmpegPath, args);
        const chunks = [];
        const errors = [];
        
        ff.stdout.on('data', d => chunks.push(d));
        ff.stderr.on('data', e => errors.push(e));
        ff.on('error', reject);
        ff.on('close', code => {
            if (code === 0) {
                const buffer = fs.readFileSync(outputPath);
                fs.unlinkSync(outputPath);
                return resolve(buffer);
            }
            const errorMsg = errors.length > 0 ? Buffer.concat(errors).toString() : `ffmpeg exited with code ${code}`;
            // Clean up on error
            try { fs.unlinkSync(outputPath); } catch (e) {}
            reject(new Error(errorMsg));
        });
    });
}
