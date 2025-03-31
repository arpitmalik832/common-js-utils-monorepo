/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
 */
import path from 'path';

import { rollupConfigs, MAIN_ENUMS } from '@arpitmalik832/build-modules';
import { ERR_NO_APP_ENV_FLAG, ERR_NO_LIB_ENV_FLAG } from '../config/logs.mjs';

/**
 * Get additional Rollup configurations based on environment variables.
 * @param {string} projectRoot - The project root.
 * @returns {Array} An array of additional Rollup configuration objects.
 * @example
 * const addons = getAddons();
 * console.log(addons);
 */
function getAddons(projectRoot) {
  const addMinimizer = [MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(
    process.env.LIB_ENV,
  );
  const addVisualizer = process.env.INCLUDE_VISUALIZER === 'true';
  const addBuildStats = process.env.INCLUDE_BUILD_STATS === 'true';

  const configs = [];
  if (addMinimizer) configs.push(rollupConfigs.getMinimizerConfig());
  if (addVisualizer)
    configs.push(
      rollupConfigs.getVisualizerConfig(
        projectRoot,
        'main',
        process.env.LIB_ENV,
      ),
    );
  if (addBuildStats)
    configs.push(
      rollupConfigs.getBuildStatsConfig(
        projectRoot,
        'main',
        process.env.LIB_ENV,
      ),
    );

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

  const projectRoot = path.resolve();
  const addons = getAddons(projectRoot);
  const baseConfig = rollupConfigs.getMainConfig(
    projectRoot,
    process.env.LIB_ENV,
    [],
    [
      {
        src: 'static/styles/*',
        dest: 'dist/styles',
      },
      {
        src: 'src/styles/mixins/*',
        dest: 'dist/styles/mixins',
      },
      {
        src: 'static/enums/icons_list.mjs',
        dest: 'dist',
      },
      {
        src: 'src/assets/*',
        dest: 'dist/assets',
      },
    ],
  );

  return {
    ...baseConfig,
    plugins: [...baseConfig.plugins, ...addons.flatMap(addon => addon.plugins)],
  };
}

export default getConfig;
