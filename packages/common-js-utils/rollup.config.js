/**
 * Rollup configuration file for the library package.
 * @file This file is saved as `rollup.config.js`.
 */
import mainConfig from './build_utils/rollup/configFiles/rollup.main.mjs';

const config = [mainConfig()];

export default config;
