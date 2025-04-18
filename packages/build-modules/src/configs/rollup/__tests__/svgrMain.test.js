/**
 * Unit tests for rollup SVGR configuration.
 * @file This file is saved as `svgrMain.test.js`.
 */
import svgr from '@svgr/rollup';
import progress from 'rollup-plugin-progress';
import '@testing-library/jest-dom';

import { MAIN_ENUMS } from '../../../enums/index.js';
import getConfig from '../svgrMain.js';
import svgrConfig from '../../svgrConfig.js';

// Mock the plugins
jest.mock('@svgr/rollup', () =>
  jest.fn(options => ({
    name: 'svgr',
    options,
  })),
);

jest.mock('rollup-plugin-progress', () =>
  jest.fn(() => ({
    name: 'progress',
  })),
);

// Mock internal imports
jest.mock('../../svgrConfig.js', () => ({
  icon: true,
  typescript: true,
  ref: true,
}));

jest.mock('../../../utils/fileUtils.js', () => ({
  getPaths: jest.fn(projectRoot => ({
    outputPath: `${projectRoot}/dist`,
  })),
}));

describe('rollup SVGR config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate correct config with development settings', () => {
    const projectRoot = '/test/project';
    const env = MAIN_ENUMS.ENVS.DEV;
    const iconsList = ['icon1.svg', 'icon2.svg'];

    const config = getConfig(projectRoot, env, iconsList);

    // Check input configuration
    expect(config.input).toEqual([
      'src/assets/icons/icon1.svg',
      'src/assets/icons/icon2.svg',
    ]);

    // Check output configuration
    expect(config.output).toHaveLength(2);

    // Check ESM output
    expect(config.output[0]).toEqual({
      dir: '/test/project/dist',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: 'esm/[name].js',
      chunkFileNames: 'esm/[name].js',
    });

    // Check CJS output
    expect(config.output[1]).toEqual({
      dir: '/test/project/dist',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: 'cjs/[name].js',
      chunkFileNames: 'cjs/[name].js',
    });

    // Check external configuration
    expect(config.external[0]).toEqual(/node_modules/);

    // Check plugins configuration
    expect(config.plugins).toHaveLength(2);
    expect(svgr).toHaveBeenCalledWith(svgrConfig);
    expect(progress).toHaveBeenCalled();
  });

  it('should disable sourcemaps in production', () => {
    const config = getConfig('/test/project', MAIN_ENUMS.ENVS.PROD, [
      'icon.svg',
    ]);

    expect(config.output[0].sourcemap).toBe(false);
    expect(config.output[1].sourcemap).toBe(false);
  });

  it('should disable sourcemaps in beta', () => {
    const config = getConfig('/test/project', MAIN_ENUMS.ENVS.BETA, [
      'icon.svg',
    ]);

    expect(config.output[0].sourcemap).toBe(false);
    expect(config.output[1].sourcemap).toBe(false);
  });

  it('should handle empty icons list', () => {
    const config = getConfig('/test/project', MAIN_ENUMS.ENVS.DEV, []);

    expect(config.input).toEqual([]);
    expect(config.plugins).toHaveLength(2);
  });

  it('should preserve module structure', () => {
    const config = getConfig('/test/project', MAIN_ENUMS.ENVS.DEV, [
      'icon.svg',
    ]);

    expect(config.output[0].preserveModules).toBe(true);
    expect(config.output[0].preserveModulesRoot).toBe('src');
    expect(config.output[1].preserveModules).toBe(true);
    expect(config.output[1].preserveModulesRoot).toBe('src');
  });

  it('should configure SVGR plugin with correct options', () => {
    getConfig('/test/project', MAIN_ENUMS.ENVS.DEV, ['icon.svg']);

    expect(svgr).toHaveBeenCalledWith(svgrConfig);
    expect(svgr).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple icons with correct paths', () => {
    const iconsList = ['folder/icon1.svg', 'folder/icon2.svg', 'icon3.svg'];
    const config = getConfig('/test/project', MAIN_ENUMS.ENVS.DEV, iconsList);

    expect(config.input).toEqual([
      'src/assets/icons/folder/icon1.svg',
      'src/assets/icons/folder/icon2.svg',
      'src/assets/icons/icon3.svg',
    ]);
  });
});
