// @flow

const beforeUnload = {
  // eslint-disable-next-line no-unused-vars
  callBackFn: (...args: Parameters<BeforeUnloadEventListener>) => {},
  subscribe(callBackFn: BeforeUnloadEventListener) {
    beforeUnload.callBackFn = callBackFn;
    window.addEventListener('beforeunload', callBackFn);
  },
  unSubscribe() {
    window.removeEventListener('beforeunload', beforeUnload.callBackFn);
  },
};

export default beforeUnload;
