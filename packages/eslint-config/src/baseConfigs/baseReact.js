/**
 * @file Base React configuration.
 */
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { FILES_ENUMS } from '../enums/index.js';
import { getDirname } from '../utils/index.js';

const dirname = getDirname();
const compat = new FlatCompat({
  baseDirectory: dirname,
});

/**
 * Get the base React configuration.
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
      extends: ['airbnb', 'plugin:css-modules/recommended', 'prettier'],
      plugins: ['css-modules', 'prettier'],
      rules: {
        'css-modules/no-unused-class': [
          2,
          {
            camelCase: true,
          },
        ],
        'css-modules/no-undef-class': [
          2,
          {
            camelCase: true,
          },
        ],
        'prettier/prettier': [
          1,
          {
            endOfLine: 'lf',
          },
        ],
      },
    }),
    {
      files: [FILES_ENUMS.JS_FILES, FILES_ENUMS.MD_FILES],
      ...js.configs.recommended,
      ...importPlugin.flatConfigs.recommended,
      ...jsxA11yPlugin.flatConfigs.strict,
      ...reactPlugin.configs.flat.all,
      ...reactPlugin.configs.flat['jsx-runtime'],
      ...reactHooksPlugin.configs.recommended,
      plugins: {
        import: importPlugin,
        'jsx-a11y': jsxA11yPlugin,
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
      },
      rules: {
        'react/react-in-jsx-scope': 0,
        'react/function-component-definition': 0,
        'react/prop-types': 0,
        'react/jsx-filename-extension': [
          0,
          {
            extensions: ['.tsx'],
          },
        ],
        'react/require-default-props': 0,
        'react-hooks/rules-of-hooks': 2,
        'react-hooks/exhaustive-deps': 0,
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
            ignore: noUnresolvedIgnoreArr,
          },
        ],
        'jsx-a11y/anchor-is-valid': 2,
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
