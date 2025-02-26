/**
 * Unit tests for Typography component.
 * @file This file is saved as `Typography.test.jsx`.
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Typography from '../Typography';
import tokens from '../../../static/enums/design_tokens.json';

describe('Typography Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<Typography />);

    expect(getByTestId('type-scale-heading')).toBeInTheDocument();
    expect(getByTestId('type-weight-heading')).toBeInTheDocument();
  });

  describe('Type Scale Section', () => {
    it('renders scale table headers correctly', () => {
      const { getByTestId } = render(<Typography />);
      expect(getByTestId('scale-category-head')).toBeInTheDocument();
      expect(getByTestId('size-head')).toBeInTheDocument();
      expect(getByTestId('line-height-head')).toBeInTheDocument();
      expect(getByTestId('letter-spacing-head')).toBeInTheDocument();
    });

    it('renders all typography scales from tokens', () => {
      const { getByTestId } = render(<Typography />);
      Object.keys(tokens.typography.scale).forEach(scaleName => {
        expect(getByTestId(`scale-${scaleName}`)).toBeInTheDocument();
        expect(getByTestId(`font-size-${scaleName}`)).toBeInTheDocument();
        expect(getByTestId(`line-height-${scaleName}`)).toBeInTheDocument();
        expect(getByTestId(`letter-spacing-${scaleName}`)).toBeInTheDocument();
      });
    });
  });

  describe('Type Weight Section', () => {
    it('renders all font weights from tokens', () => {
      const { getByTestId } = render(<Typography />);
      Object.keys(tokens.typography.weight).forEach(weight => {
        expect(getByTestId(`weight-name-${weight}`)).toBeInTheDocument();
      });
    });

    it('applies correct font weights to demo text', () => {
      const { getAllByTestId } = render(<Typography />);
      Object.entries(tokens.typography.weight).forEach(([weight, meta]) => {
        Object.entries(tokens.typography.scale).forEach(
          ([name, scalesMeta]) => {
            const elements = getAllByTestId(`weight-demo-${weight}-${name}`);
            expect(elements.length).toBeGreaterThan(0);
            expect(elements[0]).toHaveStyle({ fontWeight: meta.value });
            expect(elements[0]).toHaveTextContent(
              `${name} - ${scalesMeta['font-size'].value}/${scalesMeta['line-height'].value}`,
            );
          },
        );
      });
    });
  });

  describe('Style Processing', () => {
    it('converts typography token styles to React style objects', () => {
      const { getByTestId } = render(<Typography />);
      Object.entries(tokens.typography.scale).forEach(([name, meta]) => {
        const element = getByTestId(`scale-${name}`);
        expect(element).toHaveStyle({
          fontSize: meta['font-size'].value,
          lineHeight: meta['line-height'].value,
          letterSpacing: meta['letter-spacing'].value,
        });
      });
    });

    it('handles missing style values gracefully', () => {
      const originalScale = tokens.typography.scale;
      tokens.typography.scale = {
        test: {
          'font-size': { value: '16rem' },
          // Missing line-height and letter-spacing
        },
      };

      const { getByTestId } = render(<Typography />);
      const element = getByTestId('scale-test');
      expect(element).toHaveStyle({ fontSize: '16rem' });

      tokens.typography.scale = originalScale;
    });

    it('handles missing style values gracefully', () => {
      const originalScale = tokens.typography.scale;
      tokens.typography.scale = {
        test: {
          'font-size': null,
          // Missing line-height and letter-spacing
        },
      };

      const { getByTestId } = render(<Typography />);
      const element = getByTestId('scale-test');
      expect(element).toHaveStyle({ fontSize: null });

      tokens.typography.scale = originalScale;
    });
  });

  describe('Layout and Structure', () => {
    it('renders in correct section order', () => {
      const { getByTestId } = render(<Typography />);
      const typeScaleHeading = getByTestId('type-scale-heading');
      const typeWeightHeading = getByTestId('type-weight-heading');
      expect(typeScaleHeading).toHaveTextContent('Type Scale');
      expect(typeWeightHeading).toHaveTextContent('Type Weight');
    });

    it('renders table structure correctly', () => {
      const { getByTestId } = render(<Typography />);
      expect(getByTestId('scale-table')).toBeInTheDocument();
      expect(getByTestId('scale-table-head')).toBeInTheDocument();
      expect(getByTestId('scale-table-body')).toBeInTheDocument();
    });

    it('maintains consistent weight demo container structure', () => {
      const { getAllByTestId } = render(<Typography />);
      const weightContainers = getAllByTestId('weight-container');
      weightContainers.forEach(container => {
        expect(container.querySelector('.weightName')).toBeInTheDocument();
        expect(
          container.querySelector('.weightDemoContainer'),
        ).toBeInTheDocument();
      });
    });
  });
});
