/**
 * Unit tests for rollup minimizer configuration.
 * @file This file is saved as `minimizer.test.js`.
 */
import terser from '@rollup/plugin-terser';
import '@testing-library/jest-dom';

import getConfig from '../minimizer.js';

// Mock terser plugin
jest.mock('@rollup/plugin-terser', () =>
  jest.fn(options => ({
    name: 'terser',
    options,
  })),
);

describe('rollup minimizer config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate correct config with terser plugin', () => {
    const config = getConfig();

    // Check basic structure
    expect(config).toHaveProperty('plugins');
    expect(config.plugins).toHaveLength(1);

    // Get terser plugin
    const terserPlugin = config.plugins[0];
    expect(terserPlugin.name).toBe('terser');

    // Check terser options
    expect(terserPlugin.options).toEqual({
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
  });

  it('should call terser plugin with correct options', () => {
    getConfig();

    expect(terser).toHaveBeenCalledWith({
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
    expect(terser).toHaveBeenCalledTimes(1);
  });

  it('should maintain specific compression settings', () => {
    const config = getConfig();
    const terserPlugin = config.plugins[0];

    // Test critical compression settings
    expect(terserPlugin.options.compress.dead_code).toBe(true);
    expect(terserPlugin.options.compress.drop_debugger).toBe(true);
    expect(terserPlugin.options.compress.drop_console).toBe(false);
    expect(terserPlugin.options.compress.side_effects).toBe(true);
  });

  it('should enable code mangling', () => {
    const config = getConfig();
    const terserPlugin = config.plugins[0];

    expect(terserPlugin.options.mangle).toBe(true);
  });
});
