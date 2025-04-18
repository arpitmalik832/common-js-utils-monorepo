/**
 * @file Test file for webpack production configuration.
 */

/* eslint-disable no-console */

import '@testing-library/jest-dom';
import fs from 'fs';

import getConfig from '../prod.js';
import { MAIN_ENUMS } from '../../../enums/index.js';

// Mock the dependencies
jest.mock('../../../utils', () => ({
  getPaths: jest.fn().mockReturnValue({
    outputPath: '/mock/output/path',
  }),
}));

jest.mock('../../../plugins', () => ({
  webpackPlugins: {
    StripCustomWindowVariablesPlugin: jest.fn().mockImplementation(options => ({
      apply: jest.fn(),
      options,
    })),
  },
}));

// Mock fs module
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

// Mock console.error
const originalConsoleError = console.error;
const mockConsoleError = jest.fn();

// Mock process.exit
const originalProcessExit = process.exit;
const mockProcessExit = jest.fn();

// Mock webpack plugins
jest.mock('compression-webpack-plugin', () =>
  jest.fn().mockImplementation(options => ({
    apply: jest.fn(),
    options,
  })),
);

jest.mock('webpack-assets-manifest', () =>
  jest.fn().mockImplementation(options => ({
    apply: jest.fn(),
    options,
  })),
);

