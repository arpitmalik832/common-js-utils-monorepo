/**
 * This file contains app utility functions.
 * @file This file is saved as `appUtils.js`.
 */
import { DEPRECATION_MSG_FOR_REMOVAL } from '../enums/app';

const getDeprecationMsgForRemoval = func =>
  `${func} ${DEPRECATION_MSG_FOR_REMOVAL}`;

export { getDeprecationMsgForRemoval };
