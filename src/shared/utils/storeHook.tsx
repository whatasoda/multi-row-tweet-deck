import React, { createContext, useReducer, useCallback, useContext } from 'react';
import { ActionsRecord, ActionCreatorOf, ReducerOf } from './storeModule';

type ContextInjection<A extends ActionsRecord, S> = [
  React.Context<S> | undefined,
  (React.Context<ActionCreatorOf<A>> | undefined)?,
];

export const createStoreHook = <A extends ActionsRecord, S>(
  createAction: ActionCreatorOf<A>,
  reducer: ReducerOf<A, S>,
  ctx?: ContextInjection<A, S>,
) => {
  const [
    stateContext = createContext<S>(null as any),
    dispatcherContext = createContext<ActionCreatorOf<A>>(null as any),
  ] = ctx || [];

  const useState = () => useContext(stateContext);
  const useDispatcher = () => useContext(dispatcherContext);
  const initialize = (defaultInitialState: S): React.FC<{ initialState?: S }> => {
    return function Provider({ initialState, children }) {
      const [state, dispatch] = useReducer(reducer, initialState || defaultInitialState);
      const dispatcher = useCallback<ActionCreatorOf<A>>((type, ...args) => {
        const action = createAction(type, ...args);
        dispatch(action);
        return action;
      }, []);

      return (
        <dispatcherContext.Provider value={dispatcher}>
          <stateContext.Provider value={state} children={children} />
        </dispatcherContext.Provider>
      );
    };
  };

  return [initialize, useState, useDispatcher] as const;
};
