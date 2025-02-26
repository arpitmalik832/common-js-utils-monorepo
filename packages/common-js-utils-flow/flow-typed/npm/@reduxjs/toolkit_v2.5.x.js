/**
 * Flow typings for @reduxjs/toolkit
 * @flow
 */

declare module '@reduxjs/toolkit' {
  // Most basic types first
  declare type Action<T = any> = {
    type: T,
    ...
  };

  declare type Dispatch = <A>(action: A) => A;

  declare type Reducer<S, A> = (state: S | void, action: A) => S;

  declare type PayloadAction<P = void, T = string, M = void, E = void> = {
    payload: P,
    type: T,
    ...(M extends void ? {} : {meta: M}),
    ...(E extends void ? {} : {error: E}),
  };

  declare type ThunkAction<R, S, E> = (
    dispatch: Dispatch,
    getState: () => S,
    extra: E
  ) => R;

  // Builder types
  declare type ActionReducerMapBuilder<State> = {
    addCase: <ActionCreator>(
      actionCreator: ActionCreator,
      reducer: (state: State, action: any) => State | void
    ) => ActionReducerMapBuilder<State>,
    addMatcher: (
      matcher: (action: Action<any>) => boolean,
      reducer: (state: State, action: any) => State | void
    ) => ActionReducerMapBuilder<State>,
    addDefaultCase: (
      reducer: (state: State, action: any) => State | void
    ) => ActionReducerMapBuilder<State>,
  };

  // Slice types
  declare type SliceOptions<State, CaseReducers, Name: string = string> = {|
    name: Name,
    initialState: State | (() => State),
    reducers: CaseReducers,
    extraReducers?: (builder: ActionReducerMapBuilder<State>) => void,
  |};

  declare type Slice<State = any, CaseReducers = {}, Name: string = string> = {|
    name: Name,
    reducer: Reducer<State, any>,
    actions: $ReadOnly<$Exact<{[key: $Keys<CaseReducers>]: (...args: any[]) => PayloadAction<any>}>>,
    caseReducers: CaseReducers,
    getInitialState: () => State,
  |};

  // Store types
  declare type ConfigureStoreOptions<S = any, A = Action<any>> = {|
    reducer: Reducer<S, A> | {[key: string]: Reducer<any, A>},
    middleware?: Array<any>,
    devTools?: boolean | Object,
    preloadedState?: S,
    enhancers?: Array<any>,
  |};

  declare type EnhancedStore<S = any, A = Action<any>> = {
    dispatch: Dispatch,
    getState(): S,
    subscribe(listener: () => void): () => void,
    replaceReducer(nextReducer: Reducer<S, A>): void,
    ...
  };

  // Async thunk types
  declare type AsyncThunkConfig = {
    state?: any,
    dispatch?: Dispatch,
    extra?: any,
    rejectValue?: any,
    serializedErrorType?: any,
  };

  declare type RejectWithValue<RejectValue> = {
    +$$rejectType: RejectValue,
  };

  declare type GetThunkAPI<ThunkApiConfig> = {
    dispatch: ThunkApiConfig['dispatch'] | Dispatch,
    getState: () => ThunkApiConfig['state'],
    extra: ThunkApiConfig['extra'],
    requestId: string,
    signal: AbortSignal,
    rejectWithValue: (value: ThunkApiConfig['rejectValue']) => RejectWithValue<ThunkApiConfig['rejectValue']>,
    fulfillWithValue: <FulfilledValue>(value: FulfilledValue) => FulfilledValue,
  };

  declare type AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig> = (
    arg: ThunkArg,
    thunkAPI: GetThunkAPI<ThunkApiConfig>
  ) => Promise<Returned> | Returned;

  // Entity adapter types
  declare type EntityState<T> = {|
    ids: Array<string | number>,
    entities: { [key: string | number]: T },
  |};

  declare type EntityAdapter<T> = {|
    addOne: (state: EntityState<T>, entity: T) => void,
    addMany: (state: EntityState<T>, entities: Array<T> | { [key: string]: T }) => void,
    setOne: (state: EntityState<T>, entity: T) => void,
    setMany: (state: EntityState<T>, entities: Array<T> | { [key: string]: T }) => void,
    setAll: (state: EntityState<T>, entities: Array<T> | { [key: string]: T }) => void,
    removeOne: (state: EntityState<T>, key: string | number) => void,
    removeMany: (state: EntityState<T>, keys: Array<string | number>) => void,
    removeAll: (state: EntityState<T>) => void,
    updateOne: (state: EntityState<T>, update: { id: string | number, changes: $Rest<T, {}> }) => void,
    updateMany: (state: EntityState<T>, updates: Array<{ id: string | number, changes: $Rest<T, {}> }>) => void,
    upsertOne: (state: EntityState<T>, entity: T) => void,
    upsertMany: (state: EntityState<T>, entities: Array<T> | { [key: string]: T }) => void,
    getInitialState: (state?: Object) => EntityState<T>,
  |};

  // Function exports
  declare export function createSlice<State, CaseReducers, Name: string>(
    options: SliceOptions<State, CaseReducers, Name>
  ): Slice<State, CaseReducers, Name>;

  declare export function configureStore<S, A>(
    options: ConfigureStoreOptions<S, A>
  ): EnhancedStore<S, A>;

  declare export function createAsyncThunk<Returned, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, AsyncThunkConfig>,
    options?: Object
  ): {
    pending: string,
    fulfilled: string,
    rejected: string,
    (arg: ThunkArg): ThunkAction<Promise<any>, any, any>,
    ...
  };

  declare export function createEntityAdapter<T>(options?: {|
    selectId?: (model: T) => string | number,
    sortComparer?: (a: T, b: T) => number,
  |}): EntityAdapter<T>;

  declare export function createAction<P>(
    type: string,
    prepareAction?: (payload: P, ...args: any[]) => {payload: P, meta?: any, error?: any}
  ): {
    (...args: any[]): PayloadAction<P>,
    type: string,
    match: (action: Action<any>) => boolean,
    ...
  };

  declare export function createReducer<S>(
    initialState: S,
    builderCallback: (builder: ActionReducerMapBuilder<S>) => void,
  ): Reducer<S, any>;
}
