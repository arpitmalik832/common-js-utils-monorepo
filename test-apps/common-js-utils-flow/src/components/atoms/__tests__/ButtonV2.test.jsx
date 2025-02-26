/**
 * Button unit tests.
 * @file The file is saved as `Button.test.jsx`.
 */
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { slices } from '@arpitmalik832/common-js-utils-flow';
import { configureStore } from '@reduxjs/toolkit';

import ReduxProvider from '../../../providers/ReduxProvider';

import Button from '../ButtonV2';

describe('Button unit tests', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        app: slices?.appSlice?.reducer,
      },
    });
    // Mock the dispatch function
    store.dispatch = jest.fn();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  const renderButton = () =>
    render(
      <ReduxProvider store={store}>
        <Button />
      </ReduxProvider>,
    );

  test('Button snapshot test', () => {
    const { container } = renderButton();
    expect(container).toMatchSnapshot();
  });

  it('renders with correct text content', () => {
    const { getByTestId } = renderButton();
    expect(getByTestId('button')).toHaveTextContent('Button');
  });

  it('has correct button attributes', () => {
    const { getByTestId } = renderButton();
    const button = getByTestId('button');

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-cy', 'button');
    expect(button).toHaveClass('button');
  });

  it('dispatches correct action on click', () => {
    const { getByTestId } = renderButton();
    const button = getByTestId('button');

    fireEvent.click(button);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      slices.appSliceActions.updateStore({ key: 'x', value: 'a' }),
    );
  });
});
