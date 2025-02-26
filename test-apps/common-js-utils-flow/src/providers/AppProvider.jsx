// @flow
import React from 'react';

import ReduxProvider from './ReduxProvider';
import App from '../HOC/App';
import store from '../redux/store/main';

function AppProvider(): React.Node {
  return (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  );
}

export default AppProvider;
