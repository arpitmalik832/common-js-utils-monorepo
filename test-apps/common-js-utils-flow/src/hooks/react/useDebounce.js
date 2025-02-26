// @flow

function useDebounce<D, T: VoidFunctionWithParams<D>>(
  func: T,
  timeout: number = 200,
): (...args: D[]) => void {
  let timer;
  return (...args: D[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export default useDebounce;
