/**
 * This files contains utility functions for arrays.
 * @file This file is saved as `arrayUtils.js`.
 */

/**
 * Removes duplicate values from an array.
 * @param {Array} array - The array to deduplicate.
 * @returns {Array} A new array with duplicate values removed.
 * @example
 * const uniqueArray = deduplicate([1, 2, 2, 3]); // [1, 2, 3]
 */
function deduplicate(array) {
  return [...new Set(array)];
}

export { deduplicate };
