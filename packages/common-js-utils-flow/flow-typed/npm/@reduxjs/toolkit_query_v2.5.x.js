declare module '@reduxjs/toolkit/query' {
  declare class AbortSignal {
    +aborted: boolean;
    +reason: mixed;
    onabort: ?((event: Event) => mixed);
    throwIfAborted(): void;
    addEventListener(type: string, callback: EventListener): void;
    removeEventListener(type: string, callback: EventListener): void;
    dispatchEvent(event: Event): boolean;
  }
  
  declare class AbortController {
    +signal: AbortSignal;
    abort(reason?: mixed): void;
  }

  declare type Dispatch = <A>(action: A) => A;
  declare type MaybePromise<T> = T | Promise<T>;

  declare type BaseQueryApi = {|
    signal: AbortSignal,
    dispatch: Dispatch,
    getState: () => any,
    extra: any,
    endpoint: string,
    type: 'query' | 'mutation',
    forced?: boolean,
  |};

  declare type QueryReturnValue<T = mixed, E = mixed> =
  | { data: T, error?: mixed }
  | { error: E, data?: mixed };
  
  declare type BaseQueryFn<
    Args = any,
    Result = mixed,
    Error = mixed,
    Meta = mixed
  > = (
    args: Args,
    api: BaseQueryApi,
    extraOptions: Meta
  ) => MaybePromise<QueryReturnValue<Result, Error>>;

  declare type ThunkAction<R, S, E> = (
    dispatch: Dispatch,
    getState: () => S,
    extra: E
  ) => R;

  declare type ApiEndpointQuery<
    QueryArg,
    ResultType,
    ReducerPath = string
  > = {|
    select: (arg: QueryArg) => (state: any) => ResultType,
    initiate: (arg: QueryArg, options?: {
      subscribe?: boolean,
      forceRefetch?: boolean | number,
    }) => ThunkAction<Promise<any>, any, any>,
  |};

  declare type EndpointDefinition<QueryArg, ResultType, QueryFn> = {|
    query: QueryFn,
    transformResponse?: (response: ResultType) => ResultType,
    providesTags?: Array<string>,
    invalidatesTags?: Array<string>,
  |};

  declare type EndpointDefinitions = {
    [key: string]: EndpointDefinition<mixed, mixed, mixed>,
  };

  declare type CreateApiOptions<
    BaseQuery: BaseQueryFn<mixed, mixed, mixed, mixed>,
    Definitions: EndpointDefinitions,
    ReducerPath: string = string,
    TagTypes: string = string
  > = {|
    baseQuery: BaseQuery,
    endpoints?: (build: EndpointBuilder<BaseQuery, TagTypes>) => Definitions,
    reducerPath?: ReducerPath,
    tagTypes?: TagTypes[],
    keepUnusedDataFor?: number,
    refetchOnMountOrArgChange?: boolean | number,
    refetchOnFocus?: boolean,
    refetchOnReconnect?: boolean,
  |};

  declare type EndpointBuilder<
    BaseQuery: BaseQueryFn<mixed, mixed, mixed, mixed>,
    TagTypes: string
  > = {
    query<Args, Result>(
      options: {
        query: (args: Args) => mixed,
        transformResponse?: (result: mixed) => Result,
        providesTags?: Array<TagTypes>,
      }
    ): EndpointDefinition<Args, Result, BaseQuery>,
    mutation<Args, Result>(
      options: {
        query: (args: Args) => mixed,
        transformResponse?: (result: mixed) => Result,
        invalidatesTags?: Array<TagTypes>,
      }
    ): EndpointDefinition<Args, Result, BaseQuery>,
  };

  declare type Action<T = any> = {
    type: T,
    [key: string]: any,
  };

  declare type Reducer<S, A = Action<any>> = (state: S | void, action: A) => S;

  declare type Middleware = (
    api: { dispatch: Dispatch, getState: () => any }
  ) => (next: Dispatch) => Dispatch;

  declare type Api<
    BaseQuery: BaseQueryFn<mixed, mixed, mixed, mixed>,
    Definitions: EndpointDefinitions,
    ReducerPath: string = string,
    TagTypes: string = string
  > = {
    reducerPath: ReducerPath,
    reducer: Reducer<any, any>,
    middleware: Middleware,
    endpoints: Definitions,
    injectEndpoints: (endpoints: {
      endpoints: (build: EndpointBuilder<BaseQuery, TagTypes>) => Definitions,
    }) => Api<BaseQuery, Definitions, ReducerPath, TagTypes>,
    enhanceEndpoints: (options: {
      addTagTypes?: Array<string>,
      endpoints?: {
        [K in keyof Definitions]?: {
          providesTags?: Array<TagTypes>,
          invalidatesTags?: Array<TagTypes>,
        },
      },
    }) => Api<BaseQuery, Definitions, ReducerPath, TagTypes>,
  };

  declare export function createApi<
    BaseQuery: BaseQueryFn<mixed, mixed, mixed, mixed>,
    Definitions: EndpointDefinitions,
    ReducerPath: string = string,
    TagTypes: string = string
  >(
    options: CreateApiOptions<BaseQuery, Definitions, ReducerPath, TagTypes>
  ): Api<BaseQuery, Definitions, ReducerPath, TagTypes>;

  declare type RequestCredentials = 'omit' | 'same-origin' | 'include';

  declare type HeadersInit = 
    | Headers 
    | {[key: string]: string} 
    | Array<[string, string]>;

  declare class Headers {
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callbackfn: (value: string, key: string, parent: Headers) => void): void;
  }

  declare export function fetchBaseQuery(
    options: string | {|
      baseUrl: string,
      prepareHeaders?: (headers: Headers) => Headers | Promise<Headers>,
      headers?: HeadersInit,
      credentials?: RequestCredentials,
    |}
  ): BaseQueryFn;
} 