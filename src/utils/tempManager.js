/**
 * Temp Manager - Handle temporary files for bot operations
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get temp directory
function getTempDir() {
  const tempDir = path.join(os.tmpdir(), 'knightbot');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  return tempDir;
}

// Delete temp file safely
function deleteTempFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting temp file:', error);
  }
}

// Clean old temp files
function cleanTempDir(maxAgeMs = 3600000) {
  try {
    const tempDir = getTempDir();
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        // Ignore errors for individual files
      }
    });
  } catch (error) {
    console.error('Error cleaning temp directory:', error);
  }
}

module.exports = {
  getTempDir,
  deleteTempFile,
  cleanTempDir
};