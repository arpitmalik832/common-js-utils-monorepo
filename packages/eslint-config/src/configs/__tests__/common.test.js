/**
 * @file Unit tests for common ESLint configuration.
 */
import commonConfig from '../common.js';
import {
  getIgnoreConfig,
  globalsConfig,
  getBaseConfig,
  jestConfig,
  jsdocConfig,
  mdConfig,
} from '../../baseConfigs/index.js';

// Mock the imported configurations
jest.mock('../../baseConfigs/index.js', () => ({
  getIgnoreConfig: jest.fn().mockReturnValue([{ ignores: ['mocked-ignore'] }]),
  globalsConfig: [{ languageOptions: { globals: { mocked: true } } }],
  getBaseConfig: jest
    .fn()
    .mockReturnValue([{ rules: { 'mocked-rule': 'error' } }]),
  jestConfig: [{ files: ['**/*.test.js'] }],
  jsdocConfig: [{ plugins: { jsdoc: {} } }],
  mdConfig: [{ files: ['**/*.md'] }],
}));

describe('Common ESLint Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfig function', () => {
    test('should return an array of configurations', () => {
      const config = commonConfig();
      expect(Array.isArray(config)).toBe(true);
    });

    test('should include all required configurations', () => {
      const config = commonConfig();
      expect(config).toHaveLength(6); // 6 configurations: ignore, globals, base, jest, jsdoc, md
    });

    test('should call getIgnoreConfig with the provided ignoredDirs', () => {
      const ignoredDirs = ['node_modules', 'dist'];
      commonConfig(ignoredDirs);
      expect(getIgnoreConfig).toHaveBeenCalledWith(ignoredDirs);
    });

    test('should call getBaseConfig with the provided noUnresolvedIgnoreArr', () => {
      const noUnresolvedIgnoreArr = ['package1', 'package2'];
      commonConfig(undefined, noUnresolvedIgnoreArr);
      expect(getBaseConfig).toHaveBeenCalledWith(noUnresolvedIgnoreArr);
    });

    test('should include globalsConfig', () => {
      const config = commonConfig();
      expect(config).toContainEqual(globalsConfig[0]);
    });

    test('should include baseConfig', () => {
      const config = commonConfig();
      expect(config).toContainEqual(getBaseConfig()[0]);
    });

    test('should include jestConfig', () => {
      const config = commonConfig();
      expect(config).toContainEqual(jestConfig[0]);
    });

    test('should include jsdocConfig', () => {
      const config = commonConfig();
      expect(config).toContainEqual(jsdocConfig[0]);
    });

    test('should include mdConfig', () => {
      const config = commonConfig();
      expect(config).toContainEqual(mdConfig[0]);
    });

    test('should maintain the correct order of configurations', () => {
      const config = commonConfig();
      expect(config[0]).toEqual(getIgnoreConfig()[0]);
      expect(config[1]).toEqual(globalsConfig[0]);
      expect(config[2]).toEqual(getBaseConfig()[0]);
      expect(config[3]).toEqual(jestConfig[0]);
      expect(config[4]).toEqual(jsdocConfig[0]);
      expect(config[5]).toEqual(mdConfig[0]);
    });
  });
});
