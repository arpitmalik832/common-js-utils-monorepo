/**
 * Webpack configuration for production environment.
 * @file The file is saved as `build_utils/webpack/webpack.prod.js`.
 */
import fs from 'fs';
import CompressionPlugin from 'compression-webpack-plugin';
import AssetsManifest from 'webpack-assets-manifest';

import { webpackPlugins } from '../../plugins/index.js';
import { MAIN_ENUMS } from '../../enums/index.js';
import { getPaths } from '../../utils/index.js';

/**
 * Get the Webpack production configuration.
 * @param {string} projectRoot - The project root directory.
 * @param {string} env - The environment.
 * @param {string[]} stripVariablesArr - The array of variables to strip.
 * @returns {object} The Webpack production configuration.
 * @example
 * const config = getConfig();
 */
function getConfig(projectRoot, env, stripVariablesArr) {
  const { outputPath } = getPaths(projectRoot);
  const isBeta = env === MAIN_ENUMS.ENVS.BETA;
  const isRelease = env === MAIN_ENUMS.ENVS.PROD;

  return {
    name: 'client',
    target: 'web',
    mode: MAIN_ENUMS.ENVS.PROD,
    plugins: [
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css)$/,
      }),
      new AssetsManifest({
        output: `${outputPath}/asset-manifest.json`,
        publicPath: true,
        writeToDisk: true,
        customize: entry => {
          // You can prevent adding items to the manifest by returning false.
          if (entry.key.toLowerCase().endsWith('.map')) {
            return false;
          }
          return entry;
        },
        done: (manifest, stats) => {
          // Write chunk-manifest.json
          const chunkFileName = `${outputPath}/chunk-manifest.json`;
          try {
            const chunkFiles = stats.compilation.chunkGroups.reduce(
              (acc, c) => {
                acc[c.name] = [
                  ...(acc[c.name] || []),
                  ...c.chunks.reduce(
                    (files, cc) => [
                      ...files,
                      ...[...cc.files]
                        .filter(file => !file.endsWith('.map'))
                        .map(file => manifest.getPublicPath(file)),
                    ],
                    [],
                  ),
                ];
                return acc;
              },
              Object.create(null),
            );
            fs.writeFileSync(
              chunkFileName,
              JSON.stringify(chunkFiles, null, 2),
            );
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`ERROR: Cannot write ${chunkFileName}: `, err);
            if (isRelease) process.exit(1);
          }
        },
      }),
      (isBeta || isRelease) &&
        new webpackPlugins.StripCustomWindowVariablesPlugin({
          variables: stripVariablesArr,
        }),
    ],
  };
}

export default getConfig;
