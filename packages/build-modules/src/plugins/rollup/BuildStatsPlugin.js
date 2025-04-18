/**
 * Generates the build stats for the bundle.
 * @file This file is saved as `buildStats.js`.
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { minify_sync } from 'terser';
import CleanCSS from 'clean-css';

import { generateFileName } from '../../utils/index.js';

/**
 * Builds statistics for the bundle.
 * @param {string} outFile - The path where the build stats will be saved.
 * @returns {void}
 * @example
 * // Example usage
 * BuildStatsPlugin('path/to/output.json');
 */
function BuildStatsPlugin(outFile) {
  let startTime;

  return {
    name: 'build-stats-plugin',
    buildStart() {
      startTime = Date.now();
    },
    generateBundle(options, bundle) {
      const stats = {
        files: [],
        totalSize: 0,
        totalGzippedSize: 0,
        totalBrotliSize: 0,
        totalMinifiedSize: 0,
        buildDuration: Date.now() - startTime,
        noOfFiles: 0,
        largestFile: null,
      };

      Object.entries(bundle)
        .filter(
          ([fileName]) =>
            !fileName.endsWith('.map') && !fileName.endsWith('.br'),
        )
        .forEach(([fileName, fileMeta]) => {
          let content = '';

          if (fileMeta.code) {
            content = fileMeta.code;
          } else if (fileMeta.source) {
            content = fileMeta.source;
          } else if (typeof fileMeta === 'string') {
            content = fileMeta;
          }

          let minified = '';
          if (fileName.endsWith('.js') || fileName.endsWith('.mjs')) {
            minified = minify_sync(content, {
              compress: true,
              mangle: true,
            });
          }

          if (fileName.endsWith('.css') || fileName.endsWith('.scss')) {
            const rawCode = content.toString('utf8');
            const minifyCSS = new CleanCSS();
            minified = minifyCSS.minify(rawCode).styles;
          }

          const size = Buffer.byteLength(content, 'utf8');
          const gzippedSize = zlib.gzipSync(content).length;
          const brotliSize = zlib.brotliCompressSync(content).length;
          const minifiedSize = Buffer.byteLength(minified, 'utf8');

          stats.files.push({
            fileName,
            size,
            gzippedSize,
            brotliSize,
            minifiedSize,
            contentType: fileMeta.type || 'unknown',
          });

          stats.totalSize += size;
          stats.totalGzippedSize += gzippedSize;
          stats.totalBrotliSize += brotliSize;
          stats.totalMinifiedSize += minifiedSize;
        });

      stats.noOfFiles = stats.files.length;

      if (stats.files.length > 0) {
        stats.files = stats.files.map(i => ({
          ...i,
          percentageBySize: ((i.size / stats.totalSize) * 100).toFixed(2),
        }));
        stats.largestFile = stats.files.reduce(
          (prev, current) => (prev.size > current.size ? prev : current),
          stats.files[0],
        );
      }

      const outputPath =
        outFile ||
        generateFileName(`${process.cwd()}/.logs`, 'build-stats', 'json');

      // Ensure the directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));
    },
  };
}

export default BuildStatsPlugin;
