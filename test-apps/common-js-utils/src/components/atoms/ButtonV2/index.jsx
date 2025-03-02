/**
 * A button component that dispatches an action when clicked.
 * @file This file is saved as `src/components/atoms/Button/index.jsx`.
 */
import { slices } from '@arpitmalik832/common-js-utils';
import { useDispatch } from 'react-redux';

import s from './index.module.scss';

/**
 * A button component that dispatches an action when clicked.
 * @returns {import('react').JSX.Element} The rendered button component.
 * @example
 * <Button />
 */
function Button() {
  const dispatch = useDispatch();

  /**
   * Handles the button click event by dispatching an action to update the store.
   * @example
   * onButtonClick();
   */
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
