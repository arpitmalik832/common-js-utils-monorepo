/**
 * Rollup configuration file for building SVG icons using SVGR.
 * @file This file is saved as `svgr.mjs`.
 */
import svgr from '@svgr/rollup';
import progress from 'rollup-plugin-progress';

import icons_list from '../../../static/enums/icons_list.mjs';
import svgrConfig from '../../../svgr.config.mjs';
import copyPlugin from '../customPlugins/copy.mjs';
import { ENVS } from '../../config/index.mjs';
import { outputPath } from '../../config/commonPaths.mjs';

const config = {
  input: icons_list.map(i => `src/assets/icons/${i}`),
  output: [
    {
      dir: outputPath,
      format: 'esm',
      sourcemap: ![ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV),
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: `esm/[name].js`,
      chunkFileNames: `esm/[name].js`,
    },
    {
      dir: outputPath,
      format: 'cjs',
      sourcemap: ![ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV),
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: `cjs/[name].js`,
      chunkFileNames: `cjs/[name].js`,
    },
  ],
  external: [/node_modules/], // Exclude node_modules
  plugins: [svgr(svgrConfig), copyPlugin(), progress()],
};

export default config;
