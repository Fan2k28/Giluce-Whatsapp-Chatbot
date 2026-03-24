/**
 * Video to WebP Converter
 * Converts video to animated WebP format
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Convert MP4 video to animated WebP
 * @param {Buffer} videoBuffer - The MP4 video buffer
 * @returns {Promise<Buffer>} - The WebP buffer
 */
function videoToWebp(videoBuffer) {
    return new Promise((resolve, reject) => {
        const tmpDir = os.tmpdir();
        const inputPath = path.join(tmpDir, `input_${Date.now()}.mp4`);
        const outputPath = path.join(tmpDir, `output_${Date.now()}.webp`);

        // Write input buffer to temporary file
        fs.writeFileSync(inputPath, videoBuffer);

        const ffmpegArgs = [
            '-i', inputPath,
            '-vf', 'fps=15,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,setsar=1',
            '-c:v', 'libwebp',
            '-quality', '90',
            '-loop', '0',
            '-preset', 'default',
            '-an',
            '-vsync', '0',
            outputPath
        ];

        const ffmpeg = spawn('ffmpeg', ffmpegArgs);

        const errors = [];
        ffmpeg.stderr.on('data', (data) => {
            errors.push(data.toString());
        });

        ffmpeg.on('error', (err) => {
            // Clean up temp files
            try { fs.unlinkSync(inputPath); } catch (e) {}
            try { fs.unlinkSync(outputPath); } catch (e) {}
            reject(new Error(`FFmpeg process error: ${err.message}`));
        });

        ffmpeg.on('close', (code) => {
            // Clean up input file
            try { fs.unlinkSync(inputPath); } catch (e) {}

            if (code === 0) {
                try {
                    const webpBuffer = fs.readFileSync(outputPath);
                    // Clean up output file
                    try { fs.unlinkSync(outputPath); } catch (e) {}
                    resolve(webpBuffer);
                } catch (err) {
                    reject(new Error(`Failed to read output file: ${err.message}`));
                }
            } else {
                // Clean up output file in case of error
                try { fs.unlinkSync(outputPath); } catch (e) {}
                const errorMsg = errors.length > 0 ? errors.join('\n') : `FFmpeg exited with code ${code}`;
                reject(new Error(`FFmpeg conversion failed: ${errorMsg}`));
            }
        });
    });
}

module.exports = { videoToWebp };
