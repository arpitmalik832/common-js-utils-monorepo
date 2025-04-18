// @flow
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  slices,
  beforeUnload,
  errorLog,
  log,
} from '@arpitmalik832/common-js-utils-flow';

import { BACK_CLICK, APP_UNMOUNT } from '../enums/app';

function useNavigation(): UseNavigation {
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

  function push(callback: VoidFunctionWithParams<mixed>) {
    dispatch(slices.navigationSliceActions.push(callback));
  }

  function pop() {
    handleBackPress();
  }

  function replace(callback: VoidFunctionWithParams<mixed>) {
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
