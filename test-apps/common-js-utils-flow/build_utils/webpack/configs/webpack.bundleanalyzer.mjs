/**
 * Webpack Bundle Analyzer configuration.
 * @file The file is saved as `build_utils/webpack/webpack.bundleanalyzer.js`.
 */
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';

const timestamp = new Date().toISOString().replace(/:/g, '-');
const visualizerPath = `distInfo/${process.env.STORY_ENV ? 'storybook' : 'main'}/${process.env.STORY_ENV || process.env.APP_ENV}/visualizers/${timestamp}`;

const config = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // Generate static HTML files
      reportFilename: path.resolve(visualizerPath, `${timestamp}.html`), // Specify the output file name
      openAnalyzer: false, // Do not automatically open the report in the browser
    }),
  ],
};

export default config;
