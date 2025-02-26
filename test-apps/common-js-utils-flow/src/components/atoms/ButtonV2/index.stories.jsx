// @flow
import React from 'react';
import { ReduxProvider } from '@arpitmalik832/common-js-utils-flow';

import Button from './index';
import store from '../../../redux/store/main';

export default {
  title: 'Atoms/Button',
  component: (): React.Node => (
    <ReduxProvider store={store}>
      <Button />
    </ReduxProvider>
  ),
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};
