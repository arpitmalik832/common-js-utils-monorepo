/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `svgr.mjs`.
 */

import baseConfig from './rollup.svgr.common.mjs';
import minimizerConfig from './rollup.minimizer.mjs';
import visualizerConfig from './rollup.visualizer.mjs';
import buildStatsConfig from './rollup.buildStats.mjs';
import {
  ERR_NO_APP_ENV_FLAG,
  ERR_NO_LIB_ENV_FLAG,
} from '../../config/logs.mjs';
import { ENVS } from '../../config/index.mjs';

/**
 * Get additional Rollup configurations based on environment variables.
 * @returns {Array} An array of additional Rollup configuration objects.
 * @example
 * const addons = getAddons();
 * console.log(addons);
 */
function getAddons() {
  const addMinimizer = [ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV);
  const addVisualizer = process.env.INCLUDE_VISUALIZER === 'true';
  const addBuildStats = process.env.INCLUDE_BUILD_STATS === 'true';

  const configs = [];
  if (addMinimizer) configs.push(minimizerConfig);
  if (addVisualizer) configs.push(visualizerConfig('svgr'));
  if (addBuildStats) configs.push(buildStatsConfig('svgr'));

  return configs;
}

/**
 * Get the Rollup configuration based on environment variables.
 * Throws an error if the LIB_ENV environment variable is not set.
 * @returns {object} The merged Rollup configuration object.
 * @throws {Error} If the LIB_ENV environment variable is not set.
 * @example
 * const config = getConfig();
 * console.log(config);
 */
function getConfig() {
  if (!process.env.LIB_ENV) {
    throw new Error(ERR_NO_LIB_ENV_FLAG);
  }
  if (!process.env.APP_ENV) {
    throw new Error(ERR_NO_APP_ENV_FLAG);
  }

  const addons = getAddons();

  return {
    ...baseConfig,
    plugins: [...baseConfig.plugins, ...addons.flatMap(addon => addon.plugins)],
  };
}

export default getConfig;
