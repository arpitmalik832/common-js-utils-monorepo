/**
 * Unit tests for webpack buildStats configuration.
 * @file This file is saved as `buildStats.test.js`.
 */
import '@testing-library/jest-dom';

import { BuildStatsPlugin } from '../../../plugins/webpack/index.js';
import getConfig from '../buildstats.js';

// Mock the BuildStatsPlugin
jest.mock('../../../plugins/webpack/BuildStatsPlugin.js', () =>
  jest.fn().mockImplementation(options => ({
    name: 'BuildStatsPlugin',
    options,
  })),
);

describe('webpack buildStats config', () => {
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

  it('should generate correct config with build stats plugin', () => {
    const dirPath = '/test/path';
    const type = 'main';
    const env = 'development';

    const config = getConfig(dirPath, type, env);

    // Check basic structure
    expect(config).toHaveProperty('plugins');
    expect(config.plugins).toHaveLength(1);

    // Check plugin configuration
    const plugin = config.plugins[0];
    expect(plugin.name).toBe('BuildStatsPlugin');
    expect(plugin.options).toEqual({
      outputPath:
        '/test/path/main/development/buildStats/2024-01-01T00-00-00.000Z.json',
    });
  });

  it('should call BuildStatsPlugin with correct options', () => {
    const dirPath = '/test/path';
    const type = 'storybook';
    const env = 'production';

    getConfig(dirPath, type, env);

    expect(BuildStatsPlugin).toHaveBeenCalledWith({
      outputPath:
        '/test/path/storybook/production/buildStats/2024-01-01T00-00-00.000Z.json',
    });
    expect(BuildStatsPlugin).toHaveBeenCalledTimes(1);
  });

  it('should handle different types and environments', () => {
    const testCases = [
      { dirPath: '/path/one', type: 'type1', env: 'env1' },
      { dirPath: '/path/two', type: 'type2', env: 'env2' },
      { dirPath: '', type: 'type3', env: 'env3' },
    ];

    testCases.forEach(({ dirPath, type, env }) => {
      const config = getConfig(dirPath, type, env);
      const expectedPath = `${dirPath}/${type}/${env}/buildStats/2024-01-01T00-00-00.000Z.json`;

      expect(config.plugins[0].options.outputPath).toBe(expectedPath);
    });
  });

  it('should generate unique paths based on timestamp', () => {
    // First call
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const config1 = getConfig('/test', 'main', 'dev');
    const path1 = config1.plugins[0].options.outputPath;

    // Second call with different timestamp
    jest.setSystemTime(new Date('2024-01-01T00:01:00.000Z'));
    const config2 = getConfig('/test', 'main', 'dev');
    const path2 = config2.plugins[0].options.outputPath;

    expect(path1).not.toBe(path2);
  });

  it('should handle empty directory path', () => {
    const config = getConfig('', 'main', 'dev');
    expect(config.plugins[0].options.outputPath).toBe(
      '/main/dev/buildStats/2024-01-01T00-00-00.000Z.json',
    );
  });
});
