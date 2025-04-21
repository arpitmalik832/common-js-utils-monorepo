/**
 * @file ESLint configuration for ignoring files.
 */

/**
 * Get the ESLint configuration for ignoring files.
 * @param {Array} ignoredDirs - The directories to ignore.
 * @returns {Array} The ESLint configuration for ignoring files.
 * @example
 * const ignoreConfig = getConfig();
 * console.log(ignoreConfig);
 */
function getConfig(ignoredDirs = []) {
  return [
    {
      ignores: ignoredDirs,
    },
  ];
}

export default getConfig;
