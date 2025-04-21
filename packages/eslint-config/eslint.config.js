/**
 * ESLint configuration for the library.
 * @file This file is saved as `eslint.config.js`.
 */
import { getCommonConfig } from './dist/esm/lib.js';

export default getCommonConfig(
  [
    'node_modules/*',
    'dist/*',
    'build/*',
    'coverage/*',
    'cypress/fixtures',
    'cypress/downloads',
    'cypress/videos',
    'cypress/screenshots',
    'storybook-static',
    '**/*.md',
    'distInfo/*',
    '.logs/*',
    'build_utils/index.mjs',
  ],
  ['typescript-eslint', 'eslint-plugin-cypress/flat'],
);
