/**
 * Unit tests for Storybook webpack configuration.
 * @file This file is saved as `webpack.test.js`.
 */
import CompressionPlugin from 'compression-webpack-plugin';
import '@testing-library/jest-dom';

import { MAIN_ENUMS } from '../../../enums/index.js';
import getConfig from '../webpack.js';
import {
  getBundleAnalyzerConfig,
  getBuildStatsConfig,
  getMinimizerConfig,
} from '../../webpack/index.js';

// Mock external dependencies
jest.mock('compression-webpack-plugin', () =>
  jest.fn().mockImplementation(options => ({
    name: 'CompressionPlugin',
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

jest.mock('../../webpack/bundleAnalyzer.js', () => ({
  __esModule: true,
  default: jest.fn((path, type, env) => ({
    plugins: [{ name: 'BundleAnalyzerPlugin', path, type, env }],
  })),
}));

jest.mock('../../webpack/buildStats.js', () => ({
  __esModule: true,
  default: jest.fn((path, type, env) => ({
    plugins: [{ name: 'BuildStatsPlugin', path, type, env }],
  })),
}));

jest.mock('../../svgrConfig.js', () => ({
  icon: true,
  typescript: true,
  ref: true,
}));

jest.mock('../../webpack/minimizer.js', () => ({
  __esModule: true,
  default: jest.fn(env => ({
    optimization: {
      minimizer: [{ name: 'TerserPlugin', env }],
    },
  })),
}));

jest.mock('../../../utils/fileUtils.js', () => ({
  getDirname: jest.fn(() => '/mock/path'),
}));

describe('Storybook webpack config', () => {
  const defaultConfig = {
    module: {
      rules: [
        {
          test: { test: () => true }, // Keep only one test property
        },
      ],
    },
    plugins: [],
    optimization: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should generate correct base configuration', () => {
    const projectRoot = '/test/project';
    const config = getConfig(
      projectRoot,
      '/analyzer/path',
      '/stats/path',
      MAIN_ENUMS.ENVS.DEV,
      'false',
      'false',
      'NO_ENV',
    );

    expect(config.stories).toEqual([
      `${projectRoot}/src/**/*.stories.@(js|jsx|ts|tsx)`,
      `${projectRoot}/src/**/*.mdx`,
    ]);
    expect(config.addons).toContain('@storybook/addon-essentials');
    expect(config.framework).toBe('@storybook/react-webpack5');
  });

  it('should throw error when env is not provided', () => {
    expect(() => {
      const config = getConfig(
        '/test',
        '/analyzer',
        '/stats',
        null,
        'false',
        'false',
        'NO_ENV',
      );
      config.webpackFinal(defaultConfig);
    }).toThrow('NO_ENV');
  });

  it('should configure webpack rules correctly', () => {
    const config = getConfig(
      '/test',
      '/analyzer',
      '/stats',
      MAIN_ENUMS.ENVS.DEV,
      'false',
      'false',
      'NO_ENV',
    );
    const finalConfig = config.webpackFinal(defaultConfig);

    // Check JS/JSX rule
    const jsRule = finalConfig.module.rules.find(
      rule => rule.test.toString() === '/\\.(js|jsx)$/',
    );
    expect(jsRule).toBeDefined();
    expect(jsRule.use).toContain('babel-loader');

    // Check SCSS rule
    const scssRule = finalConfig.module.rules.find(
      rule => rule.test.toString() === '/\\.(scss|sass)$/',
    );
    expect(scssRule).toBeDefined();
    expect(scssRule.use).toContain('sass-loader');
  });

  it('should configure optimization for production', () => {
    const config = getConfig(
      '/test',
      '/analyzer',
      '/stats',
      MAIN_ENUMS.ENVS.PROD,
      'false',
      'false',
      'NO_ENV',
    );
    const finalConfig = config.webpackFinal(defaultConfig);

    expect(finalConfig.optimization.minimize).toBe(true);
    expect(finalConfig.optimization.splitChunks).toEqual({
      chunks: 'all',
      maxSize: 200 * 1024,
    });
    expect(getMinimizerConfig).toHaveBeenCalledWith(MAIN_ENUMS.ENVS.PROD);
  });

  it('should add bundle analyzer when enabled', () => {
    const config = getConfig(
      '/test',
      '/analyzer',
      '/stats',
      MAIN_ENUMS.ENVS.DEV,
      'true',
      'false',
      'NO_ENV',
    );
    const finalConfig = config.webpackFinal(defaultConfig);

    expect(getBundleAnalyzerConfig).toHaveBeenCalledWith(
      '/analyzer',
      'storybook',
      MAIN_ENUMS.ENVS.DEV,
    );
    expect(finalConfig.plugins).toContainEqual(
      expect.objectContaining({ name: 'BundleAnalyzerPlugin' }),
    );
  });

  it('should add build stats when enabled', () => {
    const config = getConfig(
      '/test',
      '/analyzer',
      '/stats',
      MAIN_ENUMS.ENVS.DEV,
      'false',
      'true',
      'NO_ENV',
    );
    const finalConfig = config.webpackFinal(defaultConfig);

    expect(getBuildStatsConfig).toHaveBeenCalledWith(
      '/stats',
      'storybook',
      MAIN_ENUMS.ENVS.DEV,
    );
    expect(finalConfig.plugins).toContainEqual(
      expect.objectContaining({ name: 'BuildStatsPlugin' }),
    );
  });

  it('should configure compression plugin', () => {
    const config = getConfig(
      '/test',
      '/analyzer',
      '/stats',
      MAIN_ENUMS.ENVS.DEV,
      'false',
      'false',
      'NO_ENV',
    );
    const finalConfig = config.webpackFinal(defaultConfig);

    expect(CompressionPlugin).toHaveBeenCalledWith({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css)$/,
    });
    expect(finalConfig.plugins).toContainEqual(
      expect.objectContaining({ name: 'CompressionPlugin' }),
    );
  });
});
