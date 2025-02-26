/**
 * Unit tests for Icons component.
 * @file This file is saved as `Icons.test.jsx`.
 */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Icons from '../Icons';
import { copyToClipboard } from '../../utils/commonUtils';

jest.mock('../../../static/enums/icons_list.mjs', () => ({
  __esModule: true,
  default: [
    'lg32/standardAccount.svg',
    'rg24/systemActionABCKeypad.svg',
    'sm16/systemAdd.svg',
  ],
}));

// Mock the commonUtils
jest.mock('../../utils/commonUtils', () => ({
  copyToClipboard: jest.fn(),
}));

// Mock the logsUtils
jest.mock('../../utils/logsUtils', () => ({
  log: jest.fn(),
  errorLog: jest.fn(),
}));

// Mock dynamic imports for icons
jest.mock(
  '../../assets/icons/lg32/standardAccount.svg',
  () => ({
    ReactComponent: () => <div data-testid="mock-icon">Icon1</div>,
  }),
  { virtual: true },
);

jest.mock(
  '../../assets/icons/rg24/systemActionABCKeypad.svg',
  () => ({
    ReactComponent: () => <div data-testid="mock-icon">Icon2</div>,
  }),
  { virtual: true },
);

jest.mock(
  '../../assets/icons/sm16/systemAdd.svg',
  () => ({
    ReactComponent: () => <div data-testid="mock-icon">Icon3</div>,
  }),
  { virtual: true },
);

