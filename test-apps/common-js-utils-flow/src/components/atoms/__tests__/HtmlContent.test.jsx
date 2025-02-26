/**
 * Unit tests for HtmlContent component.
 * @file This file is saved as `HtmlContent.test.jsx`.
 */
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import HtmlContent from '../HtmlContent';

describe('HtmlContent unit tests', () => {
  afterEach(() => {
    cleanup();
  });

  test('HtmlContent snapshot test', () => {
    const component = render(
      <HtmlContent title="title" description="description" />,
    );

    expect(component).toMatchSnapshot();
  });
});
