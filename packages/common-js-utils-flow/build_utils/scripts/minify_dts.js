/* eslint-disable no-console */
/**
 * Minifies declaration files by removing comments and unnecessary whitespace.
 * @file The file is saved as `minify_dts.js`.
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the config directory.
 * @returns {string} The config directory.
 * @example
 * const dirname = getConfigDir();
 */
function getConfigDir() {
  if (typeof __dirname !== 'undefined') {
    // CommonJS environment
    return __dirname;
  }
  // ESM environment
  const filename = fileURLToPath(import.meta.url);
  return path.dirname(filename);
}

const dirname = getConfigDir();

const minifyFile = async filePath => {
  try {
    const code = await readFile(filePath, 'utf8');
    if (!code) {
      throw new Error(`File is empty or could not be read: ${filePath}`);
    }

    // Remove comments and unnecessary whitespace
    const minifiedCode = code
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
      .replace(/\s*([{};:,])\s*/g, '$1') // Remove whitespace around specific characters
      .replace(/\s+/g, ' ') // Replace multiple whitespace with a single space
      .replace(/\n/g, '') // Remove newlines
      .trim(); // Trim leading and trailing whitespace

    if (!minifiedCode) {
      throw new Error(`Minification failed for file: ${filePath}`);
    }

    await writeFile(filePath, minifiedCode, 'utf8');
  } catch (error) {
    console.error(`Error minifying file ${filePath}:`, error);
  }
};

const minifyDirectory = async dir => {
  const files = await readdir(dir, { withFileTypes: true });
  const promises = files.map(file => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      return minifyDirectory(filePath);
    }
    if (file.name.endsWith('.d.ts')) {
      return minifyFile(filePath);
    }
    return file;
  });
  await Promise.all(promises);
};

const main = async () => {
  try {
    await minifyDirectory(path.join(dirname, '../../types'));
    console.log('Declaration files minified successfully.');
  } catch (error) {
    console.error('Error minifying declaration files:', error);
  }
};

main();
