// @flow
import { useState } from 'react';

function useThrottle<D, T: VoidFunctionWithParams<D>>(
  func: T,
  limit: number = 200,
): (...args: D[]) => void {
  const [inThrottle, setInThrottle] = useState(false);

  return (...args: D[]) => {
    if (!inThrottle) {
      func(...args);
      setInThrottle(true);
      setTimeout(() => {
        setInThrottle(false);
      }, limit);
    }
  };
}

function useDebounce<D, T: VoidFunctionWithParams<D>>(
  func: T,
  timeout: number = 200,
): (...args: D[]) => void {
  let timer;
  return (...args: D[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export { useDebounce, useThrottle };