describe('Icons Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    let getAllByTestId;
    await act(async () => {
      const rendered = render(<Icons />);
      getAllByTestId = rendered.getAllByTestId;
    });
    expect(getAllByTestId('icon-box').length).toBe(3);
  });

  describe('Icon sections', () => {
    it('renders all size sections', async () => {
      let getByText;
      await act(async () => {
        const rendered = render(<Icons />);
        getByText = rendered.getByText;
      });
      expect(getByText('sm16')).toBeInTheDocument();
      expect(getByText('rg24')).toBeInTheDocument();
      expect(getByText('lg32')).toBeInTheDocument();
    });
  });

  describe('Icon component', () => {
    it('handles successful icon loading', async () => {
      let getAllByTestId;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByTestId = rendered.getAllByTestId;
      });

      await waitFor(() => {
        expect(getAllByTestId('mock-icon').length).toBe(3);
      });
    });

    it('handles icon loading errors', async () => {
      const originalIconsList = jest.requireMock(
        '../../../static/enums/icons_list.mjs',
      ).default;
      jest.requireMock('../../../static/enums/icons_list.mjs').default = [
        'lg32/abc.svg',
        'rg24/abc.svg',
        'sm16/abc.svg',
      ];

      await act(async () => {
        render(<Icons />);
      });

      // Restore the original icons list
      jest.requireMock('../../../static/enums/icons_list.mjs').default =
        originalIconsList;
    });
  });

  describe('Modal functionality', () => {
    it('opens modal when icon is clicked', async () => {
      let getAllByTestId;
      let getByTestId;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByTestId = rendered.getAllByTestId;
        getByTestId = rendered.getByTestId;
      });

      const iconBox = getAllByTestId('icon-box')[0];
      await act(async () => {
        fireEvent.click(iconBox);
      });
      expect(getByTestId('icon-modal')).toBeInTheDocument();
    });

    it('closes modal when backdrop is clicked', async () => {
      let getAllByTestId;
      let getByTestId;
      let queryByTestId;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByTestId = rendered.getAllByTestId;
        getByTestId = rendered.getByTestId;
        queryByTestId = rendered.queryByTestId;
      });

      const iconBox = getAllByTestId('icon-box')[0];
      await act(async () => {
        fireEvent.click(iconBox);
      });
      const backdrop = getByTestId('backdrop');
      await act(async () => {
        fireEvent.click(backdrop);
      });
      expect(queryByTestId('icon-modal')).not.toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      let getAllByTestId;
      let getByTestId;
      let queryByTestId;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByTestId = rendered.getAllByTestId;
        getByTestId = rendered.getByTestId;
        queryByTestId = rendered.queryByTestId;
      });

      const iconBox = getAllByTestId('icon-box')[0];
      await act(async () => {
        fireEvent.click(iconBox);
      });
      const closeButton = getByTestId('close-icon');
      await act(async () => {
        fireEvent.click(closeButton);
      });
      expect(queryByTestId('icon-modal')).not.toBeInTheDocument();
    });

    it('handles keyboard navigation', async () => {
      let getAllByTestId;
      let getByTestId;
      let queryByTestId;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByTestId = rendered.getAllByTestId;
        getByTestId = rendered.getByTestId;
        queryByTestId = rendered.queryByTestId;
      });

      const iconBox = getAllByTestId('icon-box')[0];
      await act(async () => {
        fireEvent.keyDown(iconBox, { key: ' ' });
      });
      await act(async () => {
        fireEvent.keyDown(iconBox, { key: 'A' });
      });
      expect(getByTestId('icon-modal')).toBeInTheDocument();

      const copyButton = getByTestId('copy-icon');
      await act(async () => {
        fireEvent.keyDown(copyButton, { key: ' ' });
      });
      await act(async () => {
        fireEvent.keyDown(copyButton, { key: 'A' });
      });
      expect(copyToClipboard).toHaveBeenCalled();

      const closeButton = getByTestId('close-icon');
      await act(async () => {
        fireEvent.keyDown(closeButton, { key: 'A' });
      });
      await act(async () => {
        fireEvent.keyDown(closeButton, { key: ' ' });
      });
      expect(queryByTestId('icon-modal')).not.toBeInTheDocument();

      await act(async () => {
        fireEvent.keyDown(iconBox, { key: ' ' });
      });
      await act(async () => {
        fireEvent.keyDown(iconBox, { key: 'A' });
      });
      expect(getByTestId('icon-modal')).toBeInTheDocument();

      const backdrop = getByTestId('backdrop');
      await act(async () => {
        fireEvent.keyDown(backdrop, { key: 'A' });
      });
      await act(async () => {
        fireEvent.keyDown(backdrop, { key: ' ' });
      });
      expect(queryByTestId('icon-modal')).not.toBeInTheDocument();
    });
  });

  describe('Copy functionality', () => {
    it('copies import path when copy button is clicked', async () => {
      let getAllByTestId;
      let getByTestId;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByTestId = rendered.getAllByTestId;
        getByTestId = rendered.getByTestId;
      });

      const iconBox = getAllByTestId('icon-box')[0];
      await act(async () => {
        fireEvent.click(iconBox);
      });
      const copyButton = getByTestId('copy-icon');
      await act(async () => {
        fireEvent.click(copyButton);
      });
      expect(copyToClipboard).toHaveBeenCalled();
    });

    it('generates correct import path', async () => {
      let getAllByTestId;
      let getByTestId;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByTestId = rendered.getAllByTestId;
        getByTestId = rendered.getByTestId;
      });

      const iconBox = getAllByTestId('icon-box')[0];
      await act(async () => {
        fireEvent.click(iconBox);
      });
      const codeElement = getByTestId('code-element');
      expect(codeElement.textContent).toMatch(
        /import { ReactComponent as [A-Z][a-zA-Z]+ } from 'library_name\/icons\/.+'/,
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      let getAllByRole;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByRole = rendered.getAllByRole;
      });
      const buttons = getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed');
        expect(button).toHaveAttribute('tabIndex');
      });
    });

    it('handles keyboard interactions', async () => {
      let getAllByTestId;
      let getByTestId;
      let queryByTestId;
      await act(async () => {
        const rendered = render(<Icons />);
        getAllByTestId = rendered.getAllByTestId;
        getByTestId = rendered.getByTestId;
        queryByTestId = rendered.queryByTestId;
      });

      const iconBox = getAllByTestId('icon-box')[0];

      // Test Enter key
      await act(async () => {
        fireEvent.keyDown(iconBox, { key: 'Enter' });
      });
      await act(async () => {
        fireEvent.keyDown(iconBox, { key: 'A' });
      });
      expect(getByTestId('icon-modal')).toBeInTheDocument();

      // Test Space key
      const closeButton = getByTestId('close-icon');
      await act(async () => {
        fireEvent.keyDown(closeButton, { key: ' ' });
      });
      await act(async () => {
        fireEvent.keyDown(closeButton, { key: 'A' });
      });
      expect(queryByTestId('icon-modal')).not.toBeInTheDocument();
    });
  });
});
