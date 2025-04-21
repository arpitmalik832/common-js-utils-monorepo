/**
 * @file Test file for webpack common configuration.
 */

import '@testing-library/jest-dom';

import getConfig from '../common.js';
import { MAIN_ENUMS } from '../../../enums/index.js';

// Mock the dependencies
jest.mock('../../../utils', () => ({
  getPaths: jest.fn().mockReturnValue({
    entryPath: '/mock/entry/path',
    outputPath: '/mock/output/path',
  }),
}));

jest.mock('../../svgrConfig', () => ({
  __esModule: true,
  default: {
    // Mock SVGR config
    svgo: true,
    svgoConfig: {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ],
    },
  },
}));

describe('getConfig', () => {
  const mockProjectRoot = '/mock/project/root';
  const mockPkg = {
    name: 'test-package',
    version: '1.0.0',
  };
  const mockEnvVariableName = 'TEST_ENV';
  const mockFilename = 'webpack.config.js';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid webpack configuration object', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );

    expect(config).toBeDefined();
    expect(config.entry).toBe('/mock/entry/path');
    expect(config.output).toBeDefined();
    expect(config.module).toBeDefined();
    expect(config.plugins).toBeDefined();
    expect(config.resolve).toBeDefined();
  });

  it('should configure output paths correctly', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );

    expect(config.output).toEqual({
      uniqueName: mockPkg.name,
      publicPath: '/',
      path: '/mock/output/path',
      filename: `${mockPkg.version}/js/[name].[chunkhash:8].js`,
      chunkFilename: `${mockPkg.version}/js/[name].[chunkhash:8].js`,
      assetModuleFilename: `${mockPkg.version}/assets/[name].[contenthash:8][ext]`,
      crossOriginLoading: 'anonymous',
    });
  });

  it('should enable source maps in development environment', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );
    expect(config.devtool).toBe('source-map');
  });

  it('should disable source maps in production environment', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.PROD,
      mockEnvVariableName,
      mockFilename,
    );
    expect(config.devtool).toBe(false);
  });

  it('should configure babel-loader correctly', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );
    const babelRule = config.module.rules.find(rule => rule.test.test('.js'));

    expect(babelRule).toBeDefined();
    expect(babelRule.use[0].loader).toBe('babel-loader');
    expect(babelRule.exclude).toEqual(/node_modules/);
  });

  it('should include transform-react-remove-prop-types plugin in production', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.PROD,
      mockEnvVariableName,
      mockFilename,
    );
    const babelRule = config.module.rules.find(rule => rule.test.test('.js'));

    expect(babelRule.use[0].options.plugins).toContainEqual([
      'transform-react-remove-prop-types',
      {
        removeImport: true,
      },
    ]);
  });

  it('should configure CSS loaders correctly', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );
    const cssRule = config.module.rules.find(rule => rule.test.test('.css'));

    expect(cssRule).toBeDefined();
    expect(cssRule.use).toContainEqual('style-loader');
    expect(cssRule.use).toContainEqual('css-loader');
  });

  it('should configure SCSS loaders correctly', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );
    const scssRule = config.module.rules.find(rule => rule.test.test('.scss'));

    expect(scssRule).toBeDefined();
    expect(scssRule.use).toContainEqual('sass-loader');
    expect(scssRule.exclude).toEqual(/node_modules/);
  });

  it('should configure SVG loaders correctly', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );
    const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

    expect(svgRule).toBeDefined();
    expect(svgRule.use[0].loader).toBe('@svgr/webpack');
    expect(svgRule.use[1]).toBe('url-loader');
  });

  it('should configure performance hints based on environment', () => {
    const devConfig = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );
    const prodConfig = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.PROD,
      mockEnvVariableName,
      mockFilename,
    );

    expect(devConfig.performance.hints).toBe('warning');
    expect(prodConfig.performance.hints).toBe('error');
  });

  it('should configure optimization based on environment', () => {
    const devConfig = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );
    const prodConfig = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.PROD,
      mockEnvVariableName,
      mockFilename,
    );

    expect(devConfig.optimization.minimize).toBe(false);
    expect(prodConfig.optimization.minimize).toBe(true);
  });

  it('should include necessary plugins', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );

    expect(config.plugins).toHaveLength(5); // webpack.DefinePlugin, Dotenv, HtmlWebpackPlugin, MiniCssExtractPlugin, CopyPlugin
  });

  it('should configure resolve extensions correctly', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );

    expect(config.resolve.extensions).toEqual(['.mjs', '.js', '.jsx']);
  });

  it('should configure vendor chunk naming correctly', () => {
    const config = getConfig(
      mockProjectRoot,
      mockPkg,
      MAIN_ENUMS.ENVS.DEV,
      mockEnvVariableName,
      mockFilename,
    );

    const vendorCacheGroup = config.optimization.splitChunks.cacheGroups.vendor;

    // Test the vendor cache group configuration
    expect(vendorCacheGroup).toBeDefined();
    expect(vendorCacheGroup.test).toEqual(/[\\/]node_modules[\\/]/);
    expect(vendorCacheGroup.chunks).toBe('all');
    expect(vendorCacheGroup.priority).toBe(-10);
    expect(vendorCacheGroup.reuseExistingChunk).toBe(true);
    expect(vendorCacheGroup.enforce).toBe(true);
    expect(vendorCacheGroup.maxInitialRequests).toBe(30);
    expect(vendorCacheGroup.maxAsyncRequests).toBe(30);

    // Test the name function with different module contexts
    const nameFunction = vendorCacheGroup.name;

    // Test with a valid module context
    const moduleWithValidContext = {
      context: '/project/node_modules/react/index.js',
    };
    expect(nameFunction(moduleWithValidContext)).toBe('vendorreact');

    // Test with a module context that doesn't match the pattern
    const moduleWithInvalidContext = {
      context: '/project/src/components/Button.js',
    };
    expect(nameFunction(moduleWithInvalidContext)).toBe('vendor');

    // Test with a module context that has a nested package
    const moduleWithNestedPackage = {
      context: '/project/node_modules/@babel/core/lib/index.js',
    };
    expect(nameFunction(moduleWithNestedPackage)).toBe('vendor@babel');
  });
});
