/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
 */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import progress from 'rollup-plugin-progress';

import stripCustomWindowVariables from '../../../src/plugins/rollup/StripCustomWindowVariablesPlugin.js';
import { ENVS } from '../../../src/enums/main.js';
import { getPaths } from '../../../src/utils/fileUtils.js';

/**
 * Get the rollup config.
 * @param {string} projectRoot - The project root.
 * @param {string} env - The environment variable to check.
 * @param {string[]} windowVariablesToStrip - The window variables to strip from the code.
 * @returns {object} The rollup config.
 * @example
 * const config = getConfig(projectRoot, env, windowVariablesToStrip);
 * console.log(config);
 */
function getConfig(projectRoot, env, windowVariablesToStrip) {
  const paths = getPaths(projectRoot);

  return {
    input: paths.entryPath,
    output: [
      {
        dir: paths.outputPath,
        format: 'esm',
        sourcemap: ![ENVS.PROD, ENVS.BETA].includes(env),
        entryFileNames: `esm/lib.js`,
      },
      {
        dir: paths.outputPath,
        format: 'cjs',
        sourcemap: ![ENVS.PROD, ENVS.BETA].includes(env),
        entryFileNames: `cjs/lib.js`,
      },
    ],
    external: [/node_modules/], // Exclude node_modules
    plugins: [
      resolve({
        extensions: ['.js', '.json'],
        preferBuiltins: true,
        mainFields: ['module', 'main'],
        modulesOnly: true,
      }),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        configFile: './babel.config.cjs',
        extensions: ['.js'],
      }),
      commonjs({
        extensions: ['.js'],
      }),
      [ENVS.PROD, ENVS.BETA].includes(env) &&
        stripCustomWindowVariables({
          variables: [...windowVariablesToStrip],
        }),
      json(),
      progress(),
    ],
  };
}

export default getConfig;
