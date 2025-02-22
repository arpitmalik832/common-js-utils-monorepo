/**
 * This file contains utility functions for query parameters.
 * @file This file is saved as `queryUtils.js`.
 */
/**
 * Retrieves a specific query parameter from a query string.
 * @param {string} query - The query string to search within.
 * @param {string} param - The name of the query parameter to retrieve.
 * @returns {string|null} The value of the query parameter, or null if not found.
 * @example
 * // returns 'value'
 * getQueryParam('?param=value', 'param');
 */
function getQueryParam(query, param) {
  const urlSearchParams = new URLSearchParams(query);
  return param ? urlSearchParams?.get(param) : urlSearchParams;
}

/**
 * Processes the query parameters from a given search string.
 * @param {string} searchString - The query string to process.
 * @returns {object} An object representing the key-value pairs of the query parameters.
 * @example
 * // returns { param: 'value' }
 * processQueryParams('?param=value');
 */
function processQueryParams(searchString) {
  const data = searchString.substring(1);
  const array = data.split('&');
  return array.reduce((oldData, currentData) => {
    const split = currentData.split('=');
    const [key, value] = split;
    // eslint-disable-next-line no-param-reassign
    oldData[key] = value;
    return oldData;
  }, {});
}

export { getQueryParam, processQueryParams };
