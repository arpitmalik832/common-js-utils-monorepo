/**
 * Configuration files.
 * @file This file is saved as `index.js`.
 */
import svgrConfig from './svgrConfig.js';
import getPostcssConfig from './postcssConfig.js';
import * as rollupConfigs from './rollup/index.js';
import * as storybookConfigs from './storybook/index.js';
import * as webpackConfigs from './webpack/index.js';

export {
  svgrConfig,
  getPostcssConfig,
  rollupConfigs,
  storybookConfigs,
  webpackConfigs,
};
