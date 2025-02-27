// @flow
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

type ReduxProviderProps = {
  children: React.Node,
  store: ReturnType<typeof configureStore>,
};

function ReduxProvider({ children, store }: ReduxProviderProps): React.Node {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
