/**
 * Generates the build stats for the bundle.
 * @file This file is saved as `buildStats.js`.
 */
import { MAIN_ENUMS } from '../../enums/index.js';
import { errorLog, processPath } from '../../utils/index.js';

/**
 * Builds statistics for the bundle.
 * @param {string[]} pathsArr - The paths to process.
 * @param {string} env - The environment variable to check.
 * @returns {void}
 * @example
 * // Example usage
 * MinimizePlugin(['path/to/file1', 'path/to/file2']);
 */
function MinimizePlugin(pathsArr, env) {
  return {
    name: 'minimize-plugin',
    async writeBundle() {
      try {
        if ([MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env)) {
          await Promise.all(pathsArr.map(inputPath => processPath(inputPath)));
        }
      } catch (err) {
        errorLog('Error in MinimizePlugin:', err);
      }
    },
  };
}

export default MinimizePlugin;
