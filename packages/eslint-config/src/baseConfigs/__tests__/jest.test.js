/**
 * @file Unit tests for Jest ESLint configuration.
 */
import jestPlugin from 'eslint-plugin-jest';

import jestConfig from '../jest.js';
import { FILES_ENUMS } from '../../enums/index.js';

describe('Jest ESLint Configuration', () => {
  let config;

  beforeEach(() => {
    [config] = jestConfig;
  });

  describe('Configuration Structure', () => {
    test('should export an array of configurations', () => {
      expect(Array.isArray(jestConfig)).toBe(true);
      expect(jestConfig).toHaveLength(1);
    });

    test('should have valid configuration object', () => {
      expect(config).toBeInstanceOf(Object);
    });
  });

  describe('File Patterns', () => {
    test('should target Jest test files', () => {
      expect(config.files).toEqual([FILES_ENUMS.JEST_FILES]);
    });
  });

  describe('Plugins', () => {
    test('should include jest plugin', () => {
      expect(config.plugins).toHaveProperty('jest');
    });
  });

  describe('Language Options', () => {
    test('should include Jest globals', () => {
      expect(config.languageOptions.globals).toEqual(
        jestPlugin.environments.globals.globals,
      );
    });
  });
});
