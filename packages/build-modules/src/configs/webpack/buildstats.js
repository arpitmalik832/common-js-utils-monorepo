/**
 * Webpack Build Stats configuration.
 * @file The file is saved as `build_utils/webpack/webpack.buildstats.mjs`.
 */
import { BuildStatsPlugin } from '../../plugins/webpack/index.js';

/**
 * Generates the Webpack configuration for build stats.
 * @param {string} dirPath - The directory path to save the build stats.
 * @param {string} type - The type of build (e.g., 'storybook' or 'main').
 * @param {string} env - The environment variable to check.
 * @returns {object} The Webpack configuration object.
 * @example
 * const config = getConfig(dirPath, type, env);
 */
function getConfig(dirPath, type, env) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const path = `${dirPath}/${type}/${env}/buildStats`;

  return {
    plugins: [
      new BuildStatsPlugin({
        outputPath: `${path}/${timestamp}.json`,
      }),
    ],
  };
}

export default getConfig;
