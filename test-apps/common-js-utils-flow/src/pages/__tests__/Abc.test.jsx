/**
 * Abc Test unit tests.
 * @file This file is saved as `Abc.test.jsx`.
 */
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Abc from '../Abc';

describe('Abc component tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<Abc />);
    expect(container).toBeTruthy();
  });

  it('renders with correct text content', () => {
    const { getByText } = render(<Abc />);
    expect(getByText('Abc')).toBeInTheDocument();
  });

  it('renders a div element', () => {
    const { container } = render(<Abc />);
    const divElement = container.querySelector('div');
    expect(divElement).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Abc />);
    expect(container).toMatchSnapshot();
  });

  it('has correct structure', () => {
    const { container } = render(<Abc />);
    const divElement = container.firstChild;

    // Check if it's a div
    expect(divElement.tagName).toBe('DIV');

    // Check text content
    expect(divElement.textContent).toBe('Abc');

    // Check that it has no child elements (only text)
    expect(divElement.children.length).toBe(0);
  });
});
