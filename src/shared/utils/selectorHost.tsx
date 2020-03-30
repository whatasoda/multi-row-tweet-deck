import React, { createContext, useEffect, useContext, useState } from 'react';

interface SelectorSubscription<T, U> {
  skipSelfUpdate: boolean;
  curr: U;
  selector: (state: T) => U;
  equalityCheck: (prev: U, next: U) => boolean;
  readonly setCount: (next: number) => void;
}

interface SelectorContextValue<T> {
  curr: T;
  readonly registry: Set<SelectorSubscription<T, any>>;
}

const defaultEqualityCheck = (prev: any, next: any) => prev === next;

let count = 0;
const updateSubscription = <T extends any, U extends any>(
  baseState: T,
  subscription: SelectorSubscription<T, U>,
  self: boolean,
): boolean => {
  const { curr, equalityCheck, selector, setCount } = subscription;
  const next = selector(baseState);
  if (equalityCheck(curr, next)) return true;

  subscription.curr = next;
  if (!self) setCount(++count);
  return false;
};

export const createSelectorHost = <T extends any>(useBaseState: () => T) => {
  const useStateWithSelector = <U extends any>(
    selector: SelectorSubscription<T, U>['selector'],
    equalityCheck: SelectorSubscription<T, U>['equalityCheck'] = defaultEqualityCheck,
  ) => {
    const { curr: baseState, registry } = useContext(useStateWithSelector.context);
    const [, setCount] = useState(0);

    const [subscription] = useState<SelectorSubscription<T, U>>(() => ({
      skipSelfUpdate: true,
      curr: selector(baseState),
      selector,
      setCount,
      equalityCheck,
    }));
    subscription.selector = selector;
    subscription.equalityCheck = equalityCheck;

    useEffect(() => {
      registry.add(subscription);
      return () => {
        registry.delete(subscription);
      };
    }, []);

    if (!subscription.skipSelfUpdate) updateSubscription(baseState, subscription, true);
    subscription.skipSelfUpdate = false;

    return subscription.curr;
  };
  useStateWithSelector.context = createContext<SelectorContextValue<T>>(null as any);

  const Provider: React.FC = ({ children }) => {
    const baseState = useBaseState();
    const [value] = useState<SelectorContextValue<T>>(() => ({ curr: baseState, registry: new Set() }));
    value.curr = baseState;

    useEffect(() => {
      const { registry } = value;
      registry.forEach((subscription) => {
        updateSubscription(baseState, subscription, false);
        subscription.skipSelfUpdate = true;
      });
    }, [baseState]);

    return <useStateWithSelector.context.Provider value={value} children={children} />;
  };

  return [useStateWithSelector, Provider] as const;
};
