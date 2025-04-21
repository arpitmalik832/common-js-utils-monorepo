/**
 * Common ESLint configuration.
 * @file This file is saved as `common.js`.
 */
import {
  getIgnoreConfig,
  globalsConfig,
  getBaseConfig,
  jestConfig,
  jsdocConfig,
  mdConfig,
} from '../baseConfigs/index.js';

/**
 * Get the ESLint configuration for the common project.
 * @param {Array} ignoredDirs - The directories to ignore.
 * @param {Array} noUnresolvedIgnoreArr - The packages to ignore.
 * @returns {Array} The ESLint configuration for the common project.
 * @example
 * const commonConfig = getConfig();
 * console.log(commonConfig);
 */
function getConfig(ignoredDirs, noUnresolvedIgnoreArr) {
  return [
    ...getIgnoreConfig(ignoredDirs),
    ...globalsConfig,
    ...getBaseConfig(noUnresolvedIgnoreArr),
    ...jestConfig,
    ...jsdocConfig,
    ...mdConfig,
  ];
}

export default getConfig;
