/**
 * Webpack Build Stats configuration.
 * @file The file is saved as `build_utils/webpack/webpack.buildstats.mjs`.
 */
import { BuildStatsPlugin } from '../customPlugins/BuildStats.mjs';

const timestamp = new Date().toISOString().replace(/:/g, '-');
const path = `distInfo/${process.env.STORY_ENV ? 'storybook' : 'main'}/${process.env.STORY_ENV || process.env.APP_ENV}/buildStats`;

const config = {
  plugins: [
    new BuildStatsPlugin({
      outputPath: `${path}/${timestamp}.json`,
    }),
  ],
};

export default config;
