/**
 * Webpack configuration file.
 * @file This file is saved as `webpack.config.js`.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import { webpackConfigs, MAIN_ENUMS } from '@arpitmalik832/build-modules';

import pkg from './package.json' with { type: 'json' };
import {
  ERR_NO_APP_ENV_FLAG,
  ERR_NO_BE_ENV_FLAG,
} from './build_utils/config/logs.mjs';

/**
 * Adds additional configurations based on command line arguments.
 * @param {string} projectRoot - The project root directory.
 * @returns {Array} An array of additional webpack configurations.
 * @example
 * // To include federation and bundle analyzer configurations
 * // Run the command with federation bundleAnalyzer
 */
function addons(projectRoot) {
  const addFederation = process.env.INCLUDE_FEDERATION === 'true';
  const addVisualizer = process.env.INCLUDE_VISUALIZER === 'true';
  const addBuildStats = process.env.INCLUDE_BUILD_STATS === 'true';

  const configs = [];
  if (addFederation)
    configs.push(
      webpackConfigs.getFederationConfig(
        projectRoot,
        process.env.APP_ENV,
        pkg.dependencies,
        [],
      ),
    );
  if (addVisualizer)
    configs.push(
      webpackConfigs.getBundleAnalyzerConfig(
        projectRoot,
        'main',
        process.env.APP_ENV,
      ),
    );
  if (addBuildStats)
    configs.push(
      webpackConfigs.getBuildStatsConfig(
        projectRoot,
        'main',
        process.env.APP_ENV,
      ),
    );
  return configs;
}

/**
 * Generates the webpack configuration based on the environment.
 * @returns {object} The merged webpack configuration.
 * @throws {Error} If the APP_ENV environment variable is not set.
 * @example
 * // To generate the configuration for the development environment
 * process.env.APP_ENV = 'development';
 * const config = getConfig();
 */
function getConfig() {
  if (!process.env.APP_ENV) {
    throw new Error(ERR_NO_APP_ENV_FLAG);
  }
  if (!process.env.BE_ENV) {
    throw new Error(ERR_NO_BE_ENV_FLAG);
  }

  const projectRoot = path.resolve();
  const filename = fileURLToPath(import.meta.url);

  let envConfig;

  switch (process.env.APP_ENV) {
    case MAIN_ENUMS.ENVS.PROD:
    case MAIN_ENUMS.ENVS.BETA:
    case MAIN_ENUMS.ENVS.STG:
      envConfig = webpackConfigs.getProdConfig(
        projectRoot,
        process.env.APP_ENV,
        ['abc'],
      );
      break;
    case MAIN_ENUMS.ENVS.DEV:
    default:
      envConfig = webpackConfigs.getDevConfig(
        projectRoot,
        process.env.PORT || 3000,
      );
  }

  return merge(
    webpackConfigs.getCommonConfig(
      projectRoot,
      pkg,
      process.env.APP_ENV,
      'process.env.APP_ENV',
      filename,
    ),
    envConfig,
    webpackConfigs.getWorkersConfig(projectRoot),
    ...addons(projectRoot),
  );
}

export default getConfig;
