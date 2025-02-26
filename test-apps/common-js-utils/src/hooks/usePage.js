/**
 * This hook handles pages in a route.
 * @file It is saved as `usePage.js`.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { slices, errorLog, log } from '@arpitmalik832/common-js-utils-pkg';

import { BACK_CLICK } from '../enums/app';

/**
 * Custom hook to handle pages in a route.
 * @returns {object} An object containing the stack and methods to manipulate it.
 * @example
 * const { stack, push, pop, clear } = usePage();
 */
function usePage() {
  const stack = useSelector(state => state.page);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBackPress = useCallback(() => {
    if (stack.length) {
      dispatch(slices.pageSliceActions.pop());
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

  /**
   * Pushes a callback onto the stack.
   * @param {Function} callback - The callback to push onto the stack.
   * @example
   * push(() => console.log('Callback executed'));
   */
  function push(callback) {
    dispatch(slices.pageSliceActions.push(callback));
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
    dispatch(slices.pageSliceActions.replace(callback));
  }

  const clear = useCallback(() => {
    if (stack.length) {
      dispatch(slices.pageSliceActions.clear());
    }
  }, [stack]);

  return { stack, push, pop, replace, clear };
}

export default usePage;
