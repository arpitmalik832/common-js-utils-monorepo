/**
 * @file Test file for webpack workers configuration.
 */

import '@testing-library/jest-dom';

import getConfig from '../workers.js';
import { getPaths } from '../../../utils';

// Mock the dependencies
jest.mock('../../../utils', () => ({
  getPaths: jest.fn().mockReturnValue({
    outputPath: '/mock/output/path',
  }),
}));

// Mock the InjectManifest plugin
jest.mock('workbox-webpack-plugin', () => ({
  InjectManifest: jest.fn().mockImplementation(options => ({
    apply: jest.fn(),
    options,
  })),
}));

describe('getConfig', () => {
  const mockProjectRoot = '/mock/project/root';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid webpack workers configuration object', () => {
    const config = getConfig(mockProjectRoot);

    expect(config).toBeDefined();
    expect(config.plugins).toBeDefined();
    expect(config.plugins.length).toBe(1);
  });

  it('should configure InjectManifest plugin correctly', () => {
    const config = getConfig(mockProjectRoot);
    const injectManifestPlugin = config.plugins[0];

    expect(injectManifestPlugin).toBeDefined();
    expect(injectManifestPlugin.options.swDest).toBe('/mock/output/path/sw.js');
    expect(injectManifestPlugin.options.swSrc).toBe('./public/sw.js');
    expect(injectManifestPlugin.options.exclude).toEqual([
      /asset-manifest\.json$/,
      /\.gz$/,
      /src\/assets\//,
    ]);
    expect(injectManifestPlugin.options.chunks).toEqual([]);
  });

  it('should call getPaths with the correct project root', () => {
    getConfig(mockProjectRoot);

    expect(getPaths).toHaveBeenCalledWith(mockProjectRoot);
  });
});
