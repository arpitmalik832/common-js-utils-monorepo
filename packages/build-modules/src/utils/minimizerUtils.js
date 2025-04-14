/**
 * Utility functions for the minimizer.
 * @file This file is saved as `minimizerUtils.js`.
 */
import fs from 'fs/promises';
import path from 'path';
import { minify } from 'terser';
import cssnano from 'cssnano';
import postcss from 'postcss';
import postcssScss from 'postcss-scss';

import { errorLog } from './logsUtils.js';

/**
 * Minimizes the content of a file.
 * @param {string} filepath - The filepath of the content.
 * @returns {Promise<string>} The minimized content.
 * @example
 * return minimizeContent(filepath);
 */
async function minimizeContent(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  const content = await fs.readFile(filepath, 'utf8');

  const cssOptions = {
    preset: [
      'default',
      {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        minifySelectors: true,
        reduceIdents: true, // Shorten IDs
        reduceInitial: true, // Replace initial values
        mergeLonghand: true,
        mergeRules: true,
        minifyFontValues: true,
        minifyGradients: true,
        minifyParams: true,
        normalizePositions: true,
        normalizeRepeatStyle: true,
        normalizeString: true,
        normalizeTimingFunctions: true,
        normalizeUnicode: true,
        normalizeUrl: true,
        orderedValues: true,
        reduceBackgroundRepeat: true,
        reducePositions: true,
        reduceTransforms: true,
        styleCache: true,
        calc: {
          preserve: false, // Evaluate calc expressions
          precision: 2,
        },
        colormin: {
          reduce: true,
        },
        zindex: {
          startIndex: 1,
        },
        convertValues: {
          length: true,
          time: true,
          angle: true,
        },
        uniqueSelectors: true,
        mergeIdents: true,
        discardDuplicates: true,
        discardOverridden: true,
        discardUnused: true,
        mergeMedia: true,
      },
    ],
  };

  try {
    switch (ext) {
      case '.js':
      case '.mjs':
      case '.jsx':
      case '.ts':
      case '.tsx': {
        const jsResult = await minify(content, {
          compress: {
            dead_code: true,
            drop_debugger: true,
            drop_console: false,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            hoist_funs: true,
            keep_fargs: false,
            hoist_vars: true,
            if_return: true,
            join_vars: true,
            side_effects: true,
          },
          mangle: true,
        });
        await fs.writeFile(filepath, jsResult.code);
        break;
      }
      case '.css': {
        const cssResult = await postcss([cssnano(cssOptions)]).process(
          content,
          {
            from: filepath,
            map: false,
          },
        );
        await fs.writeFile(filepath, cssResult.css);
        break;
      }
      case '.scss':
      case '.sass': {
        const scssResult = await postcss([cssnano(cssOptions)]).process(
          content,
          {
            from: filepath,
            map: false,
            syntax: postcssScss, // Use SCSS parser for .scss files
          },
        );
        await fs.writeFile(filepath, scssResult.css);
        break;
      }
      default:
    }
  } catch (err) {
    errorLog(`Error minifying ${filepath}:`, err);
  }
}

/**
 * Function to process a path.
 * @param {string} inputPath - The path to process.
 * @example
 * const processPath = processPath('path/to/file');
 */
async function processPath(inputPath) {
  try {
    const stats = await fs.stat(inputPath);

    if (stats.isDirectory()) {
      const files = await fs.readdir(inputPath, { recursive: true });
      await Promise.all(
        files.map(async file => {
          const fullPath = path.join(inputPath, file);
          const fileStats = await fs.stat(fullPath);
          if (fileStats.isFile()) {
            await minimizeContent(fullPath);
          }
        }),
      );
    } else {
      await minimizeContent(inputPath);
    }
  } catch (err) {
    errorLog(`Error processing path ${inputPath}:`, err);
  }
}

export { minimizeContent, processPath };
