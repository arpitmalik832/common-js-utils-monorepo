/**
 * Unit tests for the reportWebVitals file.
 * @file This file is saved as `reportWebVitals.test.js`.
 */
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';
import '@testing-library/jest-dom';

import reportWebVitals from '../reportWebVitals';
import { log } from '../logsUtils';

jest.mock('web-vitals', () => ({
  onLCP: jest.fn(),
  onFID: jest.fn(),
  onCLS: jest.fn(),
  onFCP: jest.fn(),
  onTTFB: jest.fn(),
}));

jest.mock('../commonUtils', () => ({
  log: jest.fn(),
}));

describe('test reportWebVitals', () => {
  it('test function', () => {
    reportWebVitals();
    expect(onCLS).toHaveBeenCalledWith(log);
    expect(onFID).toHaveBeenCalledWith(log);
    expect(onLCP).toHaveBeenCalledWith(log);
    expect(onFCP).toHaveBeenCalledWith(log);
    expect(onTTFB).toHaveBeenCalledWith(log);
  });
});
