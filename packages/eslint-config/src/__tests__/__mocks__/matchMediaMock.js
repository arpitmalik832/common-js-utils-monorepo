/**
 * It contains the matchMedia mock.
 * @file The file is saved as `matchMediaMock.js`.
 */

/**
 * Mocks the matchMedia function.
 * @param {boolean} matches - Indicates if the media query matches.
 * @returns {object} The mocked matchMedia object.
 * @example
 * const mediaQueryList = matchMediaMock(true);
 * console.log(mediaQueryList.matches); // true
 */
function matchMediaMock(matches) {
  return jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

export default matchMediaMock;
