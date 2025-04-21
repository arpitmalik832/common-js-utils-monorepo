/**
 * ESLint configuration for the library.
 * @file This file is saved as `eslint.config.js`.
 */
import { getReactConfig } from '@arpitmalik832/eslint-config';

export default getReactConfig(
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
  ],
  [
    'typescript-eslint',
    '@arpitmalik832/common-js-utils/.*\\.css$',
    '@arpitmalik832/common-js-utils/.*\\.svg$',
    '@arpitmalik832/common-js-utils/.*\\.png$',
    'react-dom/client',
    'eslint-plugin-cypress/flat',
  ],
);
