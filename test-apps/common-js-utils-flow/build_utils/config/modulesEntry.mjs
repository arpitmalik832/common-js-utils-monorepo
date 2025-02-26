/**
 * The file provides the project entries based on the environment.
 * @file This file is saved as `build_utils/config/modulesEntry.js`.
 */
import { ENVS } from './index.mjs';

/**
 * Get the project URL based on the environment.
 * @param {string} env - The environment name.
 * @returns {object} An object containing the project URL.
 * @example
 * // returns { PROJ: 'https://proj-url.com/' }
 * getEntries('production');
 */
function getEntries(env) {
  // let exampleUrl;
  let projUrl;

  switch (env) {
    case ENVS.PRODUCTION:
      // exampleUrl = 'https://exmaple.com/';
      projUrl = 'https://proj-url.com/';
      break;
    case ENVS.BETA:
      // exampleUrl = 'https://exmaple.com/';
      projUrl = 'https://proj-url.com/';
      break;
    case ENVS.STAGING:
      // exampleUrl = 'https://exmaple.com/';
      projUrl = 'https://proj-url.com/';
      break;
    case ENVS.DEVELOPMENT:
      // exampleUrl = 'https://exmaple.com/';
      projUrl = 'http://localhost:3000/';
      break;
    default:
      // exampleUrl = 'https://exmaple.com/';
      projUrl = 'https://proj-url.com/';
  }

  return {
    // EXAMPLE: exampleUrl,
    PROJ: projUrl,
  };
}

export default getEntries;
