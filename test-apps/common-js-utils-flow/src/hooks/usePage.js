// @flow
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { slices, errorLog, log } from '@arpitmalik832/common-js-utils-flow-pkg';

import { BACK_CLICK } from '../enums/app';

function usePage(): UsePage {
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

  function push(callback: VoidFunctionWithParams<mixed>) {
    dispatch(slices.pageSliceActions.push(callback));
  }

  function pop() {
    handleBackPress();
  }

  function replace(callback: VoidFunctionWithParams<mixed>) {
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
