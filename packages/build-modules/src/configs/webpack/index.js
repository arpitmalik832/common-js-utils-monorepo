/**
 * Webpack configuration files.
 * @file This file is saved as `index.js`.
 */
import getBuildStatsConfig from './buildstats.js';
import getBundleAnalyzerConfig from './bundleanalyzer.js';
import getMinimizerConfig from './minimizer.js';
import getFederationConfig from './federation.js';
import getWorkersConfig from './workers.js';
import getCommonConfig from './common.js';
import getDevConfig from './dev.js';
import getProdConfig from './prod.js';

export {
  getBuildStatsConfig,
  getBundleAnalyzerConfig,
  getMinimizerConfig,
  getFederationConfig,
  getWorkersConfig,
  getCommonConfig,
  getDevConfig,
  getProdConfig,
};
