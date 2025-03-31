/**
 * Webpack Bundle Analyzer configuration.
 * @file The file is saved as `build_utils/webpack/webpack.bundleanalyzer.js`.
 */
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';

/**
 * Get the webpack configuration.
 * @param {string} dirPath - The directory path to save the visualizers.
 * @param {string} type - The type of build (e.g., 'storybook' or 'main').
 * @param {string} env - The environment variable to check.
 * @returns {object} The webpack configuration.
 * @example
 * const config = getConfig(dirPath, type, env);
 */
function getConfig(dirPath, type, env) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const visualizerPath = `${dirPath}/${type}/${env}/visualizer/`;

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
