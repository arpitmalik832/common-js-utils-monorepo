/* eslint-disable no-console */
/**
 * Utility functions for the build-modules scripts.
 * @file This file is saved as `scripts/utils.js`.
 */
import brotliSizePkg from 'brotli-size';
import CleanCSS from 'clean-css';
import fs from 'fs';
import path from 'path';
import { minify_sync } from 'terser';

const minifyCSS = new CleanCSS();

/**
 * Recursively get all files from directories.
 * @param {string} dir - Directory path.
 * @returns {string[]} Array of file paths.
 * @example
 * const files = getAllFiles(path.join(__dirname, './packages/common-js-utils/dist'));
 */
function getAllFiles(dir) {
  const files = [];

  /**
   * Recursively traverse the directory and get all files.
   * @param {string} currentDir - Current directory path.
   * @returns {void}
   * @example
   * traverse(path.join(__dirname, './packages/common-js-utils/dist'));
   */
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (/\.(js|css|scss|png|jpg|jpeg|gif|svg)$/i.test(item)) {
        files.push(fullPath);
      }
    });
  }

  traverse(dir);
  return files;
}

/**
 * Get the size of the files in the project build dir.
 * @param {string[]} dirs - The directories to get the size of.
 * @returns {object[]} The size of the files.
 * @example
 * const distDirs = [
 *   path.join(__dirname, './packages/common-js-utils/dist'),
 *   path.join(__dirname, './packages/common-js-utils-flow/dist'),
 *   path.join(__dirname, './test-apps/common-ts-utils/dist'),
 *   path.join(__dirname, './test-apps/common-ts-utils-flow/dist'),
 * ];
 * const sizes = getSizes(files);
 */
function getSizes(dirs) {
  console.log('Getting sizes for dirs:', JSON.stringify(dirs, null, 2));
  return dirs.map(dir => {
    console.log('Getting sizes of files in:', dir);
    const files = getAllFiles(dir);
    console.log(
      'Files found in dir:',
      dir,
      ' -> ',
      JSON.stringify(files, null, 2),
    );
    const results = files.map(file => {
      try {
        const code = fs.readFileSync(file);

        if (/\.(png|jpg|jpeg|gif|svg)$/i.test(file)) {
          return {
            file,
            size: code.length,
            minified: code.length,
            compressed: code.length,
          };
        }

        let result = '';
        if (/\.(css|scss)$/i.test(file)) {
          const rawCode = code.toString('utf8');
          result = minifyCSS.minify(rawCode).styles;
        }

        if (/\.js$/i.test(file)) {
          const rawCode = code.toString('utf8');
          result = minify_sync(rawCode).code;
        }

        const size = Buffer.byteLength(code, 'utf8');
        const minified = Buffer.byteLength(result, 'utf8');
        const compressed = brotliSizePkg.sync(result);

        return {
          file,
          size,
          minified,
          compressed,
        };
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        return {
          file,
          error: error.message,
        };
      }
    });

    const aggrResult = results.reduce(
      (acc, item) => {
        const { size, minified, compressed } = item;

        return {
          size: acc.size + size,
          minified: acc.minified + minified,
          compressed: acc.compressed + compressed,
        };
      },
      { size: 0, minified: 0, compressed: 0 },
    );

    console.log(
      'Aggregated results for dir:',
      dir,
      ' -> ',
      JSON.stringify(aggrResult, null, 2),
    );

    return {
      file: dir,
      ...aggrResult,
    };
  });
}

/**
 * Get the aggregated sizes of the files in the project build dir.
 * @param {object[]} sizes - The sizes of the files.
 * @returns {string} The aggregated sizes of the files.
 * @example
 * const aggregatedSizes = getAggregatedSizes(sizes);
 */
function getAggregatedSizes(sizes) {
  const aggregatedResults = {};
  sizes.forEach(entry => {
    const { file, size, minified, compressed } = entry;
    const fileNameArr = file.split('common-js-utils-monorepo/');
    const filename = fileNameArr[fileNameArr.length - 1];
    aggregatedResults[filename] = {
      size,
      compressed,
      minified,
    };
  });

  return JSON.stringify(aggregatedResults, null, 2);
}

/**
 * Read a JSON file and return the parsed data.
 * @param {string} filePath - The path to the JSON file.
 * @returns {object} The parsed data.
 * @example
 * const data = readJsonFile('./path/to/file.json');
 */
function readJsonFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

/**
 * Merge two benchmark results.
 * @param {object} base - The base benchmark results.
 * @param {object} patch - The patch benchmark results.
 * @returns {object} The merged results.
 * @example
 * const merged = mergeData(base, patch);
 */
