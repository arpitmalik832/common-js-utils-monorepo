/**
 * The main application component.
 * @file The file is saved as `App.jsx`.
 */
import { RouterProvider } from 'react-router';

import router from '../routes';
import useAppMount from '../hooks/useAppMount';
import '@arpitmalik832/common-js-utils/styles/postcss-processed/index.css';

/**
 * Main application component.
 * @returns {import('react').JSX.Element} The rendered application.
 * @example
 * <App />
 */
function App() {
  useAppMount();

  return <RouterProvider router={router} />;
}

export default App;
