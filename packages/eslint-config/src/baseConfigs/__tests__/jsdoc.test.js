/**
 * @file Unit tests for JSDoc ESLint configuration.
 */
import babelParser from '@babel/eslint-parser';

import jsdocConfig from '../jsdoc.js';
import { FILES_ENUMS } from '../../enums/index.js';

describe('JSDoc ESLint Configuration', () => {
  let config;

  beforeEach(() => {
    [config] = jsdocConfig;
  });

  describe('Configuration Structure', () => {
    test('should export an array of configurations', () => {
      expect(Array.isArray(jsdocConfig)).toBe(true);
      expect(jsdocConfig).toHaveLength(1);
    });

    test('should have valid configuration object', () => {
      expect(config).toBeInstanceOf(Object);
    });
  });

  describe('File Patterns', () => {
    test('should target JavaScript files only', () => {
      expect(config.files).toEqual([FILES_ENUMS.JS_FILES]);
    });
  });

  describe('Plugins', () => {
    test('should include jsdoc plugin', () => {
      expect(config.plugins).toHaveProperty('jsdoc');
    });
  });

  describe('Rules', () => {
    test('should have all required JSDoc rules enabled', () => {
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
        expect(config.rules[`jsdoc/${rule}`]).toBeDefined();
      });
    });

    test('should have correct rule severity levels', () => {
      expect(config.rules['jsdoc/check-indentation']).toBe(1);
      expect(config.rules['jsdoc/check-types']).toBe(2);
      expect(config.rules['jsdoc/check-values']).toBe(2);
      expect(config.rules['jsdoc/check-syntax']).toBe(2);
      expect(config.rules['jsdoc/check-alignment']).toBe(2);
      expect(config.rules['jsdoc/check-tag-names']).toBe(2);
      expect(config.rules['jsdoc/check-param-names']).toBe(2);
      expect(config.rules['jsdoc/check-property-names']).toBe(2);
      expect(config.rules['jsdoc/check-line-alignment']).toBe(2);
      expect(config.rules['jsdoc/require-jsdoc']).toBe(2);
      expect(config.rules['jsdoc/require-param']).toBe(2);
      expect(config.rules['jsdoc/require-throws']).toBe(2);
      expect(config.rules['jsdoc/require-yields']).toBe(2);
      expect(config.rules['jsdoc/require-returns']).toBe(2);
      expect(config.rules['jsdoc/require-example']).toBe(2);
      expect(config.rules['jsdoc/require-template']).toBe(2);
      expect(config.rules['jsdoc/require-property']).toBe(2);
      expect(config.rules['jsdoc/require-param-type']).toBe(2);
      expect(config.rules['jsdoc/require-param-name']).toBe(2);
      expect(config.rules['jsdoc/require-description']).toBe(2);
      expect(config.rules['jsdoc/require-returns-type']).toBe(2);
      expect(config.rules['jsdoc/require-yields-check']).toBe(2);
      expect(config.rules['jsdoc/require-file-overview']).toBe(2);
      expect(config.rules['jsdoc/require-returns-check']).toBe(2);
      expect(config.rules['jsdoc/require-property-name']).toBe(2);
      expect(config.rules['jsdoc/require-property-type']).toBe(2);
      expect(config.rules['jsdoc/require-asterisk-prefix']).toBe(2);
      expect(config.rules['jsdoc/require-param-description']).toBe(2);
      expect(config.rules['jsdoc/require-returns-description']).toBe(2);
      expect(config.rules['jsdoc/require-property-description']).toBe(2);
      expect(config.rules['jsdoc/require-description-complete-sentence']).toBe(
        2,
      );
      expect(
        config.rules['jsdoc/require-hyphen-before-param-description'],
      ).toBe(2);
      expect(config.rules['jsdoc/sort-tags']).toBe(2);
      expect(config.rules['jsdoc/tag-lines']).toBe(2);
      expect(config.rules['jsdoc/valid-types']).toBe(2);
    });
  });

  describe('Language Options', () => {
    test('should have correct parser options', () => {
      expect(config.languageOptions.parser).toBe(babelParser);
      expect(config.languageOptions.ecmaVersion).toBe(6);
      expect(config.languageOptions.parserOptions).toEqual({
        requireConfigFile: false,
        babelOptions: {
          presets: [
            [
              '@babel/preset-react',
              {
                runtime: 'automatic',
              },
            ],
            '@babel/preset-env',
          ],
        },
      });
    });
  });

  describe('Settings', () => {
    test('should have correct import resolver settings', () => {
      expect(config.settings['import/resolver']).toEqual({
        node: {
          extensions: ['.js', '.jsx'],
        },
      });
    });
  });
});
