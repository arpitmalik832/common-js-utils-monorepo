/* eslint-disable no-console */
/**
 * Script to get the size of the files in the project build dir.
 * @file This file is saved as `scripts/size.js`.
 */
import brotliSizePkg from 'brotli-size';
import CleanCSS from 'clean-css';
import fs from 'fs';
import path from 'path';
import { minify_sync } from 'terser';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

// eslint-disable-next-line import/extensions
import distDirs from './enums.js';

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

// run.js --outfile filename.js
const { argv } = yargs(hideBin(process.argv)).option('outfile', {
  alias: 'o',
  type: 'string',
  description: 'Output file',
  demandOption: false,
});
const { outfile } = argv;

console.log('Running "size" benchmark, please wait...');

const sizes = getSizes(distDirs);

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

const aggregatedResultsString = JSON.stringify(aggregatedResults, null, 2);

// Print / Write results
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const timestamp = `${year}${month}${day}-${hours}${minutes}`;

const dirpath = `${process.cwd()}/.logs`;
const filepath = `${dirpath}/size-${timestamp}.json`;
if (!fs.existsSync(dirpath)) {
  fs.mkdirSync(dirpath);
}
const outpath = outfile || filepath;
fs.writeFileSync(outpath, `${aggregatedResultsString}\n`);

console.log('Results:', aggregatedResultsString);
console.log('Results written to', outpath);
