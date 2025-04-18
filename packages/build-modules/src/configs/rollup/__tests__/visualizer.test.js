/**
 * Unit tests for rollup visualizer configuration.
 * @file This file is saved as `visualizer.test.js`.
 */
import { visualizer } from 'rollup-plugin-visualizer';
import '@testing-library/jest-dom';

import getConfig from '../visualizer.js';

// Mock the visualizer plugin
jest.mock('rollup-plugin-visualizer', () => ({
  visualizer: jest.fn(options => ({
    name: 'visualizer',
    options,
  })),
}));

describe('rollup visualizer config', () => {
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

  it('should generate correct config with all visualizer plugins', () => {
    const dirPath = '/test/path';
    const type = 'main';
    const env = 'development';

    const config = getConfig(dirPath, type, env);

    // Check basic structure
    expect(config).toHaveProperty('plugins');
    expect(config.plugins).toHaveLength(6);

    // Expected base path for all visualizers
    const expectedBasePath =
      '/test/path/main/development/visualizers/2024-01-01T00-00-00.000Z';

    // Expected templates and their corresponding files
    const expectedVisualizers = [
      { template: 'flamegraph', filename: 'flamegraph.html' },
      { template: 'list', filename: 'list.html' },
      { template: 'network', filename: 'network.html' },
      { template: 'raw-data', filename: 'raw-data.html' },
      { template: 'sunburst', filename: 'sunburst.html' },
      { template: 'treemap', filename: 'treemap.html' },
    ];

    // Check each visualizer plugin
    expectedVisualizers.forEach((expected, index) => {
      const plugin = config.plugins[index];
      expect(plugin.name).toBe('visualizer');
      expect(plugin.options).toEqual({
        filename: `${expectedBasePath}/${expected.filename}`,
        template: expected.template,
      });
    });
  });

  it('should call visualizer plugin with correct options for each template', () => {
    const dirPath = '/test/path';
    const type = 'svgr';
    const env = 'production';

    getConfig(dirPath, type, env);

    // Expected base path
    const expectedBasePath =
      '/test/path/svgr/production/visualizers/2024-01-01T00-00-00.000Z';

    // Verify each visualizer call
    expect(visualizer).toHaveBeenCalledWith({
      filename: `${expectedBasePath}/flamegraph.html`,
      template: 'flamegraph',
    });
    expect(visualizer).toHaveBeenCalledWith({
      filename: `${expectedBasePath}/list.html`,
      template: 'list',
    });
    expect(visualizer).toHaveBeenCalledWith({
      filename: `${expectedBasePath}/network.html`,
      template: 'network',
    });
    expect(visualizer).toHaveBeenCalledWith({
      filename: `${expectedBasePath}/raw-data.html`,
      template: 'raw-data',
    });
    expect(visualizer).toHaveBeenCalledWith({
      filename: `${expectedBasePath}/sunburst.html`,
      template: 'sunburst',
    });
    expect(visualizer).toHaveBeenCalledWith({
      filename: `${expectedBasePath}/treemap.html`,
      template: 'treemap',
    });

    expect(visualizer).toHaveBeenCalledTimes(6);
  });

  it('should handle different types and environments', () => {
    const testCases = [
      { dirPath: '/path/one', type: 'type1', env: 'env1' },
      { dirPath: '/path/two', type: 'type2', env: 'env2' },
      { dirPath: '', type: 'type3', env: 'env3' },
    ];

    testCases.forEach(({ dirPath, type, env }) => {
      const config = getConfig(dirPath, type, env);
      const expectedBasePath = `${dirPath}/${type}/${env}/visualizers/2024-01-01T00-00-00.000Z`;

      config.plugins.forEach(plugin => {
        expect(plugin.options.filename).toContain(expectedBasePath);
      });
    });
  });

  it('should generate unique paths based on timestamp', () => {
    // First call
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const config1 = getConfig('/test', 'main', 'dev');
    const path1 = config1.plugins[0].options.filename;

    // Second call with different timestamp
    jest.setSystemTime(new Date('2024-01-01T00:01:00.000Z'));
    const config2 = getConfig('/test', 'main', 'dev');
    const path2 = config2.plugins[0].options.filename;

    expect(path1).not.toBe(path2);
  });
});
