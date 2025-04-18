/**
 * This file is used to configure the service worker for the application.
 * @file The file is saved as `build_utils/webpack/webpack.workers.js`.
 */
import { InjectManifest } from 'workbox-webpack-plugin';

import { getPaths } from '../../utils';

/**
 * Generates the Webpack configuration for the service workers.
 * @param {string} projectRoot - The project root directory.
 * @returns {object} The Webpack configuration object.
 * @example
 * const config = getConfig(projectRoot);
 */
function getConfig(projectRoot) {
  const { outputPath } = getPaths(projectRoot);

  return {
    plugins: [
      new InjectManifest({
        swDest: `${outputPath}/sw.js`,
        swSrc: './public/sw.js',
        exclude: [/asset-manifest\.json$/, /\.gz$/, /src\/assets\//],
        chunks: [],
      }),
    ],
  };
}

export default getConfig;
