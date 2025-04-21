/**
 * @file Unit tests for Markdown ESLint configuration.
 */
import mdConfig from '../md.js';
import { FILES_ENUMS } from '../../enums/index.js';

// Mock the required dependencies
jest.mock('eslint-plugin-mdx', () => ({
  flat: {
    rules: {
      'mdx/no-unescaped-entities': 'error',
      'mdx/no-unknown-components': 'error',
    },
  },
  flatCodeBlocks: {
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  createRemarkProcessor: jest.fn().mockReturnValue({
    name: 'mdx',
    supportsAutofix: true,
  }),
}));

jest.mock('eslint-mdx', () => ({
  name: 'mdx',
  parseForESLint: jest.fn(),
}));

describe('Markdown ESLint Configuration', () => {
  let config;

  beforeEach(() => {
    [config] = mdConfig;
  });

  describe('Configuration Structure', () => {
    test('should export an array of configurations', () => {
      expect(Array.isArray(mdConfig)).toBe(true);
      expect(mdConfig).toHaveLength(1);
    });

    test('should have valid configuration object', () => {
      expect(config).toBeInstanceOf(Object);
    });
  });

  describe('File Patterns', () => {
    test('should target Markdown files', () => {
      expect(config.files).toEqual([FILES_ENUMS.MD_FILES]);
    });
  });

  describe('Language Options', () => {
    test('should have correct parser', () => {
      expect(config.languageOptions.parser).toBeDefined();
    });

    test('should have correct parser options', () => {
      expect(config.languageOptions.parserOptions).toEqual({
        extensions: [FILES_ENUMS.MD_FILES, FILES_ENUMS.JS_FILES],
        markdownExtensions: [FILES_ENUMS.MD_FILES, FILES_ENUMS.JS_FILES],
      });
    });
  });

  describe('Settings', () => {
    test('should have correct import resolver settings', () => {
      expect(config.settings['import/resolver']).toEqual({
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      });
    });
  });

  describe('Processor', () => {
    test('should have correct processor configuration', () => {
      expect(config.processor).toBeDefined();
      expect(config.processor.name).toBe('mdx');
      expect(config.processor.supportsAutofix).toBe(true);
    });
  });

  describe('Rules', () => {
    test('should have correct code style rules', () => {
      expect(config.rules['no-var']).toBe('error');
      expect(config.rules['prefer-const']).toBe('error');
    });

    test('should have all JSDoc rules disabled', () => {
      const jsdocRules = [
        'check-types',
        'check-values',
        'check-syntax',
        'check-alignment',
        'check-tag-names',
        'check-indentation',
        'check-param-names',
        'check-property-names',
        'check-line-alignment',
        'require-jsdoc',
        'require-param',
        'require-throws',
        'require-yields',
        'require-returns',
        'require-example',
        'require-template',
        'require-property',
        'require-param-type',
        'require-param-name',
        'require-description',
        'require-returns-type',
        'require-yields-check',
        'require-file-overview',
        'require-returns-check',
        'require-property-name',
        'require-property-type',
        'require-asterisk-prefix',
        'require-param-description',
        'require-returns-description',
        'require-property-description',
        'require-description-complete-sentence',
        'require-hyphen-before-param-description',
        'sort-tags',
        'tag-lines',
        'valid-types',
      ];

      jsdocRules.forEach(rule => {
        expect(config.rules[`jsdoc/${rule}`]).toBe('off');
      });
    });
  });
});
