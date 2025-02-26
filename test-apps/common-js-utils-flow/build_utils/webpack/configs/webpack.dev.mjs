/**
 * Webpack development configuration for client.
 * @file The file is saved as `build_utils/webpack/webpack.dev.js`.
 */
import { ENVS } from '../../config/index.mjs';
import { outputPath } from '../../config/commonPaths.mjs';

const port = process.env.PORT || 3000;

const config = {
  name: 'client',
  target: 'web',
  mode: ENVS.DEV,
  devServer: {
    port,
    static: {
      directory: outputPath,
    },
    historyApiFallback: true,
    webSocketServer: false,
    hot: true,
  },
};

export default config;