describe('getConfig', () => {
  const mockProjectRoot = '/mock/project/root';
  const mockStripVariablesArr = ['CONSOLE_LOG', 'DEBUG'];

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup console.error mock
    console.error = mockConsoleError;
    // Setup process.exit mock
    process.exit = mockProcessExit;
  });

  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError;
    // Restore process.exit
    process.exit = originalProcessExit;
  });

  it('should return a valid webpack production configuration object', () => {
    const config = getConfig(
      mockProjectRoot,
      MAIN_ENUMS.ENVS.PROD,
      mockStripVariablesArr,
    );

    expect(config).toBeDefined();
    expect(config.name).toBe('client');
    expect(config.target).toBe('web');
    expect(config.mode).toBe(MAIN_ENUMS.ENVS.PROD);
    expect(config.plugins).toBeDefined();
  });

  it('should include CompressionPlugin with correct configuration', () => {
    const config = getConfig(
      mockProjectRoot,
      MAIN_ENUMS.ENVS.PROD,
      mockStripVariablesArr,
    );
    const compressionPlugin = config.plugins[0];

    expect(compressionPlugin).toBeDefined();
    expect(compressionPlugin.options.filename).toBe('[path][base].br');
    expect(compressionPlugin.options.algorithm).toBe('brotliCompress');
    expect(compressionPlugin.options.test).toEqual(/\.(js|css)$/);
  });

  it('should include AssetsManifest plugin with correct configuration', () => {
    const config = getConfig(
      mockProjectRoot,
      MAIN_ENUMS.ENVS.PROD,
      mockStripVariablesArr,
    );
    const assetsManifestPlugin = config.plugins[1];

    expect(assetsManifestPlugin).toBeDefined();
    expect(assetsManifestPlugin.options.output).toBe(
      '/mock/output/path/asset-manifest.json',
    );
    expect(assetsManifestPlugin.options.publicPath).toBe(true);
    expect(assetsManifestPlugin.options.writeToDisk).toBe(true);
    expect(typeof assetsManifestPlugin.options.customize).toBe('function');
    expect(typeof assetsManifestPlugin.options.done).toBe('function');
  });

  it('should include StripCustomWindowVariablesPlugin in production mode', () => {
    const config = getConfig(
      mockProjectRoot,
      MAIN_ENUMS.ENVS.PROD,
      mockStripVariablesArr,
    );
    const stripPlugin = config.plugins[2];

    expect(stripPlugin).toBeDefined();
    expect(stripPlugin.options.variables).toEqual(mockStripVariablesArr);
  });

  it('should include StripCustomWindowVariablesPlugin in beta mode', () => {
    const config = getConfig(
      mockProjectRoot,
      MAIN_ENUMS.ENVS.BETA,
      mockStripVariablesArr,
    );
    const stripPlugin = config.plugins[2];

    expect(stripPlugin).toBeDefined();
    expect(stripPlugin.options.variables).toEqual(mockStripVariablesArr);
  });

  it('should not include StripCustomWindowVariablesPlugin in development mode', () => {
    const config = getConfig(
      mockProjectRoot,
      MAIN_ENUMS.ENVS.DEV,
      mockStripVariablesArr,
    );

    expect(config.plugins[2]).toBeFalsy();
  });

  it('should customize asset manifest to exclude source maps', () => {
    const config = getConfig(
      mockProjectRoot,
      MAIN_ENUMS.ENVS.PROD,
      mockStripVariablesArr,
    );
    const assetsManifestPlugin = config.plugins[1];
    const customizeFn = assetsManifestPlugin.options.customize;

    // Test with a source map file
    expect(customizeFn({ key: 'main.js.map' })).toBe(false);

    // Test with a non-source map file
    expect(customizeFn({ key: 'main.js' })).toEqual({ key: 'main.js' });
  });

  it('should handle chunk manifest generation in done callback', () => {
    const config = getConfig(
      mockProjectRoot,
      MAIN_ENUMS.ENVS.PROD,
      mockStripVariablesArr,
    );
    const assetsManifestPlugin = config.plugins[1];
    const doneFn = assetsManifestPlugin.options.done;

    const mockManifest = {
      getPublicPath: jest.fn(file => `/public/${file}`),
    };

    const mockStats = {
      compilation: {
        chunkGroups: [
          {
            name: 'main',
            chunks: [
              {
                files: ['main.js', 'main.js.map', 'main.css'],
              },
            ],
          },
        ],
      },
    };

    doneFn(mockManifest, mockStats);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/mock/output/path/chunk-manifest.json',
      JSON.stringify(
        {
          main: ['/public/main.js', '/public/main.css'],
        },
        null,
        2,
      ),
    );
  });

  describe('AssetsManifest plugin error handling', () => {
    it('should handle writeFileSync error in production mode', () => {
      const config = getConfig(
        mockProjectRoot,
        MAIN_ENUMS.ENVS.PROD,
        mockStripVariablesArr,
      );
      const assetsManifestPlugin = config.plugins[1];
      const doneFn = assetsManifestPlugin.options.done;

      const mockError = new Error('Failed to write file');
      fs.writeFileSync.mockImplementation(() => {
        throw mockError;
      });

      const mockManifest = {
        getPublicPath: jest.fn(file => `/public/${file}`),
      };

      const mockStats = {
        compilation: {
          chunkGroups: [
            {
              name: 'main',
              chunks: [
                {
                  files: ['main.js', 'main.css'],
                },
              ],
            },
          ],
        },
      };

      doneFn(mockManifest, mockStats);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'ERROR: Cannot write /mock/output/path/chunk-manifest.json: ',
        mockError,
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    it('should handle writeFileSync error in non-production mode without exiting', () => {
      const config = getConfig(
        mockProjectRoot,
        MAIN_ENUMS.ENVS.DEV,
        mockStripVariablesArr,
      );
      const assetsManifestPlugin = config.plugins[1];
      const doneFn = assetsManifestPlugin.options.done;

      const mockError = new Error('Failed to write file');
      fs.writeFileSync.mockImplementation(() => {
        throw mockError;
      });

      const mockManifest = {
        getPublicPath: jest.fn(file => `/public/${file}`),
      };

      const mockStats = {
        compilation: {
          chunkGroups: [
            {
              name: 'main',
              chunks: [
                {
                  files: ['main.js', 'main.css'],
                },
              ],
            },
          ],
        },
      };

      doneFn(mockManifest, mockStats);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'ERROR: Cannot write /mock/output/path/chunk-manifest.json: ',
        mockError,
      );
      expect(mockProcessExit).not.toHaveBeenCalled();
    });
  });
});
