/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
 */
import buildStats from '../customPlugins/buildStats.mjs';

/**
 * Generates a Rollup configuration with visualizer plugins.
 * @param {string} type - The type of build (e.g., 'svgr' or 'main').
 * @returns {object} Rollup configuration object.
 * @example
 * const config = getConfig('main');
 */
function getConfig(type) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const path = `distInfo/${type === 'svgr' ? 'svgr' : 'main'}/${process.env.LIB_ENV}/buildStats`;

  return {
    plugins: [buildStats(`${path}/${timestamp}.json`)],
  };
}

export default getConfig;
