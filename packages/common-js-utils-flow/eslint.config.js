/**
 * ESLint configuration for the library.
 * @file This file is saved as `eslint.config.js`.
 */
import { getReactFlowConfig } from '@arpitmalik832/eslint-config';

export default getReactFlowConfig(
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
    'flow-typed/npm/*',
    '.logs/*',
  ],
  ['typescript-eslint'],
);
