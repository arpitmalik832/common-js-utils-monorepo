/**
 * This file contains the paths for the project.
 * @file This file is saved as `paths.js`.
 */
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { errorLog } from './logsUtils.js';

/**
 * Get the paths for the project.
 * @param {string} projectRoot - The root directory of the project.
 * @returns {{
 * entryPath: string,
 * outputPath: string,
 * typesPath: string,
 * stylesOutputPath: string,
 * typographyMixinPath: string,
 * iconsPath: string,
 * iconsListPath: string,
 * }} The paths for the project.
 * @example
 * const paths = getPaths(projectRoot);
 * console.log(paths);
 */
function getPaths(projectRoot) {
  const entryPath = path.join(projectRoot, 'src', 'index.js');
  const outputPath = path.join(projectRoot, 'dist');
  const typesPath = path.join(projectRoot, 'types');
  const stylesOutputPath = path.join(outputPath, 'index.css');
  const typographyMixinPath = path.join(
    projectRoot,
    'dist',
    'styles',
    'mixins',
    'typography.scss',
  );
  const iconsPath = path.join(projectRoot, 'src', 'assets', 'icons');
  const iconsListPath = path.join(
    projectRoot,
    'static',
    'enums',
    'icons_list.mjs',
  );

  return {
    entryPath,
    outputPath,
    typesPath,
    stylesOutputPath,
    typographyMixinPath,
    iconsPath,
    iconsListPath,
  };
}

/**
 * Generate a filename for the size report.
 * @param {string} dirPath - The directory path to save the file.
 * @param {string} namePrefix - The prefix of the filename.
 * @param {string} extension - The extension of the file to generate.
 * @returns {string} The filename for the size report.
 * @example
 * const filename = generateFileName();
 */
function generateFileName(dirPath, namePrefix, extension) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timestamp = `${year}${month}${day}-${hours}${minutes}`;

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  return `${dirPath}/${namePrefix}-${timestamp}.${extension}`;
}

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
      errorLog('getting error ->', error);
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
    errorLog('getting error ->', error);
    return process.cwd();
  }
}

export { getPaths, generateFileName, getDirname };
