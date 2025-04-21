/**
 * ESLint configuration for the monorepo.
 * @file This file is saved as `eslint.config.js`.
 */
import { getCommonConfig } from '@arpitmalik832/eslint-config';

export default getCommonConfig(
  ['node_modules/*', 'packages/*', 'test-apps/*', '**/*.md', '.nx-cache'],
  ['typescript-eslint'],
);
