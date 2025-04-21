/**
 * @file Unit tests for React Flow ESLint configuration.
 */
import reactFlowConfig from '../reactFlow.js';
import {
  getIgnoreConfig,
  globalsConfig,
  getBaseReactFlowConfig,
  jestConfig,
  mdConfig,
  cypressConfig,
} from '../../baseConfigs/index.js';

// Mock the imported configurations
jest.mock('../../baseConfigs/index.js', () => ({
  getIgnoreConfig: jest.fn().mockReturnValue([{ ignores: ['mocked-ignore'] }]),
  globalsConfig: [{ languageOptions: { globals: { mocked: true } } }],
  getBaseReactFlowConfig: jest
    .fn()
    .mockReturnValue([{ rules: { 'react-flow/mocked-rule': 'error' } }]),
  jestConfig: [{ files: ['**/*.test.js'] }],
  mdConfig: [{ files: ['**/*.md'] }],
  cypressConfig: [{ files: ['**/*.cy.js'] }],
}));

// Mock the storybook plugin
jest.mock('eslint-plugin-storybook', () => ({
  configs: {
    'flat/recommended': [{ rules: { 'storybook/mocked-rule': 'error' } }],
  },
}));

describe('React Flow ESLint Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfig function', () => {
    test('should return an array of configurations', () => {
      const config = reactFlowConfig();
      expect(Array.isArray(config)).toBe(true);
    });

    test('should include all required configurations', () => {
      const config = reactFlowConfig();
      expect(config).toHaveLength(7); // 7 configurations: ignore, globals, baseReactFlow, cypress, storybook, jest, md
    });

    test('should call getIgnoreConfig with the provided ignoredDirs', () => {
      const ignoredDirs = ['node_modules', 'dist'];
      reactFlowConfig(ignoredDirs);
      expect(getIgnoreConfig).toHaveBeenCalledWith(ignoredDirs);
    });

    test('should call getBaseReactFlowConfig with the provided noUnresolvedIgnoreArr', () => {
      const noUnresolvedIgnoreArr = ['package1', 'package2'];
      reactFlowConfig(undefined, noUnresolvedIgnoreArr);
      expect(getBaseReactFlowConfig).toHaveBeenCalledWith(
        noUnresolvedIgnoreArr,
      );
    });

    test('should include globalsConfig', () => {
      const config = reactFlowConfig();
      expect(config).toContainEqual(globalsConfig[0]);
    });

    test('should include baseReactFlowConfig', () => {
      const config = reactFlowConfig();
      expect(config).toContainEqual(getBaseReactFlowConfig()[0]);
    });

    test('should include cypressConfig', () => {
      const config = reactFlowConfig();
      expect(config).toContainEqual(cypressConfig[0]);
    });

    test('should include storybook plugin configuration', () => {
      const config = reactFlowConfig();
      expect(config).toContainEqual({
        rules: { 'storybook/mocked-rule': 'error' },
      });
    });

    test('should include jestConfig', () => {
      const config = reactFlowConfig();
      expect(config).toContainEqual(jestConfig[0]);
    });

    test('should include mdConfig', () => {
      const config = reactFlowConfig();
      expect(config).toContainEqual(mdConfig[0]);
    });

    test('should maintain the correct order of configurations', () => {
      const config = reactFlowConfig();
      expect(config[0]).toEqual(getIgnoreConfig()[0]);
      expect(config[1]).toEqual(globalsConfig[0]);
      expect(config[2]).toEqual(getBaseReactFlowConfig()[0]);
      expect(config[3]).toEqual(cypressConfig[0]);
      expect(config[4]).toEqual({
        rules: { 'storybook/mocked-rule': 'error' },
      });
      expect(config[5]).toEqual(jestConfig[0]);
      expect(config[6]).toEqual(mdConfig[0]);
    });
  });
});
