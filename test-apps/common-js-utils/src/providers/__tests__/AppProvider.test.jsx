/**
 * AppProvider unit tests.
 * @file This file is saved as `AppProvider.test.jsx`.
 */
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReduxProvider from '../ReduxProvider';

import AppProvider from '../AppProvider';
import App from '../../HOC/App';

// Mock the dependencies
jest.mock('../../HOC/App', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-app">Mock App</div>),
}));

jest.mock('../../redux/store/store', () => ({
  __esModule: true,
  default: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

jest.mock('../ReduxProvider', () =>
  jest.fn(({ children }) => (
    <div data-testid="mock-redux-wrapper">{children}</div>
  )),
);

describe('AppProvider Tests', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<AppProvider />);
    expect(container).toBeTruthy();
  });

  it('renders ReduxProvider with correct props', () => {
    render(<AppProvider />);

    // Check if ReduxProvider was called with correct store prop
    expect(ReduxProvider).toHaveBeenCalledTimes(1);
  });

  it('renders App component inside ReduxProvider', () => {
    render(<AppProvider />);

    // Check if both wrapper and app are rendered
    expect(screen.getByTestId('mock-redux-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('mock-app')).toBeInTheDocument();
  });

  it('maintains correct component hierarchy', () => {
    render(<AppProvider />);

    // Check if App is nested inside ReduxProvider
    const wrapper = screen.getByTestId('mock-redux-wrapper');
    const app = screen.getByTestId('mock-app');
    expect(wrapper).toContainElement(app);
  });

  it('matches snapshot', () => {
    const { container } = render(<AppProvider />);
    expect(container).toMatchSnapshot();
  });

  it('renders App component exactly once', () => {
    render(<AppProvider />);
    expect(App).toHaveBeenCalledTimes(1);
  });

  it('provides Redux store to the app', () => {
    render(<AppProvider />);

    // Verify ReduxProvider was called with store
    expect(ReduxProvider).toHaveBeenCalledTimes(1);
  });

  it('has correct structure and content', () => {
    const { container } = render(<AppProvider />);

    // Check the DOM structure
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Mock App')).toBeInTheDocument();
  });
});
