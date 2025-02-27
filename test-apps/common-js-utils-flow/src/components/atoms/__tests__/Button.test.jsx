/**
 * Unit tests for Button component.
 * @file This file is saved as `Button.test.jsx`.
 */
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Component from '../Button';

describe('Button unit tests', () => {
  afterEach(() => {
    cleanup();
  });

  test('Button snapshot test', () => {
    const component = render(<Component />);

    expect(component).toMatchSnapshot();
  });

  it('Button renders correctly', () => {
    const { getByTestId } = render(<Component />);

    expect(getByTestId('button')).toHaveTextContent('Button');
    fireEvent.click(getByTestId('button'));
  });
});
