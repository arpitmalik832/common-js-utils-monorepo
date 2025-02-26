/**
 * Contains the jest setup for the library.
 * @file This file is saved as `jest.setup.js`.
 */

// Polyfill TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

window.URL.createObjectURL = img =>
  img instanceof Blob || img instanceof MediaSource ? 'mocked-url' : '';
