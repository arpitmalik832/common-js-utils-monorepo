/**
 * Rollup plugins.
 * @file This file is saved as `index.js`.
 */
import BuildStatsPlugin from './BuildStatsPlugin.js';
import CopyPlugin from './CopyPlugin.js';
import ImportStylesPlugin from './ImportStylesPlugin.js';
import StripCustomWindowVariablesPlugin from './StripCustomWindowVariablesPlugin.js';
import MinimizePlugin from './MinimizePlugin.js';

export {
  BuildStatsPlugin,
  CopyPlugin,
  ImportStylesPlugin,
  MinimizePlugin,
  StripCustomWindowVariablesPlugin,
};
