// @flow

const preferredColorScheme = {
  // eslint-disable-next-line no-unused-vars
  callBackFn: (...args: Parameters<MQEventListener>) => {},
  subscribe(callBackFn: MQEventListener) {
    preferredColorScheme.callBackFn = callBackFn;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const mqList: MediaQueryListEvent = { matches: mq.matches };
    callBackFn.call(mq, mqList);

    mq.addEventListener('change', callBackFn);
  },
  unSubscribe() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', preferredColorScheme.callBackFn);
  },
};

export default preferredColorScheme;