function mergeData(base, patch) {
  const merged = {};

  /**
   * Add data to the merged results.
   * @param {object} data - The data to add.
   * @param {number} fileIndex - The index of the file.
   * @example
   * addToMerged(base, 1);
   * addToMerged(patch, 2);
   */
  function addToMerged(data, fileIndex) {
    Object.keys(data).forEach(key => {
      if (merged[key] == null) {
        merged[key] = {};
      }
      Object.keys(data[key]).forEach(subKey => {
        if (merged[key][subKey] == null) {
          merged[key][subKey] = {};
        }
        merged[key][subKey][fileIndex] = data[key][subKey];
      });
    });
  }

  if (base != null) {
    addToMerged(base, 1);
  }
  if (patch != null) {
    addToMerged(patch, 2);
  }

  return merged;
}

/**
 * Generate comparison data.
 * @param {object} results - The results to generate comparison data from.
 * @returns {object} The comparison data.
 * @example
 * const comparisonData = generateComparisonData(results);
 */
function generateComparisonData(results) {
  const baseResult = parseInt(results[1], 10);
  const patchResult = parseInt(results[2], 10);
  const isValidBase = !Number.isNaN(baseResult);
  const isValidPatch = !Number.isNaN(patchResult);
  let icon = '';
  let ratioFixed = '';

  if (isValidBase && isValidPatch) {
    const ratio = patchResult / baseResult;
    ratioFixed = ratio.toFixed(2);
    if (ratio < 0.95 || ratio > 1.05) {
      icon = '**!!**';
    } else if (ratio < 1) {
      icon = '-';
    } else if (ratio > 1) {
      icon = '+';
    }
  }

  return {
    baseResult: isValidBase ? baseResult.toLocaleString() : '',
    patchResult: isValidPatch ? patchResult.toLocaleString() : '',
    ratio: ratioFixed,
    icon,
  };
}

/**
 * Generate a markdown table from the merged data.
 * @param {object} mergedData - The merged data to generate the table from.
 * @returns {string} The markdown table.
 * @example
 * const markdownTable = generateMarkdownTable(mergedData);
 */
function generateMarkdownTable(mergedData) {
  const rows = [];
  rows.push('| **Results** | **Base** | **Patch** | **Ratio** |  |');
  rows.push('| :--- | ---: | ---: | ---: | ---: |');
  Object.keys(mergedData).forEach(suiteName => {
    rows.push('|  |  |  |  |');
    rows.push(`| **${suiteName}** |  |  |  |  |`);
    Object.keys(mergedData[suiteName]).forEach(test => {
      const results = mergedData[suiteName][test];
      const { baseResult, patchResult, ratio, icon } =
        generateComparisonData(results);
      rows.push(
        `| &middot; ${test} | ${baseResult} | ${patchResult} | ${ratio} | ${icon} |`,
      );
    });
  });
  return rows.join('\n');
}

/**
 * Retrieves a list of icon files from the specified directory.
 * @param {string} dir - The directory to search for icons.
 * @returns {string[]} An array of icon file paths.
 * @example
 * const icons = getIcons('/path/to/icons');
 */
function getIcons(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory()
      ? getIcons(res)
      : res?.split(`${path.sep}icons${path.sep}`)[1];
  });
  return Array.prototype.concat(...files);
}

/**
 * Minifies a TypeScript declaration file.
 * @param {string} filePath - The path to the TypeScript declaration file.
 * @example
 * minifyFile('./path/to/file.d.ts');
 */
function minifyFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
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

    fs.writeFileSync(filePath, minifiedCode, 'utf8');
  } catch (error) {
    console.error(`Error minifying file ${filePath}:`, error);
  }
}

/**
 * Minifies all TypeScript declaration files in a directory.
 * @param {string} dir - The directory to minify.
 * @example
 * minifyDirectory('./path/to/directory');
 */
function minifyDtsDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      minifyDtsDirectory(filePath);
    }
    if (file.name.endsWith('.d.ts')) {
      minifyFile(filePath);
    }
  });
}

/**
 * Updates the typography SCSS file to use the correct import path.
 * @param {string} filePath - The path to the typography SCSS file.
 * @example
 * updateTypographyUse()
 */
function updateTypographyUse(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(
      "@use '../../../static/styles/style-dictionary/typography' as t;",
      "@use '../style-dictionary/typography' as t;",
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('typography.scss updated successfully');
  } catch (error) {
    console.error('Error updating typography.scss ->', error);
  }
}

export {
  getAggregatedSizes,
  getSizes,
  readJsonFile,
  mergeData,
  generateMarkdownTable,
  getIcons,
  minifyDtsDirectory,
  updateTypographyUse,
};
