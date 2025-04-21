/**
 * Webpack development configuration for client.
 * @file The file is saved as `build_utils/webpack/webpack.dev.js`.
 */
import { getPaths } from '../../utils/index.js';
import { MAIN_ENUMS } from '../../enums/index.js';

/**
 * Get the Webpack development configuration for client.
 * @param {string} projectRoot - The project root directory.
 * @param {number} port - The port number.
 * @returns {object} The Webpack development configuration for client.
 * @example
 * const config = getConfig();
 */
function getConfig(projectRoot, port) {
  const { outputPath } = getPaths(projectRoot);

  return {
    name: 'client',
    target: 'web',
    mode: MAIN_ENUMS.ENVS.DEV,
    devServer: {
      port: port || 3000,
      static: {
        directory: outputPath,
      },
      historyApiFallback: true,
      webSocketServer: false,
      hot: true,
    },
  };
}

export default getConfig;
