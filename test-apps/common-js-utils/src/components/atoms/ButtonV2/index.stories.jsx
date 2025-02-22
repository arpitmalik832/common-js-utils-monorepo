/**
 * This file is used to test the Button component.
 * @file This file is saved as 'src/components/atoms/Button/index.stories.jsx'.
 */
import { ReduxProvider } from '@arpitmalik832/common-js-utils';

import Button from './index';
import store from '../../../redux/store/store';

export default {
  title: 'Atoms/Button',
  component: () => (
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
