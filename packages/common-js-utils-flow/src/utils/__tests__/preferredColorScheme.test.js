/**
 * Unit tests for the `preferredColorScheme` event listener.
 * @file The file is saved as `preferredColorScheme.test.js`.
 */
import '@testing-library/jest-dom';

import preferredColorScheme from '../eventListeners/preferredColorScheme';
import matchMediaMock from '../../__tests__/__mocks__/matchMediaMock';

describe('preferredColorScheme unit tests', () => {
  const callBackFn = jest.fn();

  it('preferredColorScheme functions test', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock(true),
    });

    preferredColorScheme.callBackFn();
    preferredColorScheme.subscribe(callBackFn);
    preferredColorScheme.callBackFn();
    expect(callBackFn).toHaveBeenCalledTimes(2);
    preferredColorScheme.unSubscribe();
  });
});
