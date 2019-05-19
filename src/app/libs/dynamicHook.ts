import { useEffect, useMemo, useState } from 'react';
import warning from 'warning';
import { __DEV__ } from '../../utils/env';

type DynamicHookDescriptor<T, U, V extends any[]> = {
  initial: (selector: U) => T;
  keyGen: (selector: U) => string;
  updater: (set: (selector: U, value: T) => void, issuer: U, ...args: V) => void;
};
let hookCallCount = 0;
const DynamicHook = <T, U, V extends any[]>({ initial, keyGen, updater }: DynamicHookDescriptor<T, U, V>) => {
  const settersMap = new Map<string, Set<(value: T) => void>>();

  const set = (selector: U, value: T) => {
    const setters = settersMap.get(keyGen(selector));
    if (!setters) {
      if (__DEV__) {
        warning(false, 'Invalid selector: not found: %1', selector);
      }
      return;
    }

    setters.forEach((setter) => setter(value));
  };

  const hook = (selector: U) => {
    hookCallCount++;
    const key = keyGen(selector);
    const [s, setState] = useState<T>(null as any);
    const [c, update] = useMemo(() => [hookCallCount, updater.bind(null, set, selector)], [key]);
    const state = c === hookCallCount ? initial(selector) : s;

    useEffect(() => {
      setState(state);

      const setters = settersMap.get(key) || new Set();
      if (!settersMap.has(key)) {
        settersMap.set(key, setters);
      }
      setters.add(setState);
      return () => {
        setters.delete(setState);
        if (!setters.size) {
          settersMap.delete(key);
        }
      };
    }, [key]);

    return [state, update] as const;
  };

  return [hook, set] as const;
};

export default DynamicHook;
