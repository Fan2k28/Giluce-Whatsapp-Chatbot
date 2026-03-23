/**
 * EXIF utilities for sticker creation
 */

const webp = require('node-webpmux');
const crypto = require('crypto');
const config = require('../../config');

/**
 * Write EXIF metadata to a WebP image buffer
 * @param {Buffer} imgBuffer - The WebP image buffer
 * @param {Object} metadata - Metadata object with packname, etc.
 * @returns {Promise<Buffer>} - The WebP buffer with EXIF metadata
 */
async function writeExifVid(imgBuffer, metadata = {}) {
    const img = new webp.Image();
    await img.load(imgBuffer);
    
    const json = {
        'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
        'sticker-pack-name': metadata.packname || config.packname || 'Made by',
        'emojis': metadata.emojis || ['🤖']
    };
    
    const exifAttr = Buffer.from([
        0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
    ]);
    
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    
    img.exif = exif;
    return await img.save(null);
}

/**
 * Write EXIF metadata to a static WebP image
 * @param {Buffer} webpBuffer - The WebP image buffer
 * @param {Object} metadata - Metadata object with packname, etc.
 * @returns {Promise<Buffer>} - The WebP buffer with EXIF metadata
 */
async function writeExif(webpBuffer, metadata = {}) {
    const img = new webp.Image();
    await img.load(webpBuffer);
    
    const json = {
        'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
        'sticker-pack-name': metadata.packname || config.packname || 'Made by',
        'emojis': metadata.emojis || ['🤖']
    };
    
    const exifAttr = Buffer.from([
        0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
    ]);
    
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    
    img.exif = exif;
    return await img.save(null);
}

module.exports = {
    writeExifVid,
    writeExif
};
