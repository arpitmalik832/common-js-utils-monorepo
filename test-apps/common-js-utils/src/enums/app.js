/**
 * This file is used to define the mount errors.
 * @file This file is saved as 'src/enums/app.js'.
 */
const MOUNT_ERRORS = {
  ELEMENT_REQUIRED: 'Element is required',
  INVALID_DOM_ELEMENT: 'Invalid DOM element',
};

const BACK_CLICK = {
  SUCCESS: 'Back button clicked!!!',
  ERROR: 'error while navigating back',
};

const APP_UNMOUNT = '😬 app closed!!';

const DEFAULT_API_TIMEOUT = 15000;

export { MOUNT_ERRORS, BACK_CLICK, APP_UNMOUNT, DEFAULT_API_TIMEOUT };
