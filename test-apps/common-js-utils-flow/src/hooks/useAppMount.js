// @flow
import useTheme from './useTheme';
import useInitAxios from './useInitAxios';

function useAppMount(): void {
  useTheme();
  useInitAxios();
}

export default useAppMount;
