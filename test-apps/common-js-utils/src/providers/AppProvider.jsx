/**
 * This provider is used to wrap the application with all the necessary Providers.
 * @file This file is saved as `providers/AppProvider.jsx`.
 */
import App from '../HOC/App';
import store from '../redux/store/main';
import ReduxProvider from './ReduxProvider';

/**
 * AppWrapper component that wraps the application with ReduxProvider.
 * @returns {import('react').JSX.Element} The wrapped application component.
 * @example
 * return (
 *   <AppWrapper />
 * );
 */
function AppProvider() {
  return (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  );
}

export default AppProvider;
