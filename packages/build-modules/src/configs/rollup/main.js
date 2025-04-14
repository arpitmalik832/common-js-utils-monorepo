/**
 * This file contains the configuration for the rollup build.
 * @file This file is saved as `src/configs/rollup/main.js`.
 */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import svgr from '@svgr/rollup';
import url from '@rollup/plugin-url';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import progress from 'rollup-plugin-progress';
import path from 'path';

import svgrConfig from '../svgrConfig.js';
import { rollupPlugins } from '../../plugins/index.js';
import { MAIN_ENUMS } from '../../enums/index.js';
import { getDirname, getPaths } from '../../utils/index.js';

/**
 * Get the rollup config.
 * @param {string} projectRoot - The project root.
 * @param {string} env - The environment variable to check.
 * @param {string[]} windowVariablesToStrip - The window variables to strip from the code.
 * @param {Array} arrayForCopyPlugin - The array for the copy plugin.
 * @param {Array} arrayForMinimizePlugin - The array for the minimize plugin.
 * @returns {object} The rollup config.
 * @example
 * const config = getConfig();
 */
function getConfig(
  projectRoot,
  env,
  windowVariablesToStrip,
  arrayForCopyPlugin,
  arrayForMinimizePlugin,
) {
  const paths = getPaths(projectRoot);
  const dirname = getDirname();

  return {
    input: paths.entryPath,
    output: [
      {
        dir: paths.outputPath,
        format: 'esm',
        sourcemap: ![MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env),
        entryFileNames: `esm/lib.js`,
      },
      {
        dir: paths.outputPath,
        format: 'cjs',
        sourcemap: ![MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env),
        entryFileNames: `cjs/lib.js`,
      },
    ],
    external: [/node_modules/], // Exclude node_modules
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
        preferBuiltins: true,
        mainFields: ['module', 'main'],
        modulesOnly: true,
      }),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        configFile: './babel.config.cjs',
        extensions: ['.js', '.jsx'],
      }),
      commonjs({
        extensions: ['.js', '.jsx'],
      }),
      [MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env) &&
        rollupPlugins.StripCustomWindowVariablesPlugin({
          variables: [...windowVariablesToStrip],
        }),
      postcss({
        extensions: ['.css', '.scss'],
        extract: paths.stylesPath,
        minimize: [MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env),
        modules: true,
        use: ['sass'],
        config: {
          path: [
            `${projectRoot}/postcss.config.js`,
            `${projectRoot}/postcss.config.mjs`,
            path.resolve(dirname, '../postcssConfig.js'),
          ],
          ctx: {
            env: [MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env)
              ? MAIN_ENUMS.ENVS.PROD
              : MAIN_ENUMS.ENVS.STG,
          },
        },
      }),
      image(),
      url(),
      svgr(svgrConfig),
      rollupPlugins.CopyPlugin(arrayForCopyPlugin),
      rollupPlugins.MinimizePlugin(arrayForMinimizePlugin, env),
      json(),
      progress(),
    ],
  };
}

export default getConfig;
