/**
 * @file ESLint configuration for Markdown.
 */
import * as mdxPlugin from 'eslint-plugin-mdx';
import * as eslintMdx from 'eslint-mdx';

import { FILES_ENUMS } from '../enums/index.js';

const config = [
  {
    ...mdxPlugin.flat,
    ...mdxPlugin.flatCodeBlocks,
    files: [FILES_ENUMS.MD_FILES],
    languageOptions: {
      parser: eslintMdx,
      parserOptions: {
        extensions: [FILES_ENUMS.MD_FILES, FILES_ENUMS.JS_FILES],
        markdownExtensions: [FILES_ENUMS.MD_FILES, FILES_ENUMS.JS_FILES],
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    processor: mdxPlugin.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
    rules: {
      ...mdxPlugin.flatCodeBlocks.rules,
      'no-var': 'error',
      'prefer-const': 'error',
      // Disable all JSDoc rules for markdown files
      'jsdoc/check-types': 'off',
      'jsdoc/check-values': 'off',
      'jsdoc/check-syntax': 'off',
      'jsdoc/check-alignment': 'off',
      'jsdoc/check-tag-names': 'off',
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/check-property-names': 'off',
      'jsdoc/check-line-alignment': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-throws': 'off',
      'jsdoc/require-yields': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-example': 'off',
      'jsdoc/require-template': 'off',
      'jsdoc/require-property': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-param-name': 'off',
      'jsdoc/require-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-yields-check': 'off',
      'jsdoc/require-file-overview': 'off',
      'jsdoc/require-returns-check': 'off',
      'jsdoc/require-property-name': 'off',
      'jsdoc/require-property-type': 'off',
      'jsdoc/require-asterisk-prefix': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-description-complete-sentence': 'off',
      'jsdoc/require-hyphen-before-param-description': 'off',
      'jsdoc/sort-tags': 'off',
      'jsdoc/tag-lines': 'off',
      'jsdoc/valid-types': 'off',
    },
  },
];

export default config;
