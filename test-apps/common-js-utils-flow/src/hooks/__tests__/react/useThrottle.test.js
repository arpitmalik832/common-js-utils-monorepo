/**
 * Unit tests for reactUtils.
 * @file This file is saved as `reactUtils.test.js`.
 */
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import useThrottle from '../../react/useThrottle';

describe('reactUtils unit tests', () => {
  const mockFunc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('useThrottle unit test with custom time period', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useThrottle(mockFunc, 500));

    act(() => {
      result.current();
    });
    expect(mockFunc).toHaveBeenCalledTimes(1);

    // Second immediate call should be throttled
    act(() => {
      result.current();
    });
    expect(mockFunc).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(600);
    });

    act(() => {
      result.current();
    });
    expect(mockFunc).toHaveBeenCalledTimes(2);
  });

  it('useThrottle unit test with default time period', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useThrottle(mockFunc));

    act(() => {
      result.current();
    });
    expect(mockFunc).toHaveBeenCalledTimes(1);

    // Second immediate call should be throttled
    act(() => {
      result.current();
    });
    expect(mockFunc).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(250);
    });

    act(() => {
      result.current();
    });
    expect(mockFunc).toHaveBeenCalledTimes(2);
  });
});
