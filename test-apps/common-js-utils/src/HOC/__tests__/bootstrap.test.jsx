/**
 * This file is used to test the bootstrap file.
 * @file This file is saved as `src/__tests__/bootstrap.test.jsx`.
 */
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { mount } from '../../bootstrap';
import AppProvider from '../../providers/AppProvider';
import { MOUNT_ERRORS } from '../../enums/app';

// Mock React dependencies
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

jest.mock('../../providers/AppProvider', () => () => (
  <div>Mock App Provider</div>
));

describe('Bootstrap Tests', () => {
  let mockRoot;
  let mockElement;
  let mockUnmount;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock DOM element
    mockElement = document.createElement('div');

    // Create mock root methods
    mockUnmount = jest.fn();
    mockRoot = {
      render: jest.fn(),
      unmount: mockUnmount,
    };

    // Setup createRoot mock
    createRoot.mockReturnValue(mockRoot);
  });

  it('should create root with provided element', () => {
    mount(mockElement);
    expect(createRoot).toHaveBeenCalledWith(mockElement);
  });

  it('should render AppProvider within StrictMode', () => {
    mount(mockElement);
    expect(mockRoot.render).toHaveBeenCalledWith(
      <StrictMode>
        <AppProvider />
      </StrictMode>,
    );
  });

  it('should return unmount function', () => {
    const unmount = mount(mockElement);
    expect(typeof unmount).toBe('function');
  });

  describe('Unmount Function', () => {
    it('should call root.unmount when unmount function is called', async () => {
      const unmount = mount(mockElement);
      unmount();

      // Wait for microtask queue to process
      await Promise.resolve();

      expect(mockUnmount).toHaveBeenCalled();
    });

    it('should queue unmount in microtask', () => {
      const unmount = mount(mockElement);
      unmount();
      expect(mockUnmount).not.toHaveBeenCalled();
    });

    it('should execute unmount after microtask queue', async () => {
      const unmount = mount(mockElement);
      unmount();

      expect(mockUnmount).not.toHaveBeenCalled();
      await Promise.resolve();
      expect(mockUnmount).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should throw error if no element is provided', () => {
      expect(() => mount()).toThrow(MOUNT_ERRORS.ELEMENT_REQUIRED);
    });

    it('should throw error if invalid element is provided', () => {
      expect(() => mount(null)).toThrow(MOUNT_ERRORS.ELEMENT_REQUIRED);
      expect(() => mount(undefined)).toThrow(MOUNT_ERRORS.ELEMENT_REQUIRED);
      expect(() => mount({})).toThrow(MOUNT_ERRORS.INVALID_DOM_ELEMENT);
      expect(() => mount('not-an-element')).toThrow(
        MOUNT_ERRORS.INVALID_DOM_ELEMENT,
      );
    });

    it('should throw error with specific message for null element', () => {
      expect(() => mount(null)).toThrow(MOUNT_ERRORS.ELEMENT_REQUIRED);
    });

    it('should throw error with specific message for non-DOM element', () => {
      expect(() => mount({ some: 'object' })).toThrow(
        MOUNT_ERRORS.INVALID_DOM_ELEMENT,
      );
    });

    it('should accept valid DOM element', () => {
      expect(() => mount(document.createElement('div'))).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should create root and render app successfully', () => {
      const unmount = mount(mockElement);
      expect(createRoot).toHaveBeenCalledWith(mockElement);
      expect(mockRoot.render).toHaveBeenCalled();
      expect(typeof unmount).toBe('function');
    });

    it('should handle complete mount/unmount cycle', async () => {
      const unmount = mount(mockElement);
      expect(createRoot).toHaveBeenCalledWith(mockElement);
      expect(mockRoot.render).toHaveBeenCalled();

      unmount();
      await Promise.resolve();
      expect(mockUnmount).toHaveBeenCalled();
    });
  });

  describe('React Components', () => {
    it('should render AppProvider component', () => {
      mount(mockElement);
      const renderCall = mockRoot.render.mock.calls[0][0];
      expect(renderCall.type).toBe(StrictMode);
      expect(renderCall.props.children.type).toBe(AppProvider);
    });

    it('should wrap AppProvider with StrictMode', () => {
      mount(mockElement);
      const renderCall = mockRoot.render.mock.calls[0][0];
      expect(renderCall.type).toBe(StrictMode);
    });
  });
});
