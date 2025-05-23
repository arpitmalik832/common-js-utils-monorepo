// @flow
import React from 'react';
import { ReactComponent as StandardAccount } from '@arpitmalik832/common-js-utils-flow/assets/icons/lg32/standardAccount.svg';
import forwardGrey from '@arpitmalik832/common-js-utils-flow/assets/images/forwardGrey.png';

import s from './index.module.scss';

function Button(): React.Node {
  return (
    <div data-testid="button" className={s.button}>
      <StandardAccount />
      <img src={forwardGrey} alt="" />
      Button
    </div>
  );
}

export default Button;
