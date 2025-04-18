/**
 * Unit tests for buildStats configuration.
 * @file This file is saved as `buildStats.test.js`.
 */
import '@testing-library/jest-dom';

import getConfig from '../buildStats.js';

// Mock the buildStats plugin
jest.mock('../../../plugins/index.js', () => ({
  rollupPlugins: {
    BuildStatsPlugin: jest.fn(path => ({
      name: 'build-stats',
      path,
    })),
  },
}));

jest.mock('../../../enums/main.js', () => ({
  ENVS: {
    PROD: 'production',
    BETA: 'beta',
    STG: 'staging',
    DEV: 'development',
  },
}));

describe('buildStats config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date.now() to return a fixed timestamp
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should generate correct config with all parameters', () => {
    const dirPath = '/test/path';
    const type = 'main';
    const env = 'production';

    const config = getConfig(dirPath, type, env);

    expect(config).toHaveProperty('plugins');
    expect(config.plugins).toHaveLength(1);
    expect(config.plugins[0]).toEqual({
      name: 'build-stats',
      path: '/test/path/main/production/buildStats/2024-01-01T00-00-00.000Z.json',
    });
  });

  it('should handle different types and environments', () => {
    const dirPath = '/test/path';
    const type = 'svgr';
    const env = 'development';

    const config = getConfig(dirPath, type, env);

    expect(config.plugins[0]).toEqual({
      name: 'build-stats',
      path: '/test/path/svgr/development/buildStats/2024-01-01T00-00-00.000Z.json',
    });
  });

  it('should handle path with trailing slash', () => {
    const dirPath = '/test/path/';
    const type = 'main';
    const env = 'production';

    const config = getConfig(dirPath, type, env);

    expect(config.plugins[0]).toEqual({
      name: 'build-stats',
      path: '/test/path/main/production/buildStats/2024-01-01T00-00-00.000Z.json',
    });
  });

  it('should create valid file paths for all parameters', () => {
    const testCases = [
      {
        dirPath: '/path/one',
        type: 'type1',
        env: 'env1',
        expected:
          '/path/one/type1/env1/buildStats/2024-01-01T00-00-00.000Z.json',
      },
      {
        dirPath: '/path/two/',
        type: 'type2',
        env: 'env2',
        expected:
          '/path/two/type2/env2/buildStats/2024-01-01T00-00-00.000Z.json',
      },
      {
        dirPath: '',
        type: 'type3',
        env: 'env3',
        expected: '/type3/env3/buildStats/2024-01-01T00-00-00.000Z.json',
      },
    ];

    testCases.forEach(({ dirPath, type, env, expected }) => {
      const config = getConfig(dirPath, type, env);
      expect(config.plugins[0].path).toBe(expected);
    });
  });
});
