/**
 * Unit test for appUtils.
 * @file This file is saved as `appUtils.test.js`.
 */
import '@testing-library/jest-dom';

import { getDeprecationMsgForRemoval } from '../appUtils';

describe('appUtils unit test', () => {
  it('getDeprecationMsgForRemoval unit tests', () => {
    getDeprecationMsgForRemoval('test');
  });
});
