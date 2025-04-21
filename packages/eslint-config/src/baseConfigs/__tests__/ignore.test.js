/**
 * @file Unit tests for ignore ESLint configuration.
 */
import getIgnoreConfig from '../ignore.js';

describe('Ignore ESLint Configuration', () => {
  describe('Configuration Structure', () => {
    test('should export a function', () => {
      expect(typeof getIgnoreConfig).toBe('function');
    });

    test('should return an array of configurations', () => {
      const config = getIgnoreConfig();
      expect(Array.isArray(config)).toBe(true);
      expect(config).toHaveLength(1);
    });

    test('should have valid configuration object', () => {
      const [config] = getIgnoreConfig();
      expect(config).toBeInstanceOf(Object);
      expect(config).toHaveProperty('ignores');
    });
  });

  describe('Ignore Patterns', () => {
    test('should use empty array as default ignored directories', () => {
      const [config] = getIgnoreConfig();
      expect(config.ignores).toEqual([]);
    });

    test('should use provided ignored directories', () => {
      const ignoredDirs = ['dist/', 'node_modules/'];
      const [config] = getIgnoreConfig(ignoredDirs);
      expect(config.ignores).toEqual(ignoredDirs);
    });
  });
});
