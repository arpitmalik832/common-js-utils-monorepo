/**
 * Unit test for converters.
 * @file This file is saved as `converters.test.js`.
 */
import '@testing-library/jest-dom';

import {
  rgbToHex,
  rgbaToHex,
  formatSecToYodaTime,
  convertGainFormat,
  gcd,
  getAspectRatio,
} from '../converters';

jest.mock('../logsUtils', () => ({
  __esModule: true,
  log: jest.fn(),
}));

describe('classNames unit test', () => {
  it('testing rgbToHex', () => {
    rgbToHex('rgb(255, 255, 0)');
    rgbToHex();
  });

  it('testing rgbaToHex', () => {
    rgbaToHex('rgba(255, 255, 0, 10)');
    rgbaToHex();
  });

  it('testing formatSecToYodaTime', () => {
    formatSecToYodaTime(60);
    formatSecToYodaTime(4000);
    formatSecToYodaTime();
  });

  it('testing convertGainFormat', () => {
    convertGainFormat(40.34);
    convertGainFormat(-40.34);
    convertGainFormat(0);
  });

  it('testing gcd', () => {
    gcd(50, 2);
  });

  it('testing getAspectRatio', () => {
    getAspectRatio(50, 200);
  });
});
