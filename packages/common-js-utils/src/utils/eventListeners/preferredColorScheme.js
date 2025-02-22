/**
 * This file is used to detect the preferred color scheme of the user.
 * @file This file is saved as `preferredColorScheme.js`.
 */
const preferredColorScheme = {
  callBackFn() {},
  subscribe(callBackFn) {
    this.callBackFn = callBackFn;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    callBackFn(mq);

    mq.addEventListener('change', callBackFn);
  },
  unSubscribe() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', this.callBackFn);
  },
};

export default preferredColorScheme;
