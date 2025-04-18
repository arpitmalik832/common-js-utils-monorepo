/**
 * Unit tests for SVGR configuration.
 * @file This file is saved as `svgrConfig.test.js`.
 */

import config from '../svgrConfig.js';

describe('SVGR config', () => {
  it('should have correct base configuration options', () => {
    expect(config.prettier).toBe(true);
    expect(config.svgo).toBe(true);
    expect(config.exportType).toBe('named');
    expect(config.titleProp).toBe(true);
    expect(config.ref).toBe(true);
    expect(config.icon).toBe(false);
  });

  it('should have correct output directory configuration', () => {
    expect(config.outputDir).toBe('dist/assets');
  });

  it('should have correct SVGO configuration', () => {
    expect(config.svgoConfig).toBeDefined();
    expect(config.svgoConfig.plugins).toBeInstanceOf(Array);
    expect(config.svgoConfig.plugins).toHaveLength(1);
  });

  it('should have correct SVGO preset-default plugin configuration', () => {
    const presetDefaultPlugin = config.svgoConfig.plugins[0];

    expect(presetDefaultPlugin).toEqual({
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    });
  });

  it('should maintain viewBox with SVGO configuration', () => {
    const presetDefaultPlugin = config.svgoConfig.plugins[0];
    expect(presetDefaultPlugin.params.overrides.removeViewBox).toBe(false);
  });

  it('should export configuration with correct values', () => {
    // Create a snapshot of expected configuration
    const expectedConfig = {
      prettier: true,
      svgo: true,
      exportType: 'named',
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
      titleProp: true,
      ref: true,
      outputDir: 'dist/assets',
      icon: false,
    };

    // Compare with actual configuration
    expect(config).toEqual(expectedConfig);
  });

  it('should have all required properties', () => {
    const requiredProps = [
      'prettier',
      'svgo',
      'exportType',
      'svgoConfig',
      'titleProp',
      'ref',
      'outputDir',
      'icon',
    ];

    requiredProps.forEach(prop => {
      expect(config).toHaveProperty(prop);
    });
  });
});
