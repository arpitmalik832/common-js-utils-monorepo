/**
 * Unit tests for BuildStatsPlugin Rollup plugin.
 * @file This file is saved as `BuildStatsPlugin.test.js`.
 */

import fs from 'fs';
import path from 'path';
import { minify_sync } from 'terser';
import CleanCSS from 'clean-css';

import BuildStatsPlugin from '../BuildStatsPlugin';
import { generateFileName } from '../../../utils/index.js';

// Mock dependencies
jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  dirname: jest.fn(),
}));

jest.mock('zlib', () => ({
  gzipSync: jest.fn(e => e),
  brotliCompressSync: jest.fn(e => e),
}));

jest.mock('terser', () => ({
  minify_sync: jest.fn(() => 'minified-js'),
}));

// Mock CleanCSS
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

describe('BuildStatsPlugin Rollup plugin', () => {
  let plugin;
  const mockOutFile = '/mock/path/stats.json';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Initialize plugin
    plugin = BuildStatsPlugin(mockOutFile);
  });

  it('should create plugin with correct name', () => {
    expect(plugin.name).toBe('build-stats-plugin');
  });

  it('should initialize build time on buildStart', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    plugin.buildStart();

    expect(Date.now).toHaveBeenCalled();
  });

  describe('generateBundle', () => {
    const mockBundle = {
      'main.js': {
        code: 'console.log("test")',
        type: 'chunk',
      },
      'styles.css': {
        source: '.test { color: red; }',
        type: 'asset',
      },
      'raw-string.js': 'const x = 42;',
      'empty-file.js': {},
      'ignored.js.map': {
        source: 'sourcemap content',
      },
    };

    it('should process JS and CSS files correctly', () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockImplementation(() => now);

      plugin.buildStart();
      plugin.generateBundle({}, mockBundle);

      // Verify file processing
      expect(minify_sync).toHaveBeenCalledWith('console.log("test")', {
        compress: true,
        mangle: true,
      });

      // Verify CleanCSS instantiation and minify call
      expect(CleanCSS).toHaveBeenCalled();
      const cleanCssInstance = CleanCSS.mock.results[0].value;
      expect(cleanCssInstance.minify).toHaveBeenCalledWith(
        '.test { color: red; }',
      );
    });

    it('should calculate correct file sizes', () => {
      plugin.buildStart();
      plugin.generateBundle({}, mockBundle);

      const writtenStats = JSON.parse(fs.writeFileSync.mock.calls[0][1]);

      expect(writtenStats.noOfFiles).toBe(4); // Including raw-string.js and empty-file.js, excluding .map file
      expect(writtenStats.files).toHaveLength(4);
      expect(writtenStats.files[0]).toHaveProperty('size');
      expect(writtenStats.files[0]).toHaveProperty('gzippedSize');
      expect(writtenStats.files[0]).toHaveProperty('brotliSize');
      expect(writtenStats.files[0]).toHaveProperty('minifiedSize');
    });

    it('should identify largest file correctly', () => {
      const largeBundle = {
        'small.js': { code: 'small' },
        'large.js': { code: 'very large content'.repeat(100) },
      };

      plugin.buildStart();
      plugin.generateBundle({}, largeBundle);

      const writtenStats = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      expect(writtenStats.largestFile.fileName).toBe('large.js');
    });

    it('should handle empty bundle', () => {
      plugin.buildStart();
      plugin.generateBundle({}, {});

      const writtenStats = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      expect(writtenStats.noOfFiles).toBe(0);
      expect(writtenStats.totalSize).toBe(0);
      expect(writtenStats.largestFile).toBe(null);
    });

    it("should create output directory if it doesn't exist", () => {
      plugin.buildStart();
      plugin.generateBundle({}, mockBundle);

      expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(mockOutFile), {
        recursive: true,
      });
    });

    it('should calculate correct percentage sizes', () => {
      plugin.buildStart();
      plugin.generateBundle({}, mockBundle);

      const writtenStats = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      writtenStats.files.forEach(file => {
        expect(file).toHaveProperty('percentageBySize');
        expect(parseFloat(file.percentageBySize)).toBeLessThanOrEqual(100);
        expect(parseFloat(file.percentageBySize)).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle CSS minification errors gracefully', () => {
      // Mock CleanCSS to return an error
      CleanCSS.mockImplementationOnce(() => ({
        minify: jest.fn(() => ({
          styles: '',
          warnings: [],
          errors: ['Minification error'],
        })),
      }));

      plugin.buildStart();
      plugin.generateBundle({}, mockBundle);

      const writtenStats = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      const cssFile = writtenStats.files.find(f => f.fileName === 'styles.css');
      expect(cssFile.minifiedSize).toBe(0);
    });

    it('should handle string file metadata', () => {
      plugin.buildStart();
      plugin.generateBundle({}, { 'test.js': 'const x = 42;' });

      const writtenStats = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      expect(writtenStats.files).toHaveLength(1);
      expect(writtenStats.files[0].fileName).toBe('test.js');
      expect(writtenStats.files[0].size).toBeGreaterThan(0);
    });

    it('should handle files with no code or source', () => {
      plugin.buildStart();
      plugin.generateBundle({}, { 'empty.js': {} });

      const writtenStats = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
      expect(writtenStats.files).toHaveLength(1);
      expect(writtenStats.files[0].fileName).toBe('empty.js');
      expect(writtenStats.files[0].size).toBe(0);
    });

    it('should use default output path when none provided', () => {
      const defaultPath = '/default/path/stats.json';
      generateFileName.mockReturnValue(defaultPath);

      const defaultPlugin = BuildStatsPlugin();
      defaultPlugin.buildStart();
      defaultPlugin.generateBundle({}, mockBundle);

      expect(generateFileName).toHaveBeenCalledWith(
        expect.stringContaining('.logs'),
        'build-stats',
        'json',
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        defaultPath,
        expect.any(String),
      );
    });
  });
});
