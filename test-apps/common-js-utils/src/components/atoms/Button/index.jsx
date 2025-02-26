/**
 * The Button component.
 * @file The file is saved as `index.jsx`.
 */
import { ReactComponent as StandardAccount } from '@arpitmalik832/common-js-utils-pkg/assets/icons/lg32/standardAccount.svg';
import forwardGrey from '@arpitmalik832/common-js-utils-pkg/assets/images/forwardGrey.png';

import s from './index.module.scss';

/**
 * Button component that renders an icon and text.
 * @returns {import('react').JSX.Element} The rendered button component.
 * @example
 * <Button />
 */
function Button() {
  return (
    <div data-testid="button" className={s.button}>
      <StandardAccount />
      <img src={forwardGrey} alt="" />
      Button
    </div>
  );
}

export default Button;
