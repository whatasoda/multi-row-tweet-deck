import React, { createContext, useEffect, useContext, useState } from 'react';

interface SelectorSubscription<T, U> {
  curr: U;
  selector: (state: T) => U;
  equalityCheck: (prev: U, next: U) => boolean;
  readonly setState: (next: U) => void;
}

interface SelectorContextValue<T> {
  curr: T;
  readonly registry: Set<SelectorSubscription<T, any>>;
}

const defaultEqualityCheck = (prev: any, next: any) => prev === next;

export const createSelectorHost = <T extends any>(useBaseState: () => T) => {
  const useStateWithSelector = <U extends any>(
    selector: SelectorSubscription<T, U>['selector'],
    equalityCheck: SelectorSubscription<T, U>['equalityCheck'] = defaultEqualityCheck,
  ) => {
    const { curr: baseState, registry } = useContext(useStateWithSelector.context);
    const [curr, setState] = useState(() => selector(baseState));

    const [subscription] = useState<SelectorSubscription<T, U>>(() => ({ curr, selector, setState, equalityCheck }));
    subscription.curr = curr;
    subscription.selector = selector;
    subscription.equalityCheck = equalityCheck;

    useEffect(() => {
      registry.add(subscription);
      return () => {
        registry.delete(subscription);
      };
    }, []);

    return curr;
  };
  useStateWithSelector.context = createContext<SelectorContextValue<T>>(null as any);

  const Provider: React.FC = ({ children }) => {
    const baseState = useBaseState();
    const [value] = useState<SelectorContextValue<T>>(() => ({ curr: baseState, registry: new Set() }));
    value.curr = baseState;

    useEffect(() => {
      const { registry } = value;
      registry.forEach(({ curr, equalityCheck, selector, setState }) => {
        const next = selector(baseState);
        if (equalityCheck(curr, next)) return;
        setState(next);
      });
    }, [baseState]);

    return <useStateWithSelector.context.Provider value={value} children={children} />;
  };

  return [useStateWithSelector, Provider] as const;
};
