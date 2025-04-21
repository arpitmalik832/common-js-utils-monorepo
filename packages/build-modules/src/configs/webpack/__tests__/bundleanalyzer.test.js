/**
 * Unit tests for webpack bundle analyzer configuration.
 * @file This file is saved as `bundleanalyzer.test.js`.
 */
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import '@testing-library/jest-dom';

import getConfig from '../bundleanalyzer.js';

// Mock webpack-bundle-analyzer
jest.mock('webpack-bundle-analyzer', () => ({
  BundleAnalyzerPlugin: jest.fn().mockImplementation(options => ({
    name: 'BundleAnalyzerPlugin',
    options,
  })),
}));

describe('webpack bundle analyzer config', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Mock Date.now() to return a fixed timestamp
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should generate correct config with bundle analyzer plugin', () => {
    const dirPath = '/test/path';
    const type = 'main';
    const env = 'development';

    const config = getConfig(dirPath, type, env);

    // Check basic structure
    expect(config).toHaveProperty('plugins');
    expect(config.plugins).toHaveLength(1);

    // Check plugin configuration
    const plugin = config.plugins[0];
    expect(plugin.name).toBe('BundleAnalyzerPlugin');
    expect(plugin.options).toEqual({
      analyzerMode: 'static',
      reportFilename: path.resolve(
        '/test/path/main/development/visualizer/',
        '2024-01-01T00-00-00.000Z.html',
      ),
      openAnalyzer: false,
    });
  });

  it('should call BundleAnalyzerPlugin with correct options', () => {
    const dirPath = '/test/path';
    const type = 'storybook';
    const env = 'production';

    getConfig(dirPath, type, env);

    expect(BundleAnalyzerPlugin).toHaveBeenCalledWith({
      analyzerMode: 'static',
      reportFilename: path.resolve(
        '/test/path/storybook/production/visualizer/',
        '2024-01-01T00-00-00.000Z.html',
      ),
      openAnalyzer: false,
    });
    expect(BundleAnalyzerPlugin).toHaveBeenCalledTimes(1);
  });

  it('should handle different types and environments', () => {
    const testCases = [
      { dirPath: '/path/one', type: 'type1', env: 'env1' },
      { dirPath: '/path/two', type: 'type2', env: 'env2' },
      { dirPath: '', type: 'type3', env: 'env3' },
    ];

    testCases.forEach(({ dirPath, type, env }) => {
      const config = getConfig(dirPath, type, env);
      const expectedPath = path.resolve(
        `${dirPath}/${type}/${env}/visualizer/`,
        '2024-01-01T00-00-00.000Z.html',
      );

      expect(config.plugins[0].options.reportFilename).toBe(expectedPath);
    });
  });

  it('should generate unique paths based on timestamp', () => {
    // First call
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const config1 = getConfig('/test', 'main', 'dev');
    const path1 = config1.plugins[0].options.reportFilename;

    // Second call with different timestamp
    jest.setSystemTime(new Date('2024-01-01T00:01:00.000Z'));
    const config2 = getConfig('/test', 'main', 'dev');
    const path2 = config2.plugins[0].options.reportFilename;

    expect(path1).not.toBe(path2);
  });

  it('should set correct analyzer mode and options', () => {
    const config = getConfig('/test', 'main', 'dev');
    const pluginOptions = config.plugins[0].options;

    expect(pluginOptions.analyzerMode).toBe('static');
    expect(pluginOptions.openAnalyzer).toBe(false);
  });

  it('should handle empty directory path', () => {
    const config = getConfig('', 'main', 'dev');
    expect(config.plugins[0].options.reportFilename).toBe(
      path.resolve('/main/dev/visualizer/', '2024-01-01T00-00-00.000Z.html'),
    );
  });
});
