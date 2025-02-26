// @flow

export type ArrayBufferView =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | DataView;

export type BlobPart =
  | Blob
  | string
  | BufferSource
  | ArrayBuffer
  | ArrayBufferView
  | Uint8Array;

export type VoidFunctionWithParams<T> = {
  (...args: T[]): void,
};

export type StyleDictionaryToken = {
  attributes: {
    category: string,
  },
};

export type UseBackPress = {
  stack: Array<VoidFunctionWithParams<mixed>>,
  push: (callback: VoidFunctionWithParams<mixed>) => void,
  pop: () => void,
  clear: () => void,
};

export type BeforeUnloadEventListener = (
  this: typeof window,
  ev: BeforeUnloadEvent,
) => void;

export type MQEventListener = (
  this: MediaQueryList,
  ev: MediaQueryListEvent,
) => void;

export type EventListener = (this: typeof window, ev: Event) => void;
