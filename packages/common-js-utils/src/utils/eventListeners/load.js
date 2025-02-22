/**
 * This function is used to subscribe to the load event of the window.
 * @file This file is saved as `load.js`.
 */
const load = {
  callBackFn() {},
  subscribe(callBackFn) {
    this.callBackFn = callBackFn;
    window.addEventListener('load', callBackFn);
  },
  unSubscribe() {
    window.removeEventListener('load', this.callBackFn);
  },
};

export default load;
