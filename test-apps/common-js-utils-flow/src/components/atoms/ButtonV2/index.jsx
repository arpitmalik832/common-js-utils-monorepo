// @flow
import React from 'react';
import { slices } from '@arpitmalik832/common-js-utils-flow-pkg';
import { useDispatch } from 'react-redux';

import s from './index.module.scss';

function Button(): React.Node {
  const dispatch = useDispatch();

  function onButtonClick() {
    dispatch(slices.appSliceActions.updateStore({ key: 'x', value: 'a' }));
  }

  return (
    <button
      type="button"
      data-testid="button"
      data-cy="button"
      className={s.button}
      onClick={onButtonClick}
    >
      Button
    </button>
  );
}

export default Button;
