/**
 * This file is used to configure storybook.
 * @file This file is saved as '.storybook/main.js'.
 */
import path from 'path';
import { storybookConfigs } from '@arpitmalik832/build-modules';

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
