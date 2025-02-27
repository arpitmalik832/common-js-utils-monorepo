/**
 * Unit tests for objectUtils.
 * @file This file is saved as `objectUtils.test.js`.
 */
import '@testing-library/jest-dom';

import { convertToArrayOfPairs, renameKeys } from '../objectUtils';

describe('objectUtils unit tests', () => {
  it('convertToArrayOfPairs unit test', () => {
    convertToArrayOfPairs({ a: 'b', c: 'd' });
    convertToArrayOfPairs();
  });

  it('renameKeys unit test', () => {
    const m = new Map();
    m.set('a', 'b');
    m.set('c', 'd');
    renameKeys(m, { a: 'b', c: 'd' });
  });
});
