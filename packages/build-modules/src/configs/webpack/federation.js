/**
 * Webpack Federation configuration.
 * @file The file is saved as `configs/webpack/federation.js`.
 */
// import webpack from 'webpack';

import { /* getPaths, */ getProjEntries } from '../../utils';

/**
 * Generates the Webpack configuration for minimizing the bundle.
 * @param {string} projectRoot - The project root directory.
 * @param {string} env - The environment variable to check.
 * @param {object} deps - The dependencies object.
 * @param {string[]} projs - The projects to build.
 * @returns {object} The Webpack configuration object.
 * @example
 * const config = getConfig(projectRoot, env, deps, projs);
 */
function getConfig(projectRoot, env, deps, projs) {
  // const { ModuleFederationPlugin } = webpack.container;
  // const { entryPath } = getPaths(projectRoot);
  const REMOTE_HOSTS = getProjEntries(env, projs);

  const remotesObj = {};

  Object.keys(REMOTE_HOSTS).forEach(proj => {
    remotesObj[proj] = `${proj}@${REMOTE_HOSTS[proj]}remoteEntry.js`;
  });

  return {
    // plugins: [
    //   new ModuleFederationPlugin({
    //     name: 'MAIN',
    //     filename: `remoteEntry.js`,
    //     exposes: {
    //       './App': `${entryPath}`,
    //     },
    //     remotes: {
    //       ...remotesObj,
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
    //         // 'lottie-react': {
    //         //   singleton: true,
    //         //   requiredVersion: deps['lottie-react'],
    //         //   eager: true,
    //         // },
    //         // 'react-router': {
    //         //   singleton: true,
    //         //   requiredVersion: deps['react-router'],
    //         //   eager: true,
    //         // },
    //         // moment: {
    //         //   singleton: true,
    //         //   requiredVersion: deps.moment,
    //         //   eager: true,
    //         // },
    //         // rxjs: {
    //         //   singleton: true,
    //         //   requiredVersion: deps.rxjs,
    //         //   eager: true,
    //         // },
    //         // uuid: {
    //         //   singleton: true,
    //         //   requiredVersion: deps.uuid,
    //         //   eager: true,
    //         // },
    //         // '@tanstack/react-query': {
    //         //   singleton: true,
    //         // },
    //       },
    //     ],
    //   }),
    // ],
  };
}

export default getConfig;
