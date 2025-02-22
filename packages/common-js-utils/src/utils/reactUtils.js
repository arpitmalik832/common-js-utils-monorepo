/**
 * React utility hooks.
 * @file This file is saved as `reactUtils.js`.
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

/**
 * Debounce a function to limit the rate at which it can be called.
 * @param {Function} func - The function to debounce.
 * @param {number} timeout - The time in milliseconds to wait before calling the function.
 * @returns {Function} A debounced version of the provided function.
 * @example
 * const debouncedFunction = useDebounce(myFunction, 1000);
 */
function useDebounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export { useDebounce, useThrottle };
