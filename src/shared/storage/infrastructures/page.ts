import { EXTENSION_ID } from '../../constants';

const storageKeyMap: Record<keyof StorageInfrastructure, string> = {
  sync: `${EXTENSION_ID}:sync`,
  local: `${EXTENSION_ID}:local`,
};

const arrify = (input: string | string[]) => (typeof input === 'string' ? [input] : input);

const createArea = <T extends keyof StorageInfrastructure>(type: T): StorageInfrastructure[T] => {
  const storageKey = storageKeyMap[type];

  const base = (callback: (curr: Record<string, any>) => Record<string, any> | void) => {
    const curr = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const next = callback(curr);
    if (next) localStorage.setItem(storageKey, JSON.stringify(next));
    return curr;
  };

  const get = (keys: string | string[] | object | null) => {
    if (keys === null) {
      return Promise.resolve(base(() => {}));
    } else {
      const keyList = typeof keys === 'object' && !Array.isArray(keys) ? Object.keys(keys) : arrify(keys);
      const initial = typeof keys === 'object' && !Array.isArray(keys) ? keys : {};

      const curr = base(() => {});
      const picked = keyList.reduce<Record<string, any>>((acc, key) => {
        if (key in curr) acc[key] = curr[key];
        return acc;
      }, initial);

      return Promise.resolve(picked);
    }
  };

  const set = (next: Record<string, any>) => {
    base((curr) => ({ ...curr, ...next }));
    return Promise.resolve();
  };

  const remove = (keys: string | string[]) => {
    const removal = arrify(keys);
    base((curr) => {
      const next = { ...curr };
      removal.forEach((key) => delete next[key]);
      return next;
    });
    return Promise.resolve();
  };

  return { get, set, remove };
};

export const init = (): StorageInfrastructure => ({
  local: createArea('local'),
  sync: createArea('sync'),
});
