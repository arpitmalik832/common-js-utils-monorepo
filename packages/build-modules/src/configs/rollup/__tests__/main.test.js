/**
 * Unit tests for rollup main configuration.
 * @file This file is saved as `main.test.js`.
 */
import '@testing-library/jest-dom';

import { MAIN_ENUMS } from '../../../enums/index.js';
import getConfig from '../main.js';

// Mock all plugins
jest.mock('@rollup/plugin-node-resolve', () =>
  jest.fn(options => ({
    name: 'node-resolve',
    options,
  })),
);
jest.mock('@rollup/plugin-commonjs', () =>
  jest.fn(() => ({
    name: 'commonjs',
  })),
);
jest.mock('@rollup/plugin-babel', () =>
  jest.fn(options => ({
    name: 'babel',
    options,
  })),
);
jest.mock('@svgr/rollup', () =>
  jest.fn(options => ({
    name: 'svgr',
    options,
  })),
);
jest.mock('@rollup/plugin-url', () =>
  jest.fn(() => ({
    name: 'url',
  })),
);
jest.mock('@rollup/plugin-image', () =>
  jest.fn(() => ({
    name: 'image',
  })),
);
jest.mock('rollup-plugin-postcss', () =>
  jest.fn(options => ({
    name: 'postcss',
    options,
  })),
);
jest.mock('@rollup/plugin-json', () =>
  jest.fn(() => ({
    name: 'json',
  })),
);
jest.mock('rollup-plugin-progress', () =>
  jest.fn(() => ({
    name: 'progress',
  })),
);

// Mock internal plugins and utils
jest.mock('../../../plugins/rollup/CopyPlugin.js', () =>
  jest.fn(options => ({
    name: 'copy',
    options,
  })),
);

jest.mock('../../../plugins/rollup/StripCustomWindowVariablesPlugin.js', () =>
  jest.fn(options => ({
    name: 'strip-custom-window-variables',
    options,
  })),
);

jest.mock('../../svgrConfig.js', () => ({
  icon: true,
  typescript: true,
  ref: true,
}));

jest.mock('../../../utils/fileUtils.js', () => ({
  getPaths: jest.fn(projectRoot => ({
    entryPath: `${projectRoot}/src/index.js`,
    outputPath: `${projectRoot}/dist`,
    stylesPath: `${projectRoot}/dist/styles.css`,
  })),
  getDirname: jest.fn(() => '/test/project'),
}));

describe('rollup main config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate correct config with production environment', () => {
    const projectRoot = '/test/project';
    const env = MAIN_ENUMS.ENVS.PROD;
    const windowVariablesToStrip = ['__DEV__'];
    const arrayForCopyPlugin = [{ src: 'assets', dest: 'dist/assets' }];

    const config = getConfig(
      projectRoot,
      env,
      windowVariablesToStrip,
      arrayForCopyPlugin,
    );

    // Test input and output configuration
    expect(config.input).toBe('/test/project/src/index.js');
    expect(config.output).toHaveLength(2);
    expect(config.output[0]).toMatchObject({
      format: 'esm',
      sourcemap: false,
      entryFileNames: 'esm/lib.js',
    });
    expect(config.output[1]).toMatchObject({
      format: 'cjs',
      sourcemap: false,
      entryFileNames: 'cjs/lib.js',
    });

    // Test external configuration
    expect(config.external[0]).toEqual(/node_modules/);

    // Test plugins configuration
    const plugins = config.plugins.filter(Boolean); // Remove falsy plugins
    expect(plugins).toHaveLength(12); // All plugins except conditional ones

    // Test resolve plugin
    expect(plugins.find(p => p.name === 'node-resolve').options).toEqual({
      extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
      mainFields: ['module', 'main'],
      modulesOnly: true,
      preferBuiltins: true,
    });

    // Test babel plugin
    expect(plugins.find(p => p.name === 'babel').options).toEqual({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      configFile: './babel.config.cjs',
      extensions: ['.js', '.jsx'],
    });

    // Test PostCSS plugin
    expect(plugins.find(p => p.name === 'postcss').options).toMatchObject({
      extensions: ['.css', '.scss'],
      extract: '/test/project/dist/styles.css',
      minimize: true,
      modules: true,
      use: ['sass'],
    });

    // Test stripCustomWindowVariables plugin
    expect(
      plugins.find(p => p.name === 'strip-custom-window-variables').options,
    ).toEqual({
      variables: ['__DEV__'],
    });

    // Test copy plugin
    expect(plugins.find(p => p.name === 'copy').options).toEqual([
      { src: 'assets', dest: 'dist/assets' },
    ]);
  });

  it('should generate correct config with development environment', () => {
    const projectRoot = '/test/project';
    const env = MAIN_ENUMS.ENVS.DEV;
    const windowVariablesToStrip = [];
    const arrayForCopyPlugin = [];

    const config = getConfig(
      projectRoot,
      env,
      windowVariablesToStrip,
      arrayForCopyPlugin,
    );

    // Test sourcemaps are enabled in development
    expect(config.output[0].sourcemap).toBe(true);
    expect(config.output[1].sourcemap).toBe(true);

    // Test stripCustomWindowVariables plugin is not included
    const plugins = config.plugins.filter(Boolean);
    expect(
      plugins.find(p => p.name === 'strip-custom-window-variables'),
    ).toBeUndefined();

    // Test PostCSS minimize is false in development
    expect(plugins.find(p => p.name === 'postcss').options.minimize).toBe(
      false,
    );
  });

  it('should handle PostCSS config paths correctly', () => {
    const projectRoot = '/test/project';
    const config = getConfig(projectRoot, MAIN_ENUMS.ENVS.DEV, [], []);
    const postcssPlugin = config.plugins.find(p => p.name === 'postcss');

    expect(postcssPlugin.options.config.path).toEqual(
      '/test/project/postcss.config.js',
    );
  });

  it('should pass correct environment to PostCSS config', () => {
    const testCases = [
      { env: MAIN_ENUMS.ENVS.PROD, expectedEnv: MAIN_ENUMS.ENVS.PROD },
      { env: MAIN_ENUMS.ENVS.BETA, expectedEnv: MAIN_ENUMS.ENVS.PROD },
      { env: MAIN_ENUMS.ENVS.DEV, expectedEnv: MAIN_ENUMS.ENVS.STG },
      { env: MAIN_ENUMS.ENVS.STG, expectedEnv: MAIN_ENUMS.ENVS.STG },
    ];

    testCases.forEach(({ env, expectedEnv }) => {
      const config = getConfig('/test/project', env, [], []);
      const postcssPlugin = config.plugins.find(p => p.name === 'postcss');
      expect(postcssPlugin.options.config.ctx.env).toBe(expectedEnv);
    });
  });
});
