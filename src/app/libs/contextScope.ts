import React, { createContext, FC, ReactElement, useContext, useState } from 'react';

const providers: FC[] = [];

const create = <T>(initial: T | null, ctxFunc: (set: (next: T) => void) => void): (() => T) => {
  const ctx = createContext(initial as T);

  const provider: FC = ({ children }) => {
    const [value, setValue] = useState(initial as T);
    ctxFunc(setValue);
    return React.createElement(ctx.Provider, { value }, children);
  };

  providers.push(provider);
  return () => useContext(ctx);
};

const IntegratedProvider: FC = ({ children }) =>
  providers.reduce<ReactElement>((acc, provider) => React.createElement(provider, {}, acc), children as ReactElement);

const ContextScope = { create, IntegratedProvider };

export default ContextScope;
