/**
 * This hook is used to mount the app.
 * @file This file is saved as `src/hooks/useAppMount.js`.
 */
import useTheme from './useTheme';
import useInitAxios from './useInitAxios';

/**
 * This hook is used to mount the app.
 * @example
 * ```js
 * useAppMount();
 * ```
 */
function useAppMount() {
  useTheme();
  useInitAxios();
}

export default useAppMount;
