/**
 * Unit tests for reactUtils.
 * @file This file is saved as `reactUtils.test.js`.
 */
import '@testing-library/jest-dom';

import useDebounce from '../../react/useDebounce';

jest.mock('react', () => ({
  _esModule: true,
  ...jest.requireActual('react'),
}));

describe('reactUtils unit tests', () => {
  const mockFunc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('useDebounce unit test with default timeout', () => {
    jest.useFakeTimers();
    useDebounce(mockFunc)();
    expect(mockFunc).not.toHaveBeenCalled();
    jest.advanceTimersByTime(250);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('useDebounce unit test with custom timeout', () => {
    jest.useFakeTimers();
    useDebounce(mockFunc, 500)();
    expect(mockFunc).not.toHaveBeenCalled();
    jest.advanceTimersByTime(600);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });
});
