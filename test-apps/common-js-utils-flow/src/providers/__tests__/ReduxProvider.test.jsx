/**
 * Unit tests for ReduxProvider component.
 * @file This file is saved as `ReduxProvider.test.jsx`.
 */
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Component from '../ReduxProvider';

jest.mock('react-redux', () => ({
  Provider: jest.fn(() => <div data-testid="mock-provider" />),
}));

describe('ReduxProvider unit tests', () => {
  afterEach(cleanup);

  it('ReduxProvider snapshot test', () => {
    const component = render(<Component />);

    expect(component).toMatchSnapshot();
  });
});
