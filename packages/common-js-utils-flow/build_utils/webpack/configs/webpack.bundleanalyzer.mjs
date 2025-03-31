/**
 * Webpack Bundle Analyzer configuration.
 * @file The file is saved as `build_utils/webpack/webpack.bundleanalyzer.js`.
 */
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';

/**
 * Get the webpack configuration.
 * @returns {object} The webpack configuration.
 * @example
 * const config = getConfig();
 */
function getConfig() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const visualizerPath = `distInfo/storybook/${process.env.STORY_ENV}/visualizer/`;

  return {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // Generate static HTML files
        reportFilename: path.resolve(visualizerPath, `${timestamp}.html`), // Specify the output file name
        openAnalyzer: false, // Do not automatically open the report in the browser
      }),
    ],
  };
}

export default getConfig;
