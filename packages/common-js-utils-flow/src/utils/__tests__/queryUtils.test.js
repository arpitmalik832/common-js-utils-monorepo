/**
 * Unit tests for the queryUtils file.
 * @file This file is saved as `queryUtils.test.js`.
 */
import '@testing-library/jest-dom';

import { getQueryParam, processQueryParams } from '../queryUtils';

describe('queryUtils unit tests', () => {
  it('getQueryParam unit test', () => {
    getQueryParam('?a=b', 'a');
    getQueryParam('?a=b');
  });

  it('processQueryParams unit test', () => {
    processQueryParams('?x=test');
  });
});
