/**
 * Unit tests for Colors component.
 * @file This file is saved as `Colors/__tests__/index.test.jsx`.
 */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Colors from '../Colors/index';
import tokens from '../../../static/enums/design_tokens.json';

// Mock the scss module
jest.mock('../index.scss', () => ({
  colorsContainer: 'colorsContainer',
  colorCard: 'colorCard',
  colorName: 'colorName',
  colorCode: 'colorCode',
  whiteText: 'whiteText',
  sectionHeading: 'sectionHeading',
  themeHeader: 'themeHeader',
  colorsRow: 'colorsRow',
}));

describe('Colors Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<Colors />);
    const container = getByTestId('colorsContainer');
    expect(container).toBeInTheDocument();
  });

  describe('getColorValue function', () => {
    it('should handle hex color values', () => {
      const { getAllByTestId } = render(<Colors />);
      const colorCards = getAllByTestId('colorCard');
      expect(colorCards.length).toBeGreaterThan(0);

      // Verify that hex colors are rendered correctly
      const hexColors = colorCards.filter(card =>
        card.querySelector('.colorCode')?.textContent.startsWith('#'),
      );
      expect(hexColors.length).toBeGreaterThan(0);
    });

    it('should handle primitive color references', () => {
      const { getAllByTestId } = render(<Colors />);
      const colorCards = getAllByTestId('colorCard');

      // Verify that primitive colors are resolved and rendered
      const primitiveColors = colorCards.filter(card =>
        card.querySelector('.colorCode')?.textContent.match(/#[0-9A-F]{6}/i),
      );
      expect(primitiveColors.length).toBeGreaterThan(0);
    });
  });

  describe('renderColorBox function', () => {
    it('should render color boxes with correct styles', () => {
      const { getAllByTestId } = render(<Colors />);
      const colorCards = getAllByTestId('colorCard');

      colorCards.forEach(card => {
        // Check if background color is set
        const style = window.getComputedStyle(card);
        expect(style.background).not.toBe('');
        expect(style.background).toMatch(
          /(#[0-9A-F]{6}|rgb\(\d+,\s*\d+,\s*\d+\))/i,
        );

        // Check if color name and code are present
        expect(card.querySelector('.colorName')).toBeInTheDocument();
        expect(card.querySelector('.colorCode')).toBeInTheDocument();
      });
    });

    it('should apply white text class for light theme', () => {
      const { getAllByTestId } = render(<Colors />);
      const colorNames = getAllByTestId('colorName');
      const whiteTextElements = colorNames.filter(colorName =>
        colorName.classList.contains('whiteText'),
      );
      expect(whiteTextElements.length).toBeGreaterThan(0);
    });
  });

  describe('Component Structure', () => {
    it('should render section headings', () => {
      const { getAllByTestId } = render(<Colors />);
      const sectionHeadings = getAllByTestId('type');
      expect(sectionHeadings.length).toBeGreaterThan(0);

      // Verify capitalization
      sectionHeadings.forEach(heading => {
        expect(heading.textContent).toMatch(/^[A-Z]/);
      });
    });

    it('should render theme headers', () => {
      const { getByTestId } = render(<Colors />);
      const themeHeader = getByTestId('themeHeader');
      expect(themeHeader).toBeInTheDocument();
      expect(themeHeader).toHaveTextContent('Light');
      expect(themeHeader).toHaveTextContent('Dark');
    });

    it('should render color rows', () => {
      const { getAllByTestId } = render(<Colors />);
      const colorRows = getAllByTestId('colorsRow');
      expect(colorRows.length).toBeGreaterThan(0);

      // Each row should contain both light and dark theme colors
      colorRows.forEach(row => {
        const colorCards = row.getElementsByClassName('colorCard');
        expect(colorCards.length).toBe(2);
      });
    });
  });

  describe('Color Value Formatting', () => {
    it('should format color variable names correctly', () => {
      const { getAllByTestId } = render(<Colors />);
      const colorNames = getAllByTestId('colorName');

      colorNames.forEach(name => {
        expect(name.textContent).toMatch(/^--[a-z]+-[a-z]+-[0-9]+$/);
      });
    });

    it('should display hex color codes correctly', () => {
      const { getAllByTestId } = render(<Colors />);
      const colorCodes = getAllByTestId('colorCode');

      colorCodes.forEach(code => {
        expect(code.textContent).toMatch(/#([0-9A-F]{6}|[0-9A-F]{3})/i);
      });
    });
  });

  describe('Theme Switching', () => {
    it('should render both light and dark theme colors', () => {
      const { getAllByTestId } = render(<Colors />);
      const colorRows = getAllByTestId('colorsRow');

      colorRows.forEach(row => {
        const [lightTheme, darkTheme] = row.getElementsByClassName('colorCard');
        expect(lightTheme).toBeInTheDocument();
        expect(darkTheme).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing color values gracefully', () => {
      const invalidTokens = {
        'color-semantics': {
          light: {
            primary: {
              default: {
                background: {
                  value: '{color.invalid.500}',
                },
                'background-2': {
                  value: '#000',
                },
              },
            },
          },
        },
      };

      // Replace tokens temporarily
      const originalTokens = { ...tokens };
      Object.assign(tokens, invalidTokens);

      render(<Colors />);

      // Restore original tokens
      Object.assign(tokens, originalTokens);
    });
  });
});
