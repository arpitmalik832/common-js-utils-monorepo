/**
 * App unit tests.
 * @file The file is saved as `App.test.jsx`.
 */
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Component from '../App';

jest.mock('react-router', () => ({
  __esModule: true,
  RouterProvider: jest.fn(() => <div data-testid="mock-router-provider" />),
}));

jest.mock('../../routes', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('../../hooks/useAppMount', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('App unit tests', () => {
  afterEach(() => {
    cleanup();
  });

  test('App snapshot test', () => {
    const component = render(<Component />);

    expect(component).toMatchSnapshot();
  });
});
