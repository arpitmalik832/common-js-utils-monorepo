/**
 * @file Unit tests for globals ESLint configuration.
 */
import globals from 'globals';

import globalsConfig from '../globals.js';

describe('Globals ESLint Configuration', () => {
  let config;

  beforeEach(() => {
    [config] = globalsConfig;
  });

  describe('Configuration Structure', () => {
    test('should export an array of configurations', () => {
      expect(Array.isArray(globalsConfig)).toBe(true);
      expect(globalsConfig).toHaveLength(1);
    });

    test('should have valid configuration object', () => {
      expect(config).toBeInstanceOf(Object);
    });
  });

  describe('Language Options', () => {
    test('should include browser globals', () => {
      expect(config.languageOptions.globals).toMatchObject(globals.browser);
    });

    test('should include node globals', () => {
      expect(config.languageOptions.globals).toMatchObject(globals.node);
    });

    test('should include additional globals', () => {
      expect(config.languageOptions.globals.NodeJS).toBe(true);
      expect(config.languageOptions.globals.BlobPart).toBe(true);
    });
  });

  describe('Linter Options', () => {
    test('should have correct reportUnusedDisableDirectives setting', () => {
      expect(config.linterOptions.reportUnusedDisableDirectives).toBe(2);
    });
  });
});
