/**
 * Webpack Minimizer configuration.
 * @file The file is saved as `configs/webpack/minimizer.js`.
 */
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import { MAIN_ENUMS } from '../../enums/index.js';

/**
 * Generates the Webpack configuration for minimizing the bundle.
 * @param {string} env - The environment variable to check.
 * @returns {object} The Webpack configuration object.
 * @example
 * const config = getConfig(env);
 */
function getConfig(env) {
  return {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              inline: false,
              drop_console: env === MAIN_ENUMS.ENVS.PROD,
              dead_code: true,
              drop_debugger: env === MAIN_ENUMS.ENVS.PROD,
              conditionals: true,
              evaluate: true,
              booleans: true,
              loops: true,
              unused: true,
              hoist_funs: true,
              keep_fargs: false,
              hoist_vars: true,
              if_return: true,
              join_vars: true,
              side_effects: true,
              warnings: false,
            },
            mangle: true,
            output: {
              comments: false,
            },
          },
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
    },
  };
}

export default getConfig;
