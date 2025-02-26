/**
 * NotFound Page unit tests.
 * @file This file is saved as `NotFound.test.jsx`.
 */
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import NotFound from '../NotFound';

describe('NotFound component tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<NotFound />);
    expect(container).toBeTruthy();
  });

  it('renders with correct text content', () => {
    const { getByText } = render(<NotFound />);
    expect(getByText('404')).toBeInTheDocument();
  });

  it('renders a div element', () => {
    const { container } = render(<NotFound />);
    const divElement = container.querySelector('div');
    expect(divElement).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<NotFound />);
    expect(container).toMatchSnapshot();
  });

  it('has correct structure', () => {
    const { container } = render(<NotFound />);
    const divElement = container.firstChild;

    // Check if it's a div
    expect(divElement.tagName).toBe('DIV');

    // Check text content
    expect(divElement.textContent).toBe('404');

    // Check that it has no child elements (only text)
    expect(divElement.children.length).toBe(0);
  });

  it('is accessible', () => {
    const { container } = render(<NotFound />);
    // Check if the 404 message is visible to screen readers
    expect(container.firstChild).toBeVisible();
  });

  it('has correct role for accessibility', () => {
    const { container } = render(<NotFound />);
    // The main content should be visible and properly structured
    expect(container.firstChild).toBeVisible();
    expect(container.firstChild).toHaveTextContent('404');
  });
});
