/**
 * Unit tests for BuildStatsPlugin Webpack plugin.
 * @file This file is saved as `buildStats.test.js`.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { minify_sync } from 'terser';

import BuildStatsPlugin from '../BuildStatsPlugin.js';
import { generateFileName } from '../../../utils/index.js';

// Mock dependencies
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
  },
}));

jest.mock('path', () => ({
  dirname: jest.fn(p => p),
}));

jest.mock('zlib', () => ({
  gzipSync: jest.fn(content => Buffer.from(content)),
  brotliCompressSync: jest.fn(content => Buffer.from(content)),
}));

jest.mock('terser', () => ({
  minify_sync: jest.fn(() => 'minified-js'),
}));

jest.mock('clean-css', () =>
  jest.fn().mockImplementation(() => ({
    minify: jest.fn(() => ({
      styles: 'minified-css',
      warnings: [],
      errors: [],
    })),
  })),
);

jest.mock('../../../utils/fileUtils.js', () => ({
  generateFileName: jest.fn(),
}));

describe('BuildStatsPlugin', () => {
  let plugin;
  let mockCompiler;
  let mockCompilation;
  const defaultOutputPath = '/mock/path/stats.json';

  beforeEach(() => {
    jest.clearAllMocks();
    generateFileName.mockReturnValue(defaultOutputPath);

    // Mock compilation assets
    mockCompilation = {
      assets: {
        'main.js': {
          source: () => 'console.log("test")',
          size: () => 100,
        },
        'styles.css': {
          source: () => '.test { color: red; }',
          size: () => 50,
        },
        'ignored.js.map': {
          source: () => 'sourcemap content',
          size: () => 200,
        },
      },
      chunkGroups: [
        {
          chunks: [
            {
              files: new Set(['main.js']),
            },
          ],
        },
      ],
    };

    // Mock compiler hooks
    mockCompiler = {
      hooks: {
        beforeCompile: {
          tap: jest.fn(),
        },
        done: {
          tap: jest.fn(),
        },
        emit: {
          tapAsync: jest.fn(),
        },
      },
    };

    // Initialize plugin
    plugin = new BuildStatsPlugin();
  });

  it('should initialize with default options', () => {
    expect(plugin.outputPath).toBe(defaultOutputPath);
    expect(plugin.stats).toEqual({
      files: [],
      totalSize: 0,
      totalGzippedSize: 0,
      totalBrotliSize: 0,
      totalMinifiedSize: 0,
      noOfFiles: 0,
      largestFile: null,
      buildDuration: 0,
    });
  });

  it('should initialize with custom output path', () => {
    const customPath = '/custom/path/stats.json';
    plugin = new BuildStatsPlugin({ outputPath: customPath });
    expect(plugin.outputPath).toBe(customPath);
  });

  describe('apply', () => {
    beforeEach(() => {
      plugin.apply(mockCompiler);
    });

    it('should register all hooks', () => {
      expect(mockCompiler.hooks.beforeCompile.tap).toHaveBeenCalledWith(
        'BuildStatsPlugin',
        expect.any(Function),
      );
      expect(mockCompiler.hooks.done.tap).toHaveBeenCalledWith(
        'BuildStatsPlugin',
        expect.any(Function),
      );
      expect(mockCompiler.hooks.emit.tapAsync).toHaveBeenCalledWith(
        'BuildStatsPlugin',
        expect.any(Function),
      );
    });

    it('should record build start time', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockImplementation(() => now);

      const beforeCompileHandler =
        mockCompiler.hooks.beforeCompile.tap.mock.calls[0][1];
      beforeCompileHandler();

      expect(plugin.startTime).toBe(now);
    });

    it('should write stats file on completion', () => {
      const startTime = 1000;
      const endTime = 2000;
      jest
        .spyOn(Date, 'now')
        .mockImplementationOnce(() => startTime)
        .mockImplementationOnce(() => endTime);

      const beforeCompileHandler =
        mockCompiler.hooks.beforeCompile.tap.mock.calls[0][1];
      beforeCompileHandler();

      const doneHandler = mockCompiler.hooks.done.tap.mock.calls[0][1];
      doneHandler();

      expect(mkdirSync).toHaveBeenCalledWith(dirname(plugin.outputPath), {
        recursive: true,
      });
      expect(writeFileSync).toHaveBeenCalledWith(
        plugin.outputPath,
        expect.any(String),
      );

      const writtenStats = JSON.parse(writeFileSync.mock.calls[0][1]);
      expect(writtenStats.buildDuration).toBe(1000);
    });

    it('should process assets and calculate stats', done => {
      const emitHandler = mockCompiler.hooks.emit.tapAsync.mock.calls[0][1];

      emitHandler(mockCompilation, () => {
        expect(plugin.stats.files).toHaveLength(2); // Excluding .map file
        expect(plugin.stats.noOfFiles).toBe(2);

        const jsFile = plugin.stats.files.find(f => f.fileName === 'main.js');
        expect(jsFile).toBeTruthy();
        expect(jsFile.contentType).toBe('chunk');
        expect(jsFile.size).toBe(100);

        const cssFile = plugin.stats.files.find(
          f => f.fileName === 'styles.css',
        );
        expect(cssFile).toBeTruthy();
        expect(cssFile.contentType).toBe('asset');
        expect(cssFile.size).toBe(50);

        expect(plugin.stats.largestFile.fileName).toBe('main.js');

        done();
      });
    });

    it('should handle empty compilation', done => {
      const emptyCompilation = {
        assets: {},
        chunkGroups: [],
      };

      const emitHandler = mockCompiler.hooks.emit.tapAsync.mock.calls[0][1];

      emitHandler(emptyCompilation, () => {
        expect(plugin.stats.files).toHaveLength(0);
        expect(plugin.stats.noOfFiles).toBe(0);
        expect(plugin.stats.largestFile).toBe(null);
        expect(plugin.stats.totalSize).toBe(0);
        done();
      });
    });

    it('should calculate correct percentages', done => {
      const emitHandler = mockCompiler.hooks.emit.tapAsync.mock.calls[0][1];

      emitHandler(mockCompilation, () => {
        const { totalSize, files } = plugin.stats;
        files.forEach(file => {
          const expectedPercentage = ((file.size / totalSize) * 100).toFixed(2);
          expect(file.percentageBySize).toBe(expectedPercentage);
        });
        done();
      });
    });

    it('should handle minification errors gracefully', done => {
      // Mock minification error
      minify_sync.mockImplementationOnce(() => '');

      const emitHandler = mockCompiler.hooks.emit.tapAsync.mock.calls[0][1];

      emitHandler(mockCompilation, () => {
        const jsFile = plugin.stats.files.find(f => f.fileName === 'main.js');
        expect(jsFile.minifiedSize).toBe(0);
        done();
      });
    });
  });
});
