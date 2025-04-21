/**
 * @file React configuration.
 */
import storybookPlugin from 'eslint-plugin-storybook';

import {
  getIgnoreConfig,
  globalsConfig,
  getBaseReactConfig,
  jestConfig,
  jsdocConfig,
  mdConfig,
  cypressConfig,
} from '../baseConfigs/index.js';

/**
 * Get the React configuration.
 * @param {string[]} ignoredDirs - The directories to ignore.
 * @param {string[]} noUnresolvedIgnoreArr - The packages to ignore.
 * @returns {import('eslint').Linter.FlatConfig} The React configuration.
 * @example
 * const config = getConfig(['node_modules', 'dist']);
 */
function getConfig(ignoredDirs, noUnresolvedIgnoreArr) {
  return [
    ...getIgnoreConfig(ignoredDirs),
    ...globalsConfig,
    ...getBaseReactConfig(noUnresolvedIgnoreArr),
    ...cypressConfig,
    ...storybookPlugin.configs['flat/recommended'],
    ...jestConfig,
    ...jsdocConfig,
    ...mdConfig,
  ];
}

export default getConfig;
