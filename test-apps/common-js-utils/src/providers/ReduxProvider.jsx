/**
 * Provides the Redux store to its children.
 * @file The file is saved as `ReduxProvider.jsx`.
 */
import { Provider } from 'react-redux';

/**
 * ReduxProvider component that provides the Redux store to its children.
 * @param {object} props - The component props.
 * @param {import('react').ReactNode} props.children - The child components.
 * @param {import('@reduxjs/toolkit').EnhancedStore} props.store - The Redux store.
 * @returns {import('react').JSX.Element} The rendered component.
 * @example
 * <ReduxProvider store={store}>
 *   <App />
 * </ReduxProvider>
 */
function ReduxProvider({ children, store }) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
