/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
 */
import buildStats from '../plugins/buildStats.js';

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
  const path = `${dirPath}/${type}/${env}/buildStats`;

  return {
    plugins: [buildStats(`${path}/${timestamp}.json`)],
  };
}

export default getConfig;
