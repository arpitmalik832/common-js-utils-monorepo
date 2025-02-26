/**
 * Mock of fetch for jest unit tests.
 * @file The file is saved as `FetchMock.js.`.
 */

/**
 * Mock fetch function for testing.
 * @param {any} data - The data to resolve.
 * @param {boolean} isRejected - Indicates if the promise should be rejected.
 * @returns {Function} - A jest mock function.
 * @example
 * const mockFetch = fetchMock({ data: 'test' }, false);
 * mockFetch().then(response => console.log(response)); // Logs: { data: 'test' }
 */
function fetchMock(data, isRejected) {
  return jest.fn().mockImplementation(() => {
    if (isRejected) {
      return Promise.reject(new Error('xyz'));
    }
    return Promise.resolve(data);
  });
}

export default fetchMock;
