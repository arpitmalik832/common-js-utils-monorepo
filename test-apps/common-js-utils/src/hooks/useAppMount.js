/**
 * This hook is used to mount the app.
 * @file This file is saved as 'src/hooks/useAppMount.js'.
 */
import useTheme from './useTheme.js';

// eslint-disable-next-line import/extensions
import useInitAxios from './useInitAxios.js';

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
