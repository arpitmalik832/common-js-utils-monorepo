/**
 * @file Unit tests for React ESLint configuration.
 */
import reactConfig from '../react.js';
import {
  getIgnoreConfig,
  globalsConfig,
  getBaseReactConfig,
  jestConfig,
  jsdocConfig,
  mdConfig,
  cypressConfig,
} from '../../baseConfigs/index.js';

// Mock the imported configurations
jest.mock('../../baseConfigs/index.js', () => ({
  getIgnoreConfig: jest.fn().mockReturnValue([{ ignores: ['mocked-ignore'] }]),
  globalsConfig: [{ languageOptions: { globals: { mocked: true } } }],
  getBaseReactConfig: jest
    .fn()
    .mockReturnValue([{ rules: { 'react/mocked-rule': 'error' } }]),
  jestConfig: [{ files: ['**/*.test.js'] }],
  jsdocConfig: [{ plugins: { jsdoc: {} } }],
  mdConfig: [{ files: ['**/*.md'] }],
  cypressConfig: [{ files: ['**/*.cy.js'] }],
}));

// Mock the storybook plugin
jest.mock('eslint-plugin-storybook', () => ({
  configs: {
    'flat/recommended': [{ rules: { 'storybook/mocked-rule': 'error' } }],
  },
}));

describe('React ESLint Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfig function', () => {
    test('should return an array of configurations', () => {
      const config = reactConfig();
      expect(Array.isArray(config)).toBe(true);
    });

    test('should include all required configurations', () => {
      const config = reactConfig();
      expect(config).toHaveLength(8); // 8 configurations: ignore, globals, baseReact, cypress, storybook, jest, jsdoc, md
    });

    test('should call getIgnoreConfig with the provided ignoredDirs', () => {
      const ignoredDirs = ['node_modules', 'dist'];
      reactConfig(ignoredDirs);
      expect(getIgnoreConfig).toHaveBeenCalledWith(ignoredDirs);
    });

    test('should call getBaseReactConfig with the provided noUnresolvedIgnoreArr', () => {
      const noUnresolvedIgnoreArr = ['package1', 'package2'];
      reactConfig(undefined, noUnresolvedIgnoreArr);
      expect(getBaseReactConfig).toHaveBeenCalledWith(noUnresolvedIgnoreArr);
    });

    test('should include globalsConfig', () => {
      const config = reactConfig();
      expect(config).toContainEqual(globalsConfig[0]);
    });

    test('should include baseReactConfig', () => {
      const config = reactConfig();
      expect(config).toContainEqual(getBaseReactConfig()[0]);
    });

    test('should include cypressConfig', () => {
      const config = reactConfig();
      expect(config).toContainEqual(cypressConfig[0]);
    });

    test('should include storybook plugin configuration', () => {
      const config = reactConfig();
      expect(config).toContainEqual({
        rules: { 'storybook/mocked-rule': 'error' },
      });
    });

    test('should include jestConfig', () => {
      const config = reactConfig();
      expect(config).toContainEqual(jestConfig[0]);
    });

    test('should include jsdocConfig', () => {
      const config = reactConfig();
      expect(config).toContainEqual(jsdocConfig[0]);
    });

    test('should include mdConfig', () => {
      const config = reactConfig();
      expect(config).toContainEqual(mdConfig[0]);
    });

    test('should maintain the correct order of configurations', () => {
      const config = reactConfig();
      expect(config[0]).toEqual(getIgnoreConfig()[0]);
      expect(config[1]).toEqual(globalsConfig[0]);
      expect(config[2]).toEqual(getBaseReactConfig()[0]);
      expect(config[3]).toEqual(cypressConfig[0]);
      expect(config[4]).toEqual({
        rules: { 'storybook/mocked-rule': 'error' },
      });
      expect(config[5]).toEqual(jestConfig[0]);
      expect(config[6]).toEqual(jsdocConfig[0]);
      expect(config[7]).toEqual(mdConfig[0]);
    });
  });
});
