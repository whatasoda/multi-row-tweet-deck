export type ActionsRecord = Record<string, (...args: any[]) => { payload: any } | null>;
export type OneOfTypeOf<A extends ActionsRecord> = Extract<keyof A, string>;
export type OneOfActionOf<A extends ActionsRecord> = {
  [T in OneOfTypeOf<A>]: { type: T } & ReturnType<A[T]>;
}[OneOfTypeOf<A>];
export type ActionCreatorOf<A extends ActionsRecord> = <T extends Extract<keyof A, string>>(
  type: T,
  ...args: Parameters<A[T]>
) => OneOfActionOf<A>;
export type ReducerMapOf<A extends ActionsRecord, S> = {
  [T in OneOfTypeOf<A>]: (state: S, action: ReturnType<A[T]>) => S;
};
export type ReducerOf<A extends ActionsRecord, S> = (state: S, action: OneOfActionOf<A>) => S;
export type ReducerCreator<A extends ActionsRecord> = <S>(reducers: ReducerMapOf<A, S>) => ReducerOf<A, S>;

export const createStoreModule = <A extends ActionsRecord>(actions: A) => {
  type OneOfType = OneOfTypeOf<A>;
  type OneOfAction = OneOfActionOf<A>;

  const createAction: ActionCreatorOf<A> = <T extends OneOfType>(type: T, ...args: Parameters<A[T]>) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      if (!(type in actions)) console.warn(`action creation failed: unknown action type '${type}' recieved`);
    }

    return { type, ...(actions[type](...args) as ReturnType<A[T]>) } as Extract<OneOfAction, { type: T }>;
  };

  const createReducer: ReducerCreator<A> = <S>(reducers: ReducerMapOf<A, S>) => {
    return (state: S, action: OneOfAction) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        if (!(action.type in reducers)) console.warn(`reducer call failed: no child reducer for '${action.type}'`);
      }

      return reducers[action.type](state, action);
    };
  };

  return [createAction, createReducer] as const;
};
