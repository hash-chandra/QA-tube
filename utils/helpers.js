const fs = require('fs');
const path = require('path');

/**
 * Helper utilities for test automation
 */
class TestHelpers {
  /**
   * Verify that a file exists
   * @param {string} filePath - Path to the file
   * @returns {boolean} - True if file exists
   */
  static fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      console.error(`Error checking file existence: ${error.message}`);
      return false;
    }
  }

  /**
   * Ensure directory exists, create if not
   * @param {string} dirPath - Path to the directory
   */
  static ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  }

  /**
   * Get file size in bytes
   * @param {string} filePath - Path to the file
   * @returns {number} - File size in bytes
   */
  static getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      console.error(`Error getting file size: ${error.message}`);
      return 0;
    }
  }

  /**
   * Format time in seconds to MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} - Formatted time string
   */
  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Generate timestamp for unique filenames
   * @returns {string} - Timestamp string
   */
  static getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }
}

module.exports = TestHelpers;
