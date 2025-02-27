// @flow
import type { AxiosInstance } from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import type {
  SliceCaseReducers,
  SliceSelectors,
  Slice,
} from '@reduxjs/toolkit';

import { SLICE_NAMES } from '../../enums/redux';

type APIData = {
  host: string,
  headers: Record<string, string | Record<string, string>>,
  axiosInstance: AxiosInstance,
};

type ApisRedux = APIData[];

const apisSlice: Slice<
  ApisRedux,
  SliceCaseReducers<ApisRedux>,
  string,
  string,
  SliceSelectors<ApisRedux>,
> = createSlice<
  ApisRedux,
  SliceCaseReducers<ApisRedux>,
  string,
  SliceSelectors<ApisRedux>,
  string,
>({
  name: SLICE_NAMES.APIS,
  initialState: [],
  reducers: {
    addNewApiData: (state, action) => [...state, action.payload],
    updateApiHostByHost: (state, action) => {
      const newState = [...state];
      const { oldValue, newValue } = action.payload;

      const index = newState.findIndex(i => i.host === oldValue);
      if (index !== -1) {
        newState[index] = {
          ...newState[index],
          host: newValue,
        };
      }
      return newState;
    },
    updateApiHostByIndex: (state, action) => {
      const newState = [...state];
      const { index, newValue } = action.payload;

      if (index <= newState.length && index >= 0) {
        newState[index] = {
          ...newState[index],
          host: newValue,
        };
      }
      return newState;
    },
    updateApiHeadersByHost: (state, action) => {
      const newState = [...state];
      const { host, newHeaders } = action.payload;

      const index = newState.findIndex(i => i.host === host);
      if (index !== -1) {
        newState[index] = {
          ...newState[index],
          headers: newHeaders,
        };
      }
      return newState;
    },
    updateApiHeadersByIndex: (state, action) => {
      const newState = [...state];
      const { index, newHeaders } = action.payload;

      if (index <= newState.length && index >= 0) {
        newState[index] = {
          ...newState[index],
          headers: newHeaders,
        };
      }
      return newState;
    },
    addToApiHeadersByHost: (state, action) => {
      const newState = [...state];
      const { host, newHeader } = action.payload;

      const index = newState.findIndex(i => i.host === host);
      if (index !== -1) {
        newState[index] = {
          ...newState[index],
          headers: {
            ...newState[index].headers,
            [newHeader.key]: newHeader.value,
          },
        };
      }
      return newState;
    },
    addToApiHeadersByIndex: (state, action) => {
      const newState = [...state];
      const { index, newHeader } = action.payload;

      if (index <= newState.length && index >= 0) {
        newState[index] = {
          ...newState[index],
          headers: {
            ...newState[index].headers,
            [newHeader.key]: newHeader.value,
          },
        };
      }
      return newState;
    },
    updateApiAxiosInstanceByHost: (state, action) => {
      const newState = [...state];
      const { host, axiosInstance } = action.payload;

      const index = newState.findIndex(i => i.host === host);
      if (index !== -1) {
        newState[index] = {
          ...newState[index],
          axiosInstance,
        };
      }
      return newState;
    },
    updateApiAxiosInstanceByIndex: (state, action) => {
      const newState = [...state];
      const { index, axiosInstance } = action.payload;

      if (index <= newState.length && index >= 0) {
        newState[index] = {
          ...newState[index],
          axiosInstance,
        };
      }
      return newState;
    },
  },
});

export { apisSlice };
const {
  addNewApiData,
  updateApiHostByHost,
  updateApiHostByIndex,
  updateApiHeadersByHost,
  updateApiHeadersByIndex,
  addToApiHeadersByHost,
  addToApiHeadersByIndex,
  updateApiAxiosInstanceByHost,
  updateApiAxiosInstanceByIndex,
} = apisSlice.actions;
export const apisSliceActions = {
  addNewApiData,
  updateApiHostByHost,
  updateApiHostByIndex,
  updateApiHeadersByHost,
  updateApiHeadersByIndex,
  addToApiHeadersByHost,
  addToApiHeadersByIndex,
  updateApiAxiosInstanceByHost,
  updateApiAxiosInstanceByIndex,
};
