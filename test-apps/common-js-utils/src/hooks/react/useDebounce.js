/**
 * The useDebounce hook.
 * @file This file is saved as `useDebounce.js`.
 */

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

export default useDebounce;
