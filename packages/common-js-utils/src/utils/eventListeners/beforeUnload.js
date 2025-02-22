/**
 * This is a utility function to handle the beforeunload event.
 * @file This file is saved as `beforeUnload.js`.
 */
const beforeUnload = {
  callBackFn() {},
  subscribe(callBackFn) {
    this.callBackFn = callBackFn;

    window.addEventListener('beforeunload', callBackFn);
  },
  unSubscribe() {
    window.removeEventListener('beforeunload', this.callBackFn);
  },
};

export default beforeUnload;
