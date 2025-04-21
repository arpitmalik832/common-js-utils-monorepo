/**
 * @file The index file for base configs.
 */
import getBaseConfig from './base.js';
import getBaseReactConfig from './baseReact.js';
import getBaseReactFlowConfig from './baseReactFlow.js';
import globalsConfig from './globals.js';
import getIgnoreConfig from './ignore.js';
import jestConfig from './jest.js';
import jsdocConfig from './jsdoc.js';
import mdConfig from './md.js';
import cypressConfig from './cypress.js';

export {
  getBaseConfig,
  getBaseReactConfig,
  getBaseReactFlowConfig,
  globalsConfig,
  getIgnoreConfig,
  jestConfig,
  jsdocConfig,
  mdConfig,
  cypressConfig,
};
