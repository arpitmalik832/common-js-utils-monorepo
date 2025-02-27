/**
 * Webpack configuration for production environment.
 * @file The file is saved as `build_utils/webpack/webpack.prod.js`.
 */
import fs from 'fs';
import CompressionPlugin from 'compression-webpack-plugin';
import AssetsManifest from 'webpack-assets-manifest';

import { StripCustomWindowVariablesPlugin } from '../customPlugins/StripCustomWindowVariables.mjs';
import { outputPath } from '../../config/commonPaths.mjs';
import { ENVS } from '../../config/index.mjs';

const isBeta = process.env.APP_ENV === ENVS.BETA;
const isRelease = process.env.APP_ENV === ENVS.PROD;

const config = {
  name: 'client',
  target: 'web',
  mode: ENVS.PROD,
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
          const chunkFiles = stats.compilation.chunkGroups.reduce((acc, c) => {
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
          }, Object.create(null));
          fs.writeFileSync(chunkFileName, JSON.stringify(chunkFiles, null, 2));
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(`ERROR: Cannot write ${chunkFileName}: `, err);
          if (isRelease) process.exit(1);
        }
      },
    }),
    (isBeta || isRelease) &&
      new StripCustomWindowVariablesPlugin({ variables: ['abc'] }),
  ],
};

export default config;
