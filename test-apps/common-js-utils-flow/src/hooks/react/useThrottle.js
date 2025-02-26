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

export default useThrottle;
