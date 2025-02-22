/**
 * Button component storybook.
 * @file This file is saved as `index.stories.jsx`.
 */
import Button from './index';

export default {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};
