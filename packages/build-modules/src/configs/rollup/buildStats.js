/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
 */
import path from 'path';

import { rollupPlugins } from '../../plugins/index.js';

/**
 * Generates a Rollup configuration with visualizer plugins.
 * @param {string} dirPath - The directory path to save the build stats.
 * @param {string} type - The type of build (e.g., 'svgr' or 'main').
 * @param {string} env - The environment variable to check.
 * @returns {object} Rollup configuration object.
 * @example
 * const config = getConfig(dirPath, type, env);
 */
function getConfig(dirPath, type, env) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  // Ensure we have an absolute path even when dirPath is empty
  const basePath = dirPath ? dirPath.replace(/\/+$/, '') : '';
  const normalizedPath = path.posix.join(
    basePath.startsWith('/') ? basePath : `/${basePath}`,
    type,
    env,
    'buildStats',
    `${timestamp}.json`,
  );

  return {
    plugins: [rollupPlugins.BuildStatsPlugin(normalizedPath)],
  };
}

export default getConfig;
