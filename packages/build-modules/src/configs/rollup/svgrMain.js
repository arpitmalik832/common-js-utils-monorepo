/**
 * Rollup configuration file for building SVG icons using SVGR.
 * @file This file is saved as `svgr.mjs`.
 */
import svgr from '@svgr/rollup';
import progress from 'rollup-plugin-progress';

import svgrConfig from '../svgrConfig.js';
import { MAIN_ENUMS } from '../../enums/index.js';
import { getPaths } from '../../utils/index.js';

/**
 * Get the rollup config for building SVG icons using SVGR.
 * @param {string} projectRoot - The project root.
 * @param {string} env - The environment variable to check.
 * @param {string[]} iconsList - The list of icons to build.
 * @returns {object} The rollup config.
 * @example
 * const config = getConfig();
 */
function getConfig(projectRoot, env, iconsList) {
  const paths = getPaths(projectRoot);

  return {
    input: iconsList.map(i => `src/assets/icons/${i}`),
    output: [
      {
        dir: paths.outputPath,
        format: 'esm',
        sourcemap: ![MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env),
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: `esm/[name].js`,
        chunkFileNames: `esm/[name].js`,
      },
      {
        dir: paths.outputPath,
        format: 'cjs',
        sourcemap: ![MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env),
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: `cjs/[name].js`,
        chunkFileNames: `cjs/[name].js`,
      },
    ],
    external: [/node_modules/], // Exclude node_modules
    plugins: [svgr(svgrConfig), progress()],
  };
}

export default getConfig;
