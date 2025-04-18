/**
 * Unit tests for PostCSS configuration.
 * @file This file is saved as `postcssConfig.test.js`.
 */
import '@testing-library/jest-dom';

import getConfig from '../postcssConfig.js';

describe('PostCSS config', () => {
  it('should generate correct config for production environment', () => {
    const ctx = { env: 'production' };
    const config = getConfig(ctx);

    expect(config).toEqual({
      plugins: {
        'postcss-preset-env': {},
        autoprefixer: {},
        'postcss-flexbugs-fixes': {},
        cssnano: {},
      },
    });
  });

  it('should generate correct config for beta environment', () => {
    const ctx = { env: 'beta' };
    const config = getConfig(ctx);

    expect(config).toEqual({
      plugins: {
        'postcss-preset-env': {},
        autoprefixer: {},
        'postcss-flexbugs-fixes': {},
        cssnano: {},
      },
    });
  });

  it('should disable cssnano for development environment', () => {
    const ctx = { env: 'development' };
    const config = getConfig(ctx);

    expect(config).toEqual({
      plugins: {
        'postcss-preset-env': {},
        autoprefixer: {},
        'postcss-flexbugs-fixes': {},
        cssnano: false,
      },
    });
  });

  it('should disable cssnano for staging environment', () => {
    const ctx = { env: 'staging' };
    const config = getConfig(ctx);

    expect(config).toEqual({
      plugins: {
        'postcss-preset-env': {},
        autoprefixer: {},
        'postcss-flexbugs-fixes': {},
        cssnano: false,
      },
    });
  });

  it('should include all required plugins', () => {
    const config = getConfig({ env: 'development' });
    const plugins = Object.keys(config.plugins);

    expect(plugins).toContain('postcss-preset-env');
    expect(plugins).toContain('autoprefixer');
    expect(plugins).toContain('postcss-flexbugs-fixes');
    expect(plugins).toContain('cssnano');
  });

  it('should handle undefined environment', () => {
    const config = getConfig({});

    expect(config).toEqual({
      plugins: {
        'postcss-preset-env': {},
        autoprefixer: {},
        'postcss-flexbugs-fixes': {},
        cssnano: false,
      },
    });
  });

  it('should handle null context', () => {
    const config = getConfig(null);

    expect(config).toEqual({
      plugins: {
        'postcss-preset-env': {},
        autoprefixer: {},
        'postcss-flexbugs-fixes': {},
        cssnano: false,
      },
    });
  });

  it('should handle undefined context', () => {
    const config = getConfig();

    expect(config).toEqual({
      plugins: {
        'postcss-preset-env': {},
        autoprefixer: {},
        'postcss-flexbugs-fixes': {},
        cssnano: false,
      },
    });
  });
});
