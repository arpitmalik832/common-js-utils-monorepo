/**
 * The file provides the project entries based on the environment.
 * @file This file is saved as `build_utils/config/modulesEntry.js`.
 */
import { MAIN_ENUMS } from '../enums/index.js';

/**
 * Get all the project URLs.
 * @returns {object} An object containing the project URLs.
 * @example
 * // returns {
 * //   [MAIN_ENUMS.ENVS.PROD]: 'https://proj-x.com/',
 * //   [MAIN_ENUMS.ENVS.BETA]: 'https://proj-x-beta.com/',
 * //   [MAIN_ENUMS.ENVS.STG]: 'https://proj-x-stg.com/',
 * //   [MAIN_ENUMS.ENVS.DEV]: 'https://proj-x-dev.com/',
 * //   [MAIN_ENUMS.ENVS.DEFAULT]: 'https://proj-x-stg.com/',
 * // }
 * getProjUrls();
 */
function getProjXUrls() {
  return {
    [MAIN_ENUMS.ENVS.PROD]: 'https://proj-x.com/',
    [MAIN_ENUMS.ENVS.BETA]: 'https://proj-x-beta.com/',
    [MAIN_ENUMS.ENVS.STG]: 'https://proj-x-stg.com/',
    [MAIN_ENUMS.ENVS.DEV]: 'https://proj-x-dev.com/',
    [MAIN_ENUMS.ENVS.DEFAULT]: 'https://proj-x-stg.com/',
  };
}

/**
 * Get the project URLs based on the environment.
 * @param {string} proj - The project name.
 * @returns {object} An object containing the project URLs.
 * @example
 * // returns {
 * //   [MAIN_ENUMS.ENVS.PROD]: 'https://main-proj.com/',
 * //   [MAIN_ENUMS.ENVS.BETA]: 'https://main-proj-beta.com/',
 * //   [MAIN_ENUMS.ENVS.STG]: 'https://main-proj-stg.com/',
 * //   [MAIN_ENUMS.ENVS.DEV]: 'https://main-proj-dev.com/',
 * //   [MAIN_ENUMS.ENVS.DEFAULT]: 'https://main-proj-stg.com/',
 * // }
 * getProjUrls('main');
 */
function getProjUrls(proj) {
  switch (proj) {
    case 'proj_x':
      return getProjXUrls();
    default:
      return getProjXUrls();
  }
}

/**
 * Get the project URL based on the environment.
 * @param {string} env - The environment name.
 * @param {string[]} projs - The project names.
 * @returns {object} An object containing the project URL.
 * @example
 * // returns {
 * //   MAIN: 'https://main-proj.com/',
 * //   PROJ_X: 'https://proj-x.com/',
 * // }
 * getProjEntries('production', ['proj_x']);
 */
function getProjEntries(env, projs = []) {
  const projsUrl = {};

  projs.forEach(proj => {
    projsUrl[proj] = getProjUrls(proj)[env];
  });

  return {
    ...projsUrl,
  };
}

export { getProjEntries };
