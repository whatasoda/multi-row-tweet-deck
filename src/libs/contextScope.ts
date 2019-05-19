import React, { createContext, FC, ReactElement, useContext, useState } from 'react';

const providers: FC[] = [];

const create = <T>(initial: T | null, ctxFunc: (set: (next: T) => void) => void): (() => T) => {
  const ctx = createContext(initial as T);

  let dispatch = null as null | typeof setter;
  const setter = (value: T) => {
    if (dispatch) {
      dispatch(value);
    } else {
      initial = value;
    }
  };

  const provider: FC = ({ children }) => {
    ctxFunc(setter);
    const [value, setValue] = useState(initial as T);
    if (dispatch !== setValue) {
      dispatch = setValue;
    }

    return React.createElement(ctx.Provider, { value }, children);
  };

  providers.push(provider);
  return () => useContext(ctx);
};

const IntegratedProvider: FC = ({ children }) =>
  providers.reduce<ReactElement>((acc, provider) => React.createElement(provider, {}, acc), children as ReactElement);

const ContextScope = { create, IntegratedProvider };

export default ContextScope;
