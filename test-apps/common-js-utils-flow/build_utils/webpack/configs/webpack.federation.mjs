/**
 * This file is used to create a federated module for the application.
 * @file The file is saved as `build_utils/webpack/webpack.federation.js`.
 */
// import webpack from 'webpack';
// import { readFileSync } from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname, resolve } from 'path';

// import { entryPath } from '../../config/commonPaths.mjs';
// import getEntries from '../../config/modulesEntry.mjs';

// const filename = fileURLToPath(import.meta.url);
// const dirName = dirname(filename);
// const pkg = JSON.parse(
//   readFileSync(resolve(dirName, '../../../package.json'), 'utf8'),
// );

// const deps = pkg.dependencies;
// const REMOTE_HOST = getEntries(process.env.APP_ENV);

// const { ModuleFederationPlugin } = webpack.container;

const config = {
  // plugins: [
  //   new ModuleFederationPlugin({
  //     name: `${pkg.name}`,
  //     filename: `remoteEntry.js`,
  //     exposes: {
  //       './App': `${entryPath}`,
  //     },
  //     remotes: {
  //       // example: `example@${REMOTE_HOST.EXAMPLE}remoteEntry.js`,
  //       proj: `proj@${REMOTE_HOST.PROJ}remoteEntry.js`,
  //     },
  //     shared: [
  //       {
  //         react: {
  //           singleton: true,
  //           requiredVersion: deps.react,
  //           eager: true,
  //         },
  //         'react-dom': {
  //           singleton: true,
  //           requiredVersion: deps['react-dom'],
  //           eager: true,
  //         },
  //       },
  //     ],
  //   }),
  // ],
};

export default config;
