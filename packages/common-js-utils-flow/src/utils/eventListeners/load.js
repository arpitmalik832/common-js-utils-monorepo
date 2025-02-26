// @flow

const load = {
  // eslint-disable-next-line no-unused-vars
  callBackFn: (...args: Parameters<EventListener>) => {},
  subscribe(callBackFn: EventListener) {
    load.callBackFn = callBackFn;

    window.addEventListener('load', callBackFn);
  },
  unSubscribe() {
    window.removeEventListener('load', load.callBackFn);
  },
};

export default load;
