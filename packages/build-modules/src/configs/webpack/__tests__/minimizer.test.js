/**
 * Unit tests for webpack minimizer configuration.
 * @file This file is saved as `minimizer.test.js`.
 */
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import '@testing-library/jest-dom';

import { MAIN_ENUMS } from '../../../enums/index.js';
import getConfig from '../minimizer.js';

// Mock the plugins
jest.mock('terser-webpack-plugin', () =>
  jest.fn().mockImplementation(options => ({
    name: 'TerserPlugin',
    options,
  })),
);

jest.mock('../../../enums/main.js', () => ({
  ENVS: {
    PROD: 'production',
    BETA: 'beta',
    STG: 'staging',
    DEV: 'development',
  },
}));

jest.mock('css-minimizer-webpack-plugin', () =>
  jest.fn().mockImplementation(options => ({
    name: 'CssMinimizerPlugin',
    options,
  })),
);

describe('webpack minimizer config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate correct config with both minimizer plugins', () => {
    const config = getConfig(MAIN_ENUMS.ENVS.DEV);

    expect(config).toHaveProperty('optimization');
    expect(config.optimization.minimize).toBe(true);
    expect(config.optimization.minimizer).toHaveLength(2);
  });

  it('should configure TerserPlugin correctly for production', () => {
    const config = getConfig(MAIN_ENUMS.ENVS.PROD);
    const terserPlugin = config.optimization.minimizer[0];

    expect(terserPlugin.name).toBe('TerserPlugin');
    expect(terserPlugin.options.terserOptions).toEqual({
      compress: {
        inline: false,
        drop_console: true,
        dead_code: true,
        drop_debugger: true,
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
        warnings: false,
      },
      mangle: true,
      output: {
        comments: false,
      },
    });
  });

  it('should configure TerserPlugin correctly for development', () => {
    const config = getConfig(MAIN_ENUMS.ENVS.DEV);
    const terserPlugin = config.optimization.minimizer[0];

    expect(terserPlugin.name).toBe('TerserPlugin');
    expect(terserPlugin.options.terserOptions.compress).toEqual(
      expect.objectContaining({
        drop_console: false,
        drop_debugger: false,
      }),
    );
  });

  it('should configure CssMinimizerPlugin correctly', () => {
    const config = getConfig(MAIN_ENUMS.ENVS.PROD);
    const cssPlugin = config.optimization.minimizer[1];

    expect(cssPlugin.name).toBe('CssMinimizerPlugin');
    expect(cssPlugin.options).toEqual({
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
    });
  });

  it('should call plugins with correct options', () => {
    getConfig(MAIN_ENUMS.ENVS.PROD);

    expect(TerserPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        terserOptions: expect.any(Object),
      }),
    );
    expect(CssMinimizerPlugin).toHaveBeenCalledWith({
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
    });
  });

  it('should handle different environments', () => {
    const ENVS = [
      MAIN_ENUMS.ENVS.PROD,
      MAIN_ENUMS.ENVS.DEV,
      MAIN_ENUMS.ENVS.BETA,
    ];

    ENVS.forEach(env => {
      const config = getConfig(env);
      const terserPlugin = config.optimization.minimizer[0];

      expect(terserPlugin.options.terserOptions.compress.drop_console).toBe(
        env === MAIN_ENUMS.ENVS.PROD,
      );
      expect(terserPlugin.options.terserOptions.compress.drop_debugger).toBe(
        env === MAIN_ENUMS.ENVS.PROD,
      );
    });
  });

  it('should maintain consistent non-environment-dependent options', () => {
    const config = getConfig(MAIN_ENUMS.ENVS.DEV);
    const terserPlugin = config.optimization.minimizer[0];

    expect(terserPlugin.options.terserOptions.compress).toEqual(
      expect.objectContaining({
        dead_code: true,
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
      }),
    );
  });
});
