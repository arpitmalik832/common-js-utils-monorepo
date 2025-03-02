/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
 */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import progress from 'rollup-plugin-progress';

import copyPlugin from '../customPlugins/copy.mjs';
import stripCustomWindowVariables from '../customPlugins/stripCustomWindowVariables.mjs';
import { ENVS } from '../../config/index.mjs';
import { entryPath, outputPath } from '../../config/commonPaths.mjs';

const config = {
  input: entryPath,
  output: [
    {
      dir: outputPath,
      format: 'esm',
      sourcemap: ![ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV),
      entryFileNames: `esm/lib.js`,
    },
    {
      dir: outputPath,
      format: 'cjs',
      sourcemap: ![ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV),
      entryFileNames: `cjs/lib.js`,
    },
  ],
  external: [/node_modules/], // Exclude node_modules
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      configFile: './babel.config.cjs',
    }),
    commonjs(),
    [ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV) &&
      stripCustomWindowVariables({
        variables: ['abc'],
      }),
    copyPlugin(),
    json(),
    progress(),
  ],
};

export default config;
