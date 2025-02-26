/**
 * This hook handles navigation in a route.
 * @file It is saved as `useNavigation.js`.
 */
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  slices,
  beforeUnload,
  errorLog,
  log,
} from '@arpitmalik832/common-js-utils-pkg';

import { BACK_CLICK, APP_UNMOUNT } from '../enums/app';

/**
 * Custom hook to handle navigation in a route.
 * @returns {object} An object containing the stack and methods to manipulate it.
 * @example
 * const { stack, push, pop, clear } = useNavigation();
 */
function useNavigation() {
  const stack = useSelector(state => state.navigation);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBackPress = useCallback(() => {
    if (stack.length) {
      dispatch(slices.navigationSliceActions.pop());
    } else {
      const res = navigate(-1);
      if (res instanceof Promise) {
        res
          .then(() => {
            log(BACK_CLICK.SUCCESS);
          })
          .catch(err => {
            errorLog(BACK_CLICK.ERROR, err);
          });
      }
    }
  }, [stack]);

  window.backPress = handleBackPress;

  useEffect(() => {
    beforeUnload.subscribe(() => {
      log(APP_UNMOUNT);
    });

    return () => {
      beforeUnload.unSubscribe();
    };
  }, []);

  /**
   * Pushes a callback onto the stack.
   * @param {Function} callback - The callback to push onto the stack.
   * @example
   * push(() => console.log('Callback executed'));
   */
  function push(callback) {
    dispatch(slices.navigationSliceActions.push(callback));
  }

  /**
   * Pops the last item from the stack and handles back press.
   * @example
   * const { pop } = useBackPress();
   * pop();
   */
  function pop() {
    handleBackPress();
  }

  /**
   * Replaces the last item from the stack.
   * @param {Function} callback - The callback to replace the last item.
   * @example
   * replace(() => console.log('Callback executed'));
   */
  function replace(callback) {
    dispatch(slices.navigationSliceActions.replace(callback));
  }

  const clear = useCallback(() => {
    if (stack.length) {
      dispatch(slices.navigationSliceActions.clear());
    }
  }, [stack]);

  return { stack, push, pop, replace, clear };
}

export default useNavigation;
