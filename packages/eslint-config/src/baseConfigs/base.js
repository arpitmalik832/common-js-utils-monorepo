/**
 * @file Base ESLint configuration for all projects.
 */
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';

import { FILES_ENUMS } from '../enums/index.js';
import { getDirname } from '../utils/index.js';

const dirname = getDirname();
const compat = new FlatCompat({
  baseDirectory: dirname,
});

/**
 * Get the base ESLint configuration.
 * @param {string[]} noUnresolvedIgnoreArr - Array of ignored packages.
 * @returns {import('eslint').Linter.FlatConfig[]} Flat config for ESLint.
 * @example
 * ```js
 * const config = getConfig();
 * ```
 */
function getConfig(noUnresolvedIgnoreArr = []) {
  return [
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
      files: [FILES_ENUMS.JS_FILES],
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
        'import/extensions': 0,
        'import/no-unresolved': [
          2,
          {
            ignore: noUnresolvedIgnoreArr,
          },
        ],
        'no-console': 2,
        'no-debugger': 2,
        'no-unused-vars': 2,
        'prefer-destructuring': 2,
        'func-names': 2,
        camelcase: 1,
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
}

export default getConfig;
