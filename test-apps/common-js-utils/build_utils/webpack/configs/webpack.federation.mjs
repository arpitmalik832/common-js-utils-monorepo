/**
 * This file is used to create a federated module for the application.
 * @file The file is saved as `build_utils/webpack/webpack.federation.js`.
 */
import webpack from 'webpack';

import pkg from '../../../package.json' with { type: 'json' };
import { entryPath } from '../../config/commonPaths.mjs';
import getEntries from '../../config/modulesEntry.mjs';

const deps = pkg.dependencies;
const REMOTE_HOST = getEntries(process.env.APP_ENV);

const { ModuleFederationPlugin } = webpack.container;

const config = {
  plugins: [
    new ModuleFederationPlugin({
      name: `${pkg.name}`,
      filename: `remoteEntry.js`,
      exposes: {
        './App': `${entryPath}`,
      },
      remotes: {
        // example: `example@${REMOTE_HOST.EXAMPLE}remoteEntry.js`,
        proj: `proj@${REMOTE_HOST.PROJ}remoteEntry.js`,
      },
      shared: [
        {
          react: {
            singleton: true,
            requiredVersion: deps.react,
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
            eager: true,
          },
          // 'lottie-react': {
          //   singleton: true,
          //   requiredVersion: deps['lottie-react'],
          //   eager: true,
          // },
          // 'react-router': {
          //   singleton: true,
          //   requiredVersion: deps['react-router'],
          //   eager: true,
          // },
          // moment: {
          //   singleton: true,
          //   requiredVersion: deps.moment,
          //   eager: true,
          // },
          // rxjs: {
          //   singleton: true,
          //   requiredVersion: deps.rxjs,
          //   eager: true,
          // },
          // uuid: {
          //   singleton: true,
          //   requiredVersion: deps.uuid,
          //   eager: true,
          // },
          // '@tanstack/react-query': {
          //   singleton: true,
          // },
        },
      ],
    }),
  ],
};

export default config;
