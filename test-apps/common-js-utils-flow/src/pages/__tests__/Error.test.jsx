/**
 * Error Page unit tests.
 * @file This file is saved as `Error.test.jsx`.
 */
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Error from '../Error';

describe('Error component tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<Error />);
    expect(container).toBeTruthy();
  });

  it('renders with correct text content', () => {
    const { getByText } = render(<Error />);
    expect(getByText('error')).toBeInTheDocument();
  });

  it('renders a div element', () => {
    const { container } = render(<Error />);
    const divElement = container.querySelector('div');
    expect(divElement).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Error />);
    expect(container).toMatchSnapshot();
  });

  it('has correct structure', () => {
    const { container } = render(<Error />);
    const divElement = container.firstChild;

    // Check if it's a div
    expect(divElement.tagName).toBe('DIV');

    // Check text content
    expect(divElement.textContent).toBe('error');

    // Check that it has no child elements (only text)
    expect(divElement.children.length).toBe(0);
  });

  it('is accessible', () => {
    const { container } = render(<Error />);
    // Check if the error message is visible to screen readers
    expect(container.firstChild).toBeVisible();
  });
});
