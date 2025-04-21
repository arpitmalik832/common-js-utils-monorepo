/**
 * PageWrapper unit tests.
 * @file The file is saved as `PageWrapper.test.jsx`.
 */
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { log } from '@arpitmalik832/common-js-utils';

import PageWrapper from '../PageWrapper';

// Mock the react-router dependencies
jest.mock('react-router', () => ({
  __esModule: true,
  ...jest.requireActual('react-router'),
  useLocation: () => ({
    pathname: '/test-path',
  }),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

// Mock the logging function
jest.mock('@arpitmalik832/common-js-utils', () => ({
  log: jest.fn(),
}));

describe('PageWrapper unit tests', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders PageWrapper with correct content', () => {
    render(<PageWrapper />);

    // Check if "Page Wrapper" text is present
    expect(screen.getByText('Page Wrapper')).toBeInTheDocument();

    // Check if Outlet is rendered
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });

  it('logs route change on mount', () => {
    render(<PageWrapper />);

    // Verify that log was called with correct arguments
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith('Route changed:', '/test-path');
  });

  it('PageWrapper snapshot test', () => {
    const { container } = render(<PageWrapper />);
    expect(container).toMatchSnapshot();
  });
});
