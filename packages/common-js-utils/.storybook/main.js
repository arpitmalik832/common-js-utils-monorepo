/**
 * Storybook configuration.
 * @file This file is saved as `.storybook/main.js`.
 */
import path from 'path';
// import TerserPlugin from 'terser-webpack-plugin';
// import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
// import CompressionPlugin from 'compression-webpack-plugin';

import { storybookConfigs } from '@arpitmalik832/build-modules';
// import svgrConfig from '../svgr.config.mjs';
import { ERR_NO_STORY_ENV_FLAG } from '../build_utils/config/logs.mjs';

const projectRoot = path.resolve();

export default storybookConfigs.getWebpackConfig(
  projectRoot,
  `${projectRoot}/distInfo`,
  `${projectRoot}/distInfo`,
  process.env.STORY_ENV,
  process.env.INCLUDE_BUNDLE_ANALYZER,
  process.env.INCLUDE_BUILD_STATS,
  ERR_NO_STORY_ENV_FLAG,
);
