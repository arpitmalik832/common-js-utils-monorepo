/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
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

import svgrConfig from '../../../svgr.config.mjs';
import copyPlugin from '../customPlugins/copy.mjs';
import stripCustomWindowVariables from '../customPlugins/stripCustomWindowVariables.mjs';
import { ENVS } from '../../config/index.mjs';
import {
  entryPath,
  outputPath,
  stylesPath,
} from '../../config/commonPaths.mjs';

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
      extensions: ['.js', '.jsx', '.scss', '.css'],
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
    postcss({
      extensions: ['.css', '.scss'],
      extract: stylesPath,
      minimize: [ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV),
      modules: true,
      use: ['sass'],
    }),
    image(),
    url(),
    svgr(svgrConfig),
    copyPlugin(),
    json(),
    progress(),
  ],
};

export default config;
