/**
 * The useThrottle hook.
 * @file This file is saved as `useThrottle.js`.
 */
import { useState } from 'react';

/**
 * Throttle a function to limit the rate at which it can be called.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time in milliseconds to throttle calls.
 * @returns {Function} A throttled version of the provided function.
 * @example
 * const throttledFunction = useThrottle(myFunction, 1000);
 */
function useThrottle(func, limit = 200) {
  const [inThrottle, setInThrottle] = useState(false);

  return (...args) => {
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
