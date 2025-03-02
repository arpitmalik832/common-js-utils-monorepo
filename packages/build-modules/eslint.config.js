/**
 * ESLint configuration for the library.
 * @file This file is saved as `eslint.config.js`.
 */
import babelParser from '@babel/eslint-parser';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jsdoc from 'eslint-plugin-jsdoc';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
});

const jsFiles = ['**/*.?(c|m)js?(x)'];
const jestFiles = ['**/*/__tests__/**/*.@(t|j)s?(x)'];

export default [
  {
    ignores: [
      'node_modules/*',
      'dist/*',
      'build/*',
      'coverage/*',
      '**/*.md',
      'distInfo/*',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: true,
        BlobPart: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 2,
    },
  },
  ...compat.config({
    extends: ['airbnb-base', 'prettier'],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': [
        1,
        {
          endOfLine: 'lf',
        },
      ],
    },
  }),
  {
    files: [...jsFiles],
    ...js.configs.recommended,
    ...importPlugin.flatConfigs.recommended,
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-extraneous-dependencies': [
        2,
        {
          packageDir: '.',
        },
      ],
      'import/prefer-default-export': 0,
      'import/extensions': [
        2,
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-unresolved': [
        2,
        {
          ignore: ['typescript-eslint'],
        },
      ],
      'no-console': 2,
      'no-debugger': 2,
      'no-unused-vars': 2,
      'prefer-destructuring': 2,
      'func-names': 2,
      camelcase: 1,
    },
  },
  {
    files: jestFiles,
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
      },
    },
  },
  {
    files: jsFiles,
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
          presets: ['@babel/preset-env'],
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
