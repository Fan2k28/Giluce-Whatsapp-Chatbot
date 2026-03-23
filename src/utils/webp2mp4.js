/**
 * WebP to MP4/PNG conversion utilities
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Convert WebP animated sticker to MP4 video
 * @param {Buffer} webpBuffer - The WebP buffer
 * @returns {Promise<Buffer>} - The MP4 buffer
 */
async function webp2mp4(webpBuffer) {
    return new Promise(async (resolve, reject) => {
        const tmpDir = os.tmpdir();
        const inputPath = path.join(tmpDir, `input_${Date.now()}.webp`);
        const outputPath = path.join(tmpDir, `output_${Date.now()}.mp4`);
        
        try {
            // Write input file
            fs.writeFileSync(inputPath, webpBuffer);
            
            // FFmpeg command to convert WebP to MP4
            const ffmpegPath = process.platform === 'win32' ? 'ffmpeg' : 'ffmpeg';
            const args = [
                '-y',
                '-i', inputPath,
                '-movflags', '+faststart',
                '-vf', 'fps=12,scale=512:512:force_original_aspect_ratio=decrease',
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                '-preset', 'ultrafast',
                outputPath
            ];
            
            const ff = spawn(ffmpegPath, args);
            let errors = [];
            
            ff.stderr.on('data', (data) => {
                errors.push(data);
            });
            
            ff.on('error', (err) => {
                // Clean up
                try { fs.unlinkSync(inputPath); } catch (e) {}
                reject(err);
            });
            
            ff.on('close', (code) => {
                // Clean up input
                try { fs.unlinkSync(inputPath); } catch (e) {}
                
                if (code === 0) {
                    try {
                        const outputBuffer = fs.readFileSync(outputPath);
                        fs.unlinkSync(outputPath);
                        resolve(outputBuffer);
                    } catch (e) {
                        reject(new Error('Failed to read output file'));
                    }
                } else {
                    const errorMsg = Buffer.concat(errors).toString();
                    reject(new Error(`FFmpeg exited with code ${code}: ${errorMsg}`));
                }
            });
        } catch (err) {
            try { fs.unlinkSync(inputPath); } catch (e) {}
            reject(err);
        }
    });
}

/**
 * Convert WebP static image to PNG
 * @param {Buffer} webpBuffer - The WebP buffer
 * @returns {Promise<Buffer>} - The PNG buffer
 */
async function webp2png(webpBuffer) {
    return new Promise(async (resolve, reject) => {
        const tmpDir = os.tmpdir();
        const inputPath = path.join(tmpDir, `input_${Date.now()}.webp`);
        const outputPath = path.join(tmpDir, `output_${Date.now()}.png`);
        
        try {
            // Write input file
            fs.writeFileSync(inputPath, webpBuffer);
            
            // FFmpeg command to convert WebP to PNG
            const ffmpegPath = process.platform === 'win32' ? 'ffmpeg' : 'ffmpeg';
            const args = [
                '-y',
                '-i', inputPath,
                '-vf', 'scale=512:512:force_original_aspect_ratio=decrease',
                '-f', 'image2',
                outputPath
            ];
            
            const ff = spawn(ffmpegPath, args);
            let errors = [];
            
            ff.stderr.on('data', (data) => {
                errors.push(data);
            });
            
            ff.on('error', (err) => {
                try { fs.unlinkSync(inputPath); } catch (e) {}
                reject(err);
            });
            
            ff.on('close', (code) => {
                try { fs.unlinkSync(inputPath); } catch (e) {}
                
                if (code === 0) {
                    try {
                        const outputBuffer = fs.readFileSync(outputPath);
                        fs.unlinkSync(outputPath);
                        resolve(outputBuffer);
                    } catch (e) {
                        reject(new Error('Failed to read output file'));
                    }
                } else {
                    const errorMsg = Buffer.concat(errors).toString();
                    reject(new Error(`FFmpeg exited with code ${code}: ${errorMsg}`));
                }
            });
        } catch (err) {
            try { fs.unlinkSync(inputPath); } catch (e) {}
            reject(err);
        }
    });
}

module.exports = {
    webp2mp4,
    webp2png
};
