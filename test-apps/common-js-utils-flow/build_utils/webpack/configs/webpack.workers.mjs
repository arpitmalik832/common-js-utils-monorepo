/**
 * This file is used to configure the service worker for the application.
 * @file The file is saved as `build_utils/webpack/webpack.workers.js`.
 */
import { InjectManifest } from 'workbox-webpack-plugin';

import { outputPath } from '../../config/commonPaths.mjs';

const config = {
  plugins: [
    new InjectManifest({
      swDest: `${outputPath}/sw.js`,
      swSrc: './public/sw.js',
      exclude: [/asset-manifest\.json$/, /\.gz$/, /src\/assets\//],
      chunks: [],
    }),
  ],
};

export default config;
