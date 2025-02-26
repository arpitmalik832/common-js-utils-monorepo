/**
 * Webpack Build Stats configuration.
 * @file The file is saved as `build_utils/webpack/webpack.buildstats.mjs`.
 */
import { BuildStatsPlugin } from '../customPlugins/BuildStats.mjs';

/**
 * Generates the Webpack configuration for build stats.
 * @returns {object} The Webpack configuration object.
 * @example
 * const config = getConfig();
 * console.log(config);
 */
function getConfig() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const path = `distInfo/storybook/${process.env.STORY_ENV}/buildStats`;

  return {
    plugins: [
      new BuildStatsPlugin({
        outputPath: `${path}/${timestamp}.json`,
      }),
    ],
  };
}

export default getConfig;
