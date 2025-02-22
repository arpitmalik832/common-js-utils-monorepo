/**
 * This file contains utility functions for objects.
 * @file This file is saved as `objectUtils.js`.
 */

/**
 * Converts an object into an array of key-value pairs.
 * @param {object} properties - The object to convert.
 * @returns {Array} An array of key-value pairs.
 * @example
 * const result = convertToArrayOfPairs({ a: 1, b: 2 });
 * // result will be [['a', 1], ['b', 2]]
 */
function convertToArrayOfPairs(properties = {}) {
  return Object.entries(properties).reduce((acc, curr, idx) => {
    if (idx % 2 === 0) {
      acc.push([curr]);
    } else {
      acc[Math.floor(idx / 2)].push(curr);
    }
    return acc;
  }, []);
}

/**
 * Renames the keys of an object based on a provided mapping.
 * @param {object} keysMap - An object mapping old keys to new keys.
 * @param {object} obj - The object whose keys will be renamed.
 * @returns {object} A new object with renamed keys.
 * @example
 * const newObj = renameKeys({ oldKey: 'newKey' }, { oldKey: 'value' });
 * // newObj will be { newKey: 'value' }
 */
function renameKeys(keysMap, obj) {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {},
  );
}

export { convertToArrayOfPairs, renameKeys };
