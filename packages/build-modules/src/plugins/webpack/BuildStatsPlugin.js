/**
 * Webpack plugin to generate build stats.
 * @file The file is saved as `build_utils/webpack/customPlugins/BuildStats.mjs`.
 */
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import zlib from 'zlib';
import { minify_sync } from 'terser';
import CleanCSS from 'clean-css';

import { generateFileName } from '../../utils/index.js';

class BuildStatsPlugin {
  constructor(options = {}) {
    this.outputPath =
      options.outputPath ||
      generateFileName(`${process.cwd()}/.logs`, 'build-stats', 'json');
    this.startTime = 0;
    this.stats = {
      files: [],
      totalSize: 0,
      totalGzippedSize: 0,
      totalBrotliSize: 0,
      totalMinifiedSize: 0,
      noOfFiles: 0,
      largestFile: null,
      buildDuration: 0,
    };
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tap('BuildStatsPlugin', () => {
      this.startTime = Date.now();
    });
    compiler.hooks.done.tap('BuildStatsPlugin', () => {
      // Calculate build duration
      this.stats.buildDuration = Date.now() - this.startTime;

      // Ensure the directory exists
      mkdirSync(path.dirname(this.outputPath), { recursive: true });
      writeFileSync(this.outputPath, JSON.stringify(this.stats, null, 2));
    });
    compiler.hooks.emit.tapAsync(
      'BuildStatsPlugin',
      (compilation, callback) => {
        Object.keys(compilation.assets)
          .filter(
            fileName => !fileName.endsWith('.map') && !fileName.endsWith('.br'),
          )
          .forEach(fileName => {
            const asset = compilation.assets[fileName];

            let minified = '';
            if (fileName.endsWith('.js') || fileName.endsWith('.mjs')) {
              minified = minify_sync(asset.source(), {
                compress: true,
                mangle: true,
              });
            }

            if (fileName.endsWith('.css') || fileName.endsWith('.scss')) {
              const rawCode = asset.source().toString('utf8');
              const minifyCSS = new CleanCSS();
              minified = minifyCSS.minify(rawCode).styles;
            }

            const size = asset.size();
            const gzippedSize = zlib.gzipSync(asset.source()).length;
            const brotliSize = zlib.brotliCompressSync(asset.source()).length;
            const minifiedSize = Buffer.byteLength(minified, 'utf8');

            let contentType = 'asset';
            compilation.chunkGroups.forEach(chunkGroup => {
              chunkGroup.chunks.forEach(chunk => {
                if (chunk.files.has(fileName)) {
                  contentType = 'chunk';
                }
              });
            });

            this.stats.files.push({
              fileName,
              size,
              gzippedSize,
              brotliSize,
              minifiedSize,
              contentType,
            });

            this.stats.totalSize += size;
            this.stats.totalGzippedSize += gzippedSize;
            this.stats.totalBrotliSize += brotliSize;
            this.stats.totalMinifiedSize += minifiedSize;
          });

        this.stats.noOfFiles = this.stats.files.length;

        if (this.stats.files.length > 0) {
          this.stats.files = this.stats.files.map(i => ({
            ...i,
            percentageBySize: ((i.size / this.stats.totalSize) * 100).toFixed(
              2,
            ),
          }));
          this.stats.largestFile = this.stats.files.reduce(
            (prev, current) => (prev.size > current.size ? prev : current),
            this.stats.files[0],
          );
        }

        callback();
      },
    );
  }
}

export default BuildStatsPlugin;
