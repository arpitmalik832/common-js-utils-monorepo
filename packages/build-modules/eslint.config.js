/**
 * @file ESLint configuration.
 */
import { getCommonConfig } from '@arpitmalik832/eslint-config';

export default getCommonConfig(
  [
    'node_modules/*',
    'dist/*',
    'build/*',
    'coverage/*',
    '**/*.md',
    'distInfo/*',
    '.logs/*',
  ],
  ['typescript-eslint'],
);
