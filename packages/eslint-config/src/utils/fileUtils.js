/* eslint-disable no-console */
/**
 * @file File is used to store utils regarding files.
 */
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the config directory.
 * @param {string} file - The file to get the directory from.
 * @returns {string} The config directory.
 * @example
 * const dirname = getConfigDir();
 */
function getDirname(file = null) {
  if (file) {
    try {
      // Check if it's a file URL (starts with 'file://' or contains 'import.meta.url')
      if (file.startsWith('file://')) {
        return path.dirname(fileURLToPath(file));
      }
      // If it's a regular file path
      return path.dirname(file);
    } catch (error) {
      // If URL parsing fails, try as regular path
      console.error('getting error ->', error);
      return path.dirname(file);
    }
  }
  if (typeof __dirname !== 'undefined') {
    // CommonJS environment
    return __dirname;
  }
  try {
    // ESM environment
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (error) {
    console.error('getting error ->', error);
    return process.cwd();
  }
}

export { getDirname };
