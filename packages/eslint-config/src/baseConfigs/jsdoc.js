/**
 * @file ESLint configuration for JSDoc.
 */
import babelParser from '@babel/eslint-parser';
import jsdoc from 'eslint-plugin-jsdoc';

import { FILES_ENUMS } from '../enums/index.js';

/**
 * ESLint configuration for JSDoc.
 */
const jsdocConfig = [
  {
    files: [FILES_ENUMS.JS_FILES],
    ...jsdoc.configs['flat/recommended'],
    plugins: {
      jsdoc,
    },
    rules: {
      // rules regarding jsdoc
      'jsdoc/check-types': 2,
      'jsdoc/check-values': 2,
      'jsdoc/check-syntax': 2,
      'jsdoc/check-alignment': 2,
      'jsdoc/check-tag-names': 2,
      'jsdoc/check-indentation': 1,
      'jsdoc/check-param-names': 2,
      'jsdoc/check-property-names': 2,
      'jsdoc/check-line-alignment': 2,
      'jsdoc/require-jsdoc': 2,
      'jsdoc/require-param': 2,
      'jsdoc/require-throws': 2,
      'jsdoc/require-yields': 2,
      'jsdoc/require-returns': 2,
      'jsdoc/require-example': 2,
      'jsdoc/require-template': 2,
      'jsdoc/require-property': 2,
      'jsdoc/require-param-type': 2,
      'jsdoc/require-param-name': 2,
      'jsdoc/require-description': 2,
      'jsdoc/require-returns-type': 2,
      'jsdoc/require-yields-check': 2,
      'jsdoc/require-file-overview': 2,
      'jsdoc/require-returns-check': 2,
      'jsdoc/require-property-name': 2,
      'jsdoc/require-property-type': 2,
      'jsdoc/require-asterisk-prefix': 2,
      'jsdoc/require-param-description': 2,
      'jsdoc/require-returns-description': 2,
      'jsdoc/require-property-description': 2,
      'jsdoc/require-description-complete-sentence': 2,
      'jsdoc/require-hyphen-before-param-description': 2,
      'jsdoc/sort-tags': 2,
      'jsdoc/tag-lines': 2,
      'jsdoc/valid-types': 2,
    },
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 6,
      parserOptions: {
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
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
  },
];

export default jsdocConfig;
