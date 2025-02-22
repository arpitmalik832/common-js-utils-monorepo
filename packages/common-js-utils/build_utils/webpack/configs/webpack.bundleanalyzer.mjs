/**
 * Webpack Bundle Analyzer configuration.
 * @file The file is saved as `build_utils/webpack/webpack.bundleanalyzer.js`.
 */
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { resolve } from 'path';

/**
 * Get the webpack configuration.
 * @returns {object} The webpack configuration.
 * @example
 * const config = getConfig();
 */
function getConfig() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const path = `distInfo/storybook/${process.env.STORY_ENV}/visualizer/`;

  return {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // Generate static HTML files
        reportFilename: resolve(path, `${timestamp}.html`), // Specify the output file name
        openAnalyzer: false, // Do not automatically open the report in the browser
      }),
    ],
  };
}

export default getConfig;
